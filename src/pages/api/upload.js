// Deshabilitar prerenderizado estático para esta ruta de API
export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { supabase, UPLOAD_CONFIG, verifyAuth, logAuditEvent } from '../../lib/supabase.js';

// Helper function to handle responses
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: { ...defaultHeaders, ...headers },
  });
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

/**
 * Procesa y optimiza la imagen
 * @param {ArrayBuffer} arrayBuffer - ArrayBuffer de la imagen
 * @param {string} mimeType - Tipo MIME de la imagen
 * @returns {Promise<{buffer: Buffer, mimeType: string}>}
 */
async function processImage(arrayBuffer, mimeType) {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Redimensionar si es necesario (máx. 2000px de ancho)
    if (metadata.width > 2000) {
      image.resize(2000);
    }
    
    // Optimizar según el tipo de imagen
    let processedBuffer;
    switch (mimeType) {
      case 'image/jpeg':
        processedBuffer = await image.jpeg({ 
          quality: 85, 
          progressive: true,
          mozjpeg: true 
        }).toBuffer();
        break;
      case 'image/png':
        processedBuffer = await image.png({ 
          compressionLevel: 9, 
          progressive: true,
          palette: true
        }).toBuffer();
        break;
      case 'image/webp':
        processedBuffer = await image.webp({ 
          quality: 85,
          lossless: false,
          alphaQuality: 100
        }).toBuffer();
        mimeType = 'image/webp'; // Forzamos webp para mejor compresión
        break;
      default:
        processedBuffer = buffer;
    }
    
    return { buffer: processedBuffer, mimeType };
  } catch (error) {
    console.error('Error procesando la imagen:', error);
    throw new Error('Error al procesar la imagen');
  }
}

/**
 * Maneja la solicitud POST para subir imágenes
 * @param {Request} request - Objeto de solicitud de Astro
 * @returns {Promise<Response>} Respuesta con la URL de la imagen subida o un error
 */
export async function POST(context) {
  try {
    // Verificar autenticación
    const authHeader = context.request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse(
        { error: 'No autorizado: Token no proporcionado' },
        401
      );
    }

    const token = authHeader.split(' ')[1];
    const { user, error: authError } = await verifyAuth(token);
    
    if (authError || !user) {
      return jsonResponse(
        { error: 'No autorizado: Token inválido o expirado' },
        401
      );
    }

    // Obtener los datos del formulario
    const formData = await context.request.formData();
    const file = formData.get('file');

    // Validar que se haya subido un archivo
    if (!file) {
      return jsonResponse(
        { error: 'No se ha proporcionado ningún archivo' },
        400
      );
    }

    // Validar tipo MIME
    if (!UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
      return jsonResponse(
        { 
          error: `Tipo de archivo no permitido. Se permiten: ${UPLOAD_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`,
          allowedTypes: UPLOAD_CONFIG.ALLOWED_MIME_TYPES 
        },
        400
      );
    }

    // Validar tamaño del archivo
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return jsonResponse(
        { 
          error: `El archivo excede el tamaño máximo de ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
          maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE
        },
        413
      );
    }

    // Leer el archivo como ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const originalSize = file.size;
    
    // Procesar la imagen
    const { buffer: processedBuffer, mimeType } = await processImage(fileBuffer, file.type);
    
    // Generar nombre de archivo único
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${uuidv4()}.${fileExt}`;
    // Configuración
    const bucketName = 'project-images';
    const filePath = `uploads/${user.id}/${fileName}`;
    
    console.log('Iniciando subida a Supabase...', {
      bucket: bucketName,
      path: filePath,
      size: processedBuffer.length,
      user: user.id
    });

    try {
      // Crear cliente de administración
      const adminClient = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // Usar el cliente de administración para la subida
      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from(bucketName)
        .upload(filePath, processedBuffer, {
          contentType: mimeType,
          cacheControl: 'public, max-age=31536000',
          upsert: false,
          // Metadatos básicos
          customMetadata: {
            'owner': user.id,
            'uploadedBy': user.email,
            'originalName': file.name
          }
        });

      if (uploadError) {
        console.error('Error detallado de Supabase:', {
          message: uploadError.message,
          status: uploadError.statusCode,
          error: uploadError.error,
          details: uploadError
        });

        if (uploadError.message.includes('The resource already exists')) {
          return jsonResponse(
            { error: 'Ya existe un archivo con ese nombre' },
            409
          );
        }
        
        if (uploadError.statusCode === 403) {
          return jsonResponse(
            { 
              error: 'No tienes permisos para subir archivos',
              details: 'Verifica las políticas de seguridad en Supabase'
            },
            403
          );
        }

        throw uploadError;
      }

      console.log('Archivo subido correctamente:', uploadData);
      
      // Obtener URL pública del archivo subido
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Registrar evento de auditoría
      await logAuditEvent({
        eventType: 'UPLOAD',
        userId: user.id,
        metadata: {
          filePath: uploadData.path,
          publicUrl,
          originalName: file.name,
          fileSize: originalSize,
          processedSize: processedBuffer.length,
          mimeType
        }
      });

      // Devolver respuesta exitosa
      return jsonResponse({
        success: true,
        message: 'Archivo subido correctamente',
        data: {
          path: uploadData.path,
          publicUrl,
          originalName: file.name,
          fileSize: originalSize,
          mimeType
        }
      });
    } catch (error) {
      console.error('Error en la subida a Supabase:', {
        error: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    // Obtener IP del cliente
    const clientAddress = context.clientAddress || 
      context.request.headers.get('x-forwarded-for') || 
      context.request.headers.get('x-real-ip') ||
      'unknown';

    // Registrar evento de auditoría
    await logAuditEvent({
      userId: user.id,
      action: 'UPLOAD_IMAGE',
      entity: 'project',
      metadata: {
        fileName: file.name,
        fileSize: originalSize,
        mimeType: file.type,
        processedSize: processedBuffer.length,
        savedBytes: originalSize - processedBuffer.length,
        ipAddress: clientAddress,
        userAgent: context.request.headers.get('user-agent') || 'unknown',
        filePath: uploadData.path,
        publicUrl
      }
    });

    // Devolver respuesta exitosa
    return jsonResponse({
      success: true,
      url: publicUrl,
      path: uploadData.path,
      metadata: {
        originalSize,
        processedSize: processedBuffer.length,
        savedBytes: originalSize - processedBuffer.length,
        mimeType,
        fileName: file.name
      }
    });

  } catch (error) {
    console.error('Error en el endpoint de carga de imágenes:', error);
    return jsonResponse(
      { 
        error: 'Error al procesar la imagen',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      500
    );
  }
}

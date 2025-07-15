import { v4 } from 'uuid';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { v as verifyAuth, U as UPLOAD_CONFIG, s as supabase, l as logAuditEvent } from '../../chunks/supabase_ML0sianz.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...defaultHeaders, ...headers }
  });
}
async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
      // 24 hours
    }
  });
}
async function processImage(arrayBuffer, mimeType) {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if (metadata.width > 2e3) {
      image.resize(2e3);
    }
    let processedBuffer;
    switch (mimeType) {
      case "image/jpeg":
        processedBuffer = await image.jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true
        }).toBuffer();
        break;
      case "image/png":
        processedBuffer = await image.png({
          compressionLevel: 9,
          progressive: true,
          palette: true
        }).toBuffer();
        break;
      case "image/webp":
        processedBuffer = await image.webp({
          quality: 85,
          lossless: false,
          alphaQuality: 100
        }).toBuffer();
        mimeType = "image/webp";
        break;
      default:
        processedBuffer = buffer;
    }
    return { buffer: processedBuffer, mimeType };
  } catch (error) {
    console.error("Error procesando la imagen:", error);
    throw new Error("Error al procesar la imagen");
  }
}
async function POST(context) {
  try {
    const authHeader = context.request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "No autorizado: Token no proporcionado" },
        401
      );
    }
    const token = authHeader.split(" ")[1];
    const { user, error: authError } = await verifyAuth(token);
    if (authError || !user) {
      return jsonResponse(
        { error: "No autorizado: Token inválido o expirado" },
        401
      );
    }
    const formData = await context.request.formData();
    const file = formData.get("file");
    if (!file) {
      return jsonResponse(
        { error: "No se ha proporcionado ningún archivo" },
        400
      );
    }
    if (!UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
      return jsonResponse(
        {
          error: `Tipo de archivo no permitido. Se permiten: ${UPLOAD_CONFIG.ALLOWED_MIME_TYPES.join(", ")}`,
          allowedTypes: UPLOAD_CONFIG.ALLOWED_MIME_TYPES
        },
        400
      );
    }
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return jsonResponse(
        {
          error: `El archivo excede el tamaño máximo de ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
          maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE
        },
        413
      );
    }
    const fileBuffer = await file.arrayBuffer();
    const originalSize = file.size;
    const { buffer: processedBuffer, mimeType } = await processImage(fileBuffer, file.type);
    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${v4()}.${fileExt}`;
    const bucketName = "project-images";
    const filePath = `uploads/${user.id}/${fileName}`;
    console.log("Iniciando subida a Supabase...", {
      bucket: bucketName,
      path: filePath,
      size: processedBuffer.length,
      user: user.id
    });
    try {
      const adminClient = createClient(
        "https://uxbwxuvynchiyobdjuca.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ynd4dXZ5bmNoaXlvYmRqdWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUxMTg4OSwiZXhwIjoyMDY1MDg3ODg5fQ.YaAGKxyFBw5wOkbQ1RxvmEZb_Vr_xk6eG5SDJkV2Ne8",
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
      const { data: uploadData2, error: uploadError } = await adminClient.storage.from(bucketName).upload(filePath, processedBuffer, {
        contentType: mimeType,
        cacheControl: "public, max-age=31536000",
        upsert: false,
        // Metadatos básicos
        customMetadata: {
          "owner": user.id,
          "uploadedBy": user.email,
          "originalName": file.name
        }
      });
      if (uploadError) {
        console.error("Error detallado de Supabase:", {
          message: uploadError.message,
          status: uploadError.statusCode,
          error: uploadError.error,
          details: uploadError
        });
        if (uploadError.message.includes("The resource already exists")) {
          return jsonResponse(
            { error: "Ya existe un archivo con ese nombre" },
            409
          );
        }
        if (uploadError.statusCode === 403) {
          return jsonResponse(
            {
              error: "No tienes permisos para subir archivos",
              details: "Verifica las políticas de seguridad en Supabase"
            },
            403
          );
        }
        throw uploadError;
      }
      console.log("Archivo subido correctamente:", uploadData2);
      const { data: { publicUrl: publicUrl2 } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      await logAuditEvent({
        eventType: "UPLOAD",
        userId: user.id,
        metadata: {
          filePath: uploadData2.path,
          publicUrl: publicUrl2,
          originalName: file.name,
          fileSize: originalSize,
          processedSize: processedBuffer.length,
          mimeType
        }
      });
      return jsonResponse({
        success: true,
        message: "Archivo subido correctamente",
        data: {
          path: uploadData2.path,
          publicUrl: publicUrl2,
          originalName: file.name,
          fileSize: originalSize,
          mimeType
        }
      });
    } catch (error) {
      console.error("Error en la subida a Supabase:", {
        error: error.message,
        stack: error.stack,
        details: error
      });
      throw error;
    }
    const { data: { publicUrl } } = supabase.storage.from(UPLOAD_CONFIG.BUCKET_NAME).getPublicUrl(uploadData.path);
    const clientAddress = context.clientAddress || context.request.headers.get("x-forwarded-for") || context.request.headers.get("x-real-ip") || "unknown";
    await logAuditEvent({
      userId: user.id,
      action: "UPLOAD_IMAGE",
      entity: "project",
      metadata: {
        fileName: file.name,
        fileSize: originalSize,
        mimeType: file.type,
        processedSize: processedBuffer.length,
        savedBytes: originalSize - processedBuffer.length,
        ipAddress: clientAddress,
        userAgent: context.request.headers.get("user-agent") || "unknown",
        filePath: uploadData.path,
        publicUrl
      }
    });
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
    console.error("Error en el endpoint de carga de imágenes:", error);
    return jsonResponse(
      {
        error: "Error al procesar la imagen",
        details: process.env.NODE_ENV === "development" ? error.message : void 0
      },
      500
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

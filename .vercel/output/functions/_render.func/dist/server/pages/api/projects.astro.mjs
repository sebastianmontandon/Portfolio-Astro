import { p as projectsService } from '../../chunks/projectsService_8jSZBNt7.mjs';
import { r as requireAuth } from '../../chunks/auth_DDddNvLA.mjs';
import { createClient } from '@supabase/supabase-js';
import { v4 } from 'uuid';
import sharp from 'sharp';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store"
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
      // 24 hours
    }
  });
}
async function GET() {
  try {
    console.log("API: Fetching projects...");
    const projects = await projectsService.getProjects();
    console.log(`API: Found ${projects?.length || 0} projects`);
    return jsonResponse({
      success: true,
      data: Array.isArray(projects) ? projects : []
    }, 200, {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    });
  } catch (error) {
    console.error("API Error fetching projects:", error);
    return jsonResponse({
      success: false,
      error: "Failed to fetch projects",
      details: process.env.NODE_ENV === "development" ? error.message : void 0
    }, 500);
  }
}
async function POST(context) {
  try {
    const authResponse = await requireAuth(context);
    if (authResponse) {
      return authResponse;
    }
    const user = context.locals.user;
    console.log("Usuario autenticado:", user);
    if (!user || !user.userId) {
      return jsonResponse(
        { error: "Usuario no autenticado correctamente" },
        401
      );
    }
    const contentType = context.request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return jsonResponse(
        { error: "Content-Type must be multipart/form-data" },
        400
      );
    }
    const formData = await context.request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");
    const technologies = formData.getAll("technologies") || [];
    const live_url = formData.get("live_url") || "";
    const github_url = formData.get("github_url") || "";
    const category = formData.get("category") || "Web App";
    const project_type = formData.get("project_type") || "personal";
    if (!title || !description || !imageFile) {
      return jsonResponse(
        { error: "Title, description, and image are required" },
        400
      );
    }
    let imageUrl = "";
    if (imageFile) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const originalSize = buffer.length;
        const processedImage = await sharp(buffer).resize(1200, 630, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80 }).toBuffer();
        const supabase = createClient(
          "https://uxbwxuvynchiyobdjuca.supabase.co",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ynd4dXZ5bmNoaXlvYmRqdWNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUxMTg4OSwiZXhwIjoyMDY1MDg3ODg5fQ.YaAGKxyFBw5wOkbQ1RxvmEZb_Vr_xk6eG5SDJkV2Ne8",
          {
            auth: { autoRefreshToken: false, persistSession: false }
          }
        );
        const fileName = `${v4()}.jpg`;
        const filePath = `projects/${user.id}/${fileName}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("project-images").upload(filePath, processedImage, {
          contentType: "image/jpeg",
          cacheControl: "public, max-age=31536000",
          upsert: false
        });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("project-images").getPublicUrl(filePath);
        imageUrl = publicUrl;
      } catch (error) {
        console.error("Error procesando la imagen:", error);
        return jsonResponse(
          { error: "Error al procesar la imagen" },
          500
        );
      }
    }
    const projectData = {
      title,
      description,
      image_url: imageUrl,
      // Asegúrate de que esta columna exista en tu tabla
      technologies,
      live_url,
      github_url,
      category,
      // Add category field
      project_type,
      // Add project_type field
      // Si tu tabla usa 'author_id' en lugar de 'user_id', cámbialo aquí
      // Si no necesitas guardar el ID del usuario, puedes eliminar esta línea
      // user_id: user.userId,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("Datos del proyecto a guardar:", projectData);
    const newProject = await projectsService.createProject(projectData);
    return jsonResponse({
      success: true,
      message: "Project created successfully",
      data: newProject
    }, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return jsonResponse(
      { error: error.message || "Failed to create project" },
      error.status || 500
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

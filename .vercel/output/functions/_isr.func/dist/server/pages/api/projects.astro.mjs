import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
export { renderers } from '../../renderers.mjs';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
function createApiResponse(status, response, headers = {}) {
  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...headers
    }
  });
}
function handleApiError(error, context) {
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";
  console.error(`Error in ${context}:`, error);
  return createApiResponse(500, {
    success: false,
    message: `Failed to ${context}`,
    error: process.env.NODE_ENV === "development" ? errorMessage : "Internal server error",
    meta: { total: 0 }
  });
}
function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
async function requireAuth(context) {
  const authHeader = context.request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAuthorized: false, message: "No token provided" };
  }
  return { isAuthorized: true };
}

const PROJECTS_FILE = join(process.cwd(), "src/data/projects.json");
function readProjects() {
  try {
    const data = readFileSync(PROJECTS_FILE, "utf-8");
    const projects = JSON.parse(data);
    return projects.map((project) => ({
      id: project.id || crypto.randomUUID(),
      title: project.title || "Untitled Project",
      description: project.description || "",
      imageUrl: project.imageUrl || "/images/placeholder.png",
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      category: project.category || "Uncategorized",
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      createdAt: project.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: project.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
    }));
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}
function writeProjects(projects) {
  try {
    const dir = dirname(PROJECTS_FILE);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing projects:", error);
    return false;
  }
}
const get = async (context) => {
  const { request, url } = context;
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  try {
    const searchParams = new URL(url).searchParams;
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "0", 10);
    let projects = readProjects();
    if (category) {
      projects = projects.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (limit > 0) {
      projects = projects.slice(0, limit);
    }
    projects.sort(
      (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
    return createApiResponse(200, {
      success: true,
      data: projects,
      meta: {
        total: projects.length,
        ...limit > 0 && { limit },
        ...category && { category }
      }
    });
  } catch (error) {
    return handleApiError(error, "fetch projects");
  }
};
const post = async (context) => {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  const auth = await requireAuth(context);
  if (!auth.isAuthorized) {
    return createApiResponse(401, {
      success: false,
      message: auth.message || "Unauthorized"
    });
  }
  try {
    const data = await request.json();
    if (!data.title || !data.description) {
      return createApiResponse(400, {
        success: false,
        message: "Title and description are required"
      });
    }
    const newProject = {
      id: crypto.randomUUID(),
      title: (data.title || "").trim(),
      description: (data.description || "").trim(),
      imageUrl: (data.imageUrl || "/images/placeholder.jpg").trim(),
      technologies: Array.isArray(data.technologies) ? data.technologies.map((t) => t.toString().trim()) : [],
      category: (data.category || "Uncategorized").trim(),
      githubUrl: data.githubUrl?.trim(),
      liveUrl: data.liveUrl?.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const projects = readProjects();
    projects.push(newProject);
    const success = writeProjects(projects);
    if (!success) {
      throw new Error("Failed to save project");
    }
    return createApiResponse(201, {
      success: true,
      message: "Project created successfully",
      data: newProject,
      meta: { total: projects.length }
    });
  } catch (error) {
    return handleApiError(error, "create project");
  }
};
const put = async (context) => {
  const { request } = context;
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  const auth = await requireAuth(context);
  if (!auth.isAuthorized) {
    return createApiResponse(401, {
      success: false,
      message: auth.message || "Unauthorized"
    });
  }
  try {
    const data = await request.json();
    if (!data.id) {
      return createApiResponse(400, {
        success: false,
        message: "Project ID is required"
      });
    }
    const projects = readProjects();
    const projectIndex = projects.findIndex((p) => p.id === data.id);
    if (projectIndex === -1) {
      return createApiResponse(404, {
        success: false,
        message: "Project not found"
      });
    }
    const updatedProject = {
      ...projects[projectIndex],
      ...data,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    projects[projectIndex] = updatedProject;
    const success = writeProjects(projects);
    if (!success) {
      throw new Error("Failed to update project");
    }
    return createApiResponse(200, {
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
      meta: { total: projects.length }
    });
  } catch (error) {
    return handleApiError(error, "update project");
  }
};
const del = async (context) => {
  const { request, url } = context;
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  const auth = await requireAuth(context);
  if (!auth.isAuthorized) {
    return createApiResponse(401, {
      success: false,
      message: auth.message || "Unauthorized"
    });
  }
  try {
    const searchParams = new URL(url).searchParams;
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (parseError) {
      }
    }
    if (!id) {
      return createApiResponse(400, {
        success: false,
        message: "Project ID is required"
      });
    }
    const projects = readProjects();
    const projectIndex = projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return createApiResponse(404, {
        success: false,
        message: "Project not found"
      });
    }
    const [deletedProject] = projects.splice(projectIndex, 1);
    const success = writeProjects(projects);
    if (!success) {
      throw new Error("Failed to delete project");
    }
    return createApiResponse(200, {
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
      meta: { total: projects.length }
    });
  } catch (error) {
    return handleApiError(error, "delete project");
  }
};
const ALL = async (context) => {
  try {
    if (context.request.method === "OPTIONS") {
      return handleOptionsRequest();
    }
    switch (context.request.method) {
      case "GET":
        return get(context);
      case "POST":
        return post(context);
      case "PUT":
        return put(context);
      case "DELETE":
        return del(context);
      default:
        return new Response(
          JSON.stringify({ error: "Method not allowed" }),
          { status: 405, headers: { "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    return handleApiError(error, "handle API request");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  default: ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

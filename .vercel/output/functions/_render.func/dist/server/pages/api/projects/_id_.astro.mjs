import { p as projectsService } from '../../../chunks/projectsService_BzRuEQBX.mjs';
import { r as requireAuth } from '../../../chunks/auth_BCWNP514.mjs';
export { renderers } from '../../../renderers.mjs';

// Deshabilitar prerenderizado estático para esta ruta de API
const prerender = false;

// Helper function to handle responses
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: { ...defaultHeaders, ...headers },
  });
}

// Handle preflight OPTIONS request
async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

// Obtener un proyecto por ID (público)
async function GET(context) {
  try {
    const id = context.params.id;
    if (!id) {
      return jsonResponse({ error: 'Project ID is required' }, 400);
    }

    const project = await projectsService.getProjectById(id);
    if (!project) {
      return jsonResponse({ error: 'Project not found' }, 404);
    }

    return jsonResponse({ data: project });
  } catch (error) {
    console.error(`Error fetching project:`, error);
    return jsonResponse(
      { error: 'Failed to fetch project' },
      500
    );
  }
}

// Actualizar un proyecto (requiere autenticación)
async function PUT(context) {
  try {
    // Verificar autenticación
    const authResponse = await requireAuth(context);
    if (authResponse) return authResponse;

    const id = context.params.id;
    if (!id) {
      return jsonResponse({ error: 'Project ID is required' }, 400);
    }

    const updates = await context.request.json();
    if (!updates) {
      return jsonResponse({ error: 'No update data provided' }, 400);
    }

    // Actualizar la fecha de modificación
    updates.updated_at = new Date().toISOString();

    const updatedProject = await projectsService.updateProject(id, updates);
    if (!updatedProject) {
      return jsonResponse({ error: 'Project not found' }, 404);
    }

    return jsonResponse({ data: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return jsonResponse(
      { error: error.message || 'Failed to update project' },
      error.status || 500
    );
  }
}

// Eliminar un proyecto (requiere autenticación)
async function DELETE(context) {
  try {
    // Verificar autenticación
    const authResponse = await requireAuth(context);
    if (authResponse) return authResponse;

    const id = context.params.id;
    if (!id) {
      return jsonResponse({ error: 'Project ID is required' }, 400);
    }

    // Forzar limpieza de caché antes de eliminar
    projectsCache.clear();
    console.log('Cache cleared before project deletion');

    const success = await projectsService.deleteProject(id);
    if (!success) {
      return jsonResponse({ error: 'Project not found' }, 404);
    }

    // Forzar limpieza de caché después de eliminar
    projectsCache.clear();
    console.log('Cache cleared after project deletion');

    return jsonResponse({ 
      success: true,
      message: 'Project deleted successfully'
    }, 200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return jsonResponse(
      { error: error.message || 'Failed to delete project' },
      error.status || 500
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  OPTIONS,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

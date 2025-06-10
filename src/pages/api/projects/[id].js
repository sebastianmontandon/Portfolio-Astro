import { projectsService } from '../../../lib/projectsService';
import { requireAuth } from '../../../middleware/auth';

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
export async function OPTIONS() {
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
export async function GET(context) {
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
export async function PUT(context) {
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
export async function DELETE(context) {
  try {
    // Verificar autenticación
    const authResponse = await requireAuth(context);
    if (authResponse) return authResponse;

    const id = context.params.id;
    if (!id) {
      return jsonResponse({ error: 'Project ID is required' }, 400);
    }

    const success = await projectsService.deleteProject(id);
    if (!success) {
      return jsonResponse({ error: 'Project not found' }, 404);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return jsonResponse(
      { error: error.message || 'Failed to delete project' },
      error.status || 500
    );
  }
}

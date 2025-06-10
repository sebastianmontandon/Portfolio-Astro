const API_URL = '/api';

export const api = {
  // Projects
  async getProjects() {
    const response = await fetch(`${API_URL}/projects`);
    return handleResponse(response);
  },

  async getProject(id) {
    const response = await fetch(`${API_URL}/projects?id=${id}`);
    return handleResponse(response);
  },

  async createProject(projectData, token) {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },

  async updateProject(id, updates, token) {
    const response = await fetch(`${API_URL}/projects?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  },

  async deleteProject(id, token) {
    const response = await fetch(`${API_URL}/projects?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 204) return true;
    return handleResponse(response);
  },

  // File upload
  async uploadFile(file, token) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return handleResponse(response);
  }
};

// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.error || 'An error occurred');
    error.status = response.status;
    error.details = data.details;
    throw error;
  }
  
  return data;
}

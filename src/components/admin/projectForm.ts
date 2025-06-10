// Types
interface ProjectData {
  id: string;
  isEdit: string;
}

interface UploadResponse {
  url: string;
}

// Define types for global functions
type AddTechnologyField = (button: HTMLButtonElement) => void;
type RemoveTechnologyField = (button: HTMLButtonElement) => void;

// Export types for global augmentation
export {};

declare global {
  interface Window {
    addTechnologyField: AddTechnologyField;
    removeTechnologyField: RemoveTechnologyField;
  }
}

// Get project data from the script tag
const getProjectData = (): ProjectData => {
  const projectDataElement = document.getElementById('projectData');
  if (!projectDataElement?.textContent) {
    throw new Error('Project data element not found or empty');
  }
  return JSON.parse(projectDataElement.textContent);
};

const projectData = getProjectData();

// Helper function to get auth token
const getAuthToken = (): string => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) {
    window.location.href = '/admin/login';
    throw new Error('No auth token found');
  }

  return token;
};

// Add technology field
function addTechnologyField(button: HTMLButtonElement) {
  const container = document.getElementById('technologiesContainer');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = 'flex space-x-2';
  div.innerHTML = `
    <input
      type="text"
      name="technologies"
      class="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
      placeholder="e.g., React, Node.js"
    />
    <button 
      type="button" 
      onclick="window.removeTechnologyField(this)"
      class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
    >
      −
    </button>
  `;
  container.appendChild(div);
}

// Remove technology field
function removeTechnologyField(button: HTMLButtonElement) {
  const container = document.getElementById('technologiesContainer');
  if (container && container.children.length > 1 && button.parentElement) {
    button.parentElement.remove();
  }
}

// Handle file upload with proper types
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const { url } = await response.json();
    const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement | null;
    if (imageUrlInput) {
      imageUrlInput.value = url;
      
      // Show preview
      let preview = document.getElementById('imagePreview') as HTMLImageElement | null;
      if (preview) {
        preview.src = url;
        preview.classList.remove('hidden');
      } else {
        preview = document.createElement('img');
        preview.id = 'imagePreview';
        preview.src = url;
        preview.className = 'mt-2 max-h-40 rounded-md';
        imageUrlInput.after(preview);
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file. Please try again.');
  }
}

// Handle form submission
async function handleFormSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
    
  if (!token) {
    window.location.href = '/admin/login';
    return;
  }
  
  try {
    const projectDataElement = document.getElementById('projectData') as HTMLScriptElement | null;
    if (!projectDataElement) throw new Error('Project data not found');
    
    const projectData = JSON.parse(projectDataElement.textContent || '{}') as ProjectData;
    
    const url = projectData.isEdit === 'true' && projectData.id
      ? `/api/projects/${projectData.id}`
      : '/api/projects';
      
    const method = projectData.isEdit === 'true' ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        technologies: formData.getAll('technologies'),
        githubUrl: formData.get('githubUrl'),
        liveUrl: formData.get('liveUrl'),
        imageUrl: formData.get('imageUrl'),
        category: formData.get('category') || 'web'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save project');
    }
    
    window.location.href = '/admin/dashboard?success=project-saved';
  } catch (error) {
    console.error('Error saving project:', error);
    const projectDataElement = document.getElementById('projectData') as HTMLScriptElement | null;
    if (!projectDataElement) return;
    
    const projectData = JSON.parse(projectDataElement.textContent || '{}') as ProjectData;
    const errorUrl = projectData.isEdit === 'true' && projectData.id
      ? `/admin/projects/edit/${projectData.id}?error=save-failed`
      : '/admin/projects/new?error=save-failed';
    window.location.href = errorUrl;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize image preview if imageUrl exists
  const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement | null;
  const imageUrl = imageUrlInput?.value;
  
  if (imageUrl) {
    const preview = document.createElement('img');
    preview.id = 'imagePreview';
    preview.src = imageUrl;
    preview.className = 'mt-2 max-h-40 rounded-md';
    imageUrlInput?.after(preview);
  }

  // Set up file input change handler
  const fileInput = document.getElementById('image') as HTMLInputElement | null;
  if (fileInput) {
    fileInput.addEventListener('change', (e: Event) => handleFileUpload(e));
  }
  
  // Set up form submission handler
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e: Event) => handleFormSubmit(e));
  }

  // Make functions available globally for inline event handlers
  window.addTechnologyField = addTechnologyField;
  window.removeTechnologyField = removeTechnologyField;
});

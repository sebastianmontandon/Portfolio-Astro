import { supabase, supabaseAdmin } from './supabase';

export const projectsService = {
  // Get all projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    return data || [];
  },

  // Get a single project by ID
  async getProjectById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
    return data;
  },

  // Create a new project
  async createProject(projectData) {
    // Usar el cliente de administración para evitar problemas con RLS
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    console.log('Project created successfully:', data);
    return data;
  },

  // Update an existing project
  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
    return data;
  },

  // Delete a project
  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
    return true;
  },

  // Upload project image
  async uploadImage(file, fileName) {
    const fileExt = fileName.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  // Delete an image
  async deleteImage(filePath) {
    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
    return true;
  }
};

// @ts-check
import { supabase, supabaseAdmin } from './supabase';

/**
 * Projects service for handling project-related operations
 */
export const projectsService = {
  /**
   * Fetches all projects from the database
   * @returns {Promise<Array<import('../types').Project>>}
   */
  async getProjects() {
    try {
      console.log('Fetching projects from Supabase...');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects from Supabase:', error);
        throw error;
      }

      const projects = data || [];
      console.log(`Successfully fetched ${projects.length} projects from Supabase`);
      return projects;
    } catch (error) {
      console.error('Error in getProjects:', error);
      return [];
    }
  },

  /**
   * Fetches a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<import('../types').Project | null>}
   */
  async getProjectById(id) {
    try {
      if (!id) {
        throw new Error('Project ID is required');
      }

      console.log(`Fetching project ${id} from Supabase...`);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching project ${id}:`, error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error(`Error in getProjectById(${id}):`, error);
      return null;
    }
  },

  /**
   * Creates a new project
   * @param {Object} projectData - Project data to create
   * @returns {Promise<import('../types').Project>}
   */
  async createProject(projectData) {
    try {
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
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  /**
   * Updates an existing project
   * @param {string} id - Project ID to update
   * @param {Object} updates - Data to update
   * @returns {Promise<import('../types').Project>}
   */
  async updateProject(id, updates) {
    try {
      const client = supabaseAdmin || supabase;

      const { data, error } = await client
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating project ${id}:`, error);
        throw error;
      }

      console.log(`Project ${id} updated successfully`);
      return data;
    } catch (error) {
      console.error(`Error in updateProject(${id}):`, error);
      throw error;
    }
  },

  /**
   * Deletes a project
   * @param {string} id - Project ID to delete
   * @returns {Promise<boolean>}
   */
  async deleteProject(id) {
    try {
      const client = supabaseAdmin || supabase;

      // Primero verificar que el proyecto existe
      const { data: existingProject, error: checkError } = await client
        .from('projects')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error(`Error checking project ${id}:`, checkError);
        throw checkError;
      }

      if (!existingProject) {
        console.error(`Project ${id} not found`);
        throw new Error('Project not found');
      }

      // Eliminar el proyecto
      const { error: deleteError } = await client
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(`Error deleting project ${id}:`, deleteError);
        throw deleteError;
      }

      // Verificar que el proyecto fue eliminado
      const { data: verifyData, error: verifyError } = await client
        .from('projects')
        .select('id')
        .eq('id', id)
        .single();

      if (verifyError && verifyError.code !== 'PGRST116') {
        console.error(`Error verifying project deletion ${id}:`, verifyError);
        throw verifyError;
      }

      if (verifyData) {
        console.error(`Project ${id} still exists after deletion`);
        throw new Error('Project deletion failed');
      }

      console.log(`Project ${id} deleted successfully and verified`);
      return true;
    } catch (error) {
      console.error(`Error in deleteProject(${id}):`, error);
      throw error;
    }
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
  },

  // Cache management methods
  /**
   * Invalidates cache for a specific project or all projects
   * @param {string} [projectId] - Optional project ID to invalidate specific cache
   */
  invalidateCache(projectId) {
    if (projectId) {
      // Invalidate specific project cache
      projectsCache.delete(`project_${projectId}`);
      console.log(`Cache invalidated for project: ${projectId}`);
    }

    // Always invalidate the all projects cache when any project changes
    projectsCache.delete('all_projects');
    console.log('All projects cache invalidated');
  },

  /**
   * Clears all cache entries
   */
  clearAllCache() {
    projectsCache.clear();
    console.log('All cache cleared');
  },

  /**
   * Gets cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: projectsCache.cache.size,
      entries: Array.from(projectsCache.cache.keys()),
      maxEntries: CACHE_CONFIG.MAX_ENTRIES,
      ttl: CACHE_CONFIG.TTL
    };
  }
};

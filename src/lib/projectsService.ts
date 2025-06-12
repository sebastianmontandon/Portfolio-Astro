// @ts-check
import { supabase as clientSupabase } from './client';
import { getAdminClient } from './supabase/server';
import type { Database } from '@/types/supabase';

// Use server-side client in Node.js environment, fallback to client-side
const supabase = typeof window === 'undefined' 
  ? getAdminClient() 
  : clientSupabase;

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

/**
 * Projects service for handling project-related operations
 */
export const projectsService = {
  /**
   * Fetches all projects from the database
   * @returns {Promise<Project[]>} Array of projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      console.log('Fetching projects from Supabase...');
      
      // Log the Supabase client configuration
      console.log('Supabase client config:', {
        isInitialized: !!supabase,
        isServer: typeof window === 'undefined',
        environment: process.env.NODE_ENV || 'development'
      });
      
      if (!supabase) {
        throw new Error('Supabase client is not properly initialized');
      }

      // Usar la función personalizada de Supabase para obtener datos frescos
      const { data, error } = await supabase
        .rpc('get_fresh_projects');

      if (error) {
        console.error('Error fetching projects from Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} projects from Supabase`);
      return data || [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error in getProjects:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'UnknownError'
      });
      return [];
    }
  },

  /**
   * Fetches a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Project | null>} Project data or null if not found
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      if (!id) {
        throw new Error('Project ID is required');
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching project ${id}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error in getProjectById(${id}):`, error);
      return null;
    }
  },

  /**
   * Creates a new project
   * @param {ProjectInsert} projectData - Project data to insert
   * @returns {Promise<Project>} The created project
   */
  async createProject(projectData: ProjectInsert): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
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
   * @param {ProjectUpdate} updates - Fields to update
   * @returns {Promise<Project>} The updated project
   */
  async updateProject(id: string, updates: ProjectUpdate): Promise<Project> {
    try {
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
    } catch (error) {
      console.error(`Error in updateProject(${id}):`, error);
      throw error;
    }
  },

  /**
   * Deletes a project
   * @param {string} id - Project ID to delete
   * @returns {Promise<boolean>} True if successful
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting project ${id}:`, error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error(`Error in deleteProject(${id}):`, error);
      throw error;
    }
  },

  /**
   * Uploads an image to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} fileName - The name of the file
   * @returns {Promise<string>} Public URL of the uploaded file
   */
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      const fileExt = fileName.split('.').pop();
      const filePath = `${Math.random().toString(36).substring(2)}.${fileExt}`;

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
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  },

  /**
   * Deletes an image from Supabase Storage
   * @param {string} filePath - Path of the file to delete
   * @returns {Promise<boolean>} True if successful
   */
  async deleteImage(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('project-images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw error;
    }
  }
};

// @ts-check
import { supabase, supabaseAdmin } from './supabase';

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_ENTRIES: 100
};

// Simple in-memory cache
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, value, ttl = CACHE_CONFIG.TTL) {
    // Clean old entries if cache is getting too large
    if (this.cache.size >= CACHE_CONFIG.MAX_ENTRIES) {
      this.cleanup();
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const now = Date.now();
    const expiry = this.timestamps.get(key);

    if (!expiry || now > expiry) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.delete(key);
      }
    }
  }
}

// Global cache instance
const projectsCache = new SimpleCache();

/**
 * Projects service for handling project-related operations
 */
export const projectsService = {
  // Get all projects with caching
  /**
   * Fetches all projects from the database with caching
   * @param {boolean} forceRefresh - Force refresh from database
   * @returns {Promise<Array<import('../types').Project>>}
   */
  async getProjects(forceRefresh = false) {
    const cacheKey = 'all_projects';

    try {
      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cachedData = projectsCache.get(cacheKey);
        if (cachedData) {
          console.log(`Returning ${cachedData.length} projects from cache`);
          return cachedData;
        }
      }

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

      // Cache the results
      projectsCache.set(cacheKey, projects);

      console.log(`Successfully fetched and cached ${projects.length} projects from Supabase`);
      return projects;
    } catch (error) {
      console.error('Error in getProjects:', error);

      // Try to return cached data as fallback
      const cachedData = projectsCache.get(cacheKey);
      if (cachedData) {
        console.log('Returning cached data as fallback due to error');
        return cachedData;
      }

      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  },

  /**
   * Fetches a single project by ID with caching
   * @param {string} id - Project ID
   * @param {boolean} forceRefresh - Force refresh from database
   * @returns {Promise<import('../types').Project | null>}
   */
  async getProjectById(id, forceRefresh = false) {
    const cacheKey = `project_${id}`;

    try {
      if (!id) {
        throw new Error('Project ID is required');
      }

      // Check cache first unless force refresh is requested
      if (!forceRefresh) {
        const cachedData = projectsCache.get(cacheKey);
        if (cachedData) {
          console.log(`Returning project ${id} from cache`);
          return cachedData;
        }
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

      const project = data || null;

      // Cache the result if found
      if (project) {
        projectsCache.set(cacheKey, project);
      }

      return project;
    } catch (error) {
      console.error(`Error in getProjectById(${id}):`, error);

      // Try to return cached data as fallback
      const cachedData = projectsCache.get(cacheKey);
      if (cachedData) {
        console.log(`Returning cached project ${id} as fallback due to error`);
        return cachedData;
      }

      return null;
    }
  },

  /**
 * Creates a new project and invalidates cache
 * @param {Object} projectData - Project data to create
 * @returns {Promise<import('../types').Project>}
 */
  async createProject(projectData) {
    try {
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

      // Invalidate cache after successful creation
      this.invalidateCache();

      console.log('Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  /**
   * Updates an existing project and invalidates cache
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

      // Invalidate cache after successful update
      this.invalidateCache(id);

      console.log(`Project ${id} updated successfully`);
      return data;
    } catch (error) {
      console.error(`Error in updateProject(${id}):`, error);
      throw error;
    }
  },

  /**
   * Deletes a project and invalidates cache
   * @param {string} id - Project ID to delete
   * @returns {Promise<boolean>}
   */
  async deleteProject(id) {
    try {
      const client = supabaseAdmin || supabase;

      const { error } = await client
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting project ${id}:`, error);
        throw error;
      }

      // Invalidate cache after successful deletion
      this.invalidateCache(id);

      console.log(`Project ${id} deleted successfully`);
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

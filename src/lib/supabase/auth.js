// @ts-check
import { jwtVerify } from 'jose';
import { TextEncoder } from 'util';
import { supabase, getAdminClient } from '.';
import { ERROR_MESSAGES } from './constants';

// Get JWT secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || import.meta.env.JWT_SECRET || 'your-256-bit-secret'
);

/**
 * Verifies if a JWT token is valid
 * @param {string} token - JWT token to verify
 * @returns {Promise<{isValid: boolean, payload?: object, error?: string}>}
 */
export const verifyToken = async (token) => {
  try {
    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { isValid: true, payload };
  } catch (error) {
    console.error('Token verification error:', error);
    return { 
      isValid: false, 
      error: error.message.includes('expired') 
        ? 'Token expired' 
        : 'Invalid token' 
    };
  }
};

/**
 * Gets the current user from the session
 * @param {string} [token] - Optional JWT token
 * @returns {Promise<{user: object|null, error?: string}>}
 */
export const getCurrentUser = async (token) => {
  try {
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) throw error;
      if (!user) return { user: null, error: 'User not found' };
      
      return { user };
    }

    // If no token is provided, try to get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    if (!session) return { user: null };
    
    return { user: session.user };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { 
      user: null, 
      error: error.message || ERROR_MESSAGES.UNAUTHORIZED 
    };
  }
};

/**
 * Checks if the current user has the required role
 * @param {string} requiredRole - Required role
 * @param {string} [token] - Optional JWT token
 * @returns {Promise<{hasRole: boolean, user?: object, error?: string}>}
 */
export const hasRole = async (requiredRole, token) => {
  try {
    const { user, error } = await getCurrentUser(token);
    
    if (error || !user) {
      return { hasRole: false, error: error || 'User not authenticated' };
    }
    
    // Get user's roles (you need to implement this based on your database schema)
    const { data: userData, error: userError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (userError) throw userError;
    
    const hasRequiredRole = userData?.role === requiredRole;
    
    if (!hasRequiredRole) {
      return { 
        hasRole: false, 
        error: ERROR_MESSAGES.UNAUTHORIZED,
        user: { id: user.id, email: user.email }
      };
    }
    
    return { hasRole: true, user };
  } catch (error) {
    console.error('Error checking user role:', error);
    return { 
      hasRole: false, 
      error: error.message || 'Error checking permissions' 
    };
  }
};

/**
 * Middleware for protecting API routes
 * @param {import('astro').APIContext} context - Astro API context
 * @param {string[]} [allowedRoles] - Array of allowed roles
 * @returns {Promise<{user?: object, error?: {status: number, message: string}}>}
 */
export const protectRoute = async (context, allowedRoles = []) => {
  try {
    const authHeader = context.request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return { 
        error: { 
          status: 401, 
          message: 'Authentication required' 
        } 
      };
    }

    // Verify the token
    const { isValid, payload, error: tokenError } = await verifyToken(token);
    
    if (!isValid || !payload) {
      return { 
        error: { 
          status: 401, 
          message: tokenError || 'Invalid or expired token' 
        } 
      };
    }

    // If no specific roles required, return the user
    if (!allowedRoles.length) {
      const { user, error: userError } = await getCurrentUser(token);
      
      if (userError || !user) {
        return { 
          error: { 
            status: 403, 
            message: userError || 'User not found' 
          } 
        };
      }
      
      return { user };
    }

    // Check if user has required role
    const { hasRole: userHasRole, error: roleError, user } = await hasRole(allowedRoles, token);
    
    if (!userHasRole || roleError) {
      return { 
        error: { 
          status: 403, 
          message: roleError || 'Insufficient permissions' 
        } 
      };
    }
    
    return { user };
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);
    return { 
      error: { 
        status: 500, 
        message: 'Internal server error' 
      } 
    };
  }
};

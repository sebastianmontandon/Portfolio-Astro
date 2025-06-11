// Endpoint para limpiar la caché de proyectos
export const prerender = false;

import { projectsService } from '../../../lib/projectsService.js';

// Helper function to handle responses
function jsonResponse(data, status = 200, headers = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}

// Clear cache endpoint
export async function POST() {
    try {
        // Clear all cache
        projectsService.clearAllCache();

        console.log('Cache cleared successfully via API');

        return jsonResponse({
            success: true,
            message: 'Cache cleared successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error clearing cache:', error);
        return jsonResponse({
            success: false,
            error: 'Failed to clear cache',
            details: import.meta.env.MODE === 'development' ? error.message : undefined
        }, 500);
    }
}

// GET endpoint to get cache statistics
export async function GET() {
    try {
        const stats = projectsService.getCacheStats();

        return jsonResponse({
            success: true,
            data: stats,
            message: 'Cache statistics retrieved successfully'
        });

    } catch (error) {
        console.error('Error getting cache stats:', error);
        return jsonResponse({
            success: false,
            error: 'Failed to get cache statistics',
            details: import.meta.env.MODE === 'development' ? error.message : undefined
        }, 500);
    }
} 
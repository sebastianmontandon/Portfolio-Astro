import { a as authService } from '../../../chunks/authService_G00fBTP6.mjs';
export { renderers } from '../../../renderers.mjs';

// Deshabilitar prerenderizado estático para esta ruta de API
const prerender = false;

// Helper function to handle responses
function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

// Iniciar sesión
async function POST(context) {
  try {
    const { email, password } = await context.request.json();
    
    if (!email || !password) {
      return jsonResponse(
        { error: 'Email and password are required' },
        400
      );
    }

    const { token, user } = await authService.login(email, password);
    
    return jsonResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        // No devolver información sensible
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse(
      { error: error.message || 'Authentication failed' },
      401
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { authService } from '../lib/authService';

export async function requireAuth(context) {
  const authHeader = context.request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Token de autenticación requerido' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const user = await authService.verifyToken(token);
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Token inválido o expirado' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Agregar el usuario al contexto para que esté disponible en la ruta
  context.locals.user = user;
  return null; // Continuar con la solicitud
}

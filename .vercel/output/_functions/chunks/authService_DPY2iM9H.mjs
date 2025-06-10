import { jwtVerify, SignJWT } from 'jose';
import { s as supabase } from './supabase_BuBGhQUZ.mjs';

// Clave secreta para firmar los tokens JWT (guárdala en una variable de entorno)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'tu-clave-secreta-segura');

const authService = {
  // Iniciar sesión y obtener token
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Crear token JWT
      const token = await new SignJWT({ 
        userId: data.user.id,
        email: data.user.email 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

      return { token, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Verificar token JWT
  async verifyToken(token) {
    try {
      if (!token) return null;
      
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
};

export { authService as a };

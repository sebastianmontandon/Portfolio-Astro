# Configuración del Chatbot IA

Este documento explica cómo configurar el chatbot IA del portfolio, incluyendo el soporte para formato Markdown y la configuración en Vercel.

## Características del Chatbot

### ✅ Funcionalidades Implementadas

- **Soporte completo para Markdown**: El chatbot interpreta y muestra formato markdown incluyendo:
  - **Negritas** e *cursivas*
  - Listas con viñetas y numeradas
  - Enlaces con estilos mejorados
  - Código inline y bloques de código
  - Encabezados
  - Citas
  - Separadores

- **Respuestas inteligentes**: Basadas en palabras clave y contexto
- **Límite de mensajes**: Máximo 6 mensajes por sesión
- **Indicador de escritura**: Animación mientras procesa respuestas
- **Diseño responsivo**: Optimizado para móviles y desktop
- **Integración HTMX**: Sin JavaScript adicional necesario

### 🎨 Estilos Markdown Implementados

El chatbot incluye estilos CSS personalizados para:

```css
/* Ejemplos de estilos aplicados */
.markdown-content strong {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.markdown-content a {
  color: #60a5fa;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}
```

## Configuración en Vercel

### 🔧 Variables de Entorno Requeridas

Para que el chatbot funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

#### Variables Públicas (Opcionales para n8n)
```bash
PUBLIC_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/chatbot
PUBLIC_N8N_USERNAME=tu_usuario
PUBLIC_N8N_PASSWORD=tu_password
```

#### Variables de Supabase (Si usas Supabase)
```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 📝 Cómo Configurar en Vercel

1. **Accede al Dashboard de Vercel**
   - Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Selecciona tu proyecto

2. **Configura las Variables de Entorno**
   - Ve a **Settings** → **Environment Variables**
   - Agrega cada variable con su valor correspondiente
   - Asegúrate de que estén marcadas para **Production**, **Preview** y **Development**

3. **Redeploy el Proyecto**
   - Ve a **Deployments**
   - Haz clic en **Redeploy** en el deployment más reciente

### 🚨 Solución al Error 404 en Vercel

Si ves el error `DEPLOYMENT_NOT_FOUND` en los logs de Vercel:

1. **Verifica las Variables de Entorno**
   ```bash
   # En los logs deberías ver:
   PUBLIC_N8N_WEBHOOK_URL: Configurado
   PUBLIC_N8N_USERNAME: Configurado
   PUBLIC_N8N_PASSWORD: Configurado
   ```

2. **Si no están configuradas, el chatbot usará respuestas simuladas**
   - Esto es normal y funcional
   - No afecta la experiencia del usuario

3. **Revisa la Configuración del Adapter**
   ```javascript
   // astro.config.mjs
   adapter: vercel({
     webAnalytics: { enabled: true },
     edgeMiddleware: false,
     includeFiles: ['./src/pages/api/**/*'],
     maxDuration: 30
   })
   ```

## Configuración Local

### 🏠 Desarrollo Local

1. **Crea un archivo `.env` en la raíz del proyecto**
   ```bash
   PUBLIC_N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/chatbot
   PUBLIC_N8N_USERNAME=tu_usuario
   PUBLIC_N8N_PASSWORD=tu_password
   ```

2. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **El chatbot funcionará con respuestas simuladas si no tienes n8n configurado**

## Respuestas del Chatbot

### 🤖 Respuestas Simuladas

El chatbot incluye respuestas inteligentes para preguntas comunes:

- **Experiencia**: Información sobre años de trabajo y tecnologías
- **Tecnologías**: Stack tecnológico completo
- **Proyectos**: Lista de proyectos destacados
- **Contacto**: Información de contacto y enlaces
- **Ubicación**: Información sobre Uruguay y zona horaria
- **Educación**: Formación y aprendizaje continuo
- **Disponibilidad**: Estado actual para trabajo freelance

### 📝 Ejemplo de Respuesta con Markdown

```
**Mi stack tecnológico incluye:**

**Backend:**
- Node.js
- Python
- FastAPI
- Express.js

**Frontend:**
- React
- TypeScript
- Tailwind CSS
- Astro

¿Te gustaría que te cuente sobre algún proyecto específico?
```

## Personalización

### 🎨 Modificar Estilos Markdown

Los estilos están en `src/components/Chatbot.astro` en la sección CSS:

```css
/* Personaliza los colores y efectos */
.markdown-content strong {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
  /* ... más estilos */
}
```

### 🔧 Agregar Nuevas Respuestas

Edita la función `getSimulatedResponse()` en `src/pages/api/chatbot.js`:

```javascript
if (message.includes('nueva_palabra_clave')) {
  return "**Tu respuesta con markdown aquí**\n\n- Punto 1\n- Punto 2";
}
```

## Troubleshooting

### ❌ Problemas Comunes

1. **Error 404 en Vercel**
   - Verifica que las variables de entorno estén configuradas
   - Revisa los logs en el dashboard de Vercel

2. **Markdown no se renderiza**
   - Verifica que la librería `marked` esté instalada
   - Revisa la consola del navegador para errores

3. **Chatbot no responde**
   - Verifica la conexión a internet
   - Revisa los logs del servidor

### 🔍 Logs de Debug

El chatbot incluye logs detallados:

```bash
📨 Mensaje del usuario: tu pregunta
📊 Contador de mensajes: 1
🔍 Variables de entorno: Configurado/No configurado
🤖 Respuesta del bot: respuesta procesada
```

## Dependencias

### 📦 Librerías Utilizadas

- **marked**: Para renderizar Markdown
- **htmx**: Para interacciones sin JavaScript
- **Tailwind CSS**: Para estilos

### 🔧 Instalación

```bash
npm install marked htmx.org
```

## Contribución

Para contribuir al chatbot:

1. Modifica `src/pages/api/chatbot.js` para la lógica
2. Actualiza `src/components/Chatbot.astro` para la UI
3. Prueba localmente antes de hacer deploy
4. Verifica que funcione en Vercel

---

**Nota**: El chatbot está diseñado para funcionar tanto con n8n como sin él, proporcionando una experiencia consistente en todos los entornos. 
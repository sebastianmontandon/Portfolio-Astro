// API endpoint para el chatbot que se conecta con n8n
import { marked } from 'marked';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const userMessage = formData.get('message');
    const messageCount = parseInt(formData.get('messageCount') || '0');

    if (!userMessage || userMessage.trim().length === 0) {
      return new Response(
        generateUserMessage("Por favor, escribe una pregunta válida."),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Validar longitud del mensaje
    if (userMessage.length > 500) {
      return new Response(
        generateUserMessage("El mensaje es demasiado largo. Por favor, acorta tu pregunta."),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Verificar si ya se alcanzó el límite de mensajes
    if (messageCount >= 6) {
      return new Response(
        generateUserMessage(userMessage) + generateLimitReachedMessage(),
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Generar mensaje del usuario
    const userMessageHTML = generateUserMessage(userMessage);

    // Aquí es donde conectarías con tu flujo de n8n
    // Por ahora, simularemos una respuesta
    console.log('📨 Mensaje del usuario:', userMessage);
    console.log('📊 Contador de mensajes:', messageCount);
    const botResponse = await getBotResponse(userMessage);
    console.log('🤖 Respuesta del bot:', botResponse);

    // Retornar ambos mensajes (usuario y bot)
    return new Response(
      userMessageHTML + generateBotMessage(botResponse),
      { 
        status: 200, 
        headers: { 'Content-Type': 'text/html' } 
      }
    );

  } catch (error) {
    console.error('Error en chatbot API:', error);
    return new Response(
      generateBotMessage("Lo siento, hubo un error procesando tu pregunta. Por favor, intenta de nuevo."),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Función para obtener respuesta del bot (conectar con n8n)
async function getBotResponse(userMessage) {
  try {
    // Obtener variables de entorno con mejor manejo
    const n8nWebhookUrl = import.meta.env.PUBLIC_N8N_WEBHOOK_URL || 
                         process.env.PUBLIC_N8N_WEBHOOK_URL || 
                         'https://tu-n8n-instance.com/webhook/chatbot';
    
    // Debug: Mostrar variables de entorno
    console.log('🔍 Variables de entorno:');
    console.log('PUBLIC_N8N_WEBHOOK_URL:', import.meta.env.PUBLIC_N8N_WEBHOOK_URL ? 'Configurado' : 'No configurado');
    console.log('PUBLIC_N8N_USERNAME:', import.meta.env.PUBLIC_N8N_USERNAME ? 'Configurado' : 'No configurado');
    console.log('PUBLIC_N8N_PASSWORD:', import.meta.env.PUBLIC_N8N_PASSWORD ? 'Configurado' : 'No configurado');
    
    // Si no tienes configurado n8n o es la URL por defecto, usar respuestas simuladas
    if (!import.meta.env.PUBLIC_N8N_WEBHOOK_URL || 
        n8nWebhookUrl === 'https://tu-n8n-instance.com/webhook/chatbot') {
      console.log('🟡 Usando respuesta simulada (n8n no configurado)');
      return getSimulatedResponse(userMessage);
    }

    // Configurar headers con autenticación básica
    const headers = {
      'Content-Type': 'application/json',
    };

    // Agregar autenticación básica si están configuradas las credenciales
    const n8nUsername = import.meta.env.PUBLIC_N8N_USERNAME || process.env.PUBLIC_N8N_USERNAME;
    const n8nPassword = import.meta.env.PUBLIC_N8N_PASSWORD || process.env.PUBLIC_N8N_PASSWORD;
    
    if (n8nUsername && n8nPassword) {
      const credentials = Buffer.from(`${n8nUsername}:${n8nPassword}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Reducido a 15 segundos

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString(),
          source: 'portfolio-chatbot'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('🔵 Status de respuesta n8n:', response.status);
      console.log('🔵 Headers de respuesta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`n8n responded with status: ${response.status}`);
      }

      // Obtener el texto de la respuesta primero
      const responseText = await response.text();
      console.log('🔵 Respuesta raw de n8n:', responseText);

      // Verificar si la respuesta está vacía
      if (!responseText || responseText.trim() === '') {
        throw new Error('n8n returned empty response');
      }

      // Intentar parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🔴 Error parsing JSON from n8n:', parseError);
        console.log('🔵 Response text that failed to parse:', responseText);
        throw new Error(`Invalid JSON response from n8n: ${parseError.message}`);
      }

      console.log('🔵 Respuesta parseada de n8n:', data);
      return data.output || data.response || data.message || "No pude procesar tu pregunta. Por favor, intenta de nuevo.";

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('🔴 Timeout conectando con n8n (15s)');
        throw new Error('n8n request timed out');
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('🔴 Error conectando con n8n:', error);
    console.log('🟡 Usando respuesta simulada como fallback');
    return getSimulatedResponse(userMessage);
  }
}

// Respuestas simuladas mientras configuras n8n
function getSimulatedResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Respuestas basadas en palabras clave con mejor formato markdown
  if (message.includes('experiencia') || message.includes('años')) {
    return "Tengo **más de 5 años** de experiencia en desarrollo backend y full-stack. He trabajado con tecnologías como Node.js, React, Python, y bases de datos como PostgreSQL y MongoDB.\n\n**Mi experiencia incluye:**\n- Desarrollo de APIs RESTful\n- Aplicaciones web escalables\n- Sistemas de microservicios\n- Integración con servicios cloud";
  }
  
  if (message.includes('tecnología') || message.includes('tech') || message.includes('stack')) {
    return "**Mi stack tecnológico incluye:**\n\n**Backend:**\n- Node.js\n- Python\n- FastAPI\n- Express.js\n\n**Frontend:**\n- React\n- TypeScript\n- Tailwind CSS\n- Astro\n\n**Bases de datos:**\n- PostgreSQL\n- MongoDB\n- Redis\n\n**DevOps:**\n- Docker\n- AWS\n- Vercel\n\n**Herramientas:**\n- Git\n- Jest\n- Swagger\n- Postman\n\nSiempre estoy aprendiendo nuevas tecnologías.";
  }
  
  if (message.includes('proyecto') || message.includes('portfolio') || message.includes('últimos')) {
    return "En mi portfolio puedes ver varios proyectos, incluyendo aplicaciones web, APIs, y herramientas de desarrollo.\n\n**Proyectos destacados:**\n- **Sistemas de tracking** - Aplicaciones para seguimiento de datos\n- **Aplicaciones de traducción** - Herramientas de procesamiento de lenguaje\n- **Herramientas de procesamiento de datos** - Conversores y procesadores\n- **APIs RESTful** - Servicios backend escalables\n\n¿Te gustaría que te cuente sobre algún proyecto específico?";
  }
  
  if (message.includes('contacto') || message.includes('email') || message.includes('linkedin')) {
    return "Puedes contactarme a través de:\n\n**Email:** sam171990@gmail.com\n**LinkedIn:** [linkedin.com/in/sebastian-montandon](https://linkedin.com/in/sebastian-montandon)\n**GitHub:** [github.com/sebastianmontandon](https://github.com/sebastianmontandon)\n\nTambién puedes usar el formulario de contacto en esta página.";
  }
  
  if (message.includes('ubicación') || message.includes('país') || message.includes('uruguay')) {
    return "Soy de **Uruguay** y trabajo tanto en proyectos locales como remotos. Estoy abierto a oportunidades de trabajo remoto y colaboraciones internacionales.\n\n**Zona horaria:** UTC-3 (GMT-3)";
  }
  
  if (message.includes('educación') || message.includes('estudios') || message.includes('universidad')) {
    return "Mi formación incluye estudios en desarrollo de software y programación. Me mantengo actualizado constantemente a través de:\n\n- Cursos online\n- Documentación oficial\n- Práctica en proyectos reales\n- Comunidades de desarrolladores";
  }
  
  if (message.includes('disponibilidad') || message.includes('freelance') || message.includes('trabajo')) {
    return "Actualmente estoy **disponible** para proyectos freelance y oportunidades de trabajo. Me especializo en:\n\n- Desarrollo backend\n- APIs RESTful\n- Aplicaciones full-stack\n- Integración de servicios\n\n¿Tienes un proyecto en mente?";
  }
  
  // Respuesta por defecto
  return "Gracias por tu pregunta. Puedo ayudarte con información sobre mi experiencia, proyectos, habilidades técnicas, y más.\n\n**¿Podrías ser más específico sobre qué te gustaría saber?**\n\n- Experiencia y años de trabajo\n- Tecnologías que uso\n- Proyectos realizados\n- Información de contacto\n- Disponibilidad para trabajo";
}

// Generar HTML para mensaje del usuario
function generateUserMessage(message) {
  return `
    <div class="flex items-start space-x-3 justify-end">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 max-w-xs">
        <p class="text-white text-sm">${escapeHtml(message)}</p>
      </div>
      <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
    </div>
  `;
}

// Generar HTML para mensaje del bot con soporte mejorado para Markdown
function generateBotMessage(message) {
  // Configurar marked con opciones mejoradas
  marked.setOptions({
    breaks: true,        // Permitir saltos de línea con \n
    gfm: true,          // GitHub Flavored Markdown
    sanitize: false,    // Permitir HTML en el Markdown
    headerIds: false,   // No generar IDs automáticos
    mangle: false       // No modificar URLs
  });

  // Convertir Markdown a HTML
  const htmlContent = marked.parse(message);

  return `
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      </div>
      <div class="bg-gray-700 rounded-lg p-3 max-w-xs">
        <div class="text-gray-100 text-sm markdown-content">${htmlContent}</div>
      </div>
    </div>
  `;
}

// Generar HTML para mensaje de límite alcanzado
function generateLimitReachedMessage() {
  return `
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      </div>
      <div class="bg-gray-700 rounded-lg p-3 max-w-xs">
        <div class="text-gray-100 text-sm markdown-content">
          <p>¡Gracias por tus preguntas! Ha sido un placer ayudarte a conocer más sobre Sebastián.</p>
          <p class="mt-2">Si aún tienes dudas o te gustaría contactarlo directamente, puedes hacerlo a través de la sección de contacto.</p>
          <button 
            onclick="scrollToContact()" 
            class="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            Ir a Contacto
          </button>
        </div>
      </div>
    </div>
  `;
}

// Función para escapar HTML (compatible con servidor)
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
} 
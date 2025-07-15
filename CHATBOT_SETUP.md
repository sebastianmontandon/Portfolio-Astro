# Configuración del Chatbot con n8n

## Descripción

Este chatbot permite a los visitantes de tu portfolio hacer preguntas sobre tu experiencia, proyectos y habilidades. Se integra con un flujo de n8n que puede acceder a tu CV y proporcionar respuestas inteligentes.

## Características

- ✅ Chat flotante con diseño moderno
- ✅ Integración con HTMX para actualizaciones dinámicas
- ✅ Conexión con flujo de n8n
- ✅ Respuestas simuladas como fallback
- ✅ Diseño responsive y accesible
- ✅ Indicadores de carga y estados de error

## Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```bash
N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/chatbot
N8N_USERNAME=tu-usuario-n8n
N8N_PASSWORD=tu-password-n8n
```

**Nota**: Si tu instancia de n8n no requiere autenticación, puedes omitir `N8N_USERNAME` y `N8N_PASSWORD`.

### 2. Configuración de n8n

#### Paso 1: Crear el Webhook
1. En tu instancia de n8n, crea un nuevo workflow
2. Agrega un nodo "Webhook"
3. Configura el método como POST
4. **Configurar Autenticación** (opcional):
   - En la configuración del webhook, habilita "Authentication"
   - Selecciona "Basic Auth"
   - Configura usuario y contraseña
   - Estos serán los mismos valores que uses en `N8N_USERNAME` y `N8N_PASSWORD`
5. Copia la URL del webhook generada

#### Paso 2: Procesar el Mensaje
1. Agrega un nodo "Code" después del webhook
2. Extrae el mensaje del usuario:
```javascript
const userMessage = $input.first().json.message;
const timestamp = $input.first().json.timestamp;
const source = $input.first().json.source;

// Aquí puedes agregar lógica para procesar el mensaje
// Por ejemplo, buscar en tu CV, hacer consultas a APIs, etc.

return {
  response: "Respuesta basada en tu CV y experiencia..."
};
```

#### Paso 3: Integrar con tu CV
Puedes conectar el flujo con:
- **Base de datos**: Si tienes tu CV en una base de datos
- **Archivo**: Si tienes tu CV en formato JSON/CSV
- **API externa**: Para obtener información actualizada
- **IA**: Para generar respuestas más inteligentes

#### Paso 4: Respuesta
1. Agrega un nodo "Respond to Webhook"
2. Configura la respuesta como JSON:
```json
{
  "response": "{{ $json.response }}",
  "timestamp": "{{ $now }}"
}
```

### 3. Ejemplo de Flujo Completo

```
Webhook → Code (Procesar) → HTTP Request (Opcional) → Code (Formatear) → Respond to Webhook
```

## Personalización

### Modificar Respuestas Simuladas

Edita el archivo `src/pages/api/chatbot.js` y modifica la función `getSimulatedResponse()`:

```javascript
function getSimulatedResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Agregar más respuestas personalizadas
  if (message.includes('tu palabra clave')) {
    return "Tu respuesta personalizada aquí";
  }
  
  // Respuesta por defecto
  return "Respuesta por defecto";
}
```

### Personalizar el Diseño

El componente del chatbot está en `src/components/Chatbot.astro`. Puedes modificar:

- Colores y gradientes
- Posición del botón flotante
- Tamaño de la ventana del chat
- Mensajes de bienvenida

### Agregar Funcionalidades

- **Historial de conversaciones**: Guardar en base de datos
- **Análisis de sentimientos**: Detectar el tono de las preguntas
- **Sugerencias**: Mostrar preguntas frecuentes
- **Multilingüe**: Soporte para múltiples idiomas

## Testing

### Local
1. Ejecuta `npm run dev`
2. Abre el chat en la esquina inferior derecha
3. Prueba diferentes preguntas

### Con n8n
1. Configura tu webhook de n8n
2. Actualiza la variable `N8N_WEBHOOK_URL`
3. Prueba el flujo completo

## Troubleshooting

### El chat no aparece
- Verifica que el componente esté importado en `Layout.astro`
- Revisa la consola del navegador para errores

### No se conecta con n8n
- Verifica la URL del webhook
- Confirma que las credenciales de autenticación sean correctas
- Revisa los logs de n8n
- Confirma que el flujo esté activo
- Verifica que el webhook esté configurado para aceptar autenticación básica

### Errores de CORS
- Configura los headers correctos en n8n
- Verifica que el dominio esté permitido

## Seguridad

- Valida siempre los inputs del usuario
- Limita la longitud de los mensajes
- Implementa rate limiting si es necesario
- Escapa HTML para prevenir XSS
- **Autenticación**: Usa credenciales seguras para n8n
- **Variables de entorno**: Nunca commits credenciales en el código
- **HTTPS**: Asegúrate de que la comunicación con n8n sea segura

## Próximos Pasos

1. Configura tu flujo de n8n con tu CV
2. Personaliza las respuestas según tu experiencia
3. Agrega análisis de métricas de uso
4. Implementa funcionalidades avanzadas como historial

## Recursos Útiles

- [Documentación de n8n](https://docs.n8n.io/)
- [HTMX Documentation](https://htmx.org/docs/)
- [Astro Documentation](https://docs.astro.build/) 
// Endpoint para servir la especificación OpenAPI
export const prerender = false;

export async function GET() {
  const yamlContent = `openapi: 3.0.3
info:
  title: Portfolio API
  description: |
    API del Portfolio de Sebastian Montandon - Sistema completo para gestion de proyectos, autenticacion, cache y contacto.
    
    ## Caracteristicas principales:
    - Gestion completa de proyectos (CRUD)
    - Sistema de autenticacion con JWT
    - Envio de emails de contacto
    - Subida y gestion de imagenes
    - Sistema de cache con invalidacion inteligente
    - Validacion y manejo de errores robusto
    
    ## Autenticacion:
    La mayoria de los endpoints de escritura requieren un token JWT valido en el header Authorization.
    
  version: 1.0.0
  contact:
    name: Sebastian Montandon
    email: sam171990@gmail.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: http://localhost:3000/api
    description: Servidor de desarrollo
  - url: https://portfolio-astro.vercel.app/api
    description: Servidor de produccion

tags:
  - name: Projects
    description: Gestion de proyectos del portfolio
  - name: Cache
    description: Gestion del sistema de cache
  - name: Contact
    description: Sistema de contacto y emails
  - name: Testing
    description: Endpoints de testing y diagnostico

paths:
  /projects:
    get:
      tags: [Projects]
      summary: Obtener todos los proyectos
      description: |
        Retorna una lista de todos los proyectos del portfolio con informacion completa.
        Los datos se sirven desde cache cuando estan disponibles para mejor rendimiento.
      parameters:
        - name: force_refresh
          in: query
          description: Forzar actualizacion desde base de datos
          required: false
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Lista de proyectos obtenida exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Project'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      tags: [Projects]
      summary: Crear un nuevo proyecto
      description: |
        Crea un nuevo proyecto en el portfolio. Requiere autenticacion.
        Soporta subida de imagen mediante multipart/form-data.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - title
                - description
                - image
              properties:
                title:
                  type: string
                  description: Titulo del proyecto
                  example: "Mi Aplicacion Web"
                description:
                  type: string
                  description: Descripcion detallada del proyecto
                  example: "Una aplicacion web moderna construida con React y Node.js"
                image:
                  type: string
                  format: binary
                  description: Imagen del proyecto (JPEG, PNG, WebP)
                technologies:
                  type: array
                  items:
                    type: string
                  description: Lista de tecnologias utilizadas
                  example: ["React", "Node.js", "MongoDB"]
                live_url:
                  type: string
                  format: uri
                  description: URL de la demo en vivo
                  example: "https://mi-proyecto.com"
                github_url:
                  type: string
                  format: uri
                  description: URL del repositorio en GitHub
                  example: "https://github.com/usuario/proyecto"
                category:
                  type: string
                  description: Categoria del proyecto
                  example: "Frontend"
      responses:
        '201':
          description: Proyecto creado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Project created successfully"
                  data:
                    $ref: '#/components/schemas/Project'
        '400':
          description: Datos de entrada invalidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: No autorizado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /projects/{id}:
    get:
      tags: [Projects]
      summary: Obtener un proyecto por ID
      description: Retorna la informacion completa de un proyecto especifico
      parameters:
        - name: id
          in: path
          required: true
          description: ID unico del proyecto
          schema:
            type: string
            format: uuid
        - name: force_refresh
          in: query
          description: Forzar actualizacion desde base de datos
          required: false
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Proyecto encontrado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    $ref: '#/components/schemas/Project'
        '404':
          description: Proyecto no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    put:
      tags: [Projects]
      summary: Actualizar un proyecto existente
      description: Actualiza la informacion de un proyecto existente. Requiere autenticacion.
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID unico del proyecto
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                title:
                  type: string
                  description: Titulo del proyecto
                description:
                  type: string
                  description: Descripcion del proyecto
                image:
                  type: string
                  format: binary
                  description: Nueva imagen del proyecto (opcional)
                technologies:
                  type: array
                  items:
                    type: string
                  description: Lista de tecnologias
                live_url:
                  type: string
                  format: uri
                  description: URL de la demo
                github_url:
                  type: string
                  format: uri
                  description: URL del repositorio
                category:
                  type: string
                  description: Categoria del proyecto
      responses:
        '200':
          description: Proyecto actualizado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Project updated successfully"
                  data:
                    $ref: '#/components/schemas/Project'
        '400':
          description: Datos de entrada invalidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: No autorizado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Proyecto no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      tags: [Projects]
      summary: Eliminar un proyecto
      description: Elimina un proyecto del portfolio permanentemente. Requiere autenticacion.
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID unico del proyecto
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Proyecto eliminado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Project deleted successfully"
        '401':
          description: No autorizado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Proyecto no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /cache/clear:
    get:
      tags: [Cache]
      summary: Obtener estadisticas del cache
      description: Retorna informacion sobre el estado actual del sistema de cache
      responses:
        '200':
          description: Estadisticas del cache obtenidas exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    properties:
                      size:
                        type: integer
                        description: Numero de entradas en cache
                        example: 15
                      entries:
                        type: array
                        items:
                          type: string
                        description: Lista de claves en cache
                        example: ["all_projects", "project_123"]
                      maxEntries:
                        type: integer
                        description: Numero maximo de entradas permitidas
                        example: 100
                      ttl:
                        type: integer
                        description: Tiempo de vida en milisegundos
                        example: 300000

    post:
      tags: [Cache]
      summary: Limpiar todo el cache
      description: Elimina todas las entradas del cache del sistema
      responses:
        '200':
          description: Cache limpiado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Cache cleared successfully"
                  clearedEntries:
                    type: integer
                    description: Numero de entradas eliminadas
                    example: 15

  /contact:
    post:
      tags: [Contact]
      summary: Enviar mensaje de contacto
      description: Envia un email de contacto a traves del formulario del portfolio
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - message
              properties:
                name:
                  type: string
                  description: Nombre completo del remitente
                  example: "Juan Perez"
                  minLength: 2
                  maxLength: 100
                email:
                  type: string
                  format: email
                  description: Email del remitente
                  example: "juan@ejemplo.com"
                message:
                  type: string
                  description: Mensaje de contacto
                  example: "Hola, me gustaria contactarte para un proyecto..."
                  minLength: 10
                  maxLength: 1000
                subject:
                  type: string
                  description: Asunto del mensaje (opcional)
                  example: "Consulta sobre servicios"
                  maxLength: 200
      responses:
        '200':
          description: Mensaje enviado exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Message sent successfully"
        '400':
          description: Datos de entrada invalidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: Demasiadas solicitudes
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Error interno del servidor
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /test-supabase:
    get:
      tags: [Testing]
      summary: Probar conexion con Supabase
      description: Endpoint de diagnostico para verificar la conectividad con la base de datos
      responses:
        '200':
          description: Conexion con Supabase exitosa
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Supabase connection successful"
                  timestamp:
                    type: string
                    format: date-time
                    example: "2024-01-15T10:30:00Z"
                  database:
                    type: object
                    properties:
                      connected:
                        type: boolean
                        example: true
                      version:
                        type: string
                        example: "PostgreSQL 15.1"
        '500':
          description: Error de conexion con Supabase
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Token JWT obtenido del proceso de autenticacion

  schemas:
    Project:
      type: object
      required:
        - id
        - title
        - description
        - image_url
        - created_at
        - updated_at
      properties:
        id:
          type: string
          format: uuid
          description: ID unico del proyecto
          example: "123e4567-e89b-12d3-a456-426614174000"
        title:
          type: string
          description: Titulo del proyecto
          example: "Mi Aplicacion Web"
          minLength: 1
          maxLength: 200
        description:
          type: string
          description: Descripcion detallada del proyecto
          example: "Una aplicacion web moderna construida con React y Node.js"
          minLength: 10
          maxLength: 1000
        image_url:
          type: string
          format: uri
          description: URL de la imagen del proyecto
          example: "https://storage.supabase.co/projects/imagen.jpg"
        technologies:
          type: array
          items:
            type: string
          description: Lista de tecnologias utilizadas
          example: ["React", "Node.js", "MongoDB", "Tailwind CSS"]
        live_url:
          type: string
          format: uri
          nullable: true
          description: URL de la demo en vivo
          example: "https://mi-proyecto.com"
        github_url:
          type: string
          format: uri
          nullable: true
          description: URL del repositorio en GitHub
          example: "https://github.com/usuario/proyecto"
        category:
          type: string
          description: Categoria del proyecto
          example: "Frontend"
          enum: ["Frontend", "Backend", "Full Stack", "Mobile", "Desktop", "Data Science", "DevOps", "Other"]
        featured:
          type: boolean
          description: Indica si el proyecto es destacado
          example: false
          default: false
        created_at:
          type: string
          format: date-time
          description: Fecha y hora de creacion
          example: "2024-01-15T10:30:00Z"
        updated_at:
          type: string
          format: date-time
          description: Fecha y hora de ultima actualizacion
          example: "2024-01-15T15:45:00Z"

    Error:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          example: false
          description: Indica que la operacion fallo
        error:
          type: string
          description: Mensaje de error descriptivo
          example: "Invalid input data"
        details:
          type: object
          description: Detalles adicionales del error (opcional)
          additionalProperties: true
        timestamp:
          type: string
          format: date-time
          description: Timestamp del error
          example: "2024-01-15T10:30:00Z"
        path:
          type: string
          description: Ruta del endpoint que genero el error
          example: "/api/projects"

    CacheStats:
      type: object
      properties:
        size:
          type: integer
          description: Numero actual de entradas en cache
          example: 25
        maxEntries:
          type: integer
          description: Numero maximo de entradas permitidas
          example: 100
        ttl:
          type: integer
          description: Tiempo de vida en milisegundos
          example: 300000
        hitRate:
          type: number
          format: float
          description: Tasa de aciertos del cache (0-1)
          example: 0.85
        entries:
          type: array
          items:
            type: string
          description: Lista de claves actualmente en cache
          example: ["all_projects", "project_123", "project_456"]

  responses:
    NotFound:
      description: Recurso no encontrado
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Resource not found"
            timestamp: "2024-01-15T10:30:00Z"
            path: "/api/projects/nonexistent-id"

    Unauthorized:
      description: No autorizado - Token JWT invalido o faltante
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Unauthorized access"
            details:
              message: "Invalid or missing JWT token"
            timestamp: "2024-01-15T10:30:00Z"

    BadRequest:
      description: Solicitud invalida - Datos de entrada incorrectos
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Invalid input data"
            details:
              validation_errors:
                - field: "email"
                  message: "Invalid email format"
                - field: "name"
                  message: "Name is required"
            timestamp: "2024-01-15T10:30:00Z"

    InternalServerError:
      description: Error interno del servidor
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            success: false
            error: "Internal server error"
            timestamp: "2024-01-15T10:30:00Z"`;

  return new Response(yamlContent, {
    headers: {
      'Content-Type': 'application/x-yaml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 
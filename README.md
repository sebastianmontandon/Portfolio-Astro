# Portfolio Profesional - Sebastián Montandón

Portfolio profesional desarrollado con Astro, Tailwind CSS y Supabase, diseñado para mostrar mis proyectos y habilidades como Full Stack Developer con enfoque en desarrollo Backend.

![Portfolio Preview](https://i.postimg.cc/wM7qgH64/image.png)

## 🚀 Tecnologías Principales

- **Astro** - Framework web moderno con renderizado estático y dinámico
- **Tailwind CSS** - Framework CSS utility-first para diseños responsivos
- **Supabase** - Backend como servicio para autenticación y base de datos
- **TypeScript** - Tipado estático para mejor mantenibilidad
- **Node.js** - Entorno de ejecución del lado del servidor
- **PostgreSQL** - Base de datos relacional para almacenamiento de proyectos
- **JWT** - Autenticación segura con JSON Web Tokens

## ✨ Nuevas Características

### 🔥 Sistema de Caché Inteligente
- **Caché en memoria** con TTL de 5 minutos
- **Invalidación automática** al crear/actualizar/eliminar proyectos
- **Fallback inteligente** con datos en caché si hay errores de conectividad
- **API de gestión** para limpiar caché y ver estadísticas

### 📚 Documentación de API Completa
- **Swagger UI integrado** en `/api-docs`
- **Especificación OpenAPI 3.0** completa
- **Ejemplos interactivos** para probar endpoints
- **Autenticación JWT** integrada en la documentación

### 🎨 Efectos Visuales Mejorados
- **Transiciones suaves** con cubic-bezier optimizado
- **Animaciones de hover** mejoradas en cards de proyectos
- **Efectos de escala** en iconos y enlaces
- **Filtrado animado** con efectos fade y scale

## 📁 Estructura del Proyecto

```text
/
├── public/                  # Archivos estáticos (imágenes, favicon, etc.)
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── Projects.astro  # Componente principal de proyectos con caché
│   ├── lib/                 # Utilidades y servicios
│   │   ├── projectsService.js # Servicio con sistema de caché integrado
│   │   ├── supabase/       # Configuración de Supabase (cliente y servidor)
│   │   │   ├── client.js   # Cliente de Supabase para navegador
│   │   │   └── server.js   # Cliente de administración para servidor
│   │   └── client.ts       # Cliente TypeScript tipado
│   ├── middleware/          # Middleware de autenticación
│   ├── pages/
│   │   ├── api/            # Endpoints de la API
│   │   │   ├── projects/   # CRUD de proyectos
│   │   │   ├── cache/      # Gestión de caché
│   │   │   └── contact.ts  # Sistema de contacto
│   │   ├── api-docs.astro  # Documentación Swagger UI
│   │   ├── docs/           # Especificación OpenAPI
│   │   └── index.astro     # Página principal
│   └── styles/             # Estilos globales
├── docs/                    # Documentación adicional
│   └── api-spec.yaml       # Especificación completa de la API
├── astro.config.mjs         # Configuración de Astro
├── tailwind.config.mjs      # Configuración de Tailwind CSS
└── package.json             # Dependencias y scripts
```

## 🧞 Comandos Principales

| Comando                  | Acción                                            |
| :----------------------- | :------------------------------------------------ |
| `npm install`            | Instala las dependencias                          |
| `npm run dev`            | Inicia servidor de desarrollo en `localhost:3000` |
| `npm run build`          | Construye el sitio para producción en `./dist/`   |
| `npm run preview`        | Vista previa de la construcción de producción     |

## 📊 API y Documentación

### Endpoints Principales
- **`/api/projects`** - CRUD completo de proyectos con caché
- **`/api/cache/clear`** - Gestión del sistema de caché
- **`/api/contact`** - Sistema de contacto por email
- **`/api/test-supabase`** - Diagnóstico de conectividad

### Documentación Interactiva
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Especificación OpenAPI**: `http://localhost:3000/docs/api-spec.yaml`

### Sistema de Caché
```javascript
// Obtener proyectos (usa caché automáticamente)
GET /api/projects

// Forzar actualización desde BD
GET /api/projects?force_refresh=true

// Ver estadísticas del caché
GET /api/cache/clear

// Limpiar todo el caché
POST /api/cache/clear
```

## 🔄 Sistema de Proyectos Avanzado

### 🎯 Características del Sistema

- **CRUD Completo**: Crear, leer, actualizar y eliminar proyectos
- **Caché Inteligente**: Sistema de caché en memoria con invalidación automática
- **Subida de Imágenes**: Procesamiento y optimización automática con Sharp
- **Filtrado Dinámico**: Filtros por categoría con animaciones suaves
- **Autenticación JWT**: Protección de endpoints de escritura
- **API RESTful**: Endpoints bien documentados y tipados

### 🚀 Características de Rendimiento

- **Caché en Memoria**: TTL de 5 minutos para datos frecuentes
- **Fallback Inteligente**: Datos en caché si hay errores de conectividad
- **Optimización de Imágenes**: Conversión automática a WebP/JPEG optimizado
- **Lazy Loading**: Carga diferida de imágenes
- **Animaciones GPU**: Transiciones aceleradas por hardware

## 🎨 Personalización

### 🛠️ Configuración de Tailwind

```javascript
// tailwind.config.mjs
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Configuration
PUBLIC_SITE_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here
```

### Componentes Principales

- **Hero.astro**: Sección de presentación con información personal y tecnologías
- **About.astro**: Información detallada sobre experiencia y habilidades
- **Projects.astro**: Galería inteligente con caché, filtros y animaciones mejoradas
- **Contact.astro**: Formulario de contacto con validación y envío por email
- **API Routes**: Sistema completo de endpoints RESTful con autenticación

### Nuevos Archivos Importantes

- **`projectsService.js`**: Servicio con sistema de caché integrado
- **`api-docs.astro`**: Página de documentación Swagger UI
- **`api-spec.yaml`**: Especificación completa OpenAPI 3.0
- **`cache/clear.js`**: API para gestión del sistema de caché

## 🌐 Despliegue

### Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta en [Supabase](https://supabase.com/)
- Cuenta en [Vercel](https://vercel.com/) o [Netlify](https://www.netlify.com/)

### Pasos para el Despliegue

1. **Vercel**
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno
   - ¡Despliega!

2. **Netlify**
   - Importa tu repositorio
   - Establece el directorio de salida a `dist`
   - Configura las variables de entorno
   - Despliega

- [Guía de despliegue en Vercel](https://vercel.com/docs)
- [Guía de despliegue en Netlify](https://docs.netlify.com/)

## 🛠️ Desarrollo

### Estructura del Código

Aquí está la estructura principal del proyecto:

```text
src/
├── components/     # Componentes reutilizables
├── lib/            # Utilidades y servicios
│   ├── api.js      # Configuración de la API
│   └── supabase.js # Cliente de Supabase
├── pages/          # Rutas de la aplicación
│   ├── admin/      # Panel de administración
│   └── api/        # Endpoints de la API
└── styles/         # Estilos globales
```

### Convenciones de Código

- **Nombrado**: Usa nombres descriptivos en inglés
- **Componentes**: PascalCase para nombres de componentes
- **Hooks**: Prefijo `use` (ej: `useAuth`)
- **Tipos**: Usa TypeScript para tipado estático
- **Estilos**: Utiliza clases de Tailwind CSS

## 📝 Notas de Desarrollo

### 🔧 Características Técnicas

- **TypeScript**: Tipado estático completo para mejor mantenibilidad
- **Caché Inteligente**: Sistema en memoria con invalidación automática
- **Optimización de Imágenes**: Sharp para procesamiento automático
- **JWT Authentication**: Seguridad robusta para endpoints protegidos
- **Error Handling**: Manejo avanzado de errores con fallbacks
- **API Documentation**: Swagger UI integrado para testing

### 🚀 Nuevas Mejoras

- **Efectos de Transición**: Cubic-bezier optimizado para suavidad
- **Animaciones Mejoradas**: Scale y fade effects en hover
- **Sistema de Filtros**: Animaciones fluidas sin conflictos
- **Documentación Completa**: OpenAPI 3.0 con ejemplos interactivos

### 📈 Rendimiento

- **Caché TTL**: 5 minutos para datos frecuentes
- **Lazy Loading**: Imágenes cargadas bajo demanda  
- **GPU Acceleration**: Transiciones aceleradas por hardware
- **Bundle Optimization**: Código dividido y optimizado

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

### Acerca del Autor

**Sebastián Montandón** - Desarrollador Full Stack apasionado por crear experiencias web excepcionales.

---

[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

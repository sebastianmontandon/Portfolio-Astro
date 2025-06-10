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

## 📁 Estructura del Proyecto

```text
/
├── public/                  # Archivos estáticos (imágenes, favicon, etc.)
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── lib/                 # Utilidades y servicios
│   │   ├── api.js          # Configuración de la API
│   │   ├── supabase.js     # Configuración de Supabase
│   │   └── projectsService.js # Servicio de gestión de proyectos
│   ├── middleware/          # Middleware de autenticación
│   ├── pages/
│   │   ├── admin/         # Panel de administración
│   │   ├── api/            # Endpoints de la API
│   │   └── index.astro     # Página principal
│   └── styles/             # Estilos globales
├── astro.config.mjs         # Configuración de Astro
├── tailwind.config.mjs      # Configuración de Tailwind CSS
└── package.json             # Dependencias y scripts
```

## 🧞 Comandos Principales

| Comando                  | Acción                                            |
| :----------------------- | :------------------------------------------------ |
| `npm install`            | Instala las dependencias                          |
| `npm run dev`            | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`          | Construye el sitio para producción en `./dist/`   |
| `npm run preview`        | Vista previa de la construcción de producción     |

## 🔄 Gestión de Proyectos

Este portfolio muestra proyectos estáticos que se gestionan directamente a través del código. Los proyectos se definen en archivos locales y se despliegan con el sitio.

### 🎯 Características Principales

- **Diseño Responsivo**: Se adapta a todos los dispositivos
- **Rendimiento Óptimo**: Carga rápida gracias a Astro
- **Estilos Modernos**: Diseño atractivo con Tailwind CSS
- **Despliegue Sencillo**: Fácil de desplegar en cualquier plataforma de hosting estático

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
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Componentes Principales

- **Hero.astro**: Sección de presentación con información personal y tecnologías
- **About.astro**: Información detallada sobre experiencia y habilidades
- **Projects.astro**: Galería de proyectos con descripciones y enlaces
- **Contact.astro**: Formulario de contacto y enlaces a redes sociales
- **Admin/Dashboard.astro**: Panel de administración para gestionar proyectos
- **Admin/ProjectForm.astro**: Formulario para crear/editar proyectos

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

- El proyecto utiliza TypeScript para un mejor soporte de tipos
- Las imágenes se optimizan automáticamente durante la compilación
- La autenticación se maneja con JWT para mayor seguridad
- El diseño es completamente responsivo y compatible con móviles
- Se implementan técnicas de renderizado híbrido (SSG/SSR)

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

---

### Acerca del Autor

**Sebastián Montandón** - Desarrollador Full Stack apasionado por crear experiencias web excepcionales.

---

[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

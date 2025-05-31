# Portfolio Personal - Sebastián Montandón

Portfolio personal desarrollado con Astro y Tailwind CSS para mostrar mis proyectos y habilidades como Backend Developer.

![Portfolio Preview](https://i.postimg.cc/wM7qgH64/image.png)

## 🚀 Tecnologías Utilizadas

- **Astro** - Framework web con enfoque en rendimiento y simplicidad
- **Tailwind CSS** - Framework CSS para diseño rápido y responsivo
- **JavaScript/TypeScript** - Para funcionalidades interactivas
- **Node.js** - Entorno de ejecución para scripts y herramientas

## 📁 Estructura del Proyecto

```text
/
├── public/              # Archivos estáticos (imágenes, favicon, etc.)
├── scripts/             # Scripts de utilidad
│   └── add-project.js   # Script para agregar nuevos proyectos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── data/            # Datos estructurados (JSON)
│   │   └── projects.json # Datos de los proyectos
│   ├── layouts/         # Plantillas de página
│   └── pages/           # Páginas del sitio
├── astro.config.mjs     # Configuración de Astro
├── tailwind.config.mjs  # Configuración de Tailwind CSS
└── package.json         # Dependencias y scripts
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Comando                  | Acción                                            |
| :----------------------- | :------------------------------------------------ |
| `npm install`            | Instala las dependencias                          |
| `npm run dev`            | Inicia servidor local en `localhost:4321`         |
| `npm run build`          | Construye el sitio para producción en `./dist/`   |
| `npm run preview`        | Vista previa de la construcción antes de desplegar|
| `npm run add-project`    | Ejecuta el script para agregar nuevos proyectos   |

## 🔄 Gestión de Proyectos

Este portfolio incluye un sistema para agregar nuevos proyectos fácilmente mediante un script interactivo.

### Cómo Agregar un Nuevo Proyecto

1. Ejecuta el comando: `npm run add-project`
2. Sigue las instrucciones interactivas:
   - Ingresa el título del proyecto
   - Proporciona una descripción detallada
   - Lista las tecnologías utilizadas (separadas por comas)
   - Agrega la URL del repositorio en GitHub
   - Incluye la URL del proyecto en vivo/demo
   - Proporciona una URL de imagen para la vista previa

### Características del Sistema de Proyectos

- Los nuevos proyectos se agregan al inicio de la lista para destacar el trabajo más reciente
- Los datos se almacenan en formato JSON para fácil mantenimiento
- El componente `Projects.astro` lee automáticamente los datos actualizados

## 🎨 Personalización

### Estilos y Temas

Los estilos principales se gestionan a través de Tailwind CSS. La configuración se encuentra en `tailwind.config.mjs`, donde puedes modificar:

- Paleta de colores personalizada
- Fuentes tipográficas
- Animaciones
- Extensiones de componentes

### Componentes Principales

- **Hero.astro**: Sección de presentación con información personal y tecnologías
- **About.astro**: Información detallada sobre experiencia y habilidades
- **Projects.astro**: Galería de proyectos con descripciones y enlaces
- **Contact.astro**: Formulario de contacto y enlaces a redes sociales

## 📝 Notas de Desarrollo

- El portfolio utiliza animaciones sutiles para mejorar la experiencia del usuario
- Las imágenes de perfil incluyen efectos de difuminado en los bordes para una integración visual más suave
- El diseño es completamente responsivo para todos los tamaños de pantalla

## 📚 Recursos Adicionales

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Optimización de imágenes](https://docs.astro.build/en/guides/images/)

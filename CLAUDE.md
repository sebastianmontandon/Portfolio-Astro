# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build project and run post-build script
- `npm run preview` - Preview production build
- `npm run post-build` - Run post-build script only (generates/optimizes assets)

### Vercel Deployment
- `npm run vercel-build` - Custom build command for Vercel deployment

## Project Architecture

### Tech Stack
- **Framework**: Astro 5.11+ with server-side rendering
- **Styling**: Tailwind CSS with custom animations and design system
- **Database**: Supabase (PostgreSQL) with admin/client configurations
- **Authentication**: JWT-based with middleware protection
- **Deployment**: Vercel with serverless functions
- **AI Integration**: Chatbot with n8n webhook support and fallback responses

### Key Architectural Patterns

#### API Structure
- RESTful API endpoints in `src/pages/api/`
- Consistent response format: `{ success: boolean, data: any, error?: string }`
- JWT authentication for protected endpoints
- Admin operations use `supabaseAdmin` client with service role key

#### Project Management System
- Full CRUD operations for projects with Supabase backend
- Client-side filtering and pagination (6 projects per page)
- Image upload with Sharp optimization to Supabase storage
- Project types: "personal" (shows GitHub link) vs "paid" (hides GitHub link)
- Tags for project categorization: `ai_assisted`, `in_development`, `project_type`

#### Authentication Flow
- Login endpoint at `/api/auth/login`
- Middleware at `src/middleware/auth.js` protects admin routes
- JWT tokens stored in cookies with httpOnly flag

#### Component Architecture
- Astro components with TypeScript support
- Reusable components: ProjectCard, ProjectModal, Chatbot
- Global styles in `src/styles/global.css`
- Design system with consistent bento-grid layout and gradient effects

### Environment Configuration

#### Required Variables
```bash
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Site
PUBLIC_SITE_URL=https://sebastianmontandon.dev

# Authentication
JWT_SECRET=your-jwt-secret

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Chatbot (optional - uses fallback responses if not set)
N8N_WEBHOOK_URL=your-n8n-webhook
N8N_USERNAME=your-n8n-user
N8N_PASSWORD=your-n8n-password
```

### Database Schema

#### Projects Table
Key fields: `id`, `title`, `description`, `image_url`, `technologies` (array), `github_url`, `live_url`, `category`, `is_featured`, `ai_assisted`, `in_development`, `project_type` ("personal"/"paid"), `published`, `created_at`, `updated_at`

### API Endpoints

#### Projects API (`/api/projects`)
- `GET /api/projects` - Fetch all projects (with caching)
- `POST /api/projects` - Create project (protected)
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project (protected)
- `DELETE /api/projects/[id]` - Delete project (protected)

#### Other APIs
- `POST /api/auth/login` - JWT authentication
- `POST /api/contact` - Contact form with email
- `GET /api/chatbot` - AI chatbot with n8n integration
- `POST /api/upload` - Image upload to Supabase storage
- `GET /api/test-supabase` - Database connectivity test

### Special Features

#### Chatbot System
- Markdown rendering support with `marked` library
- Smart fallback responses when n8n is unavailable
- 6-message limit per session
- Styling optimized for code blocks, links, and formatting

#### Build Process
- `post-build.js` script runs after Astro build
- Optimizes images and generates additional assets
- Vercel integration with 30-second function timeout

#### Responsive Design
- Mobile-first approach with Tailwind CSS
- Custom animations with GPU acceleration
- Bento-grid layout for modern appearance
- Dark theme with purple/blue gradient accents

### File Organization
```
src/
├── components/          # Reusable Astro components
├── lib/                # Utilities and services
│   ├── supabase/       # Database client configurations
│   ├── projectsService.js  # Projects CRUD operations
│   └── authService.js  # Authentication utilities
├── pages/              # Route components
│   ├── api/           # API endpoints
│   └── index.astro    # Main page
├── middleware/         # Authentication middleware
├── types/             # TypeScript type definitions
└── styles/            # Global CSS and design system
```

### Development Notes

#### Key Services
- `projectsService.js`: Handles all project CRUD with error handling
- `supabase/client.js`: Browser client for public operations
- `supabase/server.js`: Admin client for protected operations

#### Frontend Interactions
- Project filtering by category with smooth animations
- Modal system for project details
- Pagination with page number generation
- Image lazy loading and optimization

#### Error Handling
- Graceful fallbacks for API failures
- Console logging for debugging
- User-friendly error messages in UI

### Testing & Debugging
- Use `GET /api/test-supabase` to verify database connectivity
- Check browser console for client-side errors
- Monitor Vercel function logs for API issues
- Environment variables are logged (safely) during build

### Performance Optimizations
- Image optimization with Sharp
- Lazy loading for project images
- Efficient pagination to limit DOM elements
- CSS animations use transform for GPU acceleration
- Supabase client pooling for database connections
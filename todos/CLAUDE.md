# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (fast refresh)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Adding UI Components
- `npx shadcn-ui@latest add [component-name]` - Add new shadcn/ui components

## Architecture

### Tech Stack
- **Next.js 15** with App Router
- **Supabase** for authentication and database
- **shadcn/ui** + **Radix UI** for components
- **Tailwind CSS** for styling
- **TypeScript** throughout

### Authentication Flow
This app uses Supabase's three-tier client architecture:

1. **Client-side**: `/lib/supabase/client.ts` - Browser operations
2. **Server-side**: `/lib/supabase/server.ts` - SSR with cookie handling
3. **Middleware**: `/lib/supabase/middleware.ts` - Session management

**Critical**: The middleware at `/middleware.ts` handles all authentication routing. It redirects unauthenticated users to `/auth/login` for any route except `/`, `/auth/*`, and `/login`.

### Key Patterns

#### Supabase Server Client
Always use the server client for server-side operations:
```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

#### Environment Variables
The app gracefully handles missing Supabase configuration using `hasEnvVars` utility in `/lib/utils.ts`. This allows the app to run without crashing when environment variables are not set.

#### Component Structure
- **UI Components**: `/components/ui/` - shadcn/ui components
- **Feature Components**: `/components/` - Authentication forms, navigation, etc.
- **Server Components**: Default for data fetching
- **Client Components**: Marked with `"use client"` for interactivity

#### Styling
- Use `cn()` utility from `/lib/utils.ts` for conditional classes
- CSS variables in `/app/globals.css` for theming
- Dark mode support via `next-themes`

### Protected Routes
- All routes under `/protected/` require authentication
- The middleware automatically redirects unauthenticated users
- Use `redirect("/auth/login")` in server components for additional protection

### Authentication Pages
- `/auth/login` - Login form
- `/auth/sign-up` - Registration form
- `/auth/forgot-password` - Password reset
- `/auth/confirm` - Email confirmation handler
- `/auth/error` - Authentication error handling

## Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Notes

### Middleware Constraints
- Never modify the middleware's cookie handling logic
- Always return the `supabaseResponse` object from middleware
- The middleware includes detailed comments about proper cookie handling

### Component Development
- Follow shadcn/ui patterns for new components
- Use TypeScript interfaces for props
- Implement loading states and error boundaries
- Use semantic HTML and accessibility attributes

### Database Operations
- Use the server client for database operations in server components
- Handle authentication state properly with user checks
- Implement proper error handling for database operations
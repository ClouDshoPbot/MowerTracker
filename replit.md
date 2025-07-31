# Package Tracking Application

## Overview

This is a modern full-stack package tracking application built with React, Express, and TypeScript. The application provides both customer-facing tracking functionality and an admin panel for managing packages and tracking events. It's designed for a mowing equipment business ("MowersTrack by xmowers.com") but can be adapted for any package tracking needs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but using in-memory storage for demo)
- **Migrations**: Drizzle Kit for schema management
- **Current Implementation**: In-memory storage with pre-seeded demo data
- **Schema**: Tracking numbers and tracking events with proper relationships

## Key Components

### Database Schema
- **tracking_numbers**: Main package information (customer, address, status, etc.)
- **tracking_events**: Timeline of package status updates
- **Relationships**: One-to-many between tracking numbers and events

### API Endpoints
- `GET /api/tracking/:trackingNumber` - Public tracking lookup
- `GET /api/admin/tracking` - Admin view of all packages
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/tracking` - Create new tracking number
- `POST /api/admin/tracking/:id/events` - Add tracking events

### Frontend Pages
- **Home**: Customer tracking interface with search and results, supports URL parameters (admin button removed)
- **Admin**: Protected dashboard with login system and complete package management
- **Components**: Comprehensive UI components including authentication, forms, tables, modals, and displays

### Admin Panel Features
- **Create Tracking Numbers**: Generate new packages with custom details
- **Edit Tracking Numbers**: Full editing of package information and status
- **Manage Tracking Events**: Add, view, and control tracking timeline
- **Delete Packages**: Remove tracking numbers with confirmation
- **Search & Filter**: Find packages by tracking number or customer name
- **Real-time Statistics**: Dashboard metrics for package counts and status

### Authentication & Authorization
- Simple localStorage-based authentication for admin panel
- Admin button hidden from public interface for security
- Multiple admin access URLs: `/admin`, `/admin-login`, `/mowers-admin`
- Demo credentials: username: `admin`, password: `mowers2024`
- Session persists until logout or localStorage clear
- Ready for more robust authentication if needed

## Data Flow

1. **Customer Tracking**: User enters tracking number → API lookup → Display package status and timeline
2. **Admin Management**: Admin creates packages → Generate tracking number → Add status updates → Customer can track
3. **Real-time Updates**: Query invalidation ensures fresh data after mutations
4. **Error Handling**: Comprehensive error states and user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Accessible headless UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Shared code: TypeScript compilation for schema validation

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment flag (development/production)
- **REPL_ID**: Replit-specific environment detection

### Production Deployment
- Single server deployment with static file serving
- Express serves both API and frontend assets
- Requires PostgreSQL database connection
- Can run on Node.js hosting platforms (Replit, Railway, etc.)

### Development Setup
- Hot reload for both frontend and backend
- Automatic TypeScript compilation
- Database schema push with `npm run db:push`
- Comprehensive error reporting and logging
# Overview

This is a full-stack web application built with React, TypeScript, and Express.js, serving as a job portal and recruitment platform called "Niddik". The application provides job listings, candidate management, and administrative features for both job seekers and recruiters.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **Animation**: Framer Motion for smooth animations

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with session-based auth and JWT fallback
- **Session Storage**: PostgreSQL-based session store
- **File Upload**: Cloudinary for resume and image storage
- **Email**: Nodemailer with SMTP configuration

## Database Design
- **Primary Database**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Connection**: Native PostgreSQL driver with connection pooling

# Key Components

## Authentication System
- **Strategy**: Multi-layered authentication with session-based primary and JWT fallback
- **User Roles**: Admin and regular user roles with role-based access control
- **Password Security**: bcrypt for password hashing
- **Session Management**: Persistent sessions with automatic cleanup

## Job Management
- **Job Listings**: Full CRUD operations for job postings
- **Candidate Applications**: Application tracking and management
- **Status Management**: Application workflow with status updates
- **File Handling**: Resume upload and storage via Cloudinary

## Admin Dashboard
- **User Management**: Admin can manage users and applications
- **Analytics**: Application aggregation and user analytics
- **Bulk Operations**: Mass operations on candidates and applications
- **Content Management**: Job posting and candidate review capabilities

## UI/UX Components
- **Design System**: shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Loading States**: Skeleton loaders and loading indicators

# Data Flow

## User Registration/Login Flow
1. User submits credentials through React form
2. Client-side validation with Zod schemas
3. API request to Express server
4. Passport.js authentication middleware
5. Session creation and database storage
6. Response with user data and session cookie

## Job Application Flow
1. User browses job listings (paginated API response)
2. User applies to job with resume upload
3. File upload to Cloudinary
4. Application data stored in PostgreSQL
5. Email notifications sent to relevant parties
6. Admin can review and update application status

## Admin Operations Flow
1. Admin authentication verification
2. Role-based access control middleware
3. Database operations through Drizzle ORM
4. Real-time updates via React Query
5. Optimistic UI updates with error handling

# External Dependencies

## Cloud Services
- **Cloudinary**: Image and file storage for resumes and profile pictures
- **PostgreSQL**: Hosted database (Render.com based on connection string)
- **Email Service**: SMTP server (Hostinger mail) for notifications

## Development Tools
- **Replit**: Development environment with custom Vite plugins
- **PostCSS**: CSS processing with Tailwind CSS
- **ESBuild**: Fast TypeScript compilation and bundling

## Key Libraries
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Hookform Resolvers
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Validation**: Zod for runtime type checking
- **Animation**: Framer Motion for smooth transitions

# Deployment Strategy

## Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Assets**: Static files copied during build process

## Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Authentication**: JWT_SECRET and SESSION_SECRET for security
- **External Services**: Cloudinary and email service credentials
- **Admin Setup**: Predefined admin user configuration

## Production Considerations
- **Security**: Environment variables for sensitive data
- **Performance**: Connection pooling and query optimization
- **Monitoring**: Error logging and session management
- **Scalability**: Stateless server design with external session storage

The application follows a standard full-stack architecture with clear separation of concerns, type safety throughout, and modern development practices for maintainability and scalability.
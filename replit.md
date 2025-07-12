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
- **File Upload**: Cloudinary for resume and image storage with DOC/DOCX conversion
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
- **File Handling**: Resume upload and storage via Cloudinary with automatic DOCX to PDF conversion

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
3. File upload to Cloudinary (with automatic DOCX to PDF conversion)
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

# Recent Changes

## Replit Agent to Replit Migration (July 12, 2025)
- **Migration**: Successfully migrated project from Replit Agent to standard Replit environment
- **Timesheet Validation Fix**: Fixed schema validation to accept both string and number inputs for hours fields
- **JavaScript Error Resolution**: Fixed `TypeError: timesheet.totalWeeklyAmount?.toFixed is not a function` by properly handling decimal field conversion
- **Database Field Handling**: Updated both admin and candidate timesheet views to properly parse decimal amounts from database
- **Timesheet Form Population**: Added useEffect to populate form with existing timesheet data when available
- **Working Days Display**: Fixed week display to show only working days (Mon-Fri for 5 days, Mon-Sat for 6 days)
- **Week-End Submission Logic**: Added validation to prevent timesheet submission during current week - only allows submission after week ends
- **User Experience**: Added helpful messages explaining submission rules and disabled inputs during current week
- **Admin Edit/Delete Features**: Added edit and delete functionality for approved timesheets (admin only)
- **Calendar Range Highlighting**: Fixed calendar to show week range highlighting instead of just start date
- **Previous Timesheet Display**: Fixed week titles to show correct date ranges instead of just start dates
- **Result**: All timesheet functionality now works correctly with proper week-end validation, working day configuration, and enhanced admin controls
- **Files Modified**: `shared/schema.ts`, `client/src/pages/TimesheetManagement.tsx`, `client/src/pages/CandidateTimesheets.tsx`, `server/routes.ts`

# Recent Changes

## Dynamic Working Days Configuration Feature (July 10, 2025)
- **Feature**: Configurable working days per week (5 or 6 days) set by admin with dynamic timesheet calendars
- **Database Enhancement**: Added `workingDaysPerWeek` field to `candidateBilling` table with range validation (5-6 days)
- **Admin Interface Updates**:
  - Enhanced `BillingConfig.tsx` component with working days selection in both create and edit forms
  - Added proper validation and display of working days information in billing configuration cards
  - Working days field includes dropdown with "5 Days (Mon-Fri)" and "6 Days (Mon-Sat)" options
- **Candidate Interface Updates**:
  - Updated `CandidateTimesheets.tsx` to dynamically generate timesheet form based on configured working days
  - Adaptive grid layout that shows only relevant working days (Mon-Fri for 5 days, Mon-Sat for 6 days)
  - Clear indication in timesheet description showing which days are working days
  - Updated billing information display to show working days configuration
- **Schema & API**: Server storage and API endpoints already supported the new field
- **User Experience**: Candidates now see only the days they need to track, reducing confusion and improving usability
- **Files Modified**: `client/src/components/BillingConfig.tsx`, `client/src/pages/CandidateTimesheets.tsx`

## Timesheet Management System Implementation (July 10, 2025)
- **Feature**: Complete timesheet management system for billing and client management
- **Database Schema**: Added three new tables - candidate_billing, weekly_timesheets, and invoices with proper relationships
- **Backend Implementation**:
  - Added comprehensive storage layer in `server/storage.ts` with methods for timesheet CRUD operations
  - Implemented protected API routes in `server/routes.ts` with admin/candidate authentication
  - Added billing configuration, timesheet approval/rejection, and invoice generation endpoints
- **Frontend Implementation**:
  - Created comprehensive `TimesheetManagement.tsx` component with tabbed interface
  - Separate views for candidates (timesheet submission) and admins (approval/billing management)
  - Integration with existing authentication system and proper role-based access control
  - Added routing for both `/admin/timesheets` and `/candidate/timesheets` paths
- **Features**:
  - Weekly timesheet submission with hourly breakdown (Mon-Sun)
  - Auto-calculation of weekly totals and billing amounts
  - Admin approval/rejection workflow with reason tracking
  - Invoice generation and management
  - Billing configuration for hired candidates
- **Files Added**: `client/src/pages/TimesheetManagement.tsx`, `client/src/hooks/use-user.tsx`
- **Files Modified**: `shared/schema.ts`, `server/storage.ts`, `server/routes.ts`, `client/src/App.tsx`

## Database Query Issue Resolution (July 9, 2025)
- **Problem**: Job listings were showing incorrect counts (9/10 instead of 14) across Hero component, Admin Dashboard, and admin stats in navbar
- **Root Cause**: Query parameter handling in `getQueryFn` was not passing parameters to API endpoints, causing pagination to default to limit=10
- **Solution**: 
  - Fixed `getQueryFn` in `client/src/lib/queryClient.ts` to properly handle query parameters from queryKey
  - Updated Admin Dashboard query to include `{ page: 1, limit: 1000 }` parameters
  - Updated Hero component to fetch all jobs with proper parameters
  - Fixed admin stats queries in Navbar and AnnouncementBar components
  - Fixed incorrect API endpoint from `/api/applications` to `/api/admin/applications`
- **Result**: All components now correctly display 14 active jobs instead of 9-10
- **Database Status**: 14 active jobs confirmed in database, all components now fetch complete dataset

## Authentication Flow Enhancement (July 9, 2025)
- **Feature**: Auto-open job application popup after user registration/login
- **Implementation**: 
  - Added PDF-only file upload notice with highlighted warning box on registration form
  - Enhanced authentication flow to automatically open application dialog when users are redirected back to job pages
  - Added sessionStorage flag to track when users complete authentication
  - Modified JobDetail component to detect post-authentication redirects and auto-open apply dialog
- **User Experience**: Users no longer need to manually click "Apply Now" after registering, improving conversion rate
- **Files Modified**: `client/src/pages/AuthPage.tsx`, `client/src/pages/JobDetail.tsx`
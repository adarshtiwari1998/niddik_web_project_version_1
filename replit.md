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

## Timesheet Leave Types Fix (July 13, 2025)
- **Issue Fixed**: Billing configuration was showing generic employee benefits instead of proper leave types for full-time employees
- **Root Cause**: Component was using outdated benefit options list with items like "Health Insurance", "Life Insurance", etc.
- **Solution**: 
  - Updated benefit options to only show proper leave types: "Sick Leave", "Paid Leave", "Unpaid Leave"
  - Changed layout from 2-column to single-column for better display
  - Updated both create and edit dialogs for consistency
  - Added filtering in edit form to only load valid leave types from existing data
- **User Experience**: Full-time employees now see only the three appropriate leave types instead of generic benefits
- **Database Cleanup**: Edit form now filters out old invalid benefits when loading existing records
- **Files Modified**: `client/src/components/BillingConfig.tsx`

## Client Company Dropdown Data Fix (July 13, 2025)
- **Issue Fixed**: Client company dropdown in billing configuration was not showing company names properly
- **Root Cause**: Missing loading states and error handling in dropdown component
- **Solution**: Enhanced dropdown with proper loading states, error handling, and better data structure validation
- **User Experience**: Dropdown now shows "Loading companies..." during data fetch and "No companies available" when empty
- **Debug Enhancement**: Added detailed console logging to track data flow and identify issues
- **Files Modified**: `client/src/components/BillingConfig.tsx`

## Client Company Display Enhancement (July 13, 2025)
- **Feature**: Added client company name and logo display to billing configuration cards
- **Implementation**: 
  - Added helper function `getClientCompanyInfo()` to fetch client company data by ID
  - Enhanced billing cards to show client company logo (when available) and name
  - Added green building icon for visual consistency
  - Used existing API data structure from `/api/admin/client-companies`
- **User Experience**: Billing cards now clearly show which client company each candidate is assigned to
- **Visual Enhancement**: Company logos are displayed when available, with fallback to building icon
- **Data Integration**: Seamlessly integrated with existing client_companies table data
- **Files Modified**: `client/src/components/BillingConfig.tsx`

## Billing Configuration Data Fix (July 13, 2025)
- **Issue Fixed**: Billing configuration edit dialog was not showing client company data properly
- **Root Cause**: Frontend was accessing wrong data structure path (`clientCompanies?.data?.companies` instead of `clientCompanies?.companies`)
- **Solution**: Updated data access patterns in BillingConfig.tsx to match actual API response structure
- **Database Storage Enhanced**: Updated `getAllCandidatesWithBilling` to include all required fields (supervisorName, clientCompanyId, companySettingsId, etc.)
- **User Experience**: Edit dialog now properly displays supervisor name and client company selection
- **Result**: All billing configuration data including supervisor names and client companies now display correctly in both create and edit forms

## Replit Agent to Replit Migration Complete (July 13, 2025)
- **Migration Status**: Successfully completed migration from Replit Agent to standard Replit environment
- **Packages**: All Node.js dependencies properly installed and verified working
- **Workflow**: Application workflow started successfully with Express server and Vite frontend
- **Authentication**: Admin and user authentication systems working correctly
- **Database**: PostgreSQL connections established with all API endpoints responding
- **Validation Enhancement**: Improved billing configuration validation schema with better error handling
- **Error Logging**: Added detailed validation error reporting for better debugging
- **Security**: Enhanced client/server separation maintained with proper role-based access control
- **Project Status**: All core functionality verified working - job listings, admin dashboard, timesheet management, billing configuration
- **Environment**: Application running cleanly in standard Replit environment without errors
- **Client Company Dropdown Fix**: Fixed data access path from `clientCompanies.companies` to `clientCompanies.data.companies` to match API response structure
- **Client Company Logo Display**: Fixed logo display logic to show actual company logos when available, with building icon only as fallback
- **Weekly Timesheet Tab Separation**: Moved Weekly Employee Timesheet from "Attendance Tracking" tab to separate "Weekly Timesheet" tab for better organization
- **Real Company Data Integration**: Updated timesheet template to fetch authentic company data from database tables (company_settings and client_companies) instead of dummy data
- **Backend API Fix**: Added missing getCompanySettings function to storage object to resolve 500 errors in timesheet company info endpoint
- **Enhanced Tab Structure**: Created three-tab layout: Timesheet Submission, Weekly Timesheet, and Attendance Tracking for improved user experience
- **Company Logo Display Fix**: Added Niddik company logo display in timesheet template using logo_url from company_settings table
- **Client Company Enhancement**: Enhanced client company section to display logo and complete billing address information including bill_to_address, bill_to_city, bill_to_state, bill_to_country, bill_to_zip_code
- **Field Mapping Compatibility**: Updated template to handle both camelCase and snake_case database field names for maximum compatibility
- **Week Filter Enhancement**: Added dropdown filter to select specific timesheet weeks when multiple timesheets exist, allowing users to view week-wise data easily
- **Calendar Improvement**: Enhanced calendar component to show actual working week range instead of full month, with highlighted working days and date range display
- **Logo Display Integration**: Successfully integrated company logos from database URLs (Niddik and WIMMER SOLUTIONS) into timesheet template
- **Resolution**: Complete timesheet template now displays real company data with logos, week filtering capability, accurate calendar ranges, and all client company billing address fields from database

## Billing Configuration Enhancement (July 12, 2025)
- **Enhanced Billing Configuration**: Added client company selection field to admin billing configuration popup
- **Visible Client Company Field**: Admin can now see and select which client company the candidate will work for
- **Hidden Company Settings**: Company settings field is automatically set to first option (Niddik) and hidden from admin view
- **API Integration**: Fixed API endpoints to properly fetch client companies and company settings data
- **User Experience**: Client company selection is prominently displayed in both create and edit dialogs
- **Files Modified**: `client/src/components/BillingConfig.tsx`

## Timesheet Access Security Enhancement (July 12, 2025)
- **Security Enforcement**: Enhanced candidate timesheet access control to require both hired status AND active billing configuration
- **Two-Level Protection**: 
  - Level 1: Candidate must have a hired application (`hasHiredApplication: true`)
  - Level 2: Admin must create an active billing configuration (`isActive: true`)
- **User Experience**: Added clear messaging for different access states:
  - "Not Available" - for candidates who aren't hired
  - "Billing Configuration Required" - for hired candidates waiting for admin to set up billing
- **Database Verification**: Confirmed billing configuration requirement is properly enforced at both API and UI levels
- **Files Modified**: `client/src/pages/CandidateTimesheets.tsx`

## Timesheet Submission Logic Updated (July 12, 2025)
- **Current Week Submission**: Updated timesheet submission logic to allow candidates to submit timesheets for the current week until Sunday night
- **Week-End Logic**: Changed from working day-based submission to full week-based submission (Monday to Sunday)
- **User Experience**: Candidates can now submit timesheets anytime during the current week, with deadline at Sunday night
- **Calendar Highlighting**: Improved week range display in calendar to properly show the selected week
- **Input Validation**: Updated form input disabled states to reflect new submission rules
- **Status Messages**: Added clear messaging about submission deadlines and current week availability
- **Files Modified**: `client/src/pages/CandidateTimesheets.tsx`

## Replit Agent to Replit Migration Complete (July 12, 2025)
- **Migration Status**: Successfully completed migration from Replit Agent to standard Replit environment
- **Client Company Display Fix**: Fixed data access issue where client companies weren't showing in the Company Management page
  - Problem: Frontend was accessing `clientCompanies?.data?.map()` but backend API returns data as `{ success: true, data: { companies: [...] } }`
  - Solution: Updated frontend to access `clientCompanies?.companies?.map()` to match actual API response structure
- **Logo Display Enhancement**: Updated client company cards to show actual company logos instead of generic building icons
  - Added conditional rendering: displays company logo when `logoUrl` exists, falls back to building icon when not available
  - Improved visual presentation with proper sizing, borders, and background for logo images
- **Project Status**: All core functionality verified working - database connections, authentication, API endpoints, frontend rendering
- **Migration Checklist**: All items completed successfully including package installation, workflow restart, and functionality verification

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
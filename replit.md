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

## Easy Apply JSON Error Fix and Migration Completion (July 19, 2025)
- **Migration Completed**: Successfully migrated job portal application from Replit Agent to standard Replit environment
  - **Package Verification**: All Node.js dependencies verified and working correctly
  - **Application Status**: Express server and frontend running cleanly on port 5000
  - **Database Connectivity**: PostgreSQL connections established and all API endpoints responding
  - **Feature Verification**: Job listings, admin dashboard, authentication, and all core functionality operational
- **Easy Apply Bug Fix**: Resolved critical JSON parsing error in job application submission
  - **Root Cause**: API request function parameter order mismatch between expected `(url, options)` and actual `(method, url, data)` calls
  - **Solution**: Updated JobDetail.tsx to use correct `apiRequest("/api/job-applications", { method: "POST", body: JSON.stringify(data) })` format
  - **Resume Upload**: Fixed resume upload flow to properly handle file uploads before application submission
  - **Error Handling**: Improved error handling and removed redundant response parsing
- **Application Filtering Enhancement**: Enhanced candidate applications page tab filtering functionality
  - **Backend Integration**: Verified status filtering logic working correctly in `/api/my-applications` endpoint
  - **Frontend Debugging**: Added console logging to track data flow and tab state changes
  - **Page Reset**: Added useEffect to reset page number when changing application status tabs
- **Security Maintained**: Client/server separation and role-based access control preserved throughout migration
- **Files Modified**: `client/src/pages/JobDetail.tsx`, `client/src/pages/MyApplications.tsx`, `.local/state/replit/agent/progress_tracker.md`, `replit.md`

## Main/Office Field Addition to Company Settings (July 19, 2025)
- **Enhanced Company Settings Form**: Added "Main/Office" field to company settings popup form
  - **Database Schema**: Added `main_office` column to `company_settings` table  
  - **Form Layout**: Updated phone/email section from 2-column to 3-column grid layout
  - **Field Positioning**: Main/Office field positioned between Phone Numbers and Email Addresses as requested
  - **Complete Integration**: Added field to schema validation, form defaults, edit population, and reset functions
  - **User Experience**: Clean 3-column responsive layout (Phone Numbers | Main/Office | Email Addresses)
- **Signature Upload System Implementation**: Completed signature field functionality for company settings
  - **Database Enhancement**: Added `signature_url` column to `company_settings` table
  - **File Organization**: Created organized ImageKit folder structure (logos in 'company-logos', signatures in 'signatures')
  - **Upload API**: Implemented `/api/upload-signature` endpoint with proper admin authentication
  - **Frontend Integration**: Added signature upload field next to logo upload in Company Settings dialog
  - **Form Enhancement**: Both logo and signature fields displayed side-by-side with preview and remove functionality
- **Files Modified**: `client/src/pages/CompanyManagement.tsx`, `server/routes.ts`, `server/imagekit.ts`, `shared/schema.ts`, `replit.md`

## Replit Agent to Replit Migration Completed (July 19, 2025)
- **Migration Success**: Successfully migrated job portal application from Replit Agent to standard Replit environment
  - **Package Installation**: All Node.js dependencies verified and working correctly
  - **Application Status**: Express server and frontend running cleanly on port 5000
  - **Database Connectivity**: PostgreSQL connections established and all API endpoints responding
  - **Feature Verification**: Job listings, admin dashboard, authentication, and SEO functionality operational
  - **Security Maintained**: Client/server separation and role-based access control preserved throughout migration
  - **Environment Setup**: Proper port binding (0.0.0.0:5000) and Vite development server configured
- **Files Modified**: `.local/state/replit/agent/progress_tracker.md`, `replit.md`

## Dynamic Country/State Dropdown Enhancement with International Labels (July 19, 2025)
- **Enhanced CountryStateSelect Component**: Updated labels from "State" to "State/Province" for better international clarity
  - **International Support**: Accommodates different naming conventions (states in India/USA, provinces in Canada, etc.)
  - **Consistent Labeling**: All forms now show "State/Province" label for better user understanding
  - **Placeholder Text**: Updated placeholder text to "Enter state/province" for manual entry fields
- **Fixed React Hook Form Integration**: Resolved JavaScript errors with proper useFormContext() hook usage
  - **Hook Placement**: Moved useFormContext() to component level instead of inside event handlers
  - **Error Resolution**: Fixed "TypeError: control.getValues is not a function" errors
  - **Dynamic State Management**: Maintained automatic state clearing when country selection changes
- **Complete Form Integration**: Updated all instances in CompanyManagement.tsx to use new international labels
  - **Bill-To Address**: Updated client company billing address state/province field
  - **Ship-To Address**: Updated client company shipping address state/province field  
  - **Company Settings**: Updated company settings address state/province field
- **User Experience**: Enhanced dropdown functionality with proper country-based state population
  - **Smart Dropdowns**: USA, India, Canada, Australia show predefined states/provinces
  - **Custom Entry**: "Others" option enables manual country and state/province entry
  - **Visual Clarity**: Clear labeling helps international users understand field purpose
- **Files Modified**: `client/src/components/CountryStateSelect.tsx`, `client/src/pages/CompanyManagement.tsx`, `replit.md`

## Company Management Form Reset and Country Selection Fixes (July 19, 2025)
- **Fixed Country Dropdown Selection**: Resolved issue where country dropdown wasn't showing selected value during edit mode
  - **Root Cause**: Country field wasn't properly populated when editing existing companies
  - **Solution**: Enhanced form population logic in useEffect to ensure country values are properly set
  - **Country Detection**: Improved auto-detection of countries from state values using detectCountryFromState function
- **Fixed Form Reset Issues**: Resolved problem where "Add New Company" form showed data from previous edit operations
  - **Enhanced Reset Handlers**: Updated handleAddClientCompany and handleAddCompanySettings to explicitly reset all form fields
  - **Dialog Close Handlers**: Improved handleClientDialogClose and handleSettingsDialogClose to properly clear form state
  - **Default Values**: Ensured all form fields reset to proper default values including empty strings and default booleans
- **Improved Edit Handlers**: Created dedicated handleEditClient and handleEditSettings functions for better form management
  - **Separation of Concerns**: Edit and add operations now use distinct handlers for cleaner state management
  - **Button Updates**: Updated all edit button click handlers to use new dedicated functions
- **Form State Management**: Enhanced React Hook Form integration for proper form state handling
  - **Explicit Reset**: Form reset now uses explicit default values instead of relying on schema defaults
  - **State Isolation**: Edit and add operations maintain separate state to prevent data leakage
- **Migration Successfully Completed**: Full migration from Replit Agent to standard Replit environment completed
  - **All Features Working**: Company management, form handling, and database operations functioning properly
  - **Security Maintained**: Client/server separation and authentication systems preserved
- **Files Modified**: `client/src/pages/CompanyManagement.tsx`, `replit.md`

## Column Visibility Control and Enhanced Filter Functionality (July 15, 2025)
- **Column Visibility Control**: Implemented customizable column visibility for submitted candidates table
  - **Admin Control**: Added "Columns" button with settings icon in Sort & Display section
  - **Persistent State**: Column preferences saved to localStorage and restored on page reload
  - **Required Columns**: ID, Candidate Name, Status, and Actions columns are required and cannot be hidden
  - **Optional Columns**: All other columns can be toggled on/off including Sourced By, Client, POC, Skills, Contact, Email, Experience, Notice Period, Location, CTC fields, Bill/Pay rates, and Margin/Profit calculations
  - **Default View**: Shows commonly used columns (ID, Sourced By, Client, POC, Skills, Candidate Name, Contact, Status, Actions)
  - **Quick Actions**: "Default" button to reset to default columns, "Show All" to display all columns
  - **Dynamic Table**: Table headers and cells render conditionally based on visibility settings
  - **Reduced Scrolling**: Admins can now focus on relevant columns for their workflow
- **Migration Status**: Successfully completed migration from Replit Agent to standard Replit environment
- **Filter Functionality Fixed**: Resolved submitted candidates filtering issue where client filters weren't working
  - **Root Cause**: Query parameters were not correctly mapped between frontend (`clientFilter`) and backend (`client`)
  - **Solution**: Updated query key mapping to use proper parameter names for API requests
  - **Filter Labels Added**: Implemented visual filter labels below filter controls showing active selections
  - **Individual Filter Removal**: Each filter label has color-coded remove button for easy individual filter clearing
  - **Clear All Filters**: Added comprehensive "Clear All Filters" button to reset all filters at once
- **Logout Error Fixed**: Resolved JSON parsing error on logout
  - **Issue**: Logout endpoint was returning plain text "OK" instead of JSON response
  - **Solution**: Changed `res.sendStatus(200)` to `res.status(200).json({ success: true, message: "Logged out successfully" })`
- **Database Connection**: PostgreSQL connections established and all API endpoints responding correctly
- **Authentication System**: Admin and user authentication working properly with session management
- **All Core Features Verified**: Job listings, admin dashboard, timesheet management, billing configuration, and submitted candidates all operational
- **Security Maintained**: Client/server separation and role-based access control preserved throughout migration
- **Files Modified**: `client/src/pages/admin/SubmittedCandidates.tsx`, `server/auth.ts`, `replit.md`

## Advanced Timesheet Management System with Full Admin Controls (July 14, 2025)
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment
  - All packages installed and verified working
  - Express server and frontend running properly on port 5000
  - Database connections established and API endpoints responding correctly
- **Admin Edit Functionality**: Implemented comprehensive edit and delete capabilities for weekly timesheets
  - **Inline Editing**: Added inline input fields for hours data with real-time total calculations
  - **Save/Cancel Controls**: Enhanced admin controls with save and cancel functionality during editing
  - **Data Validation**: Proper type conversion and validation for all hour values
  - **Error Handling**: Fixed JavaScript `toFixed` errors with proper number parsing and null checks
- **Bi-Weekly Calendar Simplification**: Replaced large calendar with compact date range display
  - **Space Saving**: Reduced UI footprint by replacing full calendar with simple date range indicator
  - **Clear Information**: Shows current selected range or "All Periods" when no filter applied
  - **Better UX**: More streamlined interface focused on essential functionality
- **Enhanced Admin Controls**: 
  - **Edit Mode**: Click edit button to enable inline editing of approved timesheets
  - **Delete Functionality**: Admin can permanently delete approved timesheets with confirmation
  - **Real-time Updates**: All changes reflect immediately in the interface with proper error handling
  - **Improved Status Management**: Enhanced approve/revert functionality with proper toast notifications and loading states
    - **Revert with Notifications**: When admin clicks "Revert", timesheet status changes to pending with success toast notification
    - **Dynamic Button Display**: After revert, "Approve" button automatically appears for re-approval
    - **Loading States**: Buttons show loading text ("Reverting...", "Approving...") during API calls
    - **Unified Status Mutation**: Both approve and revert operations use same mutation for consistent behavior
- **Technical Fixes**: 
  - Fixed API method from PATCH to PUT for timesheet updates
  - Resolved `currentValue.toFixed is not a function` error with proper type conversion
  - Enhanced data validation and null checking throughout edit functionality
- **Advanced Status Management**: 
  - **Approve/Reject Toggle**: Admin can revert approved timesheets back to pending status with single click
  - **Status API Endpoint**: Added `/api/admin/timesheets/:id/status` PATCH endpoint for status updates
  - **Flexible Workflow**: Admins can now approve, reject, and revert timesheet statuses as needed
- **Bi-Weekly Edit Controls**: Added comprehensive edit and delete functionality to bi-weekly view
  - **Individual Week Editing**: Separate "Edit Week 1" and "Edit Week 2" buttons for granular control
  - **Delete Confirmation**: Dialog confirmation for deleting underlying weekly timesheets
  - **Week-Specific Actions**: Admin can edit or delete specific weeks within bi-weekly periods
- **Weekly View Timeframe Filtering**: Added dropdown and calendar filtering to weekly timesheets
  - **Auto-Selected Current Week**: System automatically selects current week range on load
  - **Dropdown Selection**: Easy week selection with formatted date ranges
  - **Compact Display**: Shows current selected week range with "Clear Filter" option
  - **Visual Consistency**: Matches bi-weekly and monthly filtering patterns
- **Enhanced User Experience**:
  - **Real-time Query Invalidation**: Proper cache updates after status changes
  - **Intuitive Controls**: Clear visual feedback with icons and color-coded buttons
  - **Responsive Design**: All controls work properly across different screen sizes
- **Files Modified**: `client/src/pages/TimesheetManagement.tsx`, `server/routes.ts`, `replit.md`

## Invoice Management Tab and Timesheet UI Enhancement (July 13, 2025)
- **New Invoice Tab**: Added comprehensive invoice management tab to timesheet management page
  - **Three-tab layout**: Timesheets, Billing Configuration, and Invoice tabs for organized navigation
  - **Invoice Management Component**: Full-featured invoice listing with status badges and admin controls
  - **Role-based Access**: Admin can manage invoice status, candidates can view their invoices
  - **Status Updates**: Admin can change invoice status (draft, sent, paid, overdue) with dropdown selection
  - **PDF Integration**: Support for PDF viewing when invoice URLs are available
  - **Invoice Generation**: Integration with existing invoice generation API endpoints
- **Timesheet Page Header Enhancement**: Added missing page heading with title and description
  - **Page Title**: "Timesheet Management" with descriptive subtitle
  - **Company Management Link**: Added button linking to /admin/timesheets/companiesmanagement
  - **Visual Consistency**: Proper spacing and layout with building icon
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment
  - **All packages installed**: Node.js dependencies verified and working
  - **Application running**: Express server and frontend serving on port 5000
  - **Database connectivity**: PostgreSQL connections established and API endpoints responding
  - **Import path fixes**: Corrected AdminPasswordChange component import path
- **Files Modified**: `client/src/pages/TimesheetManagement.tsx`, `client/src/App.tsx`, `.local/state/replit/agent/progress_tracker.md`

## Employment Type Conditional Timesheet Views and Bi-Weekly Calendar Enhancement (July 13, 2025)
- **Employment Type Conditional Logic**: Implemented dynamic column display based on billing configuration employment type
  - **Subcontract employees**: Show only Regular, Overtime, and Total columns
  - **Full-time employees**: Show all columns including Sick Leave, Paid Leave, and Unpaid Leave
  - **Applied to all views**: Weekly, Bi-weekly, and Monthly timesheet views now conditionally render columns
  - **Header indicators**: Added employment type display in timesheet headers for clear identification
- **Bi-Weekly Calendar Enhancement**: Fixed bi-weekly view to properly show 2-week periods instead of single weeks
  - **True 2-week periods**: Updated logic to aggregate consecutive weeks into proper bi-weekly displays
  - **Dynamic timeframe options**: Timeframe dropdown now shows actual 2-week period ranges
  - **Always-visible small calendar**: Replaced popup calendar with compact, always-visible calendar
  - **Interactive range highlighting**: Calendar highlights selected bi-weekly periods (14 days) dynamically
  - **Clickable date selection**: Users can click calendar dates to select bi-weekly periods
  - **Proper Week 1 and Week 2 display**: Table now shows separate sections for Week 1 and Week 2 data
- **Fixed Select component errors**: Resolved empty string value errors in bi-weekly and monthly views
- **Migration completed**: Successfully migrated from Replit Agent to standard Replit environment
- **Files Modified**: `client/src/pages/TimesheetManagement.tsx`, `client/src/pages/CandidateTimesheets.tsx`

## Enhanced Bi-Weekly and Monthly Timesheet Views with Dynamic Filtering (July 13, 2025)
- **Bi-Weekly View Enhancement**: Completely rewrote BiWeeklyTableView with dynamic aggregation from weekly timesheets
  - **Dynamic Generation**: Replaced static bi-weekly data with real-time aggregation from approved weekly timesheets
  - **Smart Week Detection**: Only shows weeks with actual submitted data, eliminating empty week displays
  - **Timeframe Filtering**: Added dropdown and calendar-based filtering to select specific bi-weekly periods
  - **Color-Coded Layout**: Week 1 in blue, Week 2 in green with proper visual distinction
  - **Conditional Display**: Only shows Week 2 section when data exists, clean single-week display otherwise
  - **Calendar Integration**: Interactive calendar popover for easy date selection with week range display
- **Monthly View Enhancement**: Added comprehensive filtering and improved data aggregation
  - **Month/Year Filtering**: Separate dropdowns for month and year selection with dynamic options
  - **Calendar Navigation**: Interactive calendar for month selection with visual month range display
  - **Dynamic Options**: Filter options automatically generated from available weekly timesheet data
  - **Improved Aggregation**: Enhanced monthly data calculation with proper weekly timesheet grouping
  - **Real-time Updates**: All data refreshes automatically when filters are applied or cleared
- **User Experience Improvements**:
  - **Clear Filter Options**: Both views have "Clear Filter" buttons to reset selections
  - **Loading States**: Proper handling of data loading with fallback to empty arrays
  - **Visual Consistency**: Consistent table styling with bordered cells and color-coded sections
  - **Responsive Design**: All filtering controls work properly on different screen sizes
- **Technical Enhancements**:
  - **API Integration**: Both views fetch weekly timesheets directly for dynamic aggregation
  - **Date Range Logic**: Proper start/end week and month boundary calculations
  - **Data Validation**: Handles missing or null data gracefully with proper fallbacks
- **Migration Status**: Successfully completed migration from Replit Agent to standard Replit environment
- **Issue Fixed**: Resolved `billingData?.find is not a function` error by correcting API response structure access
- **Files Modified**: `client/src/pages/TimesheetManagement.tsx`

## Bi-Weekly and Monthly Timesheet Aggregation Implementation (July 13, 2025)
- **Feature**: Complete bi-weekly and monthly timesheet aggregation system with separate database tables
- **Database Enhancement**: Added `biweekly_timesheets` and `monthly_timesheets` tables with proper relations to existing weekly timesheets
- **Backend Implementation**:
  - Added comprehensive storage methods for bi-weekly and monthly timesheet generation and retrieval
  - Implemented dynamic aggregation functions that calculate totals from weekly timesheet data
  - Created protected API endpoints for generating aggregated timesheets with proper admin authentication
  - Added proper error handling and data validation for all aggregation operations
- **Frontend Implementation**:
  - Enhanced TimesheetManagement component with three-view mode selector (weekly, bi-weekly, monthly)
  - Created BiWeeklyTableView component with period selection and candidate filtering
  - Created MonthlyTableView component with year/month selection and comprehensive hourly breakdown
  - Added admin controls for generating bi-weekly and monthly timesheets on-demand
  - Implemented proper loading states and error handling for all aggregated views
- **User Experience**: 
  - Admin can switch between weekly, bi-weekly, and monthly timesheet views seamlessly
  - Generate bi-weekly timesheets by selecting candidate and period start date
  - Generate monthly timesheets by selecting candidate, year, and month
  - View aggregated data with proper totals, calculations, and formatted currency display
- **Data Integration**: All aggregated timesheets reference original weekly timesheets for audit trail and data consistency
- **Files Modified**: `shared/schema.ts`, `server/storage.ts`, `server/routes.ts`, `client/src/pages/TimesheetManagement.tsx`

## Timesheet Layout Enhancement (July 13, 2025)
- **Issue Fixed**: Employee Name and Supervisor Name were displaying in the same block as Client Company information on candidate timesheet page
- **Solution**: Separated Employee/Supervisor information into distinct section with gray background
- **Visual Enhancement**: 
  - Employee and Supervisor details now in separate gray background block (`bg-gray-50`)
  - Client Company information remains in blue background block (`bg-blue-50`)
  - Added proper spacing, padding, and borders for clear visual distinction
- **User Experience**: Improved layout organization and readability in `/candidate/timesheets` route
- **Files Modified**: `client/src/pages/CandidateTimesheets.tsx`

## Migration to Standard Replit Environment Complete (July 13, 2025)
- **Migration Status**: Successfully completed migration from Replit Agent to standard Replit environment
- **Package Installation**: All Node.js dependencies verified and working properly
- **Workflow Verification**: Express server and Vite frontend running successfully on port 5000
- **Database Connections**: PostgreSQL connections established and all API endpoints responding correctly
- **Authentication System**: Admin and user authentication working properly with session management
- **Functionality Verified**: Job listings, admin dashboard, timesheet management, and billing configuration all operational
- **Security Maintained**: Client/server separation and role-based access control preserved
- **Performance**: Application launching cleanly without errors in standard Replit environment

## Timesheet Leave Types Fix (July 13, 2025)
- **Issue Fixed**: Billing configuration was showing generic employee benefits instead of proper leave types for full-time employees
- **Root Cause**: Component was using outdated benefit options list with items like "Health Insurance", "Life Insurance", etc., and database contained old benefit data
- **Solution**: 
  - Updated benefit options to only show proper leave types: "Sick Leave", "Paid Leave", "Unpaid Leave"
  - Changed layout from 2-column to single-column for better display
  - Updated both create and edit dialogs for consistency
  - Added filtering in edit form to only load valid leave types from existing data
  - Enhanced submit/update functions to filter benefits before saving to database
  - Performed direct database cleanup to replace old benefit data with correct leave types
- **User Experience**: Full-time employees now see only the three appropriate leave types in both form and card display
- **Database Cleanup**: Both form filtering and direct SQL update ensure only valid leave types are stored and displayed
- **Files Modified**: `client/src/components/BillingConfig.tsx`
- **Database Updated**: Updated `candidate_billing` table to replace old benefits with valid leave types

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
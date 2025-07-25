import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("user"), // user, admin
  experience: text("experience"),
  noticePeriod: text("notice_period"),
  currentCtc: text("current_ctc"),
  expectedCtc: text("expected_ctc"),
  skills: text("skills"),
  location: text("location"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  resumeUrl: text("resume_url"),
  lastLogout: timestamp("last_logout"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters").refine(
    (val) => val.length >= 6,
    "Password must be at least 6 characters long"
  ),
  email: (schema) => schema.email("Please enter a valid email address"),
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters"),
  phone: (schema) => schema.optional(),
  experience: (schema) => schema.optional(),
  noticePeriod: (schema) => schema.optional(),
  currentCtc: (schema) => schema.optional(),
  expectedCtc: (schema) => schema.optional(),
  location: (schema) => schema.optional(),
  city: (schema) => schema.optional(),
  state: (schema) => schema.optional(),
  country: (schema) => schema.optional(),
  zipCode: (schema) => schema.optional(),
  resumeUrl: (schema) => schema.optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  interest: text("interest").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissionSchema = createInsertSchema(contactSubmissions, {
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters"),
  email: (schema) => schema.email("Please enter a valid email address"),
  company: (schema) => schema.min(1, "Company name is required"),
  interest: (schema) => schema.min(1, "Please select an interest")
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Testimonials for the success stories section
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull(),
  image: text("image").notNull(),
});

export const testimonialSchema = createInsertSchema(testimonials);
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof testimonialSchema>;

// Client companies to show in the trusted companies section
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
});

export const clientSchema = createInsertSchema(clients);
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof clientSchema>;

// Job listings
export const jobListings = pgTable("job_listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(), // Full-time, Part-time, Contract, etc.
  experienceLevel: text("experience_level").notNull(), // Entry, Mid, Senior, etc.
  salary: text("salary").notNull(), // Salary range or specifics
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  benefits: text("benefits"),
  applicationUrl: text("application_url"),
  contactEmail: text("contact_email"),
  status: text("status").notNull().default("active"), // active, filled, expired
  featured: boolean("featured").notNull().default(false),
  urgent: boolean("urgent").notNull().default(false),
  priority: boolean("priority").notNull().default(false),
  isOpen: boolean("is_open").notNull().default(false),
  postedDate: text("posted_date").notNull(),
  expiryDate: text("expiry_date"),
  category: text("category").notNull(), // Technology, Design, Marketing, etc.
  skills: text("skills").notNull(), // Comma-separated list of skills
});

export const jobListingSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Job type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  salary: z.string().min(1, "Salary is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  benefits: z.string().optional(),
  applicationUrl: z.string().optional(),
  contactEmail: z.string().optional(),
  status: z.string().default("active"),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
  priority: z.boolean().default(false),
  isOpen: z.boolean().default(false),
  postedDate: z.string().optional(),
  expiryDate: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  skills: z.string().min(1, "Skills are required"),
});

export type JobListing = typeof jobListings.$inferSelect;
export type InsertJobListing = z.infer<typeof jobListingSchema>;

// Job Applications schema
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobListings.id),
  userId: integer("user_id").notNull().references(() => users.id),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url").notNull(),
  status: text("status").notNull().default("new"), // new, reviewing, interview, hired, rejected
  experience: text("experience"),
  skills: text("skills").notNull(),
  education: text("education"),
  additionalInfo: text("additional_info"),
  billRate: text("bill_rate"),
  payRate: text("pay_rate"), 
  appliedDate: timestamp("applied_date").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobListings, {
    fields: [jobApplications.jobId],
    references: [jobListings.id],
  }),
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
}));

export const jobListingsRelations = relations(jobListings, ({ many }) => ({
  applications: many(jobApplications),
}));

export const usersRelations = relations(users, ({ many }) => ({
  applications: many(jobApplications),
}));

export const jobApplicationSchema = createInsertSchema(jobApplications, {
  coverLetter: (schema) => schema.optional(),
  resumeUrl: (schema) => schema.min(5, "Resume URL is required"),
  skills: (schema) => schema.min(3, "Skills are required"),
  experience: (schema) => schema.optional(),
  education: (schema) => schema.optional(),
  additionalInfo: (schema) => schema.optional(),
  billRate: (schema) => schema.optional(),
  payRate: (schema) => schema.optional(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof jobApplicationSchema>;

// Submitted Candidates schema
export const submittedCandidates = pgTable("submitted_candidates", {
  id: serial("id").primaryKey(),
  submissionDate: date("submission_date").defaultNow().notNull(),
  sourcedBy: text("sourced_by").notNull(),
  client: text("client").notNull(),
  poc: text("poc").notNull(),
  skills: text("skills").notNull(),
  candidateName: text("candidate_name").notNull(),
  contactNo: text("contact_no").notNull(),
  emailId: text("email_id").notNull(),
  experience: text("experience").notNull(),
  noticePeriod: text("notice_period").notNull(),
  location: text("location").notNull(),
  currentCtc: text("current_ctc").notNull(),
  expectedCtc: text("expected_ctc").notNull(),
  billRate: decimal("bill_rate", { precision: 10, scale: 2 }).notNull().default('0'),
  payRate: decimal("pay_rate", { precision: 10, scale: 2 }).notNull().default('0'),
  marginPerHour: decimal("margin_per_hour", { precision: 10, scale: 2 }).notNull().default('0'),
  profitPerMonth: decimal("profit_per_month", { precision: 10, scale: 2 }).notNull().default('0'),
  status: text("status").notNull().default("new"),
  salaryInLacs: decimal("salary_in_lacs", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const submittedCandidateSchema = createInsertSchema(submittedCandidates, {
  submissionDate: (schema) => schema.optional(),
  sourcedBy: (schema) => schema.min(2, "Sourced by is required"),
  client: (schema) => schema.min(2, "Client name is required"),
  poc: (schema) => schema.min(2, "POC is required"),
  skills: (schema) => schema.min(2, "Skills are required"),
  candidateName: (schema) => schema.min(2, "Candidate name is required"),
  contactNo: (schema) => schema.min(5, "Contact number is required"),
  emailId: (schema) => schema.email("Valid email is required"),
  experience: (schema) => schema.min(1, "Experience is required"),
  noticePeriod: (schema) => schema.min(1, "Notice period is required"),
  location: (schema) => schema.min(2, "Location is required"),
  currentCtc: (schema) => schema.min(1, "Current CTC is required"),
  expectedCtc: (schema) => schema.min(1, "Expected CTC is required"),
  billRate: (schema) => schema.optional(),
  payRate: (schema) => schema.optional(),
  marginPerHour: (schema) => schema.optional(),
  profitPerMonth: (schema) => schema.optional(),
  status: (schema) => schema.min(2, "Status is required"),
  salaryInLacs: (schema) => schema.optional()
});

export type SubmittedCandidate = typeof submittedCandidates.$inferSelect;
export type InsertSubmittedCandidate = z.infer<typeof submittedCandidateSchema>;

// Demo Requests schema
export const demoRequests = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  workEmail: text("work_email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  message: text("message"),
  companyName: text("company_name"),
  fullName: text("full_name"),
  jobTitle: text("job_title"),
  status: text("status").notNull().default("pending"), // pending, scheduled, completed, rejected
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  scheduledDate: timestamp("scheduled_date"),
  adminNotes: text("admin_notes"),
});

export const demoRequestSchema = createInsertSchema(demoRequests, {
  workEmail: (schema) => schema.email("Please enter a valid work email"),
  phoneNumber: (schema) => schema.min(5, "Phone number is required"),
  message: (schema) => schema.optional(),
  companyName: (schema) => schema.optional(),
  fullName: (schema) => schema.optional(),
  jobTitle: (schema) => schema.optional(),
  acceptedTerms: (schema) => schema.refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

export type DemoRequest = typeof demoRequests.$inferSelect;
export type InsertDemoRequest = z.infer<typeof demoRequestSchema>;

// SEO Pages schema for dynamic SEO management
export const seoPages = pgTable("seo_pages", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull().unique(), // e.g., "/", "/about-us", "/services"
  pageTitle: text("page_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  metaKeywords: text("meta_keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogType: text("og_type").notNull().default("website"),
  ogUrl: text("og_url"),
  twitterCard: text("twitter_card").notNull().default("summary_large_image"),
  twitterSite: text("twitter_site"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  twitterCreator: text("twitter_creator"),
  canonicalUrl: text("canonical_url"),
  robotsDirective: text("robots_directive").notNull().default("index,follow"),
  structuredData: text("structured_data"), // JSON-LD schema
  itemPropName: text("itemprop_name"),
  itemPropDescription: text("itemprop_description"),
  itemPropImage: text("itemprop_image"),
  headScripts: text("head_scripts"), // Custom scripts for <head>
  bodyScripts: text("body_scripts"), // Custom scripts for <body>
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoPageSchema = createInsertSchema(seoPages, {
  pagePath: (schema) => schema.min(1, "Page path is required"),
  pageTitle: (schema) => schema.min(1, "Page title is required").max(60, "Title should be under 60 characters"),
  metaDescription: (schema) => schema.min(1, "Meta description is required").max(320, "Description should be under 320 characters"),
  metaKeywords: (schema) => schema.optional(),
  ogTitle: (schema) => schema.optional(),
  ogDescription: (schema) => schema.optional(),
  ogImage: (schema) => schema.optional(),
  ogType: (schema) => schema.optional(),
  ogUrl: (schema) => schema.optional(),
  twitterCard: (schema) => schema.optional(),
  twitterSite: (schema) => schema.optional(),
  twitterTitle: (schema) => schema.optional(),
  twitterDescription: (schema) => schema.optional(),
  twitterImage: (schema) => schema.optional(),
  twitterCreator: (schema) => schema.optional(),
  canonicalUrl: (schema) => schema.optional(),
  robotsDirective: (schema) => schema.optional(),
  structuredData: (schema) => schema.optional(),
  itemPropName: (schema) => schema.optional(),
  itemPropDescription: (schema) => schema.optional(),
  itemPropImage: (schema) => schema.optional(),
  headScripts: (schema) => schema.optional(),
  bodyScripts: (schema) => schema.optional(),
  isActive: (schema) => schema.optional(),
});

export type SeoPage = typeof seoPages.$inferSelect;
export type InsertSeoPage = z.infer<typeof seoPageSchema>;

// Password reset tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResetTokenSchema = createInsertSchema(passwordResetTokens);
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof passwordResetTokenSchema>;

// Whitepaper Downloads schema
export const whitepaperDownloads = pgTable("whitepaper_downloads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  workEmail: text("work_email").notNull(),
  company: text("company"),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whitepaperDownloadSchema = createInsertSchema(whitepaperDownloads, {
  fullName: (schema) => schema.min(2, "Full name is required"),
  workEmail: (schema) => schema.email("Please enter a valid work email"),
  company: (schema) => schema.optional(),
});

export type WhitepaperDownload = typeof whitepaperDownloads.$inferSelect;
export type InsertWhitepaperDownload = z.infer<typeof whitepaperDownloadSchema>;

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: text("session_id").notNull().unique(),
  sessionData: text("session_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: text("session_id").notNull().unique(),
  sessionData: text("session_data").notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// Timesheet Management System Tables

// Candidate Billing Configuration - stores hourly rates and other billing info for hired candidates
export const candidateBilling = pgTable("candidate_billing", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => users.id), // Reference to users table for hired candidates
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull().default('0'),
  workingHoursPerWeek: integer("working_hours_per_week").notNull().default(40),
  workingDaysPerWeek: integer("working_days_per_week").notNull().default(5), // 5 or 6 days per week
  currency: text("currency").notNull().default("INR"),
  
  // New fields for enhanced billing configuration
  employmentType: text("employment_type").notNull().default("subcontract"), // "subcontract" or "fulltime"
  supervisorName: text("supervisor_name"), // Supervisor name field
  clientCompanyId: integer("client_company_id").references(() => clientCompanies.id), // Selected client company
  endUserId: integer("end_user_id").references(() => endUsers.id), // Selected end user for the client company
  companySettingsId: integer("company_settings_id").references(() => companySettings.id), // Selected company settings (preselected default)
  
  // TDS and benefits configuration
  tdsRate: decimal("tds_rate", { precision: 5, scale: 2 }).default('0'), // TDS rate percentage for subcontract
  benefits: text("benefits").array().default([]), // Array of benefits for full-time employees
  
  // Leave management fields
  sickLeaveDays: integer("sick_leave_days").default(0), // Number of sick leave days assigned
  paidLeaveDays: integer("paid_leave_days").default(0), // Number of paid leave days assigned
  // Note: Unpaid leave doesn't need a field as it's unlimited by nature
  
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").notNull().references(() => users.id), // Admin who set this
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const candidateBillingSchema = createInsertSchema(candidateBilling, {
  candidateId: (schema) => schema.min(1, "Candidate ID is required"),
  hourlyRate: (schema) => schema.transform((val) => {
    if (typeof val === 'string') return val;
    return val?.toString() || '0';
  }).refine((val) => {
    const num = parseFloat(val);
    return num > 0;
  }, "Hourly rate must be greater than 0"),
  workingHoursPerWeek: (schema) => schema.min(1, "Working hours must be at least 1").max(168, "Cannot exceed 168 hours per week"),
  workingDaysPerWeek: (schema) => schema.min(5, "Must be at least 5 days").max(6, "Cannot exceed 6 days per week"),
  currency: (schema) => schema.optional(),
  employmentType: (schema) => schema.refine(val => ["subcontract", "fulltime"].includes(val), "Employment type must be either 'subcontract' or 'fulltime'"),
  supervisorName: (schema) => schema.optional().nullable(),
  clientCompanyId: (schema) => schema.optional(),
  endUserId: (schema) => schema.optional(),
  companySettingsId: (schema) => schema.optional(),
  tdsRate: (schema) => schema.transform((val) => {
    if (typeof val === 'string') return val;
    return val?.toString() || '0';
  }).refine(val => {
    const num = parseFloat(val);
    return num >= 0 && num <= 100;
  }, "TDS rate must be between 0 and 100"),
  benefits: (schema) => schema.optional(),
  sickLeaveDays: (schema) => schema.min(0, "Sick leave days cannot be negative").max(365, "Cannot exceed 365 days per year").optional(),
  paidLeaveDays: (schema) => schema.min(0, "Paid leave days cannot be negative").max(365, "Cannot exceed 365 days per year").optional(),
  createdBy: (schema) => schema.min(1, "Created by is required"),
}).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CandidateBilling = typeof candidateBilling.$inferSelect;
export type InsertCandidateBilling = z.infer<typeof candidateBillingSchema>;

// Weekly Timesheets - stores weekly timesheet data for hired candidates
export const weeklyTimesheets = pgTable("weekly_timesheets", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => users.id),
  weekStartDate: date("week_start_date").notNull(), // Monday of the week
  weekEndDate: date("week_end_date").notNull(), // Sunday of the week
  
  // Basic hour tracking (same for both employment types)
  mondayHours: decimal("monday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  tuesdayHours: decimal("tuesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  wednesdayHours: decimal("wednesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  thursdayHours: decimal("thursday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  fridayHours: decimal("friday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  saturdayHours: decimal("saturday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  sundayHours: decimal("sunday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  
  // Enhanced tracking for different employment types
  mondayOvertime: decimal("monday_overtime", { precision: 4, scale: 2 }).default('0'),
  tuesdayOvertime: decimal("tuesday_overtime", { precision: 4, scale: 2 }).default('0'),
  wednesdayOvertime: decimal("wednesday_overtime", { precision: 4, scale: 2 }).default('0'),
  thursdayOvertime: decimal("thursday_overtime", { precision: 4, scale: 2 }).default('0'),
  fridayOvertime: decimal("friday_overtime", { precision: 4, scale: 2 }).default('0'),
  saturdayOvertime: decimal("saturday_overtime", { precision: 4, scale: 2 }).default('0'),
  sundayOvertime: decimal("sunday_overtime", { precision: 4, scale: 2 }).default('0'),
  
  // Sick/Paid Leave tracking (for full-time employees)
  mondaySickLeave: decimal("monday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  tuesdaySickLeave: decimal("tuesday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  wednesdaySickLeave: decimal("wednesday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  thursdaySickLeave: decimal("thursday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  fridaySickLeave: decimal("friday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  saturdaySickLeave: decimal("saturday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  sundaySickLeave: decimal("sunday_sick_leave", { precision: 4, scale: 2 }).default('0'),
  
  // Paid Leave tracking (for full-time employees)  
  mondayPaidLeave: decimal("monday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  tuesdayPaidLeave: decimal("tuesday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  wednesdayPaidLeave: decimal("wednesday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  thursdayPaidLeave: decimal("thursday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  fridayPaidLeave: decimal("friday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  saturdayPaidLeave: decimal("saturday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  sundayPaidLeave: decimal("sunday_paid_leave", { precision: 4, scale: 2 }).default('0'),
  
  // Unpaid Leave tracking (for both employment types)
  mondayUnpaidLeave: decimal("monday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  tuesdayUnpaidLeave: decimal("tuesday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  wednesdayUnpaidLeave: decimal("wednesday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  thursdayUnpaidLeave: decimal("thursday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  fridayUnpaidLeave: decimal("friday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  saturdayUnpaidLeave: decimal("saturday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  sundayUnpaidLeave: decimal("sunday_unpaid_leave", { precision: 4, scale: 2 }).default('0'),
  
  // Totals and calculations
  totalWeeklyHours: decimal("total_weekly_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  totalRegularHours: decimal("total_regular_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  totalOvertimeHours: decimal("total_overtime_hours", { precision: 4, scale: 2 }).default('0'),
  totalRegularAmount: decimal("total_regular_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalOvertimeAmount: decimal("total_overtime_amount", { precision: 10, scale: 2 }).default('0'),
  totalWeeklyAmount: decimal("total_weekly_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  tdsAmount: decimal("tds_amount", { precision: 10, scale: 2 }).default('0'), // TDS deduction for subcontract
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull().default('0'), // Amount after TDS
  
  // Currency conversion fields
  conversionRate: decimal("conversion_rate", { precision: 10, scale: 4 }).default('85'), // 6-month average USD to INR rate
  totalWeeklyAmountINR: decimal("total_weekly_amount_inr", { precision: 10, scale: 2 }), // Converted amount in INR
  conversionDate: date("conversion_date"), // Date when conversion rate was applied
  
  status: text("status").notNull().default("draft"), // draft, submitted, approved, rejected
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const weeklyTimesheetSchema = createInsertSchema(weeklyTimesheets, {
  weekStartDate: (schema) => schema.transform((val) => new Date(val)),
  weekEndDate: (schema) => schema.transform((val) => new Date(val)),
  mondayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  tuesdayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  wednesdayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  thursdayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  fridayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  saturdayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  sundayHours: z.union([z.string(), z.number()]).transform((val) => parseFloat(val.toString())).refine(val => val >= 0 && val <= 24, "Hours must be between 0 and 24"),
  status: (schema) => schema.optional(),
});

export type WeeklyTimesheet = typeof weeklyTimesheets.$inferSelect;
export type InsertWeeklyTimesheet = z.infer<typeof weeklyTimesheetSchema>;

// Invoice Generation - stores generated invoices for weekly timesheets
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  candidateId: integer("candidate_id").notNull().references(() => users.id),
  timesheetId: integer("timesheet_id").references(() => weeklyTimesheets.id), // Made optional for bi-weekly invoices
  biWeeklyTimesheetId: integer("bi_weekly_timesheet_id").references(() => biWeeklyTimesheets.id), // New field
  weekStartDate: date("week_start_date").notNull(),
  weekEndDate: date("week_end_date").notNull(),
  totalHours: decimal("total_hours", { precision: 4, scale: 2 }).notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"), // Changed to USD
  currencyConversionRate: decimal("currency_conversion_rate", { precision: 10, scale: 4 }).notNull(), // INR to USD rate
  sixMonthAverageRate: decimal("six_month_average_rate", { precision: 10, scale: 4 }).notNull(), // 6-month average
  amountINR: decimal("amount_inr", { precision: 10, scale: 2 }).notNull(), // Original INR amount
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull().default('18.00'), // Fixed 18% GST
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }).notNull(), // GST amount
  totalWithGst: decimal("total_with_gst", { precision: 10, scale: 2 }).notNull(), // Total including GST
  status: text("status").notNull().default("generated"), // generated, sent, paid, overdue
  pdfUrl: text("pdf_url"), // URL to generated PDF invoice
  issuedDate: date("issued_date").notNull(),
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  generatedBy: integer("generated_by").notNull().references(() => users.id), // Admin who generated
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoiceSchema = createInsertSchema(invoices, {
  invoiceNumber: (schema) => schema.min(1, "Invoice number is required"),
  totalHours: (schema) => schema.transform((val) => parseFloat(val.toString())),
  hourlyRate: (schema) => schema.transform((val) => parseFloat(val.toString())),
  totalAmount: (schema) => schema.transform((val) => parseFloat(val.toString())),
  currencyConversionRate: (schema) => schema.transform((val) => parseFloat(val.toString())),
  sixMonthAverageRate: (schema) => schema.transform((val) => parseFloat(val.toString())),
  amountINR: (schema) => schema.transform((val) => parseFloat(val.toString())),
  gstRate: (schema) => schema.transform((val) => parseFloat(val.toString())),
  gstAmount: (schema) => schema.transform((val) => parseFloat(val.toString())),
  totalWithGst: (schema) => schema.transform((val) => parseFloat(val.toString())),
  issuedDate: (schema) => schema.transform((val) => new Date(val)),
  dueDate: (schema) => schema.transform((val) => new Date(val)),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof invoiceSchema>;

// Relations for timesheet system
export const candidateBillingRelations = relations(candidateBilling, ({ one }) => ({
  candidate: one(users, {
    fields: [candidateBilling.candidateId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [candidateBilling.createdBy],
    references: [users.id],
  }),
  clientCompany: one(clientCompanies, {
    fields: [candidateBilling.clientCompanyId],
    references: [clientCompanies.id],
  }),
  endUser: one(endUsers, {
    fields: [candidateBilling.endUserId],
    references: [endUsers.id],
  }),
  companySettings: one(companySettings, {
    fields: [candidateBilling.companySettingsId],
    references: [companySettings.id],
  }),
}));

export const weeklyTimesheetRelations = relations(weeklyTimesheets, ({ one, many }) => ({
  candidate: one(users, {
    fields: [weeklyTimesheets.candidateId],
    references: [users.id],
  }),
  approvedByUser: one(users, {
    fields: [weeklyTimesheets.approvedBy],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoiceRelations = relations(invoices, ({ one }) => ({
  candidate: one(users, {
    fields: [invoices.candidateId],
    references: [users.id],
  }),
  timesheet: one(weeklyTimesheets, {
    fields: [invoices.timesheetId],
    references: [weeklyTimesheets.id],
  }),
  generatedByUser: one(users, {
    fields: [invoices.generatedBy],
    references: [users.id],
  }),
}));

// Client companies for invoice management
export const clientCompanies = pgTable("client_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"), // ImageKit URL
  contactPerson: text("contact_person"),
  
  // Bill To Address
  billToAddress: text("bill_to_address").notNull(),
  billToCity: text("bill_to_city").notNull(),
  billToState: text("bill_to_state").notNull(),
  billToCountry: text("bill_to_country").notNull(),
  billToCustomCountry: text("bill_to_custom_country"), // For "Others" country option
  billToZipCode: text("bill_to_zip_code").notNull(),
  
  // Ship To Address (can be same as Bill To)
  shipToSameAsBillTo: boolean("ship_to_same_as_bill_to").default(false),
  shipToAddress: text("ship_to_address"),
  shipToCity: text("ship_to_city"),
  shipToState: text("ship_to_state"),
  shipToCountry: text("ship_to_country"),
  shipToCustomCountry: text("ship_to_custom_country"), // For "Others" country option
  shipToZipCode: text("ship_to_zip_code"),
  
  // Contact Information
  phoneNumbers: text("phone_numbers").array().default([]), // Array of phone numbers
  mainOfficeNumbers: text("main_office_numbers").array().default([]), // Array of main/office phone numbers
  emailAddresses: text("email_addresses").array().default([]), // Array of email addresses
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
});

export const clientCompanySchema = createInsertSchema(clientCompanies, {
  name: (schema) => schema.min(1, "Company name is required"),
  billToAddress: (schema) => schema.min(1, "Bill to address is required"),
  billToCity: (schema) => schema.min(1, "Bill to city is required"),
  billToState: (schema) => schema.min(1, "Bill to state is required"),
  billToCountry: (schema) => schema.min(1, "Bill to country is required"),
  billToCustomCountry: (schema) => schema.optional(),
  billToZipCode: (schema) => schema.min(1, "Bill to zip code is required"),
  phoneNumbers: z.array(z.string().min(1, "Phone number required")).min(1, "At least one phone number required"),
  mainOfficeNumbers: z.array(z.string().min(1, "Main/Office number required")).optional(),
  emailAddresses: z.array(z.string().email("Valid email required")).min(1, "At least one email address required"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type ClientCompany = typeof clientCompanies.$inferSelect;
export type InsertClientCompany = z.infer<typeof clientCompanySchema>;

// End Users table - companies can have multiple end users
export const endUsers = pgTable("end_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  clientCompanyId: integer("client_company_id").references(() => clientCompanies.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
});

export const endUserSchema = createInsertSchema(endUsers, {
  name: (schema) => schema.min(1, "End user name is required"),
  clientCompanyId: (schema) => schema.min(1, "Client company is required"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type EndUser = typeof endUsers.$inferSelect;
export type InsertEndUser = z.infer<typeof endUserSchema>;

// My company settings (default sender information)
export const companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"), // ImageKit URL for logos folder
  signatureUrl: text("signature_url"), // ImageKit URL for signatures folder
  tagline: text("tagline"),
  
  // Company Address
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  customCountry: text("custom_country"), // For "Others" country option
  zipCode: text("zip_code").notNull(),
  
  // Contact Information
  phoneNumbers: text("phone_numbers").array().default([]), // Array of phone numbers
  mainOfficeNumbers: text("main_office_numbers").array().default([]), // Array of main/office phone numbers
  emailAddresses: text("email_addresses").array().default([]), // Array of email addresses
  website: text("website"),
  
  // Tax Information
  taxId: text("tax_id"),
  gstNumber: text("gst_number"),
  
  // Bank Details (for payment information)
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  routingNumber: text("routing_number"),
  
  isDefault: boolean("is_default").default(false), // Only one company can be default
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
});

export const companySettingsSchema = createInsertSchema(companySettings, {
  name: (schema) => schema.min(1, "Company name is required"),
  address: (schema) => schema.min(1, "Address is required"),
  city: (schema) => schema.min(1, "City is required"),
  state: (schema) => schema.min(1, "State is required"),
  country: (schema) => schema.min(1, "Country is required"),
  customCountry: (schema) => schema.optional(),
  zipCode: (schema) => schema.min(1, "Zip code is required"),
  phoneNumbers: z.array(z.string().min(1, "Phone number required")).min(1, "At least one phone number required"),
  mainOfficeNumbers: z.array(z.string().min(1, "Main/Office number required")).optional(),
  emailAddresses: z.array(z.string().email("Valid email required")).min(1, "At least one email address required"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof companySettingsSchema>;

// Bi-Weekly Timesheets - aggregates data from weekly_timesheets for 2-week periods
export const biWeeklyTimesheets = pgTable("bi_weekly_timesheets", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => users.id),
  periodStartDate: date("period_start_date").notNull(), // Start date of bi-weekly period
  periodEndDate: date("period_end_date").notNull(), // End date of bi-weekly period
  
  // Aggregated data from weekly timesheets
  totalHours: decimal("total_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Overtime totals
  totalRegularHours: decimal("total_regular_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalOvertimeHours: decimal("total_overtime_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalRegularAmount: decimal("total_regular_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalOvertimeAmount: decimal("total_overtime_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Week 1 data
  week1StartDate: date("week1_start_date").notNull(),
  week1EndDate: date("week1_end_date").notNull(),
  week1TotalHours: decimal("week1_total_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week1TotalAmount: decimal("week1_total_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  week1RegularHours: decimal("week1_regular_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week1OvertimeHours: decimal("week1_overtime_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week1RegularAmount: decimal("week1_regular_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  week1OvertimeAmount: decimal("week1_overtime_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Week 2 data
  week2StartDate: date("week2_start_date").notNull(),
  week2EndDate: date("week2_end_date").notNull(),
  week2TotalHours: decimal("week2_total_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week2TotalAmount: decimal("week2_total_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  week2RegularHours: decimal("week2_regular_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week2OvertimeHours: decimal("week2_overtime_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  week2RegularAmount: decimal("week2_regular_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  week2OvertimeAmount: decimal("week2_overtime_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Day-wise aggregated hours for entire bi-weekly period
  mondayHours: decimal("monday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  tuesdayHours: decimal("tuesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  wednesdayHours: decimal("wednesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  thursdayHours: decimal("thursday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  fridayHours: decimal("friday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  saturdayHours: decimal("saturday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  sundayHours: decimal("sunday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  
  // Day-wise overtime hours for entire bi-weekly period
  mondayOvertime: decimal("monday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  tuesdayOvertime: decimal("tuesday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  wednesdayOvertime: decimal("wednesday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  thursdayOvertime: decimal("thursday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  fridayOvertime: decimal("friday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  saturdayOvertime: decimal("saturday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  sundayOvertime: decimal("sunday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  
  // Currency conversion fields
  conversionRate: decimal("conversion_rate", { precision: 10, scale: 4 }).default('85'), // 6-month average USD to INR rate
  totalAmountINR: decimal("total_amount_inr", { precision: 10, scale: 2 }), // Converted amount in INR
  conversionDate: date("conversion_date"), // Date when conversion rate was applied
  
  status: text("status").notNull().default("calculated"), // calculated, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const biWeeklyTimesheetSchema = createInsertSchema(biWeeklyTimesheets, {
  periodStartDate: (schema) => schema.transform((val) => new Date(val)),
  periodEndDate: (schema) => schema.transform((val) => new Date(val)),
  week1StartDate: (schema) => schema.transform((val) => new Date(val)),
  week1EndDate: (schema) => schema.transform((val) => new Date(val)),
  week2StartDate: (schema) => schema.transform((val) => new Date(val)),
  week2EndDate: (schema) => schema.transform((val) => new Date(val)),
});

export type BiWeeklyTimesheet = typeof biWeeklyTimesheets.$inferSelect;
export type InsertBiWeeklyTimesheet = z.infer<typeof biWeeklyTimesheetSchema>;

// Monthly Timesheets - aggregates data from weekly_timesheets for monthly periods
export const monthlyTimesheets = pgTable("monthly_timesheets", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => users.id),
  year: integer("year").notNull(),
  month: integer("month").notNull(), // 1-12
  monthName: text("month_name").notNull(), // "January 2025", "February 2025", etc.
  periodStartDate: date("period_start_date").notNull(), // First day of month
  periodEndDate: date("period_end_date").notNull(), // Last day of month
  
  // Aggregated data from weekly timesheets
  totalHours: decimal("total_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalWeeks: integer("total_weeks").notNull().default(0), // Number of weeks in the month
  
  // Overtime totals
  totalRegularHours: decimal("total_regular_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalOvertimeHours: decimal("total_overtime_hours", { precision: 6, scale: 2 }).notNull().default('0'),
  totalRegularAmount: decimal("total_regular_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  totalOvertimeAmount: decimal("total_overtime_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Day-wise aggregated hours for entire month
  mondayHours: decimal("monday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  tuesdayHours: decimal("tuesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  wednesdayHours: decimal("wednesday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  thursdayHours: decimal("thursday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  fridayHours: decimal("friday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  saturdayHours: decimal("saturday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  sundayHours: decimal("sunday_hours", { precision: 4, scale: 2 }).notNull().default('0'),
  
  // Day-wise overtime hours for entire month
  mondayOvertime: decimal("monday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  tuesdayOvertime: decimal("tuesday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  wednesdayOvertime: decimal("wednesday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  thursdayOvertime: decimal("thursday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  fridayOvertime: decimal("friday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  saturdayOvertime: decimal("saturday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  sundayOvertime: decimal("sunday_overtime", { precision: 4, scale: 2 }).notNull().default('0'),
  
  status: text("status").notNull().default("calculated"), // calculated, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monthlyTimesheetSchema = createInsertSchema(monthlyTimesheets, {
  year: (schema) => schema.min(2020, "Year must be valid").max(2030, "Year must be valid"),
  month: (schema) => schema.min(1, "Month must be between 1-12").max(12, "Month must be between 1-12"),
  periodStartDate: (schema) => schema.transform((val) => new Date(val)),
  periodEndDate: (schema) => schema.transform((val) => new Date(val)),
});

export type MonthlyTimesheet = typeof monthlyTimesheets.$inferSelect;
export type InsertMonthlyTimesheet = z.infer<typeof monthlyTimesheetSchema>;

// Relations for new timesheet tables
export const biWeeklyTimesheetRelations = relations(biWeeklyTimesheets, ({ one }) => ({
  candidate: one(users, {
    fields: [biWeeklyTimesheets.candidateId],
    references: [users.id],
  }),
}));

export const monthlyTimesheetRelations = relations(monthlyTimesheets, ({ one }) => ({
  candidate: one(users, {
    fields: [monthlyTimesheets.candidateId],
    references: [users.id],
  }),
}));

// Relations for client and company management
export const clientCompanyRelations = relations(clientCompanies, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [clientCompanies.createdBy],
    references: [users.id],
  }),
  endUsers: many(endUsers),
  // Future: invoices that belong to this client
}));

export const endUserRelations = relations(endUsers, ({ one }) => ({
  clientCompany: one(clientCompanies, {
    fields: [endUsers.clientCompanyId],
    references: [clientCompanies.id],
  }),
  createdByUser: one(users, {
    fields: [endUsers.createdBy],
    references: [users.id],
  }),
}));

export const companySettingsRelations = relations(companySettings, ({ one }) => ({
  createdByUser: one(users, {
    fields: [companySettings.createdBy],
    references: [users.id],
  }),
}));
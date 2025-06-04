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
  userId: integer("user_id").references(() => adminUsers.id).notNull(),
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
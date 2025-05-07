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
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
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
  postedDate: timestamp("posted_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  category: text("category").notNull(), // Technology, Design, Marketing, etc.
  skills: text("skills").notNull(), // Comma-separated list of skills
});

export const jobListingSchema = createInsertSchema(jobListings, {
  title: (schema) => schema.min(5, "Job title must be at least 5 characters"),
  company: (schema) => schema.min(2, "Company name is required"),
  location: (schema) => schema.min(2, "Location is required"),
  description: (schema) => schema.min(50, "Job description must be detailed"),
  requirements: (schema) => schema.min(30, "Job requirements must be detailed"),
  category: (schema) => schema.min(2, "Category is required"),
  skills: (schema) => schema.min(3, "Skills are required")
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

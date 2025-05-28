import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  contactSubmissionSchema, 
  jobListingSchema, 
  jobApplicationSchema,
  jobApplications,
  jobListings,
  submittedCandidates,
  submittedCandidateSchema,
  demoRequestSchema,
  demoRequests,
  sessions,
  users,
  seoPages,
  seoPageSchema
} from "@shared/schema";
import { db } from "../db";
import { eq, desc, asc, and, or, ilike, inArray, count } from "drizzle-orm";
import { z } from "zod";
import { setupAuth } from "./auth";
import { resumeUpload } from "./cloudinary";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Type for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication first before any routes
  setupAuth(app);

  // API endpoint for contact form submissions
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = contactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      return res.status(201).json({ success: true, data: submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating contact submission:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });


  // API endpoint to get testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      return res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // API endpoint to get clients
  app.get('/api/clients', async (req, res) => {
    try {
      const clients = await storage.getClients();
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Job Listings API Endpoints

  // Get featured job listings
  app.get('/api/job-listings/featured', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const jobListings = await storage.getFeaturedJobListings(limit);
      return res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      console.error('Error fetching featured job listings:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get recent job listings (last week by default)
  app.get('/api/job-listings/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const days = req.query.days ? parseInt(req.query.days as string) : 7; // Default to last week
      const jobListings = await storage.getRecentJobListings(limit, days);
      return res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      console.error('Error fetching recent job listings:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all job listings with pagination and filtering
  app.get("/api/job-listings", async (req: AuthenticatedRequest, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const category = req.query.category as string;
      const experienceLevel = req.query.experienceLevel as string;
      const jobType = req.query.jobType as string;
      let status = req.query.status as string;
      const featured = req.query.featured === 'true' ? true : undefined;
      const priority = req.query.priority as string;

      let isAdmin = false;

      // Check session-based authentication only
      if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        isAdmin = true;
        console.log("Admin session verified successfully");
      }

      console.log("Is Admin:", isAdmin, "Status filter requested:", status);

      // Non-admin users can only see active jobs
      if (!isAdmin) {
        console.log("Non-admin user, forcing status to active");
        status = 'active';
      }

      const result = await storage.getJobListings({
        page,
        limit,
        search,
        category,
        experienceLevel,
        jobType,
        status: (!status || status === "all_statuses") ? undefined : status,
        featured,
        priority: priority === "all_priorities" ? undefined : priority
      });

      res.json({
        success: true,
        data: result.jobListings,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching job listings:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch job listings" 
      });
    }
  });

  // Get all job listings without filters (for filter options)
  app.get("/api/job-listings-all", async (req: AuthenticatedRequest, res) => {
    try {
      const result = await storage.getJobListings({
        page: 1,
        limit: 1000, // Get a large number to capture all jobs
        search: "",
        // No status filter applied to get all possible values including draft
        status: undefined,
        category: undefined,
        experienceLevel: undefined,
        jobType: undefined,
        featured: undefined,
        priority: undefined
      });

      res.json({
        success: true,
        data: result.jobListings
      });
    } catch (error) {
      console.error("Error fetching all job listings:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch all job listings" 
      });
    }
  });

  // Get a single job listing by ID
  app.get('/api/job-listings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid job listing ID" 
        });
      }

      const jobListing = await storage.getJobListingById(id);
      if (!jobListing) {
        return res.status(404).json({ 
          success: false, 
          message: "Job listing not found" 
        });
      }

      return res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      console.error('Error fetching job listing:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Create a new job listing
  app.post('/api/job-listings', async (req, res) => {
    try {
      const validatedData = jobListingSchema.parse(req.body);
      const jobListing = await storage.createJobListing(validatedData);

      // Automatically update SEO pages with new job data
      try {
        await storage.updateAllSeoJobPages();
        console.log('SEO pages automatically updated after job creation');
      } catch (seoError) {
        console.error('Error auto-updating SEO pages after job creation:', seoError);
        // Don't fail the job creation if SEO update fails
      }

      return res.status(201).json({ success: true, data: jobListing });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating job listing:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Update a job listing
  app.put('/api/job-listings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid job listing ID" 
        });
      }

      // Ensure the job listing exists
      const existingListing = await storage.getJobListingById(id);
      if (!existingListing) {
        return res.status(404).json({ 
          success: false, 
          message: "Job listing not found" 
        });
      }

      // Partial validation (only validate fields that are provided)
      try {
        const validatedData = jobListingSchema.partial().parse(req.body);
        const updatedListing = await storage.updateJobListing(id, validatedData);

        // Automatically update SEO pages with updated job data
        try {
          await storage.updateAllSeoJobPages();
          console.log('SEO pages automatically updated after job update');
        } catch (seoError) {
          console.error('Error auto-updating SEO pages after job update:', seoError);
          // Don't fail the job update if SEO update fails
        }

        return res.status(200).json({ success: true, data: updatedListing });
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const formattedErrors = validationError.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }));

          return res.status(400).json({ 
            success: false, 
            message: "Invalid job listing data",
            errors: formattedErrors
          });
        }
        throw validationError; // Re-throw if not a validation error
      }
    } catch (error) {
      console.error('Error updating job listing:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Delete a job listing
  app.delete('/api/job-listings/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid job listing ID" 
        });
      }

      // Ensure the job listing exists
      const existingListing = await storage.getJobListingById(id);
      if (!existingListing) {
        return res.status(404).json({ 
          success: false, 
          message: "Job listing not found" 
        });
      }

      await storage.deleteJobListing(id);
      return res.status(200).json({ 
        success: true, 
        message: "Job listing deleted successfully" 
      });
    } catch (error) {
      console.error('Error deleting job listing:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Submitted Candidates API Endpoints

  // Get job applicants for use in submitted candidates
  app.get('/api/submitted-candidates/job-applicants', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      // Get all job applications with user details
      const result = await storage.getAllApplicationsWithPagination({
        page: 1,
        limit: 100, // Get a reasonable number of recent applications
      });

      // Get application user details
      const applications = result.applications;
      const formattedApplicants = [];

      // Process each application
      for (const app of applications) {
        // Get user details for this application
        const user = await storage.getUserById(app.userId);
        const jobListing = await storage.getJobListingById(app.jobId);

        if (user) {
          formattedApplicants.push({
            candidateName: user.fullName || user.username || '',
            emailId: user.email || '',
            contactNo: user.phone || '',
            location: user.location || user.city || '',
            experience: user.experience || app.experience || '',
            skills: user.skills || app.skills || '',
            noticePeriod: user.noticePeriod || '',
            currentCtc: user.currentCtc || '',
            expectedCtc: user.expectedCtc || '',
            // Default values for required fields
            client: jobListing?.company || '',
            poc: '',
            status: 'new',
            sourcedBy: 'Job Application Import',
            salaryInLacs: user.currentCtc || '',
            applicationId: app.id // Use application ID to link back to the original application
          });
        }
      }

      res.json({ success: true, data: formattedApplicants });
    } catch (error) {
      console.error('Error fetching applicants for import:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch applicants for import' });
    }
  });

  app.get('/api/submitted-candidates', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const client = req.query.client as string;
      const sourcedBy = req.query.sourcedBy as string;
      const poc = req.query.poc as string;
      const margin = req.query.margin as string;

      const result = await storage.getAllSubmittedCandidates({
        page,
        limit,
        search,
        status,
        client,
        sourcedBy,
        poc,
        margin
      });

      return res.status(200).json({ 
        success: true, 
        data: result.candidates,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching submitted candidates:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get submitted candidate by ID
  app.get('/api/submitted-candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid candidate ID" 
        });
      }

      const candidate = await storage.getSubmittedCandidateById(id);
      if (!candidate) {
        return res.status(404).json({ 
          success: false, 
          message: "Candidate not found" 
        });
      }

      return res.status(200).json({ success: true, data: candidate });
    } catch (error) {
      console.error('Error fetching submitted candidate:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Create a new submitted candidate
  app.post('/api/submitted-candidates', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      // Validate the submission data
      const validatedData = submittedCandidateSchema.parse(req.body);

      // Calculate margin and profit if bill rate and pay rate are provided
      if (validatedData.billRate && validatedData.payRate) {
        const billRate = Number(validatedData.billRate);
        const payRate = Number(validatedData.payRate);

        if (!isNaN(billRate) && !isNaN(payRate)) {
          const margin = parseFloat((billRate - payRate).toFixed(2));
          const profit = parseFloat(((billRate - payRate) * 160).toFixed(2));

          validatedData.marginPerHour = margin;
          // Assuming 160 hours per month (40 hours per week * 4 weeks)
          validatedData.profitPerMonth = profit;
        }
      }

      const candidate = await storage.createSubmittedCandidate(validatedData);
      return res.status(201).json({ success: true, data: candidate });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating submitted candidate:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Update a submitted candidate
  app.put('/api/submitted-candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid candidate ID" 
        });
      }

      // Ensure the candidate exists
      const existingCandidate = await storage.getSubmittedCandidateById(id);
      if (!existingCandidate) {
        return res.status(404).json({ 
          success: false, 
          message: "Candidate not found" 
        });
      }

      // Validate the update data
      const validatedData = submittedCandidateSchema.partial().parse(req.body);

      // Calculate margin and profit if bill rate or pay rate are updated
      if (validatedData.billRate !== undefined || validatedData.payRate !== undefined) {
        const billRate = Number(validatedData.billRate !== undefined ? validatedData.billRate : existingCandidate.billRate);
        const payRate = Number(validatedData.payRate !== undefined ? validatedData.payRate : existingCandidate.payRate);

        if (!isNaN(billRate) && !isNaN(payRate)) {
          const margin = parseFloat((billRate - payRate).toFixed(2));
          const profit = parseFloat(((billRate - payRate) * 160).toFixed(2));

          validatedData.marginPerHour = margin;
          // Assuming 160 hours per month (40 hours per week * 4 weeks)
          validatedData.profitPerMonth = profit;
        }
      }

      const updatedCandidate = await storage.updateSubmittedCandidate(id, validatedData);
      return res.status(200).json({ success: true, data: updatedCandidate });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating submitted candidate:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Delete a submitted candidate
  app.delete('/api/submitted-candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid candidate ID" 
        });
      }

      // Ensure the candidate exists
      const existingCandidate = await storage.getSubmittedCandidateById(id);
      if (!existingCandidate) {
        return res.status(404).json({ 
          success: false, 
          message: "Candidate not found" 
        });
      }

      await storage.deleteSubmittedCandidate(id);
      return res.status(200).json({ 
        success: true, 
        message: "Candidate deleted successfully" 
      });
    } catch (error) {
      console.error('Error deleting submitted candidate:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get analytics for submitted candidates
  app.get('/api/submitted-candidates/analytics/summary', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const analytics = await storage.getSubmittedCandidateAnalytics();
      return res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      console.error('Error fetching submitted candidates analytics:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Bulk create submitted candidates (for importing from sheets)
  app.post('/api/submitted-candidates/bulk', async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      const { candidates } = req.body;

      if (!Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid candidates data. Expected a non-empty array." 
        });
      }

      // Validate each candidate and calculate margins/profits
      const validatedCandidates = [];
      const errors = [];

      for (let i = 0; i < candidates.length; i++) {
        try {
          const candidate = candidates[i];
          const validatedData = submittedCandidateSchema.parse(candidate);

          // Calculate margin and profit if bill rate and pay rate are provided
          if (validatedData.billRate && validatedData.payRate) {
            const billRate = Number(validatedData.billRate);
            const payRate = Number(validatedData.payRate);

            if (!isNaN(billRate) && !isNaN(payRate)) {
              const margin = parseFloat((billRate - payRate).toFixed(2));
              const profit = parseFloat(((billRate - payRate) * 160).toFixed(2));

              validatedData.marginPerHour = margin;
              validatedData.profitPerMonth = profit; // 160 hours per month
            }
          }

          validatedCandidates.push(validatedData);
        } catch (validationError) {
          errors.push({
            index: i,
            errors: validationError instanceof z.ZodError ? validationError.errors : [{ message: "Validation failed" }]
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation errors in submitted candidates", 
          errors 
        });
      }

      const createdCandidates = await storage.bulkCreateSubmittedCandidates(validatedCandidates);
      return res.status(201).json({ 
        success: true, 
        data: createdCandidates,
        count: createdCandidates.length
      });
    } catch (error) {
      console.error('Error bulk creating submitted candidates:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });


  // Apply for a job (requires authentication, handles both file upload and existing resume URL)
  app.post('/api/job-applications', resumeUpload.single('resume'), async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to apply for jobs" 
        });
      }

      const userId = req.user!.id;

      let resumeUrl = '';

      // If resume is uploaded through form, use the file
      if (req.file) {
        resumeUrl = req.file.path || '';
      } 
      // If resume URL is provided in the JSON body, use that
      else if (req.body.resumeUrl) {
        resumeUrl = req.body.resumeUrl;
      } 
      // No resume provided
      else {
        return res.status(400).json({
          success: false,
          message: "Resume is required (either upload a file or provide an existing URL)"
        });
      }

      // Parse and validate the job application data
      const applicationData = {
        ...req.body,
        userId,
        resumeUrl,
        jobId: parseInt(req.body.jobId)
      };

      const validatedData = jobApplicationSchema.parse(applicationData);

      // Check if user has already applied to this job
      const existingApplication = await db
        .select()
        .from(jobApplications)
        .where(and(
          eq(jobApplications.userId, userId),
          eq(jobApplications.jobId, validatedData.jobId)
        ))
        .limit(1);

      if (existingApplication.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already applied to this job"
        });
      }

      // Create the job application
      const application = await storage.createJobApplication(validatedData);

      return res.status(201).json({ 
        success: true, 
        data: application 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }

      console.error('Error creating job application:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get user's job applications (requires authentication)
  app.get('/api/my-applications', async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to view your applications" 
        });
      }

      const userId = req.user!.id;

      // Get user's job applications
      const applications = await storage.getJobApplicationsForUser(userId);

      return res.status(200).json({ 
        success: true, 
        data: applications 
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Get applications for a specific job
  app.get('/api/admin/job-applications/:jobId', async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);

      if (isNaN(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID"
        });
      }

      // Get job applications for the specified job
      const applications = await storage.getJobApplicationsForJob(jobId);

      return res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Update application status
  app.put('/api/admin/job-applications/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID"
        });
      }

      const { status } = req.body;

      if (!status || !['new', 'reviewing', 'interview', 'hired', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }

      // Update application status
      const updatedApplication = await storage.updateJobApplicationStatus(id, status);

      if (!updatedApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedApplication
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"      });
    }
  });

  // API endpoint for uploading resume without authentication (for registration)
  app.post('/api/upload-resume', resumeUpload.single('resume'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // @ts-ignore - Cloudinary typings
      const file = req.file;

      if (!file.path) {
        console.error('Upload failed - file path missing', file);
        return res.status(500).json({ 
          success: false, 
          message: 'Upload failed - no file path returned' 
        });
      }

      console.log('File uploaded successfully:', {
        path: file.path,
        filename: file.originalname,
        size: file.size
      });

      // If user is authenticated, update their profile with the resume URL
      if (req.isAuthenticated() && req.user) {
        await db.update(users)
          .set({ resumeUrl: file.path })
          .where(eq(users.id, req.user.id));
      }

      return res.status(200).json({ 
        success: true, 
        url: file.path,
        filename: file.originalname 
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Upload failed',
        error: error
      });
    }
  });


  // Get user's job applications with pagination and filtering
  app.get('/api/my-applications', async (req: AuthenticatedRequest, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to view your applications" 
        });
      }

      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      // Get user's job applications with detailed job info
      const applications = await storage.getJobApplicationsForUser(userId);

      // Filter by status if provided
      const filteredApplications = status && status !== 'all' 
        ? applications.filter(app => app.status === status)
        : applications;

      // Calculate pagination
      const total = filteredApplications.length;
      const startIndex = (page - 1) * limit

const endIndex = page * limit;
      const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

      return res.status(200).json({ 
        success: true, 
        data: paginatedApplications,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Withdraw job application
  app.delete('/api/my-applications/:id/withdraw', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to withdraw applications" 
        });
      }

      const applicationId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Verify the application belongs to the user
      const application = await storage.getJobApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (application.userId !== userId) {
        return res.status(403).json({ success: false, message: 'Not authorized to withdraw this application' });
      }

      // Only allow withdrawing if application is in 'new' or 'reviewing' status
      if (application.status !== 'new' && application.status !== 'reviewing') {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot withdraw application in current status' 
        });
      }

      // Delete the application
      await db.delete(jobApplications)
        .where(eq(jobApplications.id, applicationId));

      return res.status(200).json({
        success: true,
        message: "Application withdrawn successfully"
      });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return res.status(500).json({ success: false, message: 'Failed to withdraw application' });
    }
  });

  // Get job application count for specific job (admin only)
  app.get("/api/admin/job-applications-count/:jobId", async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const jobId = parseInt(req.params.jobId);
      if (isNaN(jobId)) {
        return res.status(400).json({ success: false, message: "Invalid job ID" });
      }

      const countResult = await db
        .select({ count: count() })
        .from(jobApplications)
        .where(eq(jobApplications.jobId, jobId));

      const applicationCount = countResult[0]?.count || 0;
      res.json({ success: true, count: applicationCount });
    } catch (error) {
      console.error("Error fetching job application count:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

// Analytics endpoint for user application aggregation
  app.get('/api/admin/analytics', async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('Analytics endpoint called with params:', req.query);

      const { search, status, sortBy } = req.query;

      // Base query for applications with user data
      console.log('Executing applications query...');
      const applications = await db
        .select({
          applicationId: jobApplications.id,
          applicationStatus: jobApplications.status,
          applicationDate: jobApplications.appliedDate,
          jobId: jobApplications.jobId,
          userEmail: users.email,
          userName: users.username,
          userFullName: users.fullName,
          userId: users.id,
          userPhone: users.phone,
          userExperience: users.experience,
          userLocation: users.location,
          userCity: users.city,
          userSkills: users.skills,
          userCurrentCtc: users.currentCtc,
          userExpectedCtc: users.expectedCtc,
        })
        .from(jobApplications)
        .leftJoin(users, eq(jobApplications.userId, users.id));

      // Apply search filter if provided
      if (search && search.trim()) {
        applications.where(
          or(
            ilike(users.email, `%${search.trim()}%`),
            ilike(users.username, `%${search.trim()}%`),
            ilike(users.fullName, `%${search.trim()}%`)
          )
        );
      }

      console.log(`Found ${applications.length} applications`);

      if (applications.length === 0) {
        return res.json([]);
      }

      // Get unique job IDs to fetch job details
      const jobIds = [...new Set(applications.map(app => app.jobId).filter(id => id !== null && id !== undefined))];
      console.log('Found unique job IDs:', jobIds);

       let jobTitleMap = new Map<number, string>();

      if (jobIds.length > 0) {
        try {
          console.log("Fetching job listings...");
          const jobs = await db
            .select({
              id: jobListings.id,
              title: jobListings.title
            })
            .from(jobListings)
            .where(inArray(jobListings.id, jobIds));

          console.log(`Found ${jobs.length} job listings`);
          jobTitleMap = new Map(jobs.map(job => [job.id, job.title || 'Untitled Job']));
        } catch (jobError) {
          console.error("Error fetching job listings:", jobError);
          // Continue with empty job map if job fetching fails
        }
      }

      // Group applications by user email
      const userApplicationMap = new Map<string, any[]>();

      applications.forEach(app => {
        const userEmail = app.userEmail;
        if (!userApplicationMap.has(userEmail)) {
          userApplicationMap.set(userEmail, []);
        }
        userApplicationMap.get(userEmail)!.push(app);
      });

      console.log(`Grouped into ${userApplicationMap.size} users`);

      // Build analytics data for each user
      const analyticsData: any[] = [];

      userApplicationMap.forEach((userApps, userEmail) => {

        const user = {
          userEmail: userApps[0].userEmail,
          userName: userApps[0].userName,
          userFullName: userApps[0].userFullName,
          userId: userApps[0].userId,
          userPhone: userApps[0].userPhone,
          userExperience: userApps[0].userExperience,
          userLocation: userApps[0].userLocation,
          userCity: userApps[0].userCity,
          userSkills: userApps[0].userSkills,
          userCurrentCtc: userApps[0].userCurrentCtc,
          userExpectedCtc: userApps[0].userExpectedCtc,
        }; // Get user details from first application

        // Calculate status counts
        const statuses = {
          new: userApps.filter(app => app.applicationStatus === 'new').length,
          reviewing: userApps.filter(app => app.applicationStatus === 'reviewing').length,
          interview: userApps.filter(app => app.applicationStatus === 'interview').length,
          hired: userApps.filter(app => app.applicationStatus === 'hired').length,
          rejected: userApps.filter(app => app.applicationStatus === 'rejected').length
        };

        // Apply status filter if provided
        if (status && status !== 'all_statuses') {
          if (statuses[status as keyof typeof statuses] === 0) {
            return; // Skip this user if they don't have applications with the filtered status
          }
        }

        // Find latest application date
        const latestDate = userApps.reduce((latest, app) => {
          const appDate = app.applicationDate ? new Date(app.applicationDate) : latest;
          return appDate > latest ? appDate : latest;
        }, new Date(0));

        analyticsData.push({
          userEmail: user.userEmail,
          userName: user.userFullName || user.userName || user.userEmail,
          userFullName: user.userFullName,
          userPhone: user.userPhone,
          userExperience: user.userExperience,
          userLocation: user.userLocation,
          userCity: user.userCity,
          userSkills: user.userSkills,
          userCurrentCtc: user.userCurrentCtc,
          userExpectedCtc: user.userExpectedCtc,
          applicationsCount: userApps.length,
          latestApplicationDate: latestDate.toLocaleDateString(),
          statuses,
          applications: userApps.map(app => {
            // Get job title from the job listings
            const jobTitle = app.jobId ? (jobTitleMap.get(app.jobId) || `Job ID: ${app.jobId}`) : 'Unknown Job';

            return {
              id: app.applicationId,
              jobId: app.jobId,
              jobTitle: jobTitle,
              status: app.applicationStatus,
              appliedDate: app.applicationDate,
              createdAt: app.applicationDate
            };
          })
        });
      });

      // Apply sorting
      if (sortBy) {
        analyticsData.sort((a, b) => {
          switch (sortBy) {
            case 'applications_desc':
              return b.applicationsCount - a.applicationsCount;
            case 'applications_asc':
              return a.applicationsCount - b.applicationsCount;
            case 'latest_desc':
              return new Date(b.latestApplicationDate).getTime() - new Date(a.latestApplicationDate).getTime();
            case 'name_asc':
              return a.userName.localeCompare(b.userName);
            default:
              return 0;
          }
        });
      }

      console.log(`Returning ${analyticsData.length} analytics records`);
      res.json(analyticsData);
    } catch (error) {
      console.error('Analytics endpoint error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  });

  // Get all job applications with filtering, pagination, and detailed information
  app.get("/api/admin/applications", async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Not authorized" 
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const result = await storage.getAllApplicationsWithPagination({
        page,
        limit,
        status,
        search
      });

      return res.status(200).json({
        success: true,
        data: result.applications,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

 // API for user profile update
app.put('/api/profile', async (req: AuthenticatedRequest, res) => {
  try {
      if (!req.isAuthenticated()) {
          return res.status(401).json({ 
              success: false, 
              message: "You must be logged in to update your profile" 
          });
      }

      const userId = req.user!.id;

      // Validate and extract the update data
      const updateData = { ...req.body };
      delete updateData.password; // Prevent password updates through this endpoint

      // Make sure to log the updateData for debugging
      console.log("Update Data:", updateData);

      // Update the user profile
      const updatedUser = await storage.updateUser(userId, updateData);

      if (!updatedUser) {
          return res.status(500).json({
              success: false,
              message: "Failed to update profile"
          });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json({
          success: true,
          data: userWithoutPassword
      });

  } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
});


  // API for user password change
  app.post('/api/change-password', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to change your password" 
        });
      }

      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required"
        });
      }

      // Get the user
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the user's password
      const updatedUser = await storage.updateUserPassword(userId, hashedPassword);

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Failed to update password"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });



  // API for application summary (count by status)
  app.get('/api/my-applications/summary', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          success: false, 
          message: "You must be logged in to view your applications" 
        });
      }

      const userId = req.user!.id;

      // Get user's job applications
      const applications = await storage.getJobApplicationsForUser(userId);

      // Count applications by status
      const statusCounts: { status: string; count: number }[] = [];
      const statusMap = new Map<string, number>();

      applications.forEach(app => {
        const count = statusMap.get(app.status) || 0;
        statusMap.set(app.status, count + 1);
      });

      statusMap.forEach((count, status) => {
        statusCounts.push({ status, count });
      });

      return res.status(200).json({ 
        success: true, 
        data: statusCounts 
      });
    } catch (error) {
      console.error('Error fetching application summary:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Get all users (excluding admin users)
  app.get('/api/admin/users', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search = req.query.search as string;
      const experience = req.query.experience as string;
      const location = req.query.location as string;
      const ctc = req.query.ctc as string;

      // Build where conditions
      const { ne, or, ilike, sql, and: drizzleAnd } = await import('drizzle-orm');
      let whereConditions = [ne(users.role, 'admin')];

      if (search) {
        const searchPattern = `%${search}%`;
        whereConditions.push(
          or(
            sql`${users.id}::text ILIKE ${searchPattern}`,
            ilike(users.username, searchPattern),
            ilike(users.email, searchPattern),
            ilike(users.fullName, searchPattern)
          )
        );
      }

      if (experience) {
        if (experience === '0-1') {
          whereConditions.push(sql`${users.experience}::int BETWEEN 0 AND 1`);
        } else if (experience === '1-3') {
          whereConditions.push(sql`${users.experience}::int BETWEEN 1 AND 3`);
        } else if (experience === '3-5') {
          whereConditions.push(sql`${users.experience}::int BETWEEN 3 AND 5`);
        } else if (experience === '5-8') {
          whereConditions.push(sql`${users.experience}::int BETWEEN 5 AND 8`);
        } else if (experience === '8+') {
          whereConditions.push(sql`${users.experience}::int >= 8`);
        }
      }

      if (location) {
        whereConditions.push(
          or(
            ilike(users.city, `%${location}%`),
            ilike(users.state, `%${location}%`),
            ilike(users.location, `%${location}%`)
          )
        );
      }

      if (ctc) {
        if (ctc === '0-3') {
          whereConditions.push(sql`${users.currentCtc}::int BETWEEN 0 AND 300000`);
        } else if (ctc === '3-6') {
          whereConditions.push(sql`${users.currentCtc}::int BETWEEN 300000 AND 600000`);
        } else if (ctc === '6-10') {
          whereConditions.push(sql`${users.currentCtc}::int BETWEEN 600000 AND 1000000`);
        } else if (ctc === '10-15') {
          whereConditions.push(sql`${users.currentCtc}::int BETWEEN 1000000 AND 1500000`);
        } else if (ctc === '15+') {
          whereConditions.push(sql`${users.currentCtc}::int >= 1500000`);
        }
      }

      // Get total count
      const countResult = await db
        .select({ total: count() })
        .from(users)
        .where(drizzleAnd(...whereConditions));

      const total = countResult[0]?.total || 0;

      // Get paginated users
      const offset = (page - 1) * limit;
      const usersResult = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          full_name: users.fullName,
          phone: users.phone,
          role: users.role,
          experience: users.experience,
          notice_period: users.noticePeriod,
          current_ctc: users.currentCtc,
          expected_ctc: users.expectedCtc,
          skills: users.skills,
          location: users.location,
          city: users.city,
          state: users.state,
          country: users.country,
          zip_code: users.zipCode,
          resume_url: users.resumeUrl,
          last_logout: users.lastLogout,
          created_at: users.createdAt
        })
        .from(users)
        .where(drizzleAnd(...whereConditions))
        .orderBy(sql`${users.createdAt} DESC`)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        success: true,
        data: usersResult,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Get user analytics
  app.get('/api/admin/users/analytics', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const { ne, sql, and: drizzleAnd } = await import('drizzle-orm');

      // Get all non-admin users for analytics
      const allUsers = await db
        .select({
          experience: users.experience,
          city: users.city,
          state: users.state,
          country: users.country,
          skills: users.skills,
          currentCtc: users.currentCtc,
          lastLogout: users.lastLogout,
          createdAt: users.createdAt
        })
        .from(users)
        .where(ne(users.role, 'admin'));

      const totalUsers = allUsers.length;
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Calculate active users (logged out within last week)
      const activeUsers = allUsers.filter(user => 
        user.lastLogout && new Date(user.lastLogout) > lastWeek
      ).length;

      // Calculate recent users (joined this month)
      const recentUsers = allUsers.filter(user => 
        user.createdAt && new Date(user.createdAt) > lastMonth
      ).length;

      // Experience distribution
      const experienceDistribution = [
        { range: '0-1 years', count: 0 },
        { range: '1-3 years', count: 0 },
        { range: '3-5 years', count: 0 },
        { range: '5-8 years', count: 0 },
        { range: '8+ years', count: 0 },
        { range: 'Not specified', count: 0 }
      ];

      allUsers.forEach(user => {
        const exp = parseInt(user.experience || '0');
        if (!user.experience) {
          experienceDistribution[5].count++;
        } else if (exp <= 1) {
          experienceDistribution[0].count++;
        } else if (exp <= 3) {
          experienceDistribution[1].count++;
        } else if (exp <= 5) {
          experienceDistribution[2].count++;
        } else if (exp <= 8) {
          experienceDistribution[3].count++;
        } else {
          experienceDistribution[4].count++;
        }
      });

      // Location distribution
      const locationMap = new Map<string, number>();
      allUsers.forEach(user => {
        const location = user.city || user.state || user.country || 'Not specified';
        locationMap.set(location, (locationMap.get(location) || 0) + 1);
      });
      const locationDistribution = Array.from(locationMap.entries())
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);

      // Skills distribution
      const skillsMap = new Map<string, number>();
      allUsers.forEach(user => {
        if (user.skills) {
          const skills = user.skills.split(',').map(s => s.trim().toLowerCase());
          skills.forEach(skill => {
            if (skill) {
              skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
            }
          });
        }
      });
      const skillsDistribution = Array.from(skillsMap.entries())
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count);

      // CTC distribution
      const ctcDistribution = [
        { range: '0-3 LPA', count: 0 },
        { range: '3-6 LPA', count: 0 },
        { range: '6-10 LPA', count: 0 },
        { range: '10-15 LPA', count: 0 },
        { range: '15+ LPA', count: 0 },
        { range: 'Not specified', count: 0 }
      ];

      allUsers.forEach(user => {
        const ctc = parseInt(user.currentCtc || '0');
        if (!user.currentCtc) {
          ctcDistribution[5].count++;
        } else if (ctc <= 300000) {
          ctcDistribution[0].count++;
        } else if (ctc <= 600000) {
          ctcDistribution[1].count++;
        } else if (ctc <= 1000000) {
          ctcDistribution[2].count++;
        } else if (ctc <= 1500000) {
          ctcDistribution[3].count++;
        } else {
          ctcDistribution[4].count++;
        }
      });

      const analytics = {
        totalUsers,
        activeUsers,
        recentUsers,
        experienceDistribution,
        locationDistribution,
        skillsDistribution,
        ctcDistribution
      };

      return res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin routes for password change
  app.post('/api/admin/change-password', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Not authorized" 
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required"
        });
      }

      // Get the admin user
      const adminUser = await storage.getUserById(req.user.id);
      if (!adminUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, adminUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect"
        });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the admin's password
      const updatedUser = await storage.updateUserPassword(adminUser.id, hashedPassword);

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Failed to update password"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error('Error changing admin password:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Delete user
  app.delete('/api/admin/users/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }

      // Check if user exists and is not an admin
      const userToDelete = await storage.getUserById(userId);
      if (!userToDelete) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (userToDelete.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: "Cannot delete admin users"
        });
      }

      // Delete all sessions for this user (force logout)
      await db.delete(sessions).where(eq(sessions.userId, userId));

      // Delete the user
      await db.delete(users).where(eq(users.id, userId));

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Edit user
  app.put('/api/admin/users/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }

      // Check if user exists and is not an admin
      const userToUpdate = await storage.getUserById(userId);
      if (!userToUpdate) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (userToUpdate.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: "Cannot edit admin users"
        });
      }

      const updateData = req.body;

      // Remove any fields that shouldn't be updated
      delete updateData.id;
      delete updateData.password;
      delete updateData.role;
      delete updateData.created_at;
      delete updateData.last_logout;

      // Update the user
      const updatedUser = await db.update(users)
        .set({
          username: updateData.username,
          email: updateData.email,
          fullName: updateData.full_name,
          phone: updateData.phone,
          experience: updateData.experience,
          noticePeriod: updateData.notice_period,
          currentCtc: updateData.current_ctc,
          expectedCtc: updateData.expected_ctc,
          skills: updateData.skills,
          location: updateData.location,
          city: updateData.city,
          state: updateData.state,
          country: updateData.country,
          zipCode: updateData.zip_code
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser || updatedUser.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Failed to update user"
        });
      }

      // If username or email changed, force logout by deleting sessions
      if (updateData.username !== userToUpdate.username || updateData.email !== userToUpdate.email) {
        await db.delete(sessions).where(eq(sessions.userId, userId));
      }

      return res.status(200).json({
        success: true,
        data: updatedUser[0],
        message: "User updated successfully"
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Demo Request API Endpoints

  // Submit a new demo request
  app.post('/api/demo-requests', async (req, res) => {
    try {
      const validatedData = demoRequestSchema.parse(req.body);

      // Check if a request with this email already exists
      const existingRequest = await storage.getDemoRequestByEmail(validatedData.workEmail);

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "A demo request with this email already exists",
          existingRequest: {
            id: existingRequest.id,
            status: existingRequest.status,
            createdAt: existingRequest.createdAt,
            scheduledDate: existingRequest.scheduledDate
          }
        });
      }

      // Create the demo request
      const newRequest = await storage.createDemoRequest(validatedData);

      return res.status(201).json({
        success: true,
        message: "Demo request submitted successfully",
        data: newRequest
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error('Error creating demo request:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get demo request by email (for checking status)
  // Demo Request Check endpoint  
  app.get('/api/demo-requests/check', async (req, res) => {
    try {
      const email = req.query.email as string;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email parameter is required"
        });
      }

      const demoRequest = await storage.getDemoRequestByEmail(email);

      if (!demoRequest) {
        return res.status(404).json({
          success: false,
          message: "No demo request found for this email"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Demo request found",
        data: demoRequest
      });
    } catch (error) {
      console.error('Error checking demo request:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Demo Request Endpoints

  // Submit a new demo request
  app.post('/api/demo-requests', async (req: Request, res: Response) => {
    try {
      const { workEmail, phoneNumber, message, companyName, fullName, jobTitle, acceptedTerms } = req.body;

      // Validate request data
      try {
        demoRequestSchema.parse({
          workEmail,
          phoneNumber,
          message,
          companyName,
          fullName,
          jobTitle,
          acceptedTerms
        });
      } catch (validationError) {

        if (validationError instanceof z.ZodError) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: validationError.errors
          });
        }
      }

      // Check if a demo request with this email already exists
      const existingRequest = await storage.getDemoRequestByEmail(workEmail);

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "A demo request with this email already exists",
          existingRequest: true
        });
      }

      // Create new demo request
      const demoRequest = await storage.createDemoRequest({
        workEmail,
        phoneNumber,
        message: message || null,
        companyName: companyName || null,
        fullName: fullName || null,
        jobTitle: jobTitle || null,
        acceptedTerms: acceptedTerms === true
      });

      return res.status(201).json({
        success: true,
        message: "Demo request submitted successfully",
        data: demoRequest
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // This route definition was moved above to avoid duplication

// Admin API: Get all contact submissions
app.get('/api/admin/contact-submissions', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.isAuthenticated() || req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search as string;
    const interest = req.query.interest as string;

    const result = await storage.getAllContactSubmissions({
      page,
      limit,
      search,
      interest
    });

    return res.status(200).json({
      success: true,
      data: result.submissions,
      meta: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
  // Admin endpoints for demo requests

  // Get all demo requests (admin only)
  app.get('/api/admin/demo-requests', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const status = req.query.status as string;

      // Get paginated results using storage method
      const result = await storage.getAllDemoRequests({
        page,
        limit,
        status
      });

      return res.status(200).json({
        success: true,
        data: result.demoRequests,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching demo requests:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Update demo request status (admin only)
  app.patch('/api/admin/demo-requests/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID"
        });
      }

      // Check if the demo request exists
      const existingRequest = await storage.getDemoRequestById(id);

      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          message: "Demo request not found"
        });
      }

      // Validate and update
      const { status, adminNotes, scheduledDate } = req.body;

      const updateData: any = {};

      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;

      const updatedRequest = await storage.updateDemoRequest(id, updateData);

      return res.status(200).json({
        success: true,
        message: "Demo request updated successfully",
        data: updatedRequest
      });
    } catch (error) {
      console.error('Error updating demo request:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Delete demo request (admin only)
  app.delete('/api/admin/demo-requests/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID"
        });
      }

      // Check if the demo request exists
      const existingRequest = await storage.getDemoRequestById(id);

      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          message: "Demo request not found"
        });
      }

      // Delete the demo request
      await storage.deleteDemoRequest(id);

      return res.status(200).json({
        success: true,
        message: "Demo request deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting demo request:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

app.get("/api/last-logout", async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ lastLogout: null });
    }
    const user = await storage.getUserById(req.user.id);
    return res.json({ lastLogout: user?.lastLogout || null });
  } catch (error) {
    console.error("Error fetching last logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// SEO Pages API Endpoints

  // Get all SEO pages (public endpoint for fetching SEO data)
  app.get('/api/seo-pages', async (req, res) => {
    try {
      const seoPages = await storage.getAllSeoPages();
      return res.status(200).json({ success: true, data: seoPages });
    } catch (error) {
      console.error('Error fetching SEO pages:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get SEO data for a specific page path
  app.get('/api/seo-pages/by-path', async (req, res) => {
    try {
      const pagePath = req.query.path as string;

      if (!pagePath) {
        return res.status(400).json({
          success: false,
          message: "Page path is required"
        });
      }

      const seoPage = await storage.getSeoPageByPath(pagePath);

      if (!seoPage) {
        // Check if this is a job detail page pattern
        const jobPageMatch = pagePath.match(/^\/jobs\/(\d+)$/);

        if (jobPageMatch) {
          // Return a signal that this is a dynamic job page
          // The frontend will handle generating the SEO data
          const defaultJobSeo = {
            pageTitle: "Job Details | Niddik",
            metaDescription: "View detailed job information and apply for exciting career opportunities with top companies.",
            ogTitle: "Job Opportunity | Niddik",
            ogDescription: "Discover your next career opportunity with Niddik.",
            canonicalUrl: `https://niddik.com${pagePath}`,
            isDynamicJob: true
          };
          return res.status(200).json({ success: true, data: defaultJobSeo, isDefault: true });
        }

        // Return default SEO data if no specific page found
        const defaultSeo = {
          pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
          metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
          ogTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
          ogDescription: "Niddik provides world-class IT recruitment and staffing solutions.",
          ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-default-og.jpg",
          twitterTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
          twitterDescription: "Niddik provides world-class IT recruitment and staffing solutions.",
          canonicalUrl: `https://niddik.com${pagePath}`
        };
        return res.status(200).json({ success: true, data: defaultSeo, isDefault: true });
      }

      return res.status(200).json({ success: true, data: seoPage });
    } catch (error) {
      console.error('Error fetching SEO page by path:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Admin SEO Pages routes (require admin authentication)

  // Get all SEO pages for admin management
  app.get('/api/admin/seo-pages', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const seoPages = await storage.getAllSeoPages();
      return res.status(200).json({ success: true, data: seoPages });
    } catch (error) {
      console.error('Error fetching SEO pages for admin:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get single SEO page by ID
  app.get('/api/admin/seo-pages/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid SEO page ID"
        });
      }

      const seoPage = await storage.getSeoPageById(id);
      if (!seoPage) {
        return res.status(404).json({
          success: false,
          message: "SEO page not found"
        });
      }

      return res.status(200).json({ success: true, data: seoPage });
    } catch (error) {
      console.error('Error fetching SEO page:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create new SEO page
  app.post('/api/admin/seo-pages', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const validatedData = seoPageSchema.parse(req.body);
      const seoPage = await storage.createSeoPage(validatedData);
      return res.status(201).json({ success: true, data: seoPage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error('Error creating SEO page:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Update SEO page
  app.put('/api/admin/seo-pages/:id', async (req: AuthenticatedRequest, res) => {
    try {
      console.log('SEO Update - User:', req.user);
      console.log('SEO Update - Authenticated:', req.isAuthenticated());
      console.log('SEO Update - Request body:', req.body);

      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        console.log('SEO Update - Authentication failed');
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        console.log('SEO Update - Invalid ID:', req.params.id);
        return res.status(400).json({
          success: false,
          message: "Invalid SEO page ID"
        });
      }

      console.log('SEO Update - Validating data for ID:', id);
      const validatedData = seoPageSchema.partial().parse(req.body);
      console.log('SEO Update - Validation passed:', validatedData);

      const seoPage = await storage.updateSeoPage(id, validatedData);

      if (!seoPage) {
        console.log('SEO Update - Page not found for ID:', id);
        return res.status(404).json({
          success: false,
          message: "SEO page not found"
        });
      }

      console.log('SEO Update - Success for ID:', id);
      return res.status(200).json({ success: true, data: seoPage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('SEO Update - Validation error:', error.errors);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error('Error updating SEO page:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Update SEO pages with job data
  app.post('/api/admin/seo-pages/update-job-data', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      console.log('SEO update job data - User authenticated:', req.user?.role);
      
      const results = await storage.updateAllSeoJobPages();
      
      console.log('SEO update job data - Results:', results);
      
      return res.status(200).json({
        success: true,
        data: results,
        message: "SEO pages updated with job data"
      });
    } catch (error) {
      console.error('Error updating SEO pages with job data:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Delete SEO page
  app.delete('/api/admin/seo-pages/:id', async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid SEO page ID"
        });
      }

      const existingPage = await storage.getSeoPageById(id);
      if (!existingPage) {
        return res.status(404).json({
          success: false,
          message: "SEO page not found"
        });
      }

      await storage.deleteSeoPage(id);
      return res.status(200).json({
        success: true,
        message: "SEO page deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting SEO page:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Check current user (admin or regular)
app.get("/api/user", async (req: Request, res: Response) => {
  try {
    // Check JWT first
    const authHeader = req.headers.authorization;
    //console.log(req.headers)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: any };
        const userId = decoded.user.id;

        // Check for admin user
        const adminUser = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.id, userId)
        });

        if (adminUser) {
         // console.log("Admin JWT verified")
          const { password, ...userData } = adminUser;
          return res.json({ ...userData, isAdmin: true });
        }
         //console.log("regular JWT verified")
         const user = await storage.getUserById(userId);
         if (user) {
          const { password, ...userData } = user;
          return res.json({ ...userData, isAdmin: false });
        }
      } catch (error) {
        console.log("JWT verification failed, checking session");
      }
    }

    // If no JWT or JWT invalid, check session
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.user.id;

    // Check if user has admin role
    const user = await storage.getUserById(userId);
    if (user && user.role === 'admin') {
      const { password, ...userData } = user;
      return res.json({ ...userData, isAdmin: true });
    }

    // If not admin, return existing user data
    if (user) {
      const { password, ...userData } = user;
      return res.json({ ...userData, isAdmin: false });
    }

    return res.status(401).json({ error: "Not authenticated" });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin-specific user check endpoint
app.get("/api/admin/check", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.user.id;
    const now = new Date();

    // Check session from sessions table
    if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
      return res.status(401).json({ error: "Admin session expired" });
    }

    // Update session activity
    req.session.lastActivity = now;
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Get user and check admin role
    const user = await storage.getUserById(req.session.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Not an admin user" });
    }

    // Return user data without password
    const { password, ...userData } = user;
    return res.json(userData);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

  const httpServer = createServer(app);
  return httpServer;
}
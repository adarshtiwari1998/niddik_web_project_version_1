import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  contactSubmissionSchema, 
  jobListingSchema, 
  jobApplicationSchema,
  jobApplications,
  submittedCandidateSchema,
  demoRequestSchema,
  demoRequests,
  adminSessions,
  adminUsers
} from "@shared/schema";
import { db } from "../db";
import { and, eq, count, gt } from "drizzle-orm";
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

  // Get recent job listings
  app.get('/api/job-listings/recent', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const jobListings = await storage.getRecentJobListings(limit);
      return res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      console.error('Error fetching recent job listings:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all job listings (with pagination and filtering)
  app.get('/api/job-listings', async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const experienceLevel = req.query.experienceLevel as string;
      const jobType = req.query.jobType as string;
      const status = req.query.status as string || "active";
      const featured = req.query.featured !== undefined 
        ? req.query.featured === 'true' 
        : undefined;

      const result = await storage.getJobListings({
        page,
        limit,
        search,
        category,
        experienceLevel,
        jobType,
        status,
        featured
      });

      return res.status(200).json({ 
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
      console.error('Error fetching job listings:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
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
      const validatedData = jobListingSchema.partial().parse(req.body);
      const updatedListing = await storage.updateJobListing(id, validatedData);

      return res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
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

  // Set up authentication
  setupAuth(app);

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
            candidateName: user.username || '',
            emailId: user.email || '',
            location: user.profileData?.location || '',
            experience: user.profileData?.experience || '',
            skills: user.profileData?.skills || app.skills || '',
            noticePeriod: user.profileData?.noticePeriod || '',
            currentCtc: user.profileData?.currentCtc || '',
            expectedCtc: user.profileData?.expectedCtc || '',
            contactNo: user.profileData?.phone || '',
            // Default values for required fields
            client: jobListing?.companyName || '',
            poc: '',
            status: 'new',
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

      const result = await storage.getAllSubmittedCandidates({
        page,
        limit,
        search,
        status,
        client
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

  // Job Application API Endpoints

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
        message: "Internal server error"
      });
    }
  });

  // API endpoint for uploading resume without authentication (for registration)
  app.post('/api/upload-resume', resumeUpload.single('resume'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // @ts-ignore - Cloudinary typings
    const file = req.file;
    return res.status(200).json({ 
      success: true, 
      url: file.path,
      filename: file.originalname 
    });
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
      const startIndex = (page - 1) * limit;
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
  app.put('/api/my-applications/:id/withdraw', async (req: AuthenticatedRequest, res) => {
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

      const updatedApplication = await storage.updateJobApplicationStatus(applicationId, 'withdrawn');

      return res.status(200).json({
        success: true,
        data: updatedApplication
      });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return res.status(500).json({ success: false, message: 'Failed to withdraw application' });
    }
  });

  // Admin API: Get all applications with pagination
  app.get('/api/admin/applications', async (req: AuthenticatedRequest, res) => {
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

// Check current user (admin or regular)
app.get("/api/user", async (req: Request, res: Response) => {
  try {
    let userId: number | null = null;
    let isAdmin = false;

    // Check JWT first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as { user: any };
        userId = decoded.user.id;
      } catch (error) {
        console.log("JWT verification failed, trying session");
      }
    }

    // If no JWT or JWT invalid, check session
    if (!userId && req.isAuthenticated() && req.user) {
      userId = req.user.id;
    }

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // First check if user is admin
    const adminUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, userId)
    });

    if (adminUser) {
      // Verify admin session
      const adminSession = await db.query.adminSessions.findFirst({
        where: and(
          eq(adminSessions.userId, userId),
          eq(adminSessions.isActive, true),
          gt(adminSessions.expiresAt, new Date())
        )
      });

      if (adminSession) {
        // Update session activity
        await db.update(adminSessions)
          .set({ lastActivity: new Date() })
          .where(eq(adminSessions.id, adminSession.id));

        const { password, ...userData } = adminUser;
        return res.json({ ...userData, isAdmin: true });
      } else {
        // Deactivate expired session
        await db.update(adminSessions)
          .set({ isActive: false })
          .where(eq(adminSessions.userId, userId));
      }
    }

    // If not admin or no valid admin session, try regular user
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { password, ...userData } = user;
    return res.json({ ...userData, isAdmin: false });

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

    // Check if admin session exists for this user
    const adminSession = await db.query.adminSessions.findFirst({
      where: and(
        eq(adminSessions.userId, userId),
        eq(adminSessions.isActive, true),
        gt(adminSessions.expiresAt, new Date())
      )
    });

    if (!adminSession) {
      return res.status(401).json({ error: "No valid admin session" });
    }

    // Get admin user
    const adminUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, adminSession.userId)
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: "Not an admin user" });
    }

    // Update session activity
    await db.update(adminSessions)
      .set({ lastActivity: new Date() })
      .where(eq(adminSessions.id, adminSession.id));

    // Return admin data without password
    const { password, ...adminData } = adminUser;
    return res.json(adminData);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

  const httpServer = createServer(app);
  return httpServer;
}
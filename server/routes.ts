import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  contactSubmissionSchema, 
  jobListingSchema, 
  jobApplicationSchema
} from "@shared/schema";
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

  // Job Application API Endpoints
  
  // Apply for a job (requires authentication and file upload)
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
      
      // Check if file was uploaded successfully
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume file is required"
        });
      }

      // Get file path from Cloudinary or fallback to a local path
      const resumeUrl = req.file.path || '';
      
      // Parse and validate the job application data
      const applicationData = {
        ...req.body,
        userId,
        resumeUrl,
        jobId: parseInt(req.body.jobId)
      };
      
      const validatedData = jobApplicationSchema.parse(applicationData);
      
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

  const httpServer = createServer(app);
  return httpServer;
}

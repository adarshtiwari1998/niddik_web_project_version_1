import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  createEndUser, 
  getEndUsersByClientCompany, 
  getEndUserById, 
  updateEndUser, 
  deleteEndUser, 
  getEndUsersFromSubmittedCandidates 
} from "./storage";
import { 
  get6MonthAverageUSDToINR, 
  convertINRToUSD, 
  calculateGST, 
  formatCurrency 
} from "./currencyService";
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
  seoPageSchema,
  whitepaperDownloadSchema,
  whitepaperDownloads,
  candidateBillingSchema,
  weeklyTimesheetSchema,
  invoiceSchema,
  candidateBilling,
  weeklyTimesheets,
  invoices,
  clientCompanySchema,
  companySettingsSchema,
  clientCompanies,
  companySettings,
  endUserSchema,
  endUsers
} from "@shared/schema";
import { db } from "../db";
import { eq, desc, asc, and, or, ilike, inArray, count, ne } from "drizzle-orm";
import { z } from "zod";
import { setupAuth } from "./auth";
import { resumeUpload, seoMetaUpload, uploadToCloudinary } from "./cloudinary";
import { logoUpload, uploadLogoToImageKit, uploadSignatureToImageKit } from "./imagekit";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { emailService } from "./email"; // Import the email service
import multer from "multer";


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

  // Middleware to check for inactive SEO pages and return 404
  app.use(async (req, res, next) => {
    // Skip for API routes, static files, and assets
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/images/') || 
        req.path.startsWith('/assets/') ||
        req.path.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
      return next();
    }

    try {
      const seoPage = await storage.getSeoPageByPath(req.path);

      // If there's an SEO page for this path and it's inactive, return 404
      if (seoPage && !seoPage.isActive) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Page Not Found | Niddik</title>
              <meta name="robots" content="noindex,nofollow">
            </head>
            <body>
              <h1>404 - Page Not Found</h1>
              <p>The requested page is currently not available.</p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Error checking SEO page status:', error);
    }

    next();
  });

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
  app.post('/api/job-listings', async (req: AuthenticatedRequest, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized access" 
        });
      }

      console.log('Creating job listing with data:', req.body);
      
      const validatedData = jobListingSchema.parse(req.body);
      
      // Ensure postedDate is properly formatted as ISO string
      const formattedData = {
        ...validatedData,
        postedDate: validatedData.postedDate ? new Date(validatedData.postedDate).toISOString() : new Date().toISOString(),
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate).toISOString() : null
      };
      
      console.log('Formatted job data for creation:', formattedData);
      
      const jobListing = await storage.createJobListing(formattedData);

      // Verify the job was actually inserted by fetching it
      try {
        const createdJob = await storage.getJobListingById(jobListing.id);
        console.log('Verification: Job found in database:', createdJob);
        
        if (!createdJob) {
          console.error('Verification: Job was not found in database after creation');
          throw new Error('Job creation verification failed');
        }
      } catch (verificationError) {
        console.error('Verification: Error checking created job:', verificationError);
      }

      // Automatically update SEO pages with new job data
      try {
        await storage.updateAllSeoJobPages();
        //console.log('SEO pages automatically updated after job creation');
      } catch (seoError) {
        console.error('Error auto-updating SEO pages after job creation:', seoError);
        // Don't fail the job creation if SEO update fails
      }

      // Send email notifications in the background
      const sendNotifications = async () => {
        try {
          console.log('Starting email notifications for new job listing...');
          
          // Get all non-admin users
          const users = await storage.getAllNonAdminUsers();
          console.log(`Found ${users.length} users to notify about new job`);

          // Get platform stats
          const totalActiveJobs = await storage.getTotalActiveJobsCount();
          const adminUser = req.user;
          const createdBy = adminUser?.fullName || adminUser?.username || 'Admin';

          let successfulNotifications = 0;

          // Send notifications to all users
          for (const user of users) {
            if (user.email) {
              try {
                await emailService.sendNewJobNotificationToUsers(
                  user.email,
                  user.fullName || user.username,
                  jobListing.title,
                  jobListing.company,
                  jobListing.location,
                  jobListing.jobType,
                  jobListing.experienceLevel,
                  jobListing.salary,
                  jobListing.skills,
                  new Date(jobListing.postedDate),
                  jobListing.id,
                  req.get('origin')
                );
                successfulNotifications++;
              } catch (userEmailError) {
                console.error(`Error sending notification to ${user.email}:`, userEmailError);
              }
            }
          }

          console.log(`Successfully sent ${successfulNotifications} user notifications`);

          // Send admin notification with stats
          try {
            await emailService.sendAdminJobStatsNotification(
              jobListing.title,
              jobListing.company,
              jobListing.location,
              jobListing.jobType,
              jobListing.experienceLevel,
              jobListing.salary,
              createdBy,
              totalActiveJobs,
              successfulNotifications,
              jobListing.id,
              req.get('origin')
            );
            console.log('Admin job stats notification sent successfully');
          } catch (adminEmailError) {
            console.error('Error sending admin job stats notification:', adminEmailError);
          }

        } catch (notificationError) {
          console.error('Error in notification process:', notificationError);
        }
      };

      // Execute notifications asynchronously
      sendNotifications();

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
         // console.log('SEO pages automatically updated after job update');
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

  // Get application counts per job for admin
  app.get('/api/admin/job-application-counts', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      // Get all applications and count by job ID
      const applications = await db
        .select({
          jobId: jobApplications.jobId,
        })
        .from(jobApplications);

      const countsByJobId: Record<number, number> = {};

      applications.forEach(app => {
        if (app.jobId) {
          countsByJobId[app.jobId] = (countsByJobId[app.jobId] || 0) + 1;
        }
      });

      res.json({ success: true, data: countsByJobId });
    } catch (error) {
      console.error('Error fetching job application counts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch application counts' });
    }
  });

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

      // Get job details for email
      const job = await db.query.jobListings.findFirst({
        where: eq(jobListings.id, validatedData.jobId)
      });

      // Get user details for email
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });

      if (job && user) {
        // Send confirmation email to user
        await emailService.sendJobApplicationConfirmation(
          user.email,
          user.fullName,
          job.title,
          job.company,
          new Date(),
          req.get('origin')
        );

        // Send notification email to admin
        await emailService.sendAdminJobApplicationNotification(
          user.fullName,
          user.email,
          job.title,
          job.company,
          new Date(),
          user.phone || undefined,
          user.experience || undefined,
          user.skills || undefined,
          req.get('origin')
        );
      }

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
        success: true,        data: applications 
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
  app.put('/api/admin/job-applications/:id/status', async (req: AuthenticatedRequest, res) => {
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

      // Get the current application to check old status and get user/job info
      const currentApplication = await storage.getJobApplicationById(id);
      if (!currentApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      const oldStatus = currentApplication.status;

      // Update application status
      const updatedApplication = await storage.updateJobApplicationStatus(id, status);

      if (!updatedApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      // Get user and job details for email notifications
      const user = await storage.getUserById(currentApplication.userId);
      const job = await storage.getJobListingById(currentApplication.jobId);
      const adminUser = req.user;

      if (user && job && adminUser && oldStatus !== status) {
        try {
          // Send notification to candidate
          await emailService.sendApplicationStatusChangeNotification(
            user.email,
            user.fullName || user.username,
            job.title,
            job.company,
            oldStatus,
            status,
            req.get('origin')
          );

          // Send notification to admin team
          await emailService.sendAdminStatusChangeNotification(
            adminUser.email,
            user.fullName || user.username,
            user.email,
            job.title,
            job.company,
            oldStatus,
            status,
            adminUser.fullName || adminUser.username,
            req.get('origin')
          );

          console.log(`Status change notifications sent for application ${id}: ${oldStatus} → ${status}`);
        } catch (emailError) {
          console.error('Error sending status change emails:', emailError);
          // Don't fail the status update if email fails
        }
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

  // API endpoint for uploading SEO meta images (admin only)
  app.post('/api/upload-seo-image', seoMetaUpload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }

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

      // console.log('SEO meta image uploaded successfully:', {
      //   path: file.path,
      //   filename: file.originalname,
      //   size: file.size
      // });

      return res.status(200).json({ 
        success: true, 
        url: file.path,
        filename: file.originalname 
      });
    } catch (error) {
      console.error('SEO meta image upload error:', error);
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

  // API endpoint for uploading company logos (admin only)
  app.post('/api/upload-company-logo', logoUpload.single('logo'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = req.file;
      
      // Upload to ImageKit
      const imageKitUrl = await uploadLogoToImageKit(file.buffer, file.originalname);
      
      console.log('Company logo uploaded successfully:', {
        originalName: file.originalname,
        url: imageKitUrl,
        size: file.buffer.length
      });

      return res.status(200).json({ 
        success: true, 
        url: imageKitUrl,
        filename: file.originalname 
      });
    } catch (error) {
      console.error('Company logo upload error:', error);
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

  // API endpoint for uploading company signatures (admin only)
  app.post('/api/upload-signature', logoUpload.single('signature'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = req.file;
      
      // Upload to ImageKit in signature folder
      const imageKitUrl = await uploadSignatureToImageKit(file.buffer, file.originalname);
      
      console.log('Company signature uploaded successfully:', {
        originalName: file.originalname,
        url: imageKitUrl,
        size: file.buffer.length
      });

      return res.status(200).json({ 
        success: true, 
        url: imageKitUrl,
        filename: file.originalname 
      });
    } catch (error) {
      console.error('Company signature upload error:', error);
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

  // API endpoint for uploading resume without authentication (for registration)
  app.post('/api/upload-resume', (req: Request, res: Response) => {
    console.log('Upload request received');
    console.log('Request headers:', req.headers);
    
    resumeUpload.single('resume')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              success: false, 
              message: 'File size must be less than 5MB' 
            });
          }
          return res.status(400).json({ 
            success: false, 
            message: 'File upload error: ' + err.message 
          });
        }
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Upload failed' 
        });
      }

      try {
        if (!req.file) {
          console.error('No file in request');
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.file;
        
        console.log('File details:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          hasBuffer: !!file.buffer
        });

        // Check if file is PDF only
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        
        if (fileExtension !== 'pdf') {
          console.log('Non-PDF file rejected:', file.originalname);
          return res.status(400).json({ 
            success: false, 
            message: 'Only PDF files are allowed. Please upload a PDF file.' 
          });
        }

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);
        
        console.log('File uploaded successfully:', {
          originalName: file.originalname,
          url: cloudinaryUrl,
          size: file.buffer.length
        });

        // If user is authenticated, update their profile with the resume URL
        if (req.isAuthenticated() && req.user) {
          await db.update(users)
            .set({ resumeUrl: cloudinaryUrl })
            .where(eq(users.id, req.user.id));
        }

        return res.status(200).json({ 
          success: true, 
          url: cloudinaryUrl,
          filename: file.originalname,
          originalFilename: file.originalname
        });
      } catch (error) {
        console.error('Resume upload error:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        }
        return res.status(500).json({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    });
  });


  // Forgot password endpoint
  app.post('/api/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.status(200).json({
          success: true,
          message: "If an account with this email exists, a password reset link has been sent."
        });
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store reset token in database
      await storage.createPasswordResetToken({
        userId: user.id,
        token: resetToken,
        expiresAt,
        used: false
      });

      // Send reset email
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      await emailService.sendPasswordResetEmail(user.email, user.fullName || user.username, resetToken, baseUrl);

      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent."
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Verify reset token endpoint
  app.get('/api/verify-reset-token/:token', async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token is required"
        });
      }

      const resetToken = await storage.getPasswordResetToken(token);

      if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Token is valid"
      });
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Reset password endpoint
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token and new password are required"
        });
      }

      const resetToken = await storage.getPasswordResetToken(token);

      if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      // Get user
      const user = await storage.getUserById(resetToken.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      await storage.updateUserPassword(user.id, hashedPassword);

      // Mark token as used
      await storage.markPasswordResetTokenAsUsed(resetToken.id);

      // Send confirmation email
      await emailService.sendPasswordResetConfirmation(user.email, user.fullName || user.username);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully"
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
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

      console.log('🔍 My Applications API - Query params:', {
        page,
        limit,
        status,
        userId,
        rawQuery: req.query
      });

      // Get user's job applications with detailed job info
      const applications = await storage.getJobApplicationsForUser(userId);

      // Filter by status if provided
      const filteredApplications = status && status !== 'all' 
        ? applications.filter(app => app.status === status)
        : applications;

      console.log('📊 Applications filtering result:', {
        totalApplications: applications.length,
        requestedStatus: status,
        filteredCount: filteredApplications.length,
        applicationStatuses: applications.map(app => ({ id: app.id, status: app.status }))
      });

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
     // console.log('Analytics endpoint called with params:', req.query);

      const { search, status, sortBy } = req.query;

      // Base query for applications with user data
     // console.log('Executing applications query...');
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

     // console.log(`Found ${applications.length} applications`);

      if (applications.length === 0) {
        return res.json([]);
      }

      // Get unique job IDs to fetch job details
      const jobIds = [...new Set(applications.map(app => app.jobId).filter(id => id !== null && id !== undefined))];
     // console.log('Found unique job IDs:', jobIds);

       let jobTitleMap = new Map<number, string>();

      if (jobIds.length > 0) {
        try {
         // console.log("Fetching job listings...");
          const jobs = await db
            .select({
              id: jobListings.id,
              title: jobListings.title
            })
            .from(jobListings)
            .where(inArray(jobListings.id, jobIds));

        //  console.log(`Found ${jobs.length} job listings`);
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

      //console.log(`Grouped into ${userApplicationMap.size} users`);

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

     // console.log(`Returning ${analyticsData.length} analytics records`);
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
      //console.log("Update Data:", updateData);

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

  // Whitepaper Download API Endpoints

  // Submit whitepaper download request
  app.post('/api/whitepaper-download', async (req, res) => {
    try {
      const { fullName, workEmail, company } = req.body;

      // Validate request data
      const validatedData = whitepaperDownloadSchema.parse({
        fullName,
        workEmail,
        company: company || null,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      // Create the download record
      const download = await storage.createWhitepaperDownload(validatedData);

      // Send download email
      const downloadUrl = 'https://res.cloudinary.com/dw4glwrrn/image/upload/v1750410711/Niddik_Whitepaper_rjp3ui.pdf';
      await emailService.sendWhitepaperDownloadEmail(
        workEmail,
        fullName,
        company || '',
        downloadUrl,
        req.get('origin')
      );

      // Send admin notification
      try {
        await emailService.sendAdminWhitepaperDownloadNotification(
          fullName,
          workEmail,
          company || '',
          new Date(),
          req.get('origin')
        );
        console.log(`Admin whitepaper notification sent for: ${fullName}`);
      } catch (adminEmailError) {
        console.error('Error sending admin whitepaper notification:', adminEmailError);
        // Don't fail the request if admin email fails
      }

      return res.status(201).json({
        success: true,
        message: "Whitepaper download link sent to your email successfully",
        data: {
          id: download.id,
          downloadUrl: downloadUrl
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      console.error('Error processing whitepaper download:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Get all whitepaper downloads
  app.get('/api/admin/whitepaper-downloads', async (req: AuthenticatedRequest, res) => {
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

      const result = await storage.getAllWhitepaperDownloads({
        page,
        limit,
        search
      });

      return res.status(200).json({
        success: true,
        data: result.downloads,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching whitepaper downloads:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin API: Delete whitepaper download
  app.delete('/api/admin/whitepaper-downloads/:id', async (req: AuthenticatedRequest, res) => {
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
          message: "Invalid download ID"
        });
      }

      const existingDownload = await storage.getWhitepaperDownloadById(id);
      if (!existingDownload) {
        return res.status(404).json({
          success: false,
          message: "Download record not found"
        });
      }

      await storage.deleteWhitepaperDownload(id);
      return res.status(200).json({
        success: true,
        message: "Download record deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting whitepaper download:', error);
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

      // If page exists but is inactive, return 404 for SEO purposes
      if (!seoPage.isActive) {
        return res.status(404).json({
          success: false,
          message: "Page not found",
          error: "This page is currently inactive"
        });
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
      // console.log('SEO Update - User:', req.user);
      // console.log('SEO Update - Authenticated:', req.isAuthenticated());
      // console.log('SEO Update - Request body:', req.body);

      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
      //  console.log('SEO Update - Authentication failed');
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
       // console.log('SEO Update - Invalid ID:', req.params.id);
        return res.status(400).json({
          success: false,
          message: "Invalid SEO page ID"
        });
      }

    //  console.log('SEO Update - Validating data for ID:', id);
      const validatedData = seoPageSchema.partial().parse(req.body);
    //  console.log('SEO Update - Validation passed:', validatedData);

      const seoPage = await storage.updateSeoPage(id, validatedData);

      if (!seoPage) {
       // console.log('SEO Update - Page not found for ID:', id);
        return res.status(404).json({
          success: false,
          message: "SEO page not found"
        });
      }

     // console.log('SEO Update - Success for ID:', id);
      return res.status(200).json({ success: true, data: seoPage });
    } catch (error) {
      if (error instanceof z.ZodError) {
       // console.log('SEO Update - Validation error:', error.errors);
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

     // console.log('SEO update job data - User authenticated:', req.user?.role);

      const results = await storage.updateAllSeoJobPages();

     // console.log('SEO update job data - Results:', results);

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

  // Public schema endpoint for Google Search Console
  app.get('/schema', async (req, res) => {
    try {
      const activeSeoPages = await storage.getAllActiveSeoPages();

      const schemaData = {
        "@context": "https://schema.org",
        "@graph": activeSeoPages.filter(page => page.isActive === true).map(page => {
          let structuredData;
          try {
            structuredData = page.structuredData ? JSON.parse(page.structuredData) : null;
          } catch (error) {
            console.error(`Error parsing structured data for page ${page.pagePath}:`, error);
            structuredData = null;
          }

          return {
            "@type": "WebPage",
            "@id": `https://niddik.com${page.pagePath}`,
            "url": page.canonicalUrl || `https://niddik.com${page.pagePath}`,
            "name": page.pageTitle,
            "description": page.metaDescription,
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://niddik.com/#website",
              "name": "Niddik",
              "url": "https://niddik.com"
            },
            "dateModified": page.updatedAt,
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://niddik.com"
              }, {
                "@type": "ListItem", 
                "position": 2,
                "name": page.pageTitle,
                "item": page.canonicalUrl || `https://niddik.com${page.pagePath}`
              }]
            },
            ...(structuredData && typeof structuredData === 'object' ? structuredData : {})
          };
        })
      };

      res.setHeader('Content-Type', 'application/ld+json');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      return res.json(schemaData);
    } catch (error) {
      console.error('Error generating schema data:', error);
      return res.status(500).json({
        error: "Failed to generate schema data"
      });
    }
  });

  // Dynamic sitemap endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Get all active job listings for sitemap
      const jobListings = await storage.getJobListings({
        page: 1,
        limit: 1000,
        status: 'active'
      });

      // Get all active SEO pages
      const seoPages = await storage.getAllActiveSeoPages();
      const activeSeoPages = seoPages.filter(page => page.isActive === true);

      // Define static URLs without SEO-managed pages like /careers
      const staticUrls = [
        { loc: 'https://niddik.com/', priority: '1.0', changefreq: 'daily' },
        { loc: 'https://niddik.com/about-us', priority: '0.8', changefreq: 'monthly' },
        { loc: 'https://niddik.com/services', priority: '0.9', changefreq: 'weekly' },
        { loc: 'https://niddik.com/contact', priority: '0.7', changefreq: 'monthly' },
        { loc: 'https://niddik.com/request-demo', priority: '0.8', changefreq: 'monthly' },
        { loc: 'https://niddik.com/web-app-solutions', priority: '0.7', changefreq: 'monthly' },
        { loc: 'https://niddik.com/adaptive-hiring', priority: '0.7', changefreq: 'monthly' },
        { loc: 'https://niddik.com/insights', priority: '0.6', changefreq: 'weekly' },
        { loc: 'https://niddik.com/hiring-advice', priority: '0.6', changefreq: 'weekly' },
        { loc: 'https://niddik.com/career-advice', priority: '0.6', changefreq: 'weekly' },
        { loc: 'https://niddik.com/whitepaper', priority: '0.6', changefreq: 'monthly' },
        { loc: 'https://niddik.com/why-us', priority: '0.7', changefreq: 'monthly' },
        { loc: 'https://niddik.com/leadership-team', priority: '0.6', changefreq: 'monthly' },
        { loc: 'https://niddik.com/testimonials', priority: '0.6', changefreq: 'monthly' },
        { loc: 'https://niddik.com/facts-and-trends', priority: '0.6', changefreq: 'weekly' }
      ];

      // Generate job listing URLs
      const jobUrls = jobListings.jobListings.map(job => ({
        loc: `https://niddik.com/jobs/${job.id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: job.postedDate || new Date().toISOString().split('T')[0]
      }));

      // Combine all URLs
      const allUrls = [...staticUrls, ...jobUrls];

      // Build sitemap XML
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      return res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      return res.status(500).send('Error generating sitemap');
    }
  });

  // ======================= TIMESHEET MANAGEMENT API ROUTES =======================

  // Candidate Billing Configuration Routes
  app.get('/api/candidate-billing/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own billing info
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const billing = await storage.getCandidateBilling(candidateId);
      
      if (!billing) {
        return res.status(404).json({ success: false, message: "Billing configuration not found" });
      }

      res.json({ success: true, data: billing });
    } catch (error) {
      console.error('Error fetching candidate billing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/candidate-billing', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      console.log('Billing configuration request body:', JSON.stringify(req.body, null, 2));
      const validatedData = candidateBillingSchema.parse(req.body);
      const billing = await storage.createCandidateBilling(validatedData);

      res.status(201).json({ success: true, data: billing });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Billing validation errors:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating candidate billing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put('/api/candidate-billing/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const validatedData = candidateBillingSchema.partial().parse(req.body);
      
      const billing = await storage.updateCandidateBilling(candidateId, validatedData);
      
      if (!billing) {
        return res.status(404).json({ success: false, message: "Billing configuration not found" });
      }

      res.json({ success: true, data: billing });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating candidate billing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete('/api/candidate-billing/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidateId = parseInt(req.params.candidateId);
      
      const result = await storage.deleteCandidateBilling(candidateId);
      
      if (!result) {
        return res.status(404).json({ success: false, message: "Billing configuration not found" });
      }

      res.json({ success: true, message: "Billing configuration deleted successfully" });
    } catch (error) {
      console.error('Error deleting candidate billing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/admin/candidates-billing', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidates = await storage.getAllCandidatesWithBilling();
      res.json({ success: true, data: candidates });
    } catch (error) {
      console.error('Error fetching candidates with billing:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/admin/hired-candidates', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidates = await storage.getHiredCandidates();
      res.json({ success: true, data: candidates });
    } catch (error) {
      console.error('Error fetching hired candidates:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get candidate billing status (for sidebar visibility)
  app.get('/api/candidate/billing-status', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      // Check if candidate has any hired applications
      const userApplications = await storage.getJobApplicationsForUser(req.user.id);
      const hasHiredApplication = userApplications.some(app => app.status === 'hired');

      if (!hasHiredApplication) {
        return res.json({ success: true, data: { isActive: false, candidateId: req.user.id, hasHiredApplication: false } });
      }

      const billing = await storage.getCandidateBilling(req.user.id);
      
      if (!billing) {
        return res.json({ success: true, data: { isActive: false, candidateId: req.user.id, hasHiredApplication: true } });
      }

      res.json({ success: true, data: { ...billing, hasHiredApplication: true } });
    } catch (error) {
      console.error('Error fetching candidate billing status:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get candidate timesheet company information (for timesheet display)
  app.get('/api/candidate/timesheet-company-info', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      // Get candidate's billing configuration to find client company
      const billing = await storage.getCandidateBilling(req.user.id);
      
      if (!billing) {
        return res.json({ 
          success: true, 
          data: { 
            clientCompany: null, 
            companySettings: null 
          } 
        });
      }

      // Get client company and company settings
      const [clientCompaniesResponse, companySettingsResponse] = await Promise.all([
        storage.getAllClientCompanies({ active: true }),
        storage.getCompanySettings({})
      ]);

      // Find the specific client company assigned to this candidate
      const clientCompany = clientCompaniesResponse.companies.find(company => company.id === billing.clientCompanyId);
      
      res.json({ 
        success: true, 
        data: { 
          clientCompany: clientCompany || null,
          companySettings: companySettingsResponse.data[0] || null // Niddik company info
        } 
      });
    } catch (error) {
      console.error('Error fetching candidate timesheet company info:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Weekly Timesheet Routes
  app.get('/api/timesheets/candidate/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own timesheets
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const result = await storage.getTimesheetsForCandidate(candidateId, { page, limit, status });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching candidate timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/timesheets/:candidateId/:weekStartDate', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const weekStartDate = req.params.weekStartDate;
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own timesheets
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const timesheet = await storage.getWeeklyTimesheet(candidateId, weekStartDate);
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/timesheets', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const validatedData = weeklyTimesheetSchema.parse(req.body);
      
      // Candidates can only submit their own timesheets
      if (req.user.role !== 'admin' && req.user.id !== validatedData.candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      // Check if timesheet already exists for this week
      const existingTimesheet = await storage.getWeeklyTimesheet(validatedData.candidateId, validatedData.weekStartDate);
      if (existingTimesheet) {
        return res.status(409).json({ success: false, message: "Timesheet already exists for this week" });
      }

      // Get candidate billing to calculate amount
      const billing = await storage.getCandidateBilling(validatedData.candidateId);
      if (!billing) {
        return res.status(400).json({ success: false, message: "Candidate billing configuration not found" });
      }

      // Calculate total hours and amount
      const totalHours = (validatedData.mondayHours || 0) + 
                        (validatedData.tuesdayHours || 0) + 
                        (validatedData.wednesdayHours || 0) + 
                        (validatedData.thursdayHours || 0) + 
                        (validatedData.fridayHours || 0) + 
                        (validatedData.saturdayHours || 0) + 
                        (validatedData.sundayHours || 0);

      // Use the new overtime calculation method
      const timesheetData = {
        ...validatedData,
        candidateId: validatedData.candidateId,
        status: 'submitted',
        submittedAt: new Date()
      };

      const timesheet = await storage.createWeeklyTimesheetWithAdvancedOvertimeCalculation(timesheetData, validatedData.candidateId);

      res.status(201).json({ success: true, data: timesheet });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put('/api/timesheets/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const timesheetId = parseInt(req.params.id);
      const validatedData = weeklyTimesheetSchema.partial().parse(req.body);
      
      // Get existing timesheet to check ownership
      const existingTimesheet = await db.query.weeklyTimesheets.findFirst({
        where: eq(weeklyTimesheets.id, timesheetId)
      });

      if (!existingTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      // Candidates can only edit their own timesheets and only if not approved
      if (req.user.role !== 'admin') {
        if (req.user.id !== existingTimesheet.candidateId) {
          return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        if (existingTimesheet.status === 'approved') {
          return res.status(403).json({ success: false, message: "Cannot edit approved timesheet" });
        }
      }

      // Use advanced overtime recalculation if hours are being updated
      const timesheet = await storage.updateWeeklyTimesheetWithOvertimeRecalculation(timesheetId, validatedData);
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/admin/timesheets', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const candidateId = req.query.candidateId ? parseInt(req.query.candidateId as string) : undefined;

      const result = await storage.getAllTimesheets({ page, limit, status, candidateId });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching admin timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.patch('/api/admin/timesheets/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const timesheetId = parseInt(req.params.id);
      
      const timesheet = await storage.approveTimesheet(timesheetId, req.user.id);
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      console.error('Error approving timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.patch('/api/admin/timesheets/:id/reject', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const timesheetId = parseInt(req.params.id);
      const { rejectionReason } = req.body;
      
      if (!rejectionReason) {
        return res.status(400).json({ success: false, message: "Rejection reason is required" });
      }

      const timesheet = await storage.rejectTimesheet(timesheetId, rejectionReason);
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin edit timesheet (admin only)
  app.put('/api/admin/timesheets/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const timesheetId = parseInt(req.params.id);
      
      // Get the timesheet first to check if it exists
      const existingTimesheet = await storage.getWeeklyTimesheetById(timesheetId);
      if (!existingTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      // Validate request body
      const validatedData = weeklyTimesheetSchema.omit({ id: true, candidateId: true, createdAt: true, updatedAt: true }).parse(req.body);
      
      const timesheet = await storage.updateWeeklyTimesheet(timesheetId, validatedData);
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin update timesheet status (admin only)
  app.patch('/api/admin/timesheets/:id/status', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const timesheetId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      // Get the timesheet first to check if it exists
      const existingTimesheet = await storage.getWeeklyTimesheetById(timesheetId);
      if (!existingTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      const timesheet = await storage.updateWeeklyTimesheet(timesheetId, { status });
      
      if (!timesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: timesheet });
    } catch (error) {
      console.error('Error updating timesheet status:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin delete timesheet (admin only)
  app.delete('/api/admin/timesheets/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const timesheetId = parseInt(req.params.id);
      
      // Get the timesheet first to check if it exists
      const existingTimesheet = await storage.getWeeklyTimesheetById(timesheetId);
      if (!existingTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      const deletedTimesheet = await storage.deleteWeeklyTimesheet(timesheetId);
      
      if (!deletedTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: deletedTimesheet });
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Delete timesheet (candidate only)
  app.delete('/api/timesheets/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const timesheetId = parseInt(req.params.id);
      
      // Get the timesheet first to check ownership
      const existingTimesheet = await storage.getWeeklyTimesheetById(timesheetId);
      if (!existingTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      // Candidates can only delete their own timesheets and only if not approved
      if (req.user.role !== 'admin') {
        if (req.user.id !== existingTimesheet.candidateId) {
          return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        if (existingTimesheet.status === 'approved') {
          return res.status(403).json({ success: false, message: "Cannot delete approved timesheet" });
        }
      }

      const deletedTimesheet = await storage.deleteWeeklyTimesheet(timesheetId);
      
      if (!deletedTimesheet) {
        return res.status(404).json({ success: false, message: "Timesheet not found" });
      }

      res.json({ success: true, data: deletedTimesheet });
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Bi-Weekly Timesheet Routes
  app.get('/api/admin/biweekly-timesheets', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const candidateId = req.query.candidateId ? parseInt(req.query.candidateId as string) : undefined;
      
      const result = await storage.getAllBiWeeklyTimesheets({ page, limit, candidateId });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching bi-weekly timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/admin/biweekly-timesheets/:candidateId/generate', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const { periodStartDate } = req.body;

      if (!periodStartDate) {
        return res.status(400).json({ success: false, message: "Period start date is required" });
      }

      const biWeeklyTimesheet = await storage.generateBiWeeklyTimesheet(candidateId, new Date(periodStartDate));
      
      res.json({ success: true, data: biWeeklyTimesheet });
    } catch (error) {
      console.error('Error generating bi-weekly timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/biweekly-timesheets/candidate/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own timesheets
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const result = await storage.getAllBiWeeklyTimesheets({ page, limit, candidateId });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching candidate bi-weekly timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Monthly Timesheet Routes
  app.get('/api/admin/monthly-timesheets', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const candidateId = req.query.candidateId ? parseInt(req.query.candidateId as string) : undefined;
      
      const result = await storage.getAllMonthlyTimesheets({ page, limit, candidateId });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching monthly timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/admin/monthly-timesheets/:candidateId/generate', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const { year, month } = req.body;

      if (!year || !month) {
        return res.status(400).json({ success: false, message: "Year and month are required" });
      }

      const monthlyTimesheet = await storage.generateMonthlyTimesheet(candidateId, year, month);
      
      res.json({ success: true, data: monthlyTimesheet });
    } catch (error) {
      console.error('Error generating monthly timesheet:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/monthly-timesheets/candidate/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own timesheets
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const result = await storage.getAllMonthlyTimesheets({ page, limit, candidateId });
      
      res.json({ 
        success: true, 
        data: result.timesheets,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching candidate monthly timesheets:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Invoice Routes
  app.get('/api/invoices/candidate/:candidateId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }

      const candidateId = parseInt(req.params.candidateId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const isAdmin = req.user.role === 'admin';
      
      // Candidates can only view their own invoices
      if (!isAdmin && req.user.id !== candidateId) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
      }

      const result = await storage.getInvoicesForCandidate(candidateId, { page, limit, status });
      
      res.json({ 
        success: true, 
        data: result.invoices,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching candidate invoices:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/admin/invoices', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const candidateId = req.query.candidateId ? parseInt(req.query.candidateId as string) : undefined;

      const result = await storage.getAllInvoices({ page, limit, status, candidateId });
      
      res.json({ 
        success: true, 
        data: result.invoices,
        meta: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching admin invoices:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/admin/invoices', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const validatedData = invoiceSchema.parse(req.body);
      
      // Generate invoice number if not provided
      if (!validatedData.invoiceNumber) {
        validatedData.invoiceNumber = await storage.generateInvoiceNumber();
      }

      const invoice = await storage.createInvoice(validatedData);

      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.patch('/api/admin/invoices/:id/status', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const invoiceId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }

      const paidDate = status === 'paid' ? new Date() : undefined;
      
      const invoice = await storage.updateInvoiceStatus(invoiceId, status, paidDate);
      
      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }

      res.json({ success: true, data: invoice });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get('/api/admin/invoice-number/generate', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const invoiceNumber = await storage.generateInvoiceNumber();
      
      res.json({ success: true, data: { invoiceNumber } });
    } catch (error) {
      console.error('Error generating invoice number:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Generate invoice from approved timesheet
  app.post('/api/admin/generate-invoice', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const { timesheetId, biWeeklyTimesheetId } = req.body;

      if (!timesheetId && !biWeeklyTimesheetId) {
        return res.status(400).json({ success: false, message: "Either timesheet ID or bi-weekly timesheet ID is required" });
      }

      if (timesheetId && biWeeklyTimesheetId) {
        return res.status(400).json({ success: false, message: "Cannot specify both timesheet ID and bi-weekly timesheet ID" });
      }

      let invoice;
      if (biWeeklyTimesheetId) {
        invoice = await storage.generateInvoiceFromBiWeeklyTimesheet(parseInt(biWeeklyTimesheetId), req.user.id);
      } else {
        invoice = await storage.generateInvoiceFromTimesheet(parseInt(timesheetId), req.user.id);
      }

      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      console.error('Error generating invoice:', error);
      if (error.message.includes('not found') || error.message.includes('not approved')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message.includes('already exists')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get invoice template data for preview
  app.get('/api/admin/invoices/:id/template-data', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const invoiceId = parseInt(req.params.id);

      if (isNaN(invoiceId)) {
        return res.status(400).json({ success: false, message: "Invalid invoice ID" });
      }

      const templateData = await storage.getInvoiceTemplateData(invoiceId);

      res.json({ success: true, data: templateData });
    } catch (error) {
      console.error('Error fetching invoice template data:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Delete invoice (admin only)
  app.delete('/api/admin/invoices/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).json({ success: false, message: "Invalid invoice ID" });
      }

      await storage.deleteInvoice(invoiceId);
      
      res.json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Client Company Management API Endpoints
  
  // Get all client companies
  app.get('/api/admin/client-companies', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';

      const result = await storage.getAllClientCompanies({ page, limit, search });
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching client companies:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get client company by ID
  app.get('/api/admin/client-companies/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const company = await storage.getClientCompanyById(id);
      
      if (!company) {
        return res.status(404).json({ success: false, message: "Client company not found" });
      }
      
      res.json({ success: true, data: company });
    } catch (error) {
      console.error('Error fetching client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Create client company
  app.post('/api/admin/client-companies', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const validatedData = clientCompanySchema.parse({
        ...req.body,
        createdBy: req.user.id
      });

      const company = await storage.createClientCompany(validatedData);
      
      res.status(201).json({ success: true, data: company });
    } catch (error) {
      console.error('Error creating client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Update client company
  app.put('/api/admin/client-companies/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = clientCompanySchema.partial().parse(req.body);

      const company = await storage.updateClientCompany(id, validatedData);
      
      if (!company) {
        return res.status(404).json({ success: false, message: "Client company not found" });
      }
      
      res.json({ success: true, data: company });
    } catch (error) {
      console.error('Error updating client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Delete client company
  app.delete('/api/admin/client-companies/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteClientCompany(id);
      
      res.json({ success: true, message: "Client company deleted successfully" });
    } catch (error) {
      console.error('Error deleting client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Company Settings API Endpoints
  
  // Get all company settings
  app.get('/api/admin/company-settings', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const settings = await storage.getAllCompanySettings();
      
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get company settings by ID
  app.get('/api/admin/company-settings/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const settings = await storage.getCompanySettingsById(id);
      
      if (!settings) {
        return res.status(404).json({ success: false, message: "Company settings not found" });
      }
      
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error fetching company settings:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Create company settings
  app.post('/api/admin/company-settings', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      // Debug: Log the received data
      console.log('=== COMPANY SETTINGS DATA RECEIVED ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('Phone numbers type:', typeof req.body.phoneNumbers);
      console.log('Phone numbers value:', req.body.phoneNumbers);
      console.log('Email addresses type:', typeof req.body.emailAddresses);
      console.log('Email addresses value:', req.body.emailAddresses);

      // Preprocess data to ensure arrays are properly handled
      const processedBody = {
        ...req.body,
        phoneNumbers: Array.isArray(req.body.phoneNumbers) 
          ? req.body.phoneNumbers 
          : typeof req.body.phoneNumbers === 'string' 
            ? [req.body.phoneNumbers] 
            : [],
        emailAddresses: Array.isArray(req.body.emailAddresses) 
          ? req.body.emailAddresses 
          : typeof req.body.emailAddresses === 'string' 
            ? [req.body.emailAddresses] 
            : [],
      };

      console.log('=== PROCESSED DATA ===');
      console.log('Processed phone numbers:', processedBody.phoneNumbers);
      console.log('Processed email addresses:', processedBody.emailAddresses);

      const validatedData = companySettingsSchema.parse({
        ...processedBody,
        createdBy: req.user.id
      });

      const settings = await storage.createCompanySettings(validatedData);
      
      res.status(201).json({ success: true, data: settings });
    } catch (error) {
      console.error('Error creating company settings:', error);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Update company settings
  app.put('/api/admin/company-settings/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      
      // Preprocess data to ensure arrays are properly handled
      const processedBody = {
        ...req.body,
        phoneNumbers: Array.isArray(req.body.phoneNumbers) 
          ? req.body.phoneNumbers 
          : typeof req.body.phoneNumbers === 'string' 
            ? [req.body.phoneNumbers] 
            : req.body.phoneNumbers,
        emailAddresses: Array.isArray(req.body.emailAddresses) 
          ? req.body.emailAddresses 
          : typeof req.body.emailAddresses === 'string' 
            ? [req.body.emailAddresses] 
            : req.body.emailAddresses,
      };

      const validatedData = companySettingsSchema.partial().parse(processedBody);

      const settings = await storage.updateCompanySettings(id, validatedData);
      
      if (!settings) {
        return res.status(404).json({ success: false, message: "Company settings not found" });
      }
      
      res.json({ success: true, data: settings });
    } catch (error) {
      console.error('Error updating company settings:', error);
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
      }
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Delete company settings
  app.delete('/api/admin/company-settings/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteCompanySettings(id);
      
      res.json({ success: true, message: "Company settings deleted successfully" });
    } catch (error) {
      console.error('Error deleting company settings:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get client companies with settings (joined data)
  app.get('/api/admin/client-companies-with-settings', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';

      const result = await storage.getClientCompaniesWithSettings({ page, limit, search });
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching client companies with settings:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // ======================= COMPANY MANAGEMENT API ROUTES =======================

  // Client Companies Routes - Duplicate removed

  app.post('/api/admin/client-companies', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const validatedData = clientCompanySchema.parse({
        ...req.body,
        createdBy: req.user.id
      });

      const company = await storage.createClientCompany(validatedData);
      res.status(201).json({ success: true, data: company });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.put('/api/admin/client-companies/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = clientCompanySchema.partial().parse(req.body);
      
      const company = await storage.updateClientCompany(id, validatedData);
      
      if (!company) {
        return res.status(404).json({ success: false, message: "Client company not found" });
      }

      res.json({ success: true, data: company });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete('/api/admin/client-companies/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const result = await storage.deleteClientCompany(id);
      
      if (!result) {
        return res.status(404).json({ success: false, message: "Client company not found" });
      }

      res.json({ success: true, message: "Client company deleted successfully" });
    } catch (error) {
      console.error('Error deleting client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // ======================= END USER MANAGEMENT API ROUTES =======================

  // Get end users by client company
  app.get('/api/admin/end-users/by-company/:clientCompanyId', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const clientCompanyId = parseInt(req.params.clientCompanyId);
      const endUsers = await getEndUsersByClientCompany(clientCompanyId);
      
      res.json({ success: true, data: endUsers });
    } catch (error) {
      console.error('Error fetching end users by client company:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get end users from submitted candidates data
  app.get('/api/admin/end-users/from-candidates/:clientCompanyName', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const clientCompanyName = req.params.clientCompanyName;
      const endUsers = await getEndUsersFromSubmittedCandidates(clientCompanyName);
      
      res.json({ success: true, data: endUsers });
    } catch (error) {
      console.error('Error fetching end users from submitted candidates:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Create new end user
  app.post('/api/admin/end-users', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const validatedData = endUserSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });

      const endUser = await createEndUser(validatedData);
      res.status(201).json({ success: true, data: endUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error creating end user:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Update end user
  app.put('/api/admin/end-users/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = endUserSchema.partial().parse(req.body);
      
      const endUser = await updateEndUser(id, validatedData);
      
      if (!endUser) {
        return res.status(404).json({ success: false, message: "End user not found" });
      }

      res.json({ success: true, data: endUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Error updating end user:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Delete end user
  app.delete('/api/admin/end-users/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const result = await deleteEndUser(id);
      
      if (!result) {
        return res.status(404).json({ success: false, message: "End user not found" });
      }

      res.json({ success: true, message: "End user deleted successfully" });
    } catch (error) {
      console.error('Error deleting end user:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Currency conversion test endpoint
  app.get('/api/admin/test-currency', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const { amount = 100, currency = 'USD' } = req.query;
      
      const conversionResult = await convertCurrencyToINR(
        parseFloat(amount as string), 
        currency as string
      );
      
      res.json({
        success: true,
        data: conversionResult
      });
    } catch (error) {
      console.error('Currency test error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to test currency conversion',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get 6-month currency rates endpoint with enhanced daily sampling
  app.get('/api/admin/currency-rates', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }

      const { currency = 'USD' } = req.query;
      
      if (currency === 'USD') {
        const { average, monthlyRates } = await get6MonthAverageUSDToINR();
        
        res.json({
          success: true,
          data: {
            currency: 'USD',
            targetCurrency: 'INR',
            sixMonthAverage: average,
            monthlyRates,
            algorithm: 'Enhanced daily sampling with highest rate optimization',
            lastUpdated: new Date().toISOString(),
            note: 'Calculated from daily rate fluctuations, not single-day sampling'
          }
        });
      } else {
        // For other currencies, use enhanced conversion logic
        const currentRate = await getCurrencyRates(currency as string, 'INR');
        
        res.json({
          success: true,
          data: {
            currency: currency,
            targetCurrency: 'INR',
            currentRate: currentRate,
            lastUpdated: new Date().toISOString(),
            note: 'Current live rate - daily historical analysis available for USD only'
          }
        });
      }
    } catch (error) {
      console.error('Currency rates error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get currency rates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const server = createServer(app);
  return server;
}
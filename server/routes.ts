import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSubmissionSchema, jobListingSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}

import { db } from "@db";
import { 
  contactSubmissions, 
  testimonials, 
  clients,
  jobListings,
  InsertContactSubmission,
  ContactSubmission,
  Testimonial,
  Client,
  JobListing,
  InsertJobListing
} from "@shared/schema";
import { eq, desc, and, like, or } from "drizzle-orm";

export const storage = {
  // Contact form submissions
  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(data).returning();
    return submission;
  },
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.query.contactSubmissions.findMany({
      orderBy: (submissions, { desc }) => [desc(submissions.createdAt)]
    });
  },
  
  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.query.testimonials.findMany();
  },
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id)
    });
  },
  
  // Clients
  async getClients(): Promise<Client[]> {
    return await db.query.clients.findMany();
  },
  
  async getClientById(id: number): Promise<Client | undefined> {
    return await db.query.clients.findFirst({
      where: eq(clients.id, id)
    });
  },

  // Job Listings
  async getJobListings(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      experienceLevel?: string;
      jobType?: string;
      status?: string;
      featured?: boolean;
    } = {}
  ): Promise<{ jobListings: JobListing[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      category, 
      experienceLevel,
      jobType,
      status = "active",
      featured
    } = options;

    // Build the where conditions
    let whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(jobListings.title, `%${search}%`),
          like(jobListings.company, `%${search}%`),
          like(jobListings.description, `%${search}%`),
          like(jobListings.skills, `%${search}%`)
        )
      );
    }

    if (category) {
      whereConditions.push(eq(jobListings.category, category));
    }

    if (experienceLevel) {
      whereConditions.push(eq(jobListings.experienceLevel, experienceLevel));
    }

    if (jobType) {
      whereConditions.push(eq(jobListings.jobType, jobType));
    }

    if (status) {
      whereConditions.push(eq(jobListings.status, status));
    }

    if (featured !== undefined) {
      whereConditions.push(eq(jobListings.featured, featured));
    }

    // Create the where condition
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // Count total matching records for pagination
    const result = await db.query.jobListings.findMany({
      where: whereCondition
    });
    const totalCount = result.length;

    // Get paginated job listings
    const jobListingsResult = await db.query.jobListings.findMany({
      where: whereCondition,
      orderBy: [desc(jobListings.featured), desc(jobListings.postedDate)],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      jobListings: jobListingsResult,
      total: totalCount
    };
  },

  async getJobListingById(id: number): Promise<JobListing | undefined> {
    return await db.query.jobListings.findFirst({
      where: eq(jobListings.id, id)
    });
  },

  async createJobListing(data: InsertJobListing): Promise<JobListing> {
    const [jobListing] = await db.insert(jobListings).values(data).returning();
    return jobListing;
  },

  async updateJobListing(id: number, data: Partial<InsertJobListing>): Promise<JobListing | undefined> {
    const [updatedJobListing] = await db
      .update(jobListings)
      .set(data)
      .where(eq(jobListings.id, id))
      .returning();
    
    return updatedJobListing;
  },

  async deleteJobListing(id: number): Promise<void> {
    await db.delete(jobListings).where(eq(jobListings.id, id));
  },

  async getFeaturedJobListings(limit: number = 6): Promise<JobListing[]> {
    return await db.query.jobListings.findMany({
      where: and(
        eq(jobListings.status, "active"),
        eq(jobListings.featured, true)
      ),
      orderBy: [desc(jobListings.postedDate)],
      limit
    });
  },

  async getRecentJobListings(limit: number = 10): Promise<JobListing[]> {
    return await db.query.jobListings.findMany({
      where: eq(jobListings.status, "active"),
      orderBy: [desc(jobListings.postedDate)],
      limit
    });
  }
};

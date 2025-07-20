import { and, eq, desc, asc, ilike, inArray, count, gt, lt, sql, or, ne, isNotNull } from "drizzle-orm";
import { getCurrencyRates, convertINRToUSD, type CurrencyRates } from './currencyService.js';
import type { 
  User, 
  InsertUser, 
  ContactSubmission, 
  InsertContactSubmission,
  Testimonial,
  Client,
  JobListing,
  InsertJobListing,
  JobApplication,
  InsertJobApplication,
  SubmittedCandidate,
  InsertSubmittedCandidate,
  DemoRequest,
  InsertDemoRequest,
  SeoPage,
  InsertSeoPage,
  PasswordResetToken,
  InsertPasswordResetToken,
  WhitepaperDownload,
  InsertWhitepaperDownload,
  CandidateBilling,
  InsertCandidateBilling,
  WeeklyTimesheet,
  InsertWeeklyTimesheet,
  Invoice,
  InsertInvoice,
  ClientCompany,
  InsertClientCompany,
  CompanySettings,
  InsertCompanySettings,
  BiWeeklyTimesheet,
  InsertBiWeeklyTimesheet,
  MonthlyTimesheet,
  InsertMonthlyTimesheet,
  EndUser,
  InsertEndUser
} from "@shared/schema";
import {
  users,
  contactSubmissions,
  testimonials,
  clients,
  jobListings,
  jobApplications,
  submittedCandidates,
  demoRequests,
  seoPages,
  passwordResetTokens,
  whitepaperDownloads,
  adminSessions,
  sessions,
  candidateBilling,
  weeklyTimesheets,
  invoices,
  clientCompanies,
  companySettings,
  biWeeklyTimesheets,
  monthlyTimesheets,
  endUsers
} from "@shared/schema";
import { db } from "@db";
// Currency service import will be added when needed

// Retry utility function for database operations
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error);

      // Check if it's a connection timeout error
      if (error instanceof Error && 
          (error.message.includes('connection timeout') || 
           error.message.includes('Connection terminated') ||
           error.message.includes('connect ETIMEDOUT'))) {

        if (attempt < maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }

      // If it's not a timeout error or we've exhausted retries, throw immediately
      throw error;
    }
  }

  throw lastError!;
}

export const storage = {
  // Contact form submissions
  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(data).returning();
    return submission;
  },

  async getAllContactSubmissions(params: {
    page: number;
    limit: number;
    search?: string;
    interest?: string;
  }): Promise<{ submissions: ContactSubmission[]; total: number }> {
    const { page, limit, search, interest } = params;
    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [];

    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          ilike(contactSubmissions.fullName, searchPattern),
          ilike(contactSubmissions.email, searchPattern),
          ilike(contactSubmissions.company, searchPattern)
        )
      );
    }

    if (interest && interest !== 'all') {
      whereConditions.push(eq(contactSubmissions.interest, interest));
    }

    // Get total count
    const countResult = await db
      .select({ total: count() })
      .from(contactSubmissions)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult[0]?.total || 0;

    // Get paginated submissions
    const submissions = await db
      .select()
      .from(contactSubmissions)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    return { submissions, total };
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
      priority?: string;
    } = {}
  ): Promise<{ jobListings: JobListing[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      category, 
      experienceLevel,
      jobType,
      status,
      featured,
      priority
    } = options;

    // Build the where conditions
    let whereConditions = [];

    if (search) {
      const searchTerm = search.toLowerCase();
      whereConditions.push(
        or(
          sql`LOWER(${jobListings.title}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.company}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.description}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.skills}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.location}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.category}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.jobType}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.experienceLevel}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.salary}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.requirements}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.benefits}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${jobListings.status}) LIKE ${`%${searchTerm}%`}`
        )
      );
    }

    if (category && category !== 'all_categories') {
      whereConditions.push(eq(jobListings.category, category));
    }

    if (experienceLevel && experienceLevel !== 'all_levels') {
      whereConditions.push(eq(jobListings.experienceLevel, experienceLevel));
    }

    if (jobType && jobType !== 'all_types') {
      whereConditions.push(eq(jobListings.jobType, jobType));
    }

    if (status !== undefined && status !== null) {
      whereConditions.push(eq(jobListings.status, status));
    }

    if (featured !== undefined) {
      whereConditions.push(eq(jobListings.featured, featured));
    }

    if (priority && priority !== 'all_priorities') {
     // console.log('Applying priority filter:', priority); // Debug log
      switch (priority) {
        case 'urgent':
          whereConditions.push(eq(jobListings.urgent, true));
         // console.log('Added urgent filter condition - filtering for urgent = true'); // Debug log
          break;
        case 'priority':
          whereConditions.push(eq(jobListings.priority, true));
         // console.log('Added priority filter condition - filtering for priority = true'); // Debug log
          break;
        case 'open':
          whereConditions.push(eq(jobListings.isOpen, true));
         // console.log('Added open filter condition - filtering for isOpen = true'); // Debug log
          break;
        case 'featured':
          whereConditions.push(eq(jobListings.featured, true));
         // console.log('Added featured filter condition - filtering for featured = true'); // Debug log
          break;
        default:
          console.log('Unknown priority filter value:', priority);
          break;
      }
    }

    // Create the where condition
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // console.log('Storage getJobListings called with options:', {
    //   page, limit, search, category, experienceLevel, jobType, status, featured, priority
    // });
    // console.log('Where conditions:', whereConditions.length);

    // Count total matching records for pagination
    const result = await db.query.jobListings.findMany({
      where: whereCondition
    });
    const totalCount = result.length;

    // console.log('Total jobs found:', totalCount);
    // console.log('Jobs status distribution:', result.map(job => ({ id: job.id, status: job.status })));

    // Get paginated job listings
    const jobListingsResult = await db.query.jobListings.findMany({
      where: whereCondition,
      orderBy: [desc(jobListings.featured), desc(jobListings.postedDate)],
      limit,
      offset: (page - 1) * limit,
    });

    // console.log('Query results count:', jobListingsResult.length);
    // console.log('Priority filter results:', jobListingsResult.map(job => ({
    //   id: job.id,
    //   title: job.title,
    //   urgent: job.urgent,
    //   priority: job.priority,
    //   isOpen: job.isOpen,
    //   featured: job.featured
    // })));

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
    try {
      console.log('Storage: Creating job listing with data:', data);
      
      const [jobListing] = await db.insert(jobListings).values({
        title: data.title,
        company: data.company,
        location: data.location,
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
        benefits: data.benefits || null,
        applicationUrl: data.applicationUrl || null,
        contactEmail: data.contactEmail || null,
        status: data.status || 'active',
        featured: data.featured || false,
        urgent: data.urgent || false,
        priority: data.priority || false,
        isOpen: data.isOpen || false,
        postedDate: data.postedDate || new Date().toISOString(),
        expiryDate: data.expiryDate || null,
        category: data.category,
        skills: data.skills
      }).returning();
      
      console.log('Storage: Job listing created successfully:', jobListing);
      return jobListing;
    } catch (error) {
      console.error('Storage: Error creating job listing:', error);
      throw error;
    }
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

  async getRecentJobListings(limit: number = 10, days: number = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const result = await db
        .select()
        .from(jobListings)
        .where(
          and(
            eq(jobListings.status, 'active'),
            sql`${jobListings.postedDate} >= ${cutoffDateString} OR ${jobListings.postedDate} IS NULL`
          )
        )
        .orderBy(desc(jobListings.postedDate))
        .limit(limit);

      return result;
    } catch (error) {
      console.error('Error fetching recent job listings:', error);
      throw error;
    }
  },

  // User management
  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async getUserById(id: number): Promise<User | undefined> {
    return withRetry(async () => {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id)
      });
      return result || undefined;
    });
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return withRetry(async () => {
      const result = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      return result || undefined;
    });
  },

  async updateUser(id: number, data: Partial<Omit<InsertUser, 'password'>>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  },

  async updateUserPassword(id: number, password: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  },

  async updateLastLogout(id: number): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({ lastLogout: new Date() })
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error('Error updating last logout time:', error);
      return undefined;
    }
  },

  // Job Applications
  async createJobApplication(data: InsertJobApplication): Promise<JobApplication> {
    const [application] = await db.insert(jobApplications).values(data).returning();
    return application;
  },

  async getJobApplicationById(id: number): Promise<JobApplication | undefined> {
    return await db.query.jobApplications.findFirst({
      where: eq(jobApplications.id, id)
    });
  },

  async getJobApplicationsForUser(userId: number): Promise<JobApplication[]> {
    return await db.query.jobApplications.findMany({
      where: eq(jobApplications.userId, userId),
      orderBy: [desc(jobApplications.appliedDate)],
      with: {
        job: true
      }
    });
  },

  async getJobApplicationsForJob(jobId: number): Promise<JobApplication[]> {
    return await db.query.jobApplications.findMany({
      where: eq(jobApplications.jobId, jobId),
      orderBy: [desc(jobApplications.appliedDate)],
      with: {
        user: true
      }
    });
  },

  async updateJobApplicationStatus(id: number, status: string): Promise<JobApplication | undefined> {
    const [updatedApplication] = await db
      .update(jobApplications)
      .set({ 
        status, 
        lastUpdated: new Date() 
      })
      .where(eq(jobApplications.id, id))
      .returning();

    return updatedApplication;
  },

  async getAllApplicationsWithPagination(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {}
  ): Promise<{ applications: JobApplication[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      status,
      search = ""
    } = options;

    // Build the where conditions
    let whereConditions = [];

    if (status) {
      whereConditions.push(eq(jobApplications.status, status));
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      const userApplications = await db.query.users.findMany({
        where: or(
          sql`LOWER(${users.fullName}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${users.email}) LIKE ${`%${searchTerm}%`}`
        ),
        with: {
          applications: true
        }
      });

      if (userApplications.length > 0) {
        const applicationIds = userApplications.flatMap(user => 
          user.applications.map(app => app.id)
        );

        if (applicationIds.length > 0) {
          return {
            applications: userApplications.flatMap(user => user.applications),
            total: applicationIds.length
          };
        }
      }
    }

    // Create the where condition
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // Count total matching records for pagination
    const result = await db.query.jobApplications.findMany({
      where: whereCondition,
      with: {
        job: true,
        user: true
      }
    });
    const totalCount = result.length;

    // Get paginated applications
    const applicationsResult = await db.query.jobApplications.findMany({
      where: whereCondition,
      orderBy: [desc(jobApplications.appliedDate)],
      limit,
      offset: (page - 1) * limit,
      with: {
        job: true,
        user: true
      }
    });

    return {
      applications: applicationsResult,
      total: totalCount
    };
  },

  // Submitted Candidates
  async createSubmittedCandidate(data: InsertSubmittedCandidate): Promise<SubmittedCandidate> {
    const [candidate] = await db.insert(submittedCandidates).values(data).returning();
    return candidate;
  },

  async getSubmittedCandidateById(id: number): Promise<SubmittedCandidate | undefined> {
    return await db.query.submittedCandidates.findFirst({
      where: eq(submittedCandidates.id, id)
    });
  },

  async getAllSubmittedCandidates(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      client?: string;
      sourcedBy?: string;
      poc?: string;
      margin?: string;
    } = {}
  ): Promise<{ candidates: SubmittedCandidate[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      status,
      search = "",
      client,
      sourcedBy,
      poc,
      margin
    } = options;

    // Build the where conditions
    let whereConditions = [];

    if (status && status !== 'all_statuses') {
      whereConditions.push(eq(submittedCandidates.status, status));
    }

    if (client && client !== 'all_clients') {
      whereConditions.push(eq(submittedCandidates.client, client));
    }

    if (sourcedBy && sourcedBy !== 'all_sourced_by') {
      whereConditions.push(eq(submittedCandidates.sourcedBy, sourcedBy));
    }

    if (poc && poc !== 'all_pocs') {
      whereConditions.push(eq(submittedCandidates.poc, poc));
    }

    if (margin && margin !== 'all_margins') {
      // Check if it's a predefined range or exact value
      const marginRanges: { [key: string]: { min: number; max: number } } = {
        "0-10": { min: 0, max: 10 },
        "10-20": { min: 10, max: 20 },
        "20-30": { min: 20, max: 30 },
        "30-50": { min: 30, max: 50 },
        "50+": { min: 50, max: 999999 }
      };

      const range = marginRanges[margin];
      if (range) {
        // Handle predefined ranges
        whereConditions.push(
          and(
            sql`CAST(${submittedCandidates.marginPerHour} AS DECIMAL) >= ${range.min}`,
            range.max === 999999 
              ? sql`CAST(${submittedCandidates.marginPerHour} AS DECIMAL) >= ${range.min}`
              : sql`CAST(${submittedCandidates.marginPerHour} AS DECIMAL) < ${range.max}`
          )
        );
      } else {
        // Handle exact margin value match - convert both sides to string for exact comparison
        whereConditions.push(
          eq(submittedCandidates.marginPerHour, margin)
        );
      }
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      whereConditions.push(
        or(
          sql`LOWER(${submittedCandidates.candidateName}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.emailId}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.skills}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.client}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.contactNo}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.location}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.experience}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.status}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.poc}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.sourcedBy}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.currentCtc}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.expectedCtc}) LIKE ${`%${searchTerm}%`}`,
          sql`LOWER(${submittedCandidates.noticePeriod}) LIKE ${`%${searchTerm}%`}`
        )
      );
    }

    // Create the where condition
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // Count total matching records for pagination
    const result = await db.query.submittedCandidates.findMany({
      where: whereCondition,
    });
    const totalCount = result.length;

    // Get paginated candidates
    const candidatesResult = await db.query.submittedCandidates.findMany({
      where: whereCondition,
      orderBy: [desc(submittedCandidates.submissionDate)],
      limit,
      offset: (page - 1) * limit
    });

    return {
      candidates: candidatesResult,
      total: totalCount
    };
  },

  async updateSubmittedCandidate(id: number, data: Partial<InsertSubmittedCandidate>): Promise<SubmittedCandidate | undefined> {
    // Update the updatedAt timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };

    const [updatedCandidate] = await db
      .update(submittedCandidates)
      .set(updatedData)
      .where(eq(submittedCandidates.id, id))
      .returning();

    return updatedCandidate;
  },

  async deleteSubmittedCandidate(id: number): Promise<void> {
    await db.delete(submittedCandidates).where(eq(submittedCandidates.id, id));
  },

  async getSubmittedCandidateAnalytics(): Promise<{ 
    totalCandidates: number; 
    uniqueClients: number;
    statusCounts: Record<string, number>;
  }> {
    // Get all candidates
    const allCandidates = await db.query.submittedCandidates.findMany();
    const totalCount = allCandidates.length;

    // Get unique clients
    const uniqueClients = new Set<string>();
    allCandidates.forEach(candidate => {
      if (candidate.client) {
        uniqueClients.add(candidate.client);
      }
    });
    const uniqueClientsCount = uniqueClients.size;

    // Get status counts
    const statusCounts: Record<string, number> = {};
    const clientCounts: Record<string, number> = {};

    allCandidates.forEach(candidate => {
      // Count by status
      const status = candidate.status;
      if (!statusCounts[status]) {
        statusCounts[status] = 1;
      } else {
        statusCounts[status]++;
      }

      // Count by client
      if (candidate.client) {
        if (!clientCounts[candidate.client]) {
          clientCounts[candidate.client] = 1;
        } else {
          clientCounts[candidate.client]++;
        }
      }
    });

    return {
      totalCandidates: totalCount,
      uniqueClients: uniqueClientsCount,
      statusCounts,
      clientCounts
    };
  },

  async bulkCreateSubmittedCandidates(candidates: any[]) {
    try {
      // Process in smaller batches to avoid database timeout
      const batchSize = 100;
      const results = [];

      for (let i = 0; i < candidates.length; i += batchSize) {
        const batch = candidates.slice(i, i + batchSize);
        const batchResult = await db.insert(submittedCandidates).values(batch).returning();
        results.push(...batchResult);
      }

      return results;
    } catch (error) {
      console.error('Bulk insert error:', error);
      throw error;
    }
  },


  // Demo Requests
  async createDemoRequest(data: InsertDemoRequest): Promise<DemoRequest> {
    const [demoRequest] = await db.insert(demoRequests).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return demoRequest;
  },

  async getDemoRequestById(id: number): Promise<DemoRequest | undefined> {
    return await db.query.demoRequests.findFirst({
      where: eq(demoRequests.id, id)
    });
  },

  async getDemoRequestByEmail(email: string): Promise<DemoRequest | undefined> {
    return await db.query.demoRequests.findFirst({
      where: eq(demoRequests.workEmail, email)
    });
  },

  async getAllDemoRequests(
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{ demoRequests: DemoRequest[]; total: number }> {
    const { 
      page = 1, 
      limit = 10, 
      status
    } = options;

    // Build the where conditions
    let whereConditions = [];

    if (status && status !== 'all_statuses') {
      whereConditions.push(eq(demoRequests.status, status));
    }

    // Create the where condition
    const whereCondition = whereConditions.length > 0
      ? and(...whereConditions)
      : undefined;

    // Count total matching records for pagination
    const result = await db.query.demoRequests.findMany({
      where: whereCondition
    });
    const totalCount = result.length;

    // Get paginated demo requests
    const demoRequestsResult = await db.query.demoRequests.findMany({
      where: whereCondition,
      orderBy: [desc(demoRequests.createdAt)],
      limit,
      offset: (page - 1) * limit
    });

    return {
      demoRequests: demoRequestsResult,
      total: totalCount
    };
  },

  async updateDemoRequest(id: number, data: Partial<DemoRequest>): Promise<DemoRequest | undefined> {
    // Update the updatedAt timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };

    const [updatedRequest] = await db
      .update(demoRequests)
      .set(updatedData)
      .where(eq(demoRequests.id, id))
      .returning();

    return updatedRequest;
  },

  async deleteDemoRequest(id: number): Promise<void> {
    await db.delete(demoRequests).where(eq(demoRequests.id, id));
  },

  // SEO Pages methods
  async getAllSeoPages(): Promise<any[]> {
    try {
      const pages = await db.select().from(seoPages).orderBy(desc(seoPages.updatedAt));
      return pages;
    } catch (error) {
      console.error('Error fetching all SEO pages:', error);
      throw error;
    }
  },

  async getAllActiveSeoPages(): Promise<SeoPage[]> {
    return await db.select().from(seoPages).where(eq(seoPages.isActive, true)).orderBy(desc(seoPages.updatedAt));
  },

  async updateSeoPageWithJobData(pagePath: string): Promise<SeoPage | undefined> {
    try {
      // Get recent jobs from last 7 days
      const recentJobs = await this.getRecentJobListings(10, 7);

      if (recentJobs.length === 0) {
        console.log(`No recent jobs found for SEO update of ${pagePath}`);
        return undefined;
      }

      // Get existing SEO page
      const existingSeoPage = await this.getSeoPageByPath(pagePath);
      if (!existingSeoPage) {
        console.log(`SEO page not found for path: ${pagePath}`);
        return undefined;
      }

      // Generate job titles string for description
      const jobTitles = recentJobs.slice(0, 5).map(job => job.title).join(', ');
      const jobCompanies = [...new Set(recentJobs.map(job => job.company))].slice(0, 3).join(', ');

      // Create enhanced description based on page path
      let enhancedDescription = existingSeoPage.metaDescription;
      let enhancedKeywords = existingSeoPage.metaKeywords || '';

      if (pagePath === '/') {
        // Home page enhancement
        const baseDescription = "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.";
        enhancedDescription = `${baseDescription} Latest opportunities: ${jobTitles}. Trusted by companies like ${jobCompanies}.`;
        enhancedKeywords = `${enhancedKeywords}, ${recentJobs.map(job => job.title).join(', ')}, ${jobCompanies}`;
      } else if (pagePath === '/careers') {
        // Careers page enhancement
        const baseDescription = "Join Niddik and explore exciting career opportunities. Find your next role with top technology companies.";
        enhancedDescription = `${baseDescription} Latest positions: ${jobTitles}. Join companies like ${jobCompanies}.`;
        enhancedKeywords = `${enhancedKeywords}, ${recentJobs.map(job => job.title).join(', ')}, ${jobCompanies}`;
      }

      // Enhance structured data with recent jobs
      let enhancedStructuredData = existingSeoPage.structuredData;
      try {
        let structuredDataObj = enhancedStructuredData ? JSON.parse(enhancedStructuredData) : {};

        // Preserve existing mainEntity for home page or create if doesn't exist
        if (pagePath === '/') {
          // Preserve existing mainEntity if it exists, otherwise create default
          if (!structuredDataObj.mainEntity) {
            structuredDataObj.mainEntity = {
              "@type": "Organization",
              "name": "Niddik",
              "url": "https://niddik.com",
              "description": "Premier IT recruitment and staffing solutions provider",
              "logo": "https://niddik.com/images/niddik_logo.png",
              "sameAs": [
                "https://twitter.com/niddik",
                "https://linkedin.com/company/niddik"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123",
                "contactType": "customer service"
              }
            };
          }
        }

        // Add recent job postings to structured data
        if (pagePath === '/' || pagePath === '/careers') {
          structuredDataObj.potentialAction = {
            "@type": "SearchAction",
            "target": "https://niddik.com/careers?search={search_term}",
            "query-input": "required name=search_term"
          };

          structuredDataObj.about = recentJobs.map(job => ({
            "@type": "JobPosting",
            "title": job.title,
            "datePosted": job.postedDate || job.createdAt,
            "hiringOrganization": {
              "@type": "Organization",
              "name": job.company
            },
            "jobLocation": {
              "@type": "Place",
              "address": job.location
            },
            "url": `https://niddik.com/jobs/${job.id}`,
            "description": job.description?.substring(0, 150) + "...",
            "employmentType": job.jobType?.toUpperCase(),
            "experienceRequirements": job.experienceLevel
          }));
        }

        enhancedStructuredData = JSON.stringify(structuredDataObj, null, 2);
      } catch (parseError) {
        console.error('Error parsing structured data for enhancement:', parseError);
      }

      // Update the SEO page with enhanced data
      const updateData = {
        metaDescription: enhancedDescription.substring(0, 160), // Ensure within limit
        metaKeywords: enhancedKeywords.substring(0, 500), // Reasonable limit
        structuredData: enhancedStructuredData,
        updatedAt: new Date()
      };

      const updatedSeoPage = await this.updateSeoPage(existingSeoPage.id, updateData);
     // console.log(`SEO page updated for ${pagePath} with ${recentJobs.length} recent jobs`);

      return updatedSeoPage;
    } catch (error) {
      console.error(`Error updating SEO page ${pagePath} with job data:`, error);
      return undefined;
    }
  },

  async updateAllSeoJobPages(): Promise<{ updated: string[], errors: string[] }> {
    const results = { updated: [], errors: [] };
    const pagesToUpdate = ['/', '/careers'];

    for (const pagePath of pagesToUpdate) {
      try {
        const result = await this.updateSeoPageWithJobData(pagePath);
        if (result) {
          results.updated.push(pagePath);
        } else {
          results.errors.push(`Failed to update ${pagePath}`);
        }
      } catch (error) {
        console.error(`Error updating SEO for ${pagePath}:`, error);
        results.errors.push(`Error updating ${pagePath}: ${error.message}`);
      }
    }

    return results;
  },

  async getSeoPageByPath(pagePath: string): Promise<SeoPage | undefined> {
    return db.query.seoPages.findFirst({
      where: eq(seoPages.pagePath, pagePath)
    });
  },

  async getRootSeoPage(): Promise<SeoPage | undefined> {
    return db.query.seoPages.findFirst({
      where: and(eq(seoPages.pagePath, '/'), eq(seoPages.isActive, true))
    });
  },

  async getSeoPageById(id: number): Promise<SeoPage | undefined> {
    return db.query.seoPages.findFirst({
      where: eq(seoPages.id, id)
    });
  },

  async createSeoPage(data: InsertSeoPage): Promise<SeoPage> {
    const [seoPage] = await db.insert(seoPages).values(data).returning();
    return seoPage;
  },

async updateSeoPage(id: number, data: Partial<InsertSeoPage>): Promise<SeoPage | undefined> {
    const [seoPage] = await db
      .update(seoPages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(seoPages.id, id))
      .returning();
    return seoPage;
  },

  async deleteSeoPage(id: number): Promise<void> {
    await db.delete(seoPages).where(eq(seoPages.id, id));
  },

  async getAllJobApplications({ page = 1, limit = 10, search, status, jobId }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    jobId?: number;
  } = {}) {
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        userId: jobApplications.userId,
        coverLetter: jobApplications.coverLetter,
        resumeUrl: jobApplications.resumeUrl,
        status: jobApplications.status,
        experience: jobApplications.experience,
        skills: jobApplications.skills,
        education: jobApplications.education,
        additionalInfo: jobApplications.additionalInfo,
        billRate: jobApplications.billRate,
        payRate: jobApplications.payRate,
        appliedDate: jobApplications.appliedDate,
        lastUpdated: jobApplications.lastUpdated,
        candidateName: users.candidateName,
        email: users.email,
        contactNo: users.contactNo,
        location: users.location,
        expectedCtc: users.expectedCtc,
        jobTitle: jobListings.title,
        company: jobListings.company
      })
      .from(jobApplications)
      .leftJoin(users, eq(jobApplications.userId, users.id))
      .leftJoin(jobListings, eq(jobApplications.jobId, jobListings.id));

    if (jobId) {
      query = query.where(eq(jobApplications.jobId, jobId));
    }

    if (status) {
      query = query.where(eq(jobApplications.status, status));
    }

    if (search) {
      query = query.where(
        or(
          like(users.candidateName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    const applications = await query.limit(limit).offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobApplications);
    const total = totalResult[0].count;

    return { applications, total };
  },

  // Get job listing by ID
  async getJobListingById(id: number): Promise<JobListing | undefined> {
    try {
      const [job] = await db
        .select()
        .from(jobListings)
        .where(eq(jobListings.id, id))
        .limit(1);

      return job || undefined;
    } catch (error) {
      console.error('Error fetching job listing by ID:', error);
      return undefined;
    }
  }
  ,

  // Alternative method name for consistency
  async getJobListing(id: number): Promise<JobListing | undefined> {
    return this.getJobListingById(id);
  },

  // Get all applications for counting
  async getAllApplications(): Promise<JobApplication[]> {
    try {
      const applications = await db
        .select()
        .from(jobApplications);
      return applications;
    } catch (error) {
      console.error('Error fetching all applications:', error);
      return [];
    }
  },

  // Password Reset Token methods
  async createPasswordResetToken(data: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db.insert(passwordResetTokens).values(data).returning();
    return token;
  },

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false)
      )
    });
  },

  async markPasswordResetTokenAsUsed(tokenId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
  },

  async cleanupExpiredPasswordResetTokens(): Promise<void> {
    const now = new Date();
    await db
      .delete(passwordResetTokens)
      .where(sql`${passwordResetTokens.expiresAt} < ${now.toISOString()}`);
  },

  async deletePasswordResetTokensForUser(userId: number): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  },

  // Whitepaper Downloads methods
  async createWhitepaperDownload(data: InsertWhitepaperDownload): Promise<WhitepaperDownload> {
    const [download] = await db.insert(whitepaperDownloads).values(data).returning();
    return download;
  },

  async getAllWhitepaperDownloads({
    page = 1,
    limit = 10,
    search
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    downloads: WhitepaperDownload[];
    total: number;
  }> {
    let whereCondition = sql`1=1`;

    if (search && search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      whereCondition = sql`(
        ${whitepaperDownloads.fullName} ILIKE ${searchPattern} OR
        ${whitepaperDownloads.workEmail} ILIKE ${searchPattern} OR
        ${whitepaperDownloads.company} ILIKE ${searchPattern}
      )`;
    }

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(whitepaperDownloads)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated downloads
    const offset = (page - 1) * limit;
    const downloads = await db
      .select()
      .from(whitepaperDownloads)
      .where(whereCondition)
      .orderBy(desc(whitepaperDownloads.downloadedAt))
      .limit(limit)
      .offset(offset);

    return {
      downloads,
      total
    };
  },

  async getAllNonAdminUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(ne(users.role, 'admin'))
      .orderBy(desc(users.createdAt));
  },

  async getTotalActiveJobsCount(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(jobListings)
      .where(eq(jobListings.status, 'active'));

    return result[0]?.count || 0;
  },

  // ======================= TIMESHEET MANAGEMENT METHODS =======================
  
  // Candidate Billing Configuration Methods
  async createCandidateBilling(data: InsertCandidateBilling): Promise<CandidateBilling> {
    const [billing] = await db.insert(candidateBilling).values(data).returning();
    return billing;
  },

  async getCandidateBilling(candidateId: number): Promise<CandidateBilling | undefined> {
    return await db.query.candidateBilling.findFirst({
      where: and(
        eq(candidateBilling.candidateId, candidateId),
        eq(candidateBilling.isActive, true)
      )
    });
  },

  async updateCandidateBilling(candidateId: number, data: Partial<InsertCandidateBilling>): Promise<CandidateBilling | undefined> {
    const [updated] = await db
      .update(candidateBilling)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(candidateBilling.candidateId, candidateId))
      .returning();
    return updated;
  },

  async deleteCandidateBilling(candidateId: number): Promise<boolean> {
    try {
      // Delete all related timesheet data first
      await db.delete(weeklyTimesheets).where(eq(weeklyTimesheets.candidateId, candidateId));
      
      // Delete bi-weekly timesheets if they exist
      if (db.query.biweeklyTimesheets) {
        await db.delete(biweeklyTimesheets).where(eq(biweeklyTimesheets.candidateId, candidateId));
      }
      
      // Delete monthly timesheets if they exist
      if (db.query.monthlyTimesheets) {
        await db.delete(monthlyTimesheets).where(eq(monthlyTimesheets.candidateId, candidateId));
      }
      
      // Delete invoices related to this candidate
      await db.delete(invoices).where(eq(invoices.candidateId, candidateId));
      
      // Finally delete the billing configuration
      const result = await db
        .delete(candidateBilling)
        .where(eq(candidateBilling.candidateId, candidateId));
        
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting candidate billing and related data:', error);
      throw error;
    }
  },

  async getAllCandidatesWithBilling(): Promise<any[]> {
    // First get all hired candidate IDs
    const hiredCandidateIds = await db
      .selectDistinct({ candidateId: jobApplications.userId })
      .from(jobApplications)
      .where(eq(jobApplications.status, 'hired'));

    if (hiredCandidateIds.length === 0) return [];

    const candidateIds = hiredCandidateIds.map(c => c.candidateId);

    // Then get their details with billing information including all fields
    return await db
      .select({
        id: candidateBilling.id,
        candidateId: users.id,
        candidateName: users.fullName,
        candidateEmail: users.email,
        phone: users.phone,
        hourlyRate: candidateBilling.hourlyRate,
        workingHoursPerWeek: candidateBilling.workingHoursPerWeek,
        workingDaysPerWeek: candidateBilling.workingDaysPerWeek,
        currency: candidateBilling.currency,
        employmentType: candidateBilling.employmentType,
        supervisorName: candidateBilling.supervisorName,
        clientCompanyId: candidateBilling.clientCompanyId,
        endUserId: candidateBilling.endUserId,
        endUserName: endUsers.name,
        companySettingsId: candidateBilling.companySettingsId,
        tdsRate: candidateBilling.tdsRate,
        benefits: candidateBilling.benefits,
        sickLeaveDays: candidateBilling.sickLeaveDays,
        paidLeaveDays: candidateBilling.paidLeaveDays,
        isActive: candidateBilling.isActive,
        createdAt: candidateBilling.createdAt,
        updatedAt: candidateBilling.updatedAt
      })
      .from(candidateBilling)
      .innerJoin(users, eq(candidateBilling.candidateId, users.id))
      .leftJoin(endUsers, eq(candidateBilling.endUserId, endUsers.id))
      .where(inArray(users.id, candidateIds))
      .orderBy(desc(candidateBilling.createdAt));
  },

  async getHiredCandidates(): Promise<User[]> {
    // Get candidates with status "hired" from job applications
    const hiredCandidateIds = await db
      .selectDistinct({ candidateId: jobApplications.userId })
      .from(jobApplications)
      .where(eq(jobApplications.status, 'hired'));

    if (hiredCandidateIds.length === 0) return [];

    const candidateIds = hiredCandidateIds.map(c => c.candidateId);
    
    return await db
      .select()
      .from(users)
      .where(inArray(users.id, candidateIds))
      .orderBy(desc(users.createdAt));
  },

  // Weekly Timesheets Methods
  // Advanced overtime calculation algorithm
  calculateAdvancedOvertimeDetails(
    dailyHours: number, 
    dailyLimit: number, 
    regularRate: number
  ): { regularHours: number; overtimeHours: number; regularAmount: number; overtimeAmount: number } {
    if (dailyHours <= dailyLimit) {
      return {
        regularHours: dailyHours,
        overtimeHours: 0,
        regularAmount: dailyHours * regularRate,
        overtimeAmount: 0
      };
    }
    
    // Extra hours beyond daily limit go to overtime
    const regularHours = dailyLimit;
    const overtimeHours = dailyHours - dailyLimit;
    const regularAmount = regularHours * regularRate;
    const overtimeAmount = overtimeHours * regularRate; // Same rate for overtime
    
    return { regularHours, overtimeHours, regularAmount, overtimeAmount };
  },

  async createWeeklyTimesheetWithAdvancedOvertimeCalculation(data: InsertWeeklyTimesheet, candidateId: number): Promise<WeeklyTimesheet> {
    // Get candidate billing configuration to determine daily limits
    const billingConfig = await this.getCandidateBilling(candidateId);
    if (!billingConfig) {
      throw new Error('Billing configuration not found for candidate');
    }

    const regularRate = parseFloat(billingConfig.hourlyRate.toString());
    const workingHours = billingConfig.workingHoursPerWeek || 40;
    const workingDays = billingConfig.workingDaysPerWeek || 5;
    
    // Calculate daily hour limit dynamically (weekly hours ÷ working days)
    const dailyLimit = workingHours / workingDays;

    console.log(`Advanced Overtime Calculation for candidate ${candidateId}:
    - Working Hours/Week: ${workingHours}
    - Working Days/Week: ${workingDays}  
    - Daily Hour Limit: ${dailyLimit}
    - Regular Rate: ${regularRate}`);

    // Process each day and calculate regular vs overtime hours
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalRegularAmount = 0;
    let totalOvertimeAmount = 0;

    const processedData = { ...data };

    days.forEach((day) => {
      const hoursKey = `${day}Hours` as keyof typeof data;
      const overtimeKey = `${day}Overtime` as keyof typeof processedData;
      const originalDailyHours = parseFloat(data[hoursKey]?.toString() || '0');

      if (originalDailyHours > 0) {
        console.log(`${day}: Original hours: ${originalDailyHours}, Daily limit: ${dailyLimit}`);
        
        // Calculate overtime for this day using advanced algorithm
        const overtimeDetails = this.calculateAdvancedOvertimeDetails(originalDailyHours, dailyLimit, regularRate);
        
        console.log(`${day} breakdown: Regular: ${overtimeDetails.regularHours}, Overtime: ${overtimeDetails.overtimeHours}`);

        // Store regular hours (up to daily limit) and overtime hours separately
        processedData[hoursKey] = overtimeDetails.regularHours.toString() as any;
        processedData[overtimeKey] = overtimeDetails.overtimeHours.toString() as any;

        // Add to weekly totals
        totalRegularHours += overtimeDetails.regularHours;
        totalOvertimeHours += overtimeDetails.overtimeHours;
        totalRegularAmount += overtimeDetails.regularAmount;
        totalOvertimeAmount += overtimeDetails.overtimeAmount;
      } else {
        // No hours for this day
        processedData[hoursKey] = '0' as any;
        processedData[overtimeKey] = '0' as any;
      }
    });

    // Calculate final totals
    const totalWeeklyHours = totalRegularHours + totalOvertimeHours;
    const totalWeeklyAmount = totalRegularAmount + totalOvertimeAmount;

    console.log(`Final totals: Regular: ${totalRegularHours}h (₹${totalRegularAmount}), Overtime: ${totalOvertimeHours}h (₹${totalOvertimeAmount}), Total: ${totalWeeklyHours}h (₹${totalWeeklyAmount})`);

    // Add calculated totals to the processed data
    processedData.totalWeeklyHours = totalWeeklyHours.toString() as any;
    processedData.totalRegularHours = totalRegularHours.toString() as any;
    processedData.totalOvertimeHours = totalOvertimeHours.toString() as any;
    processedData.totalRegularAmount = totalRegularAmount.toString() as any;
    processedData.totalOvertimeAmount = totalOvertimeAmount.toString() as any;
    processedData.totalWeeklyAmount = totalWeeklyAmount.toString() as any;

    const [timesheet] = await db.insert(weeklyTimesheets).values(processedData).returning();
    
    console.log('Advanced overtime timesheet created successfully with ID:', timesheet.id);
    return timesheet;
  },

  async createWeeklyTimesheet(data: InsertWeeklyTimesheet): Promise<WeeklyTimesheet> {
    const [timesheet] = await db.insert(weeklyTimesheets).values(data).returning();
    return timesheet;
  },

  async getWeeklyTimesheet(candidateId: number, weekStartDate: string): Promise<WeeklyTimesheet | undefined> {
    return await db.query.weeklyTimesheets.findFirst({
      where: and(
        eq(weeklyTimesheets.candidateId, candidateId),
        eq(weeklyTimesheets.weekStartDate, weekStartDate)
      )
    });
  },

  async updateWeeklyTimesheetWithOvertimeRecalculation(id: number, data: Partial<InsertWeeklyTimesheet>): Promise<WeeklyTimesheet | undefined> {
    // Get the existing timesheet first
    const existingTimesheet = await this.getWeeklyTimesheetById(id);
    if (!existingTimesheet) {
      throw new Error('Timesheet not found');
    }

    // Check if hours are being updated - if so, recalculate overtime
    const hourFields = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'];
    const hasHourUpdates = hourFields.some(field => data[field as keyof typeof data] !== undefined);

    if (hasHourUpdates) {
      console.log('Hour updates detected, recalculating overtime for timesheet ID:', id);
      
      // Get candidate billing configuration
      const billingConfig = await this.getCandidateBilling(existingTimesheet.candidateId);
      if (!billingConfig) {
        throw new Error('Billing configuration not found for candidate');
      }

      const regularRate = parseFloat(billingConfig.hourlyRate.toString());
      const workingHours = billingConfig.workingHoursPerWeek || 40;
      const workingDays = billingConfig.workingDaysPerWeek || 5;
      const dailyLimit = workingHours / workingDays;

      // Merge existing data with updates to get complete hour data
      const mergedHours = {
        mondayHours: parseFloat((data.mondayHours ?? existingTimesheet.mondayHours)?.toString() || '0'),
        tuesdayHours: parseFloat((data.tuesdayHours ?? existingTimesheet.tuesdayHours)?.toString() || '0'),
        wednesdayHours: parseFloat((data.wednesdayHours ?? existingTimesheet.wednesdayHours)?.toString() || '0'),
        thursdayHours: parseFloat((data.thursdayHours ?? existingTimesheet.thursdayHours)?.toString() || '0'),
        fridayHours: parseFloat((data.fridayHours ?? existingTimesheet.fridayHours)?.toString() || '0'),
        saturdayHours: parseFloat((data.saturdayHours ?? existingTimesheet.saturdayHours)?.toString() || '0'),
        sundayHours: parseFloat((data.sundayHours ?? existingTimesheet.sundayHours)?.toString() || '0')
      };

      // Recalculate overtime for all days
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      let totalRegularHours = 0;
      let totalOvertimeHours = 0;
      let totalRegularAmount = 0;
      let totalOvertimeAmount = 0;

      days.forEach((day) => {
        const dayHours = mergedHours[`${day}Hours` as keyof typeof mergedHours];
        const overtimeDetails = this.calculateAdvancedOvertimeDetails(dayHours, dailyLimit, regularRate);
        
        // Update data with recalculated values
        data[`${day}Hours` as keyof typeof data] = overtimeDetails.regularHours.toString() as any;
        data[`${day}Overtime` as keyof typeof data] = overtimeDetails.overtimeHours.toString() as any;
        
        totalRegularHours += overtimeDetails.regularHours;
        totalOvertimeHours += overtimeDetails.overtimeHours;
        totalRegularAmount += overtimeDetails.regularAmount;
        totalOvertimeAmount += overtimeDetails.overtimeAmount;
      });

      // Update totals
      data.totalWeeklyHours = (totalRegularHours + totalOvertimeHours).toString() as any;
      data.totalRegularHours = totalRegularHours.toString() as any;
      data.totalOvertimeHours = totalOvertimeHours.toString() as any;
      data.totalRegularAmount = totalRegularAmount.toString() as any;
      data.totalOvertimeAmount = totalOvertimeAmount.toString() as any;
      data.totalWeeklyAmount = (totalRegularAmount + totalOvertimeAmount).toString() as any;

      console.log('Updated overtime calculation:', {
        totalRegular: totalRegularHours,
        totalOvertime: totalOvertimeHours,
        totalAmount: totalRegularAmount + totalOvertimeAmount
      });
    }

    const [updated] = await db
      .update(weeklyTimesheets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(weeklyTimesheets.id, id))
      .returning();
    return updated;
  },

  async updateWeeklyTimesheet(id: number, data: Partial<InsertWeeklyTimesheet>): Promise<WeeklyTimesheet | undefined> {
    const [updated] = await db
      .update(weeklyTimesheets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(weeklyTimesheets.id, id))
      .returning();
    return updated;
  },

  async deleteWeeklyTimesheet(id: number): Promise<WeeklyTimesheet | undefined> {
    const [deleted] = await db
      .delete(weeklyTimesheets)
      .where(eq(weeklyTimesheets.id, id))
      .returning();
    return deleted;
  },

  async getWeeklyTimesheetById(id: number): Promise<WeeklyTimesheet | undefined> {
    return await db.query.weeklyTimesheets.findFirst({
      where: eq(weeklyTimesheets.id, id)
    });
  },

  async getTimesheetsForCandidate(
    candidateId: number, 
    options: { page?: number; limit?: number; status?: string } = {}
  ): Promise<{ timesheets: WeeklyTimesheet[]; total: number }> {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [eq(weeklyTimesheets.candidateId, candidateId)];
    
    if (status && status !== 'all') {
      whereConditions.push(eq(weeklyTimesheets.status, status));
    }

    const whereCondition = and(...whereConditions);

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(weeklyTimesheets)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated timesheets
    const timesheets = await db
      .select()
      .from(weeklyTimesheets)
      .where(whereCondition)
      .orderBy(desc(weeklyTimesheets.weekStartDate))
      .limit(limit)
      .offset(offset);

    return { timesheets, total };
  },

  async getAllTimesheets(options: { page?: number; limit?: number; status?: string; candidateId?: number } = {}): Promise<{ timesheets: any[]; total: number }> {
    const { page = 1, limit = 10, status, candidateId } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (status && status !== 'all') {
      whereConditions.push(eq(weeklyTimesheets.status, status));
    }
    
    if (candidateId) {
      whereConditions.push(eq(weeklyTimesheets.candidateId, candidateId));
    }

    const whereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(weeklyTimesheets)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated timesheets with candidate information and currency
    const timesheets = await db
      .select({
        id: weeklyTimesheets.id,
        candidateId: weeklyTimesheets.candidateId,
        candidateName: users.fullName,
        candidateEmail: users.email,
        weekStartDate: weeklyTimesheets.weekStartDate,
        weekEndDate: weeklyTimesheets.weekEndDate,
        mondayHours: weeklyTimesheets.mondayHours,
        tuesdayHours: weeklyTimesheets.tuesdayHours,
        wednesdayHours: weeklyTimesheets.wednesdayHours,
        thursdayHours: weeklyTimesheets.thursdayHours,
        fridayHours: weeklyTimesheets.fridayHours,
        saturdayHours: weeklyTimesheets.saturdayHours,
        sundayHours: weeklyTimesheets.sundayHours,
        // Add overtime columns
        mondayOvertime: weeklyTimesheets.mondayOvertime,
        tuesdayOvertime: weeklyTimesheets.tuesdayOvertime,
        wednesdayOvertime: weeklyTimesheets.wednesdayOvertime,
        thursdayOvertime: weeklyTimesheets.thursdayOvertime,
        fridayOvertime: weeklyTimesheets.fridayOvertime,
        saturdayOvertime: weeklyTimesheets.saturdayOvertime,
        sundayOvertime: weeklyTimesheets.sundayOvertime,
        totalWeeklyHours: weeklyTimesheets.totalWeeklyHours,
        totalWeeklyAmount: weeklyTimesheets.totalWeeklyAmount,
        // Add overtime totals
        totalOvertimeHours: weeklyTimesheets.totalOvertimeHours,
        totalRegularAmount: weeklyTimesheets.totalRegularAmount,
        totalOvertimeAmount: weeklyTimesheets.totalOvertimeAmount,
        status: weeklyTimesheets.status,
        submittedAt: weeklyTimesheets.submittedAt,
        approvedAt: weeklyTimesheets.approvedAt,
        createdAt: weeklyTimesheets.createdAt,
        updatedAt: weeklyTimesheets.updatedAt,
        currency: candidateBilling.currency,
        rejectionReason: weeklyTimesheets.rejectionReason
      })
      .from(weeklyTimesheets)
      .leftJoin(users, eq(weeklyTimesheets.candidateId, users.id))
      .leftJoin(candidateBilling, eq(weeklyTimesheets.candidateId, candidateBilling.candidateId))
      .where(whereCondition)
      .orderBy(desc(weeklyTimesheets.weekStartDate))
      .limit(limit)
      .offset(offset);

    return { timesheets, total };
  },

  async approveTimesheet(timesheetId: number, approvedBy: number): Promise<WeeklyTimesheet | undefined> {
    const [updated] = await db
      .update(weeklyTimesheets)
      .set({
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: approvedBy,
        updatedAt: new Date()
      })
      .where(eq(weeklyTimesheets.id, timesheetId))
      .returning();
    
    // Auto-generate aggregated timesheets when a timesheet is approved
    if (updated) {
      await this.autoGenerateAggregatedTimesheets(updated.candidateId);
    }
    
    return updated;
  },

  // Auto-generate bi-weekly and monthly timesheets based on approved weekly timesheets
  async autoGenerateAggregatedTimesheets(candidateId: number): Promise<void> {
    try {
      // Get all approved weekly timesheets for this candidate
      const approvedTimesheets = await db
        .select()
        .from(weeklyTimesheets)
        .where(
          and(
            eq(weeklyTimesheets.candidateId, candidateId),
            eq(weeklyTimesheets.status, 'approved')
          )
        )
        .orderBy(desc(weeklyTimesheets.weekStartDate));

      if (approvedTimesheets.length === 0) return;

      // Group timesheets by bi-weekly periods and generate
      await this.generateBiWeeklyAggregations(candidateId, approvedTimesheets);
      
      // Group timesheets by monthly periods and generate
      await this.generateMonthlyAggregations(candidateId, approvedTimesheets);
      
    } catch (error) {
      console.error('Error auto-generating aggregated timesheets:', error);
    }
  },

  async generateBiWeeklyAggregations(candidateId: number, timesheets: any[]): Promise<void> {
    // Group timesheets by bi-weekly periods
    const biWeeklyGroups = new Map();
    
    for (const timesheet of timesheets) {
      const weekStart = new Date(timesheet.weekStartDate);
      const weekNumber = Math.floor((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      const biWeeklyPeriod = Math.floor(weekNumber / 2);
      const biWeeklyKey = `${weekStart.getFullYear()}-${biWeeklyPeriod}`;
      
      if (!biWeeklyGroups.has(biWeeklyKey)) {
        biWeeklyGroups.set(biWeeklyKey, []);
      }
      biWeeklyGroups.get(biWeeklyKey).push(timesheet);
    }

    // Generate bi-weekly timesheets for groups with 2 weeks
    for (const [key, groupTimesheets] of biWeeklyGroups) {
      if (groupTimesheets.length >= 2) {
        const sortedTimesheets = groupTimesheets.sort((a, b) => 
          new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
        ).slice(0, 2); // Take first 2 weeks
        
        // Check if bi-weekly timesheet already exists
        const periodStartDate = sortedTimesheets[0].weekStartDate;
        const periodEndDate = sortedTimesheets[1].weekEndDate;
        
        const existing = await db
          .select()
          .from(biWeeklyTimesheets)
          .where(
            and(
              eq(biWeeklyTimesheets.candidateId, candidateId),
              eq(biWeeklyTimesheets.periodStartDate, periodStartDate),
              eq(biWeeklyTimesheets.periodEndDate, periodEndDate)
            )
          );

        if (existing.length === 0) {
          await this.generateBiWeeklyTimesheet(candidateId, periodStartDate);
        }
      }
    }
  },

  async generateMonthlyAggregations(candidateId: number, timesheets: any[]): Promise<void> {
    // Group timesheets by month
    const monthlyGroups = new Map();
    
    for (const timesheet of timesheets) {
      const weekStart = new Date(timesheet.weekStartDate);
      const monthKey = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}`;
      
      if (!monthlyGroups.has(monthKey)) {
        monthlyGroups.set(monthKey, []);
      }
      monthlyGroups.get(monthKey).push(timesheet);
    }

    // Generate monthly timesheets
    for (const [key, groupTimesheets] of monthlyGroups) {
      if (groupTimesheets.length > 0) {
        const [year, month] = key.split('-').map(Number);
        
        // Check if monthly timesheet already exists
        const existing = await db
          .select()
          .from(monthlyTimesheets)
          .where(
            and(
              eq(monthlyTimesheets.candidateId, candidateId),
              eq(monthlyTimesheets.year, year),
              eq(monthlyTimesheets.month, month)
            )
          );

        if (existing.length === 0) {
          await this.generateMonthlyTimesheet(candidateId, year, month);
        }
      }
    }
  },

  async rejectTimesheet(timesheetId: number, rejectionReason: string): Promise<WeeklyTimesheet | undefined> {
    const [updated] = await db
      .update(weeklyTimesheets)
      .set({
        status: 'rejected',
        rejectionReason: rejectionReason,
        updatedAt: new Date()
      })
      .where(eq(weeklyTimesheets.id, timesheetId))
      .returning();
    return updated;
  },

  // Invoice Methods
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(data).returning();
    return invoice;
  },

  async getInvoicesForCandidate(candidateId: number, options: { page?: number; limit?: number; status?: string } = {}): Promise<{ invoices: any[]; total: number }> {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [eq(invoices.candidateId, candidateId)];
    
    if (status && status !== 'all') {
      whereConditions.push(eq(invoices.status, status));
    }

    const whereCondition = and(...whereConditions);

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(invoices)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated invoices with timesheet data
    const invoicesResult = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        candidateId: invoices.candidateId,
        timesheetId: invoices.timesheetId,
        weekStartDate: invoices.weekStartDate,
        weekEndDate: invoices.weekEndDate,
        totalHours: invoices.totalHours,
        hourlyRate: invoices.hourlyRate,
        totalAmount: invoices.totalAmount,
        currency: invoices.currency,
        status: invoices.status,
        pdfUrl: invoices.pdfUrl,
        issuedDate: invoices.issuedDate,
        dueDate: invoices.dueDate,
        paidDate: invoices.paidDate,
        notes: invoices.notes,
        createdAt: invoices.createdAt
      })
      .from(invoices)
      .where(whereCondition)
      .orderBy(desc(invoices.issuedDate))
      .limit(limit)
      .offset(offset);

    return { invoices: invoicesResult, total };
  },

  async getAllInvoices(options: { page?: number; limit?: number; status?: string; candidateId?: number } = {}): Promise<{ invoices: any[]; total: number }> {
    const { page = 1, limit = 10, status, candidateId } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (status && status !== 'all') {
      whereConditions.push(eq(invoices.status, status));
    }
    
    if (candidateId) {
      whereConditions.push(eq(invoices.candidateId, candidateId));
    }

    const whereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(invoices)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated invoices with candidate information
    const invoicesResult = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        candidateId: invoices.candidateId,
        candidateName: users.fullName,
        candidateEmail: users.email,
        timesheetId: invoices.timesheetId,
        weekStartDate: invoices.weekStartDate,
        weekEndDate: invoices.weekEndDate,
        totalHours: invoices.totalHours,
        hourlyRate: invoices.hourlyRate,
        totalAmount: invoices.totalAmount,
        currency: invoices.currency,
        status: invoices.status,
        pdfUrl: invoices.pdfUrl,
        issuedDate: invoices.issuedDate,
        dueDate: invoices.dueDate,
        paidDate: invoices.paidDate,
        notes: invoices.notes,
        createdAt: invoices.createdAt
      })
      .from(invoices)
      .leftJoin(users, eq(invoices.candidateId, users.id))
      .where(whereCondition)
      .orderBy(desc(invoices.issuedDate))
      .limit(limit)
      .offset(offset);

    return { invoices: invoicesResult, total };
  },

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    return await db.query.invoices.findFirst({
      where: eq(invoices.id, id)
    });
  },

  async updateInvoiceStatus(id: number, status: string, paidDate?: Date): Promise<Invoice | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paidDate) {
      updateData.paidDate = paidDate;
    }
    
    const [updated] = await db
      .update(invoices)
      .set(updateData)
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  },

  // Generate invoice number
  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get the latest invoice number for this year-month
    const latestInvoice = await db
      .select()
      .from(invoices)
      .where(sql`${invoices.invoiceNumber} LIKE ${`INV-${year}${month}-%`}`)
      .orderBy(desc(invoices.invoiceNumber))
      .limit(1);

    let nextNumber = 1;
    if (latestInvoice.length > 0) {
      const lastNumber = latestInvoice[0].invoiceNumber.split('-')[2];
      nextNumber = parseInt(lastNumber) + 1;
    }

    return `INV-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
  },

  // Generate invoice from approved timesheet
  async generateInvoiceFromTimesheet(timesheetId: number, generatedBy: number): Promise<Invoice> {
    // Get timesheet details with candidate and billing information
    const timesheetData = await db
      .select({
        timesheet: weeklyTimesheets,
        candidate: users,
        billing: candidateBilling
      })
      .from(weeklyTimesheets)
      .leftJoin(users, eq(weeklyTimesheets.candidateId, users.id))
      .leftJoin(candidateBilling, eq(weeklyTimesheets.candidateId, candidateBilling.candidateId))
      .where(and(
        eq(weeklyTimesheets.id, timesheetId),
        eq(weeklyTimesheets.status, 'approved')
      ))
      .limit(1);

    if (!timesheetData.length) {
      throw new Error('Timesheet not found or not approved');
    }

    const { timesheet, candidate, billing } = timesheetData[0];

    if (!billing) {
      throw new Error('Billing configuration not found for candidate');
    }

    // Check if invoice already exists for this timesheet
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.timesheetId, timesheetId))
      .limit(1);

    if (existingInvoice.length > 0) {
      throw new Error('Invoice already exists for this timesheet');
    }

    // Get real-time currency conversion rates
    const currencyData = await get6MonthAverageUSDToINR();
    
    // Original INR amount from timesheet
    const amountINR = parseFloat(timesheet.totalWeeklyAmount.toString());
    
    // Convert to USD using current rate
    const totalAmountUSD = convertINRToUSD(amountINR, currencyData.currentRate);
    
    // Calculate 18% GST
    const { gstAmount, totalWithGst } = calculateGST(totalAmountUSD, 18.0);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // Calculate due date (30 days from today)
    const issuedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice data with USD conversion
    const invoiceData: InsertInvoice = {
      invoiceNumber,
      candidateId: timesheet.candidateId,
      timesheetId: timesheet.id,
      biWeeklyTimesheetId: null,
      weekStartDate: timesheet.weekStartDate,
      weekEndDate: timesheet.weekEndDate,
      totalHours: timesheet.totalWeeklyHours,
      hourlyRate: convertINRToUSD(parseFloat(billing.hourlyRate.toString()), currencyData.currentRate),
      totalAmount: totalAmountUSD,
      currency: 'USD',
      currencyConversionRate: currencyData.currentRate,
      sixMonthAverageRate: currencyData.sixMonthAverage,
      amountINR: amountINR,
      gstRate: 18.0,
      gstAmount: gstAmount,
      totalWithGst: totalWithGst,
      status: 'generated',
      issuedDate: issuedDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      generatedBy,
      notes: `Invoice generated for week ${timesheet.weekStartDate} to ${timesheet.weekEndDate}. Converted from INR ${amountINR} at rate ${currencyData.currentRate}`
    };

    return await this.createInvoice(invoiceData);
  },

  // Generate invoice from approved bi-weekly timesheet
  async generateInvoiceFromBiWeeklyTimesheet(biWeeklyTimesheetId: number, generatedBy: number): Promise<Invoice> {
    // Get bi-weekly timesheet details with candidate and billing information
    const timesheetData = await db
      .select({
        timesheet: biWeeklyTimesheets,
        candidate: users,
        billing: candidateBilling
      })
      .from(biWeeklyTimesheets)
      .leftJoin(users, eq(biWeeklyTimesheets.candidateId, users.id))
      .leftJoin(candidateBilling, eq(biWeeklyTimesheets.candidateId, candidateBilling.candidateId))
      .where(and(
        eq(biWeeklyTimesheets.id, biWeeklyTimesheetId),
        eq(biWeeklyTimesheets.status, 'approved')
      ))
      .limit(1);

    if (!timesheetData.length) {
      throw new Error('Bi-weekly timesheet not found or not approved');
    }

    const { timesheet, candidate, billing } = timesheetData[0];

    if (!billing) {
      throw new Error('Billing configuration not found for candidate');
    }

    // Check if invoice already exists for this bi-weekly timesheet
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.biWeeklyTimesheetId, biWeeklyTimesheetId))
      .limit(1);

    if (existingInvoice.length > 0) {
      throw new Error('Invoice already exists for this bi-weekly timesheet');
    }

    // Get real-time currency conversion rates
    const currencyData = await get6MonthAverageUSDToINR();
    
    // Original INR amount from bi-weekly timesheet
    const amountINR = parseFloat(timesheet.totalBiWeeklyAmount.toString());
    
    // Convert to USD using current rate
    const totalAmountUSD = convertINRToUSD(amountINR, currencyData.currentRate);
    
    // Calculate 18% GST
    const { gstAmount, totalWithGst } = calculateGST(totalAmountUSD, 18.0);

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();

    // Calculate due date (30 days from today)
    const issuedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice data with USD conversion
    const invoiceData: InsertInvoice = {
      invoiceNumber,
      candidateId: timesheet.candidateId,
      timesheetId: null,
      biWeeklyTimesheetId: timesheet.id,
      weekStartDate: timesheet.periodStartDate,
      weekEndDate: timesheet.periodEndDate,
      totalHours: timesheet.totalBiWeeklyHours,
      hourlyRate: convertINRToUSD(parseFloat(billing.hourlyRate.toString()), currencyData.currentRate),
      totalAmount: totalAmountUSD,
      currency: 'USD',
      currencyConversionRate: currencyData.currentRate,
      sixMonthAverageRate: currencyData.sixMonthAverage,
      amountINR: amountINR,
      gstRate: 18.0,
      gstAmount: gstAmount,
      totalWithGst: totalWithGst,
      status: 'generated',
      issuedDate: issuedDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      generatedBy,
      notes: `Invoice generated for bi-weekly period ${timesheet.periodStartDate} to ${timesheet.periodEndDate}. Converted from INR ${amountINR} at rate ${currencyData.currentRate}`
    };

    return await this.createInvoice(invoiceData);
  },

  // Get invoice data for template with all related information
  async getInvoiceTemplateData(invoiceId: number): Promise<any> {
    const invoiceData = await db
      .select({
        invoice: invoices,
        candidate: users,
        billing: candidateBilling,
        timesheet: weeklyTimesheets,
        companySettings: companySettings,
        clientCompany: clientCompanies
      })
      .from(invoices)
      .leftJoin(users, eq(invoices.candidateId, users.id))
      .leftJoin(candidateBilling, eq(invoices.candidateId, candidateBilling.candidateId))
      .leftJoin(weeklyTimesheets, eq(invoices.timesheetId, weeklyTimesheets.id))
      .leftJoin(companySettings, eq(candidateBilling.companySettingsId, companySettings.id))
      .leftJoin(clientCompanies, eq(candidateBilling.clientCompanyId, clientCompanies.id))
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (!invoiceData.length) {
      throw new Error('Invoice not found');
    }

    const data = invoiceData[0];

    // Calculate overtime details from timesheet
    const regularHours = parseFloat(data.timesheet?.totalRegularHours?.toString() || '0');
    const overtimeHours = parseFloat(data.timesheet?.totalOvertimeHours?.toString() || '0');
    const regularAmount = parseFloat(data.timesheet?.totalRegularAmount?.toString() || '0');
    const overtimeAmount = parseFloat(data.timesheet?.totalOvertimeAmount?.toString() || '0');

    return {
      invoice: {
        invoiceNumber: data.invoice.invoiceNumber,
        candidateName: data.candidate?.fullName || '',
        candidateEmail: data.candidate?.email || '',
        weekStartDate: data.invoice.weekStartDate,
        weekEndDate: data.invoice.weekEndDate,
        totalHours: parseFloat(data.invoice.totalHours?.toString() || '0'),
        hourlyRate: parseFloat(data.invoice.hourlyRate?.toString() || '0'),
        totalAmount: parseFloat(data.invoice.totalAmount?.toString() || '0'),
        currency: data.invoice.currency,
        currencyConversionRate: parseFloat(data.invoice.currencyConversionRate?.toString() || '0'),
        sixMonthAverageRate: parseFloat(data.invoice.sixMonthAverageRate?.toString() || '0'),
        amountINR: parseFloat(data.invoice.amountINR?.toString() || '0'),
        gstRate: parseFloat(data.invoice.gstRate?.toString() || '18'),
        gstAmount: parseFloat(data.invoice.gstAmount?.toString() || '0'),
        totalWithGst: parseFloat(data.invoice.totalWithGst?.toString() || '0'),
        issuedDate: data.invoice.issuedDate,
        dueDate: data.invoice.dueDate,
        notes: data.invoice.notes
      },
      companyData: {
        name: data.companySettings?.name || 'NIDDIK',
        logoUrl: data.companySettings?.logoUrl || '',
        address: data.companySettings?.address || '3rd Floor, Flat No. C-11 Multistorey Apt.',
        city: data.companySettings?.city || 'New Delhi',
        state: data.companySettings?.state || 'Delhi',
        country: data.companySettings?.country || 'India',
        zipCode: data.companySettings?.zipCode || '110025',
        phoneNumbers: data.companySettings?.phoneNumbers || [],
        emailAddresses: data.companySettings?.emailAddresses || [],
        website: data.companySettings?.website || '',
        taxId: data.companySettings?.taxId || '+917317361085 | +913556516289',
        gstNumber: data.companySettings?.gstNumber || ''
      },
      clientData: {
        name: data.clientCompany?.name || '',
        logoUrl: data.clientCompany?.logoUrl || '',
        billToAddress: data.clientCompany?.billToAddress || '',
        billToCity: data.clientCompany?.billToCity || '',
        billToState: data.clientCompany?.billToState || '',
        billToCountry: data.clientCompany?.billToCountry || '',
        billToZipCode: data.clientCompany?.billToZipCode || '',
        contactPerson: data.clientCompany?.contactPerson || '',
        phoneNumbers: data.clientCompany?.phoneNumbers || [],
        emailAddresses: data.clientCompany?.emailAddresses || []
      },
      timesheetDetails: {
        mondayHours: parseFloat(data.timesheet?.mondayHours?.toString() || '0'),
        tuesdayHours: parseFloat(data.timesheet?.tuesdayHours?.toString() || '0'),
        wednesdayHours: parseFloat(data.timesheet?.wednesdayHours?.toString() || '0'),
        thursdayHours: parseFloat(data.timesheet?.thursdayHours?.toString() || '0'),
        fridayHours: parseFloat(data.timesheet?.fridayHours?.toString() || '0'),
        saturdayHours: parseFloat(data.timesheet?.saturdayHours?.toString() || '0'),
        sundayHours: parseFloat(data.timesheet?.sundayHours?.toString() || '0'),
        regularHours,
        overtimeHours,
        totalRegularAmount: regularAmount,
        totalOvertimeAmount: overtimeAmount
      },
      billingData: {
        hourlyRate: parseFloat(data.billing?.hourlyRate?.toString() || '0'),
        currency: data.billing?.currency || 'INR',
        workingDaysPerWeek: data.billing?.workingDaysPerWeek || 5,
        employmentType: data.billing?.employmentType || 'Subcontract',
        supervisorName: data.billing?.supervisorName || '',
        clientCompanyName: data.clientCompany?.name || '',
        endUserName: data.billing?.endUserId ? `End User ${data.billing.endUserId}` : undefined
      }
    };
  },

  async deleteInvoice(id: number): Promise<void> {
    const result = await db.delete(invoices).where(eq(invoices.id, id));
    if (result.rowCount === 0) {
      throw new Error('Invoice not found');
    }
  },

  // Client Company Management
  async createClientCompany(data: InsertClientCompany): Promise<ClientCompany> {
    const [company] = await db.insert(clientCompanies).values(data).returning();
    return company;
  },

  async getClientCompanyById(id: number): Promise<ClientCompany | undefined> {
    const [company] = await db.select().from(clientCompanies).where(eq(clientCompanies.id, id));
    return company;
  },

  async getAllClientCompanies(params: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
  } = {}): Promise<{ companies: ClientCompany[]; total: number }> {
    const { page = 1, limit = 10, search, active } = params;
    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [];

    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          ilike(clientCompanies.name, searchPattern),
          ilike(clientCompanies.contactPerson, searchPattern)
        )
      );
    }

    if (active !== undefined) {
      whereConditions.push(eq(clientCompanies.isActive, active));
    }

    // Get total count
    const countResult = await db
      .select({ total: count() })
      .from(clientCompanies)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult[0]?.total || 0;

    // Get paginated results
    const companies = await db
      .select()
      .from(clientCompanies)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(clientCompanies.createdAt))
      .limit(limit)
      .offset(offset);

    return { companies, total };
  },

  async updateClientCompany(id: number, data: Partial<InsertClientCompany>): Promise<ClientCompany | undefined> {
    const [company] = await db
      .update(clientCompanies)
      .set(data)
      .where(eq(clientCompanies.id, id))
      .returning();
    return company;
  },

  async deleteClientCompany(id: number): Promise<void> {
    await db.delete(clientCompanies).where(eq(clientCompanies.id, id));
  },

  // Company Settings Management
  async createCompanySettings(data: InsertCompanySettings): Promise<CompanySettings> {
    const [settings] = await db.insert(companySettings).values(data).returning();
    return settings;
  },

  async getCompanySettingsById(id: number): Promise<CompanySettings | undefined> {
    const [settings] = await db.select().from(companySettings).where(eq(companySettings.id, id));
    return settings;
  },

  async getAllCompanySettings(): Promise<CompanySettings[]> {
    return await db.select().from(companySettings).orderBy(desc(companySettings.createdAt));
  },

  async updateCompanySettings(id: number, data: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined> {
    const [settings] = await db
      .update(companySettings)
      .set(data)
      .where(eq(companySettings.id, id))
      .returning();
    return settings;
  },

  async deleteCompanySettings(id: number): Promise<void> {
    await db.delete(companySettings).where(eq(companySettings.id, id));
  },

  // Get client companies with their settings
  async getClientCompaniesWithSettings(params: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
  } = {}): Promise<{ companies: (ClientCompany & { settings?: CompanySettings })[]; total: number }> {
    const { page = 1, limit = 10, search, active } = params;
    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions = [];

    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          ilike(clientCompanies.name, searchPattern),
          ilike(clientCompanies.contactPerson, searchPattern)
        )
      );
    }

    if (active !== undefined) {
      whereConditions.push(eq(clientCompanies.isActive, active));
    }

    // Get total count
    const countResult = await db
      .select({ total: count() })
      .from(clientCompanies)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult[0]?.total || 0;

    // Get paginated results with settings
    const results = await db
      .select({
        company: clientCompanies,
        settings: companySettings,
      })
      .from(clientCompanies)
      .leftJoin(companySettings, eq(clientCompanies.id, companySettings.clientId))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(clientCompanies.createdAt))
      .limit(limit)
      .offset(offset);

    const companies = results.map(result => ({
      ...result.company,
      settings: result.settings || undefined,
    }));

    return { companies, total };
  },

  // Company Settings
  async getCompanySettings(params: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: CompanySettings[]; meta: { total: number; page: number; limit: number; pages: number } }> {
    return await withRetry(async () => {
      const { page = 1, limit = 10, search } = params;
      const offset = (page - 1) * limit;

      let query = db.select().from(companySettings);
      let countQuery = db.select({ count: count() }).from(companySettings);

      // Add search filter
      if (search) {
        const condition = ilike(companySettings.name, `%${search}%`);
        query = query.where(condition);
        countQuery = countQuery.where(condition);
      }

      const [results, totalResults] = await Promise.all([
        query.orderBy(desc(companySettings.isDefault), desc(companySettings.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);

      const total = totalResults[0]?.count || 0;

      return {
        data: results,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    });
  },

  // Bi-Weekly Timesheet Management
  async createBiWeeklyTimesheet(data: InsertBiWeeklyTimesheet): Promise<BiWeeklyTimesheet> {
    const [timesheet] = await db.insert(biWeeklyTimesheets).values(data).returning();
    return timesheet;
  },

  async getBiWeeklyTimesheetById(id: number): Promise<BiWeeklyTimesheet | undefined> {
    const [timesheet] = await db.select().from(biWeeklyTimesheets).where(eq(biWeeklyTimesheets.id, id));
    return timesheet;
  },

  async getBiWeeklyTimesheetsByCandidate(candidateId: number): Promise<BiWeeklyTimesheet[]> {
    return await db
      .select()
      .from(biWeeklyTimesheets)
      .where(eq(biWeeklyTimesheets.candidateId, candidateId))
      .orderBy(desc(biWeeklyTimesheets.periodStartDate));
  },

  async generateBiWeeklyTimesheet(candidateId: number, periodStartDate: Date): Promise<BiWeeklyTimesheet> {
    // Calculate dates for the bi-weekly period
    const periodEndDate = new Date(periodStartDate);
    periodEndDate.setDate(periodStartDate.getDate() + 13); // 14 days total (2 weeks)

    // Week 1 dates
    const week1StartDate = new Date(periodStartDate);
    const week1EndDate = new Date(periodStartDate);
    week1EndDate.setDate(week1StartDate.getDate() + 6); // 7 days

    // Week 2 dates
    const week2StartDate = new Date(week1EndDate);
    week2StartDate.setDate(week1EndDate.getDate() + 1);
    const week2EndDate = new Date(periodEndDate);

    // Get weekly timesheets for this period
    const weeklyTimesheetsData = await db
      .select()
      .from(weeklyTimesheets)
      .where(
        and(
          eq(weeklyTimesheets.candidateId, candidateId),
          eq(weeklyTimesheets.status, 'approved'),
          sql`${weeklyTimesheets.weekStartDate} >= ${week1StartDate.toISOString().split('T')[0]}`,
          sql`${weeklyTimesheets.weekStartDate} <= ${week2StartDate.toISOString().split('T')[0]}`
        )
      );

    // Calculate totals
    let totalHours = 0;
    let totalAmount = 0;
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalRegularAmount = 0;
    let totalOvertimeAmount = 0;
    let week1TotalHours = 0;
    let week1TotalAmount = 0;
    let week1RegularHours = 0;
    let week1OvertimeHours = 0;
    let week1RegularAmount = 0;
    let week1OvertimeAmount = 0;
    let week2TotalHours = 0;
    let week2TotalAmount = 0;
    let week2RegularHours = 0;
    let week2OvertimeHours = 0;
    let week2RegularAmount = 0;
    let week2OvertimeAmount = 0;

    // Day-wise aggregation
    let mondayHours = 0;
    let tuesdayHours = 0;
    let wednesdayHours = 0;
    let thursdayHours = 0;
    let fridayHours = 0;
    let saturdayHours = 0;
    let sundayHours = 0;
    
    // Day-wise overtime aggregation
    let mondayOvertime = 0;
    let tuesdayOvertime = 0;
    let wednesdayOvertime = 0;
    let thursdayOvertime = 0;
    let fridayOvertime = 0;
    let saturdayOvertime = 0;
    let sundayOvertime = 0;

    for (const weeklyTimesheet of weeklyTimesheetsData) {
      const weekTotal = parseFloat(weeklyTimesheet.totalWeeklyHours?.toString() || '0');
      const weekAmount = parseFloat(weeklyTimesheet.totalWeeklyAmount?.toString() || '0');
      const weekRegular = parseFloat(weeklyTimesheet.totalRegularHours?.toString() || '0');
      const weekOvertime = parseFloat(weeklyTimesheet.totalOvertimeHours?.toString() || '0');
      const weekRegularAmount = parseFloat(weeklyTimesheet.totalRegularAmount?.toString() || '0');
      const weekOvertimeAmount = parseFloat(weeklyTimesheet.totalOvertimeAmount?.toString() || '0');

      totalHours += weekTotal;
      totalAmount += weekAmount;
      totalRegularHours += weekRegular;
      totalOvertimeHours += weekOvertime;
      totalRegularAmount += weekRegularAmount;
      totalOvertimeAmount += weekOvertimeAmount;

      // Determine if it's week 1 or week 2
      const weekStart = new Date(weeklyTimesheet.weekStartDate);
      if (weekStart.getTime() === week1StartDate.getTime()) {
        week1TotalHours += weekTotal;
        week1TotalAmount += weekAmount;
        week1RegularHours += weekRegular;
        week1OvertimeHours += weekOvertime;
        week1RegularAmount += weekRegularAmount;
        week1OvertimeAmount += weekOvertimeAmount;
      } else {
        week2TotalHours += weekTotal;
        week2TotalAmount += weekAmount;
        week2RegularHours += weekRegular;
        week2OvertimeHours += weekOvertime;
        week2RegularAmount += weekRegularAmount;
        week2OvertimeAmount += weekOvertimeAmount;
      }

      // Aggregate daily hours
      mondayHours += parseFloat(weeklyTimesheet.mondayHours?.toString() || '0');
      tuesdayHours += parseFloat(weeklyTimesheet.tuesdayHours?.toString() || '0');
      wednesdayHours += parseFloat(weeklyTimesheet.wednesdayHours?.toString() || '0');
      thursdayHours += parseFloat(weeklyTimesheet.thursdayHours?.toString() || '0');
      fridayHours += parseFloat(weeklyTimesheet.fridayHours?.toString() || '0');
      saturdayHours += parseFloat(weeklyTimesheet.saturdayHours?.toString() || '0');
      sundayHours += parseFloat(weeklyTimesheet.sundayHours?.toString() || '0');
      
      // Aggregate daily overtime hours
      mondayOvertime += parseFloat(weeklyTimesheet.mondayOvertime?.toString() || '0');
      tuesdayOvertime += parseFloat(weeklyTimesheet.tuesdayOvertime?.toString() || '0');
      wednesdayOvertime += parseFloat(weeklyTimesheet.wednesdayOvertime?.toString() || '0');
      thursdayOvertime += parseFloat(weeklyTimesheet.thursdayOvertime?.toString() || '0');
      fridayOvertime += parseFloat(weeklyTimesheet.fridayOvertime?.toString() || '0');
      saturdayOvertime += parseFloat(weeklyTimesheet.saturdayOvertime?.toString() || '0');
      sundayOvertime += parseFloat(weeklyTimesheet.sundayOvertime?.toString() || '0');
    }

    // Create bi-weekly timesheet record
    const biWeeklyData: InsertBiWeeklyTimesheet = {
      candidateId,
      periodStartDate: periodStartDate.toISOString().split('T')[0],
      periodEndDate: periodEndDate.toISOString().split('T')[0],
      totalHours: totalHours.toString(),
      totalAmount: totalAmount.toString(),
      totalRegularHours: totalRegularHours.toString(),
      totalOvertimeHours: totalOvertimeHours.toString(),
      totalRegularAmount: totalRegularAmount.toString(),
      totalOvertimeAmount: totalOvertimeAmount.toString(),
      week1StartDate: week1StartDate.toISOString().split('T')[0],
      week1EndDate: week1EndDate.toISOString().split('T')[0],
      week1TotalHours: week1TotalHours.toString(),
      week1TotalAmount: week1TotalAmount.toString(),
      week1RegularHours: week1RegularHours.toString(),
      week1OvertimeHours: week1OvertimeHours.toString(),
      week1RegularAmount: week1RegularAmount.toString(),
      week1OvertimeAmount: week1OvertimeAmount.toString(),
      week2StartDate: week2StartDate.toISOString().split('T')[0],
      week2EndDate: week2EndDate.toISOString().split('T')[0],
      week2TotalHours: week2TotalHours.toString(),
      week2TotalAmount: week2TotalAmount.toString(),
      week2RegularHours: week2RegularHours.toString(),
      week2OvertimeHours: week2OvertimeHours.toString(),
      week2RegularAmount: week2RegularAmount.toString(),
      week2OvertimeAmount: week2OvertimeAmount.toString(),
      mondayHours: mondayHours.toString(),
      tuesdayHours: tuesdayHours.toString(),
      wednesdayHours: wednesdayHours.toString(),
      thursdayHours: thursdayHours.toString(),
      fridayHours: fridayHours.toString(),
      saturdayHours: saturdayHours.toString(),
      sundayHours: sundayHours.toString(),
      mondayOvertime: mondayOvertime.toString(),
      tuesdayOvertime: tuesdayOvertime.toString(),
      wednesdayOvertime: wednesdayOvertime.toString(),
      thursdayOvertime: thursdayOvertime.toString(),
      fridayOvertime: fridayOvertime.toString(),
      saturdayOvertime: saturdayOvertime.toString(),
      sundayOvertime: sundayOvertime.toString(),
      status: 'calculated'
    };

    return await this.createBiWeeklyTimesheet(biWeeklyData);
  },

  async getAllBiWeeklyTimesheets(options: { page?: number; limit?: number; candidateId?: number } = {}): Promise<{ timesheets: any[]; total: number }> {
    const { page = 1, limit = 10, candidateId } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (candidateId) {
      whereConditions.push(eq(biWeeklyTimesheets.candidateId, candidateId));
    }

    const whereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(biWeeklyTimesheets)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated results with candidate information
    const timesheets = await db
      .select({
        id: biWeeklyTimesheets.id,
        candidateId: biWeeklyTimesheets.candidateId,
        candidateName: users.fullName,
        candidateEmail: users.email,
        periodStartDate: biWeeklyTimesheets.periodStartDate,
        periodEndDate: biWeeklyTimesheets.periodEndDate,
        totalHours: biWeeklyTimesheets.totalHours,
        totalAmount: biWeeklyTimesheets.totalAmount,
        week1StartDate: biWeeklyTimesheets.week1StartDate,
        week1EndDate: biWeeklyTimesheets.week1EndDate,
        week1TotalHours: biWeeklyTimesheets.week1TotalHours,
        week1TotalAmount: biWeeklyTimesheets.week1TotalAmount,
        week2StartDate: biWeeklyTimesheets.week2StartDate,
        week2EndDate: biWeeklyTimesheets.week2EndDate,
        week2TotalHours: biWeeklyTimesheets.week2TotalHours,
        week2TotalAmount: biWeeklyTimesheets.week2TotalAmount,
        mondayHours: biWeeklyTimesheets.mondayHours,
        tuesdayHours: biWeeklyTimesheets.tuesdayHours,
        wednesdayHours: biWeeklyTimesheets.wednesdayHours,
        thursdayHours: biWeeklyTimesheets.thursdayHours,
        fridayHours: biWeeklyTimesheets.fridayHours,
        saturdayHours: biWeeklyTimesheets.saturdayHours,
        sundayHours: biWeeklyTimesheets.sundayHours,
        status: biWeeklyTimesheets.status,
        createdAt: biWeeklyTimesheets.createdAt,
        currency: candidateBilling.currency
      })
      .from(biWeeklyTimesheets)
      .leftJoin(users, eq(biWeeklyTimesheets.candidateId, users.id))
      .leftJoin(candidateBilling, eq(biWeeklyTimesheets.candidateId, candidateBilling.candidateId))
      .where(whereCondition)
      .orderBy(desc(biWeeklyTimesheets.periodStartDate))
      .limit(limit)
      .offset(offset);

    return { timesheets, total };
  },

  // Monthly Timesheet Management
  async createMonthlyTimesheet(data: InsertMonthlyTimesheet): Promise<MonthlyTimesheet> {
    const [timesheet] = await db.insert(monthlyTimesheets).values(data).returning();
    return timesheet;
  },

  async getMonthlyTimesheetById(id: number): Promise<MonthlyTimesheet | undefined> {
    const [timesheet] = await db.select().from(monthlyTimesheets).where(eq(monthlyTimesheets.id, id));
    return timesheet;
  },

  async getMonthlyTimesheetsByCandidate(candidateId: number): Promise<MonthlyTimesheet[]> {
    return await db
      .select()
      .from(monthlyTimesheets)
      .where(eq(monthlyTimesheets.candidateId, candidateId))
      .orderBy(desc(monthlyTimesheets.year), desc(monthlyTimesheets.month));
  },

  async generateMonthlyTimesheet(candidateId: number, year: number, month: number): Promise<MonthlyTimesheet> {
    // Calculate dates for the monthly period
    const periodStartDate = new Date(year, month - 1, 1); // First day of month
    const periodEndDate = new Date(year, month, 0); // Last day of month
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = `${monthNames[month - 1]} ${year}`;

    // Get weekly timesheets for this month
    const weeklyTimesheetsData = await db
      .select()
      .from(weeklyTimesheets)
      .where(
        and(
          eq(weeklyTimesheets.candidateId, candidateId),
          eq(weeklyTimesheets.status, 'approved'),
          sql`${weeklyTimesheets.weekStartDate} >= ${periodStartDate.toISOString().split('T')[0]}`,
          sql`${weeklyTimesheets.weekStartDate} <= ${periodEndDate.toISOString().split('T')[0]}`
        )
      );

    // Calculate totals
    let totalHours = 0;
    let totalAmount = 0;
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalRegularAmount = 0;
    let totalOvertimeAmount = 0;
    let totalWeeks = weeklyTimesheetsData.length;

    // Day-wise aggregation
    let mondayHours = 0;
    let tuesdayHours = 0;
    let wednesdayHours = 0;
    let thursdayHours = 0;
    let fridayHours = 0;
    let saturdayHours = 0;
    let sundayHours = 0;
    
    // Day-wise overtime aggregation
    let mondayOvertime = 0;
    let tuesdayOvertime = 0;
    let wednesdayOvertime = 0;
    let thursdayOvertime = 0;
    let fridayOvertime = 0;
    let saturdayOvertime = 0;
    let sundayOvertime = 0;

    for (const weeklyTimesheet of weeklyTimesheetsData) {
      const weekTotal = parseFloat(weeklyTimesheet.totalWeeklyHours?.toString() || '0');
      const weekAmount = parseFloat(weeklyTimesheet.totalWeeklyAmount?.toString() || '0');
      const weekRegular = parseFloat(weeklyTimesheet.totalRegularHours?.toString() || '0');
      const weekOvertime = parseFloat(weeklyTimesheet.totalOvertimeHours?.toString() || '0');
      const weekRegularAmount = parseFloat(weeklyTimesheet.totalRegularAmount?.toString() || '0');
      const weekOvertimeAmount = parseFloat(weeklyTimesheet.totalOvertimeAmount?.toString() || '0');

      totalHours += weekTotal;
      totalAmount += weekAmount;
      totalRegularHours += weekRegular;
      totalOvertimeHours += weekOvertime;
      totalRegularAmount += weekRegularAmount;
      totalOvertimeAmount += weekOvertimeAmount;

      // Aggregate daily hours
      mondayHours += parseFloat(weeklyTimesheet.mondayHours?.toString() || '0');
      tuesdayHours += parseFloat(weeklyTimesheet.tuesdayHours?.toString() || '0');
      wednesdayHours += parseFloat(weeklyTimesheet.wednesdayHours?.toString() || '0');
      thursdayHours += parseFloat(weeklyTimesheet.thursdayHours?.toString() || '0');
      fridayHours += parseFloat(weeklyTimesheet.fridayHours?.toString() || '0');
      saturdayHours += parseFloat(weeklyTimesheet.saturdayHours?.toString() || '0');
      sundayHours += parseFloat(weeklyTimesheet.sundayHours?.toString() || '0');
      
      // Aggregate daily overtime hours
      mondayOvertime += parseFloat(weeklyTimesheet.mondayOvertime?.toString() || '0');
      tuesdayOvertime += parseFloat(weeklyTimesheet.tuesdayOvertime?.toString() || '0');
      wednesdayOvertime += parseFloat(weeklyTimesheet.wednesdayOvertime?.toString() || '0');
      thursdayOvertime += parseFloat(weeklyTimesheet.thursdayOvertime?.toString() || '0');
      fridayOvertime += parseFloat(weeklyTimesheet.fridayOvertime?.toString() || '0');
      saturdayOvertime += parseFloat(weeklyTimesheet.saturdayOvertime?.toString() || '0');
      sundayOvertime += parseFloat(weeklyTimesheet.sundayOvertime?.toString() || '0');
    }

    // Create monthly timesheet record
    const monthlyData: InsertMonthlyTimesheet = {
      candidateId,
      year,
      month,
      monthName,
      periodStartDate: periodStartDate.toISOString().split('T')[0],
      periodEndDate: periodEndDate.toISOString().split('T')[0],
      totalHours: totalHours.toString(),
      totalAmount: totalAmount.toString(),
      totalRegularHours: totalRegularHours.toString(),
      totalOvertimeHours: totalOvertimeHours.toString(),
      totalRegularAmount: totalRegularAmount.toString(),
      totalOvertimeAmount: totalOvertimeAmount.toString(),
      totalWeeks,
      mondayHours: mondayHours.toString(),
      tuesdayHours: tuesdayHours.toString(),
      wednesdayHours: wednesdayHours.toString(),
      thursdayHours: thursdayHours.toString(),
      fridayHours: fridayHours.toString(),
      saturdayHours: saturdayHours.toString(),
      sundayHours: sundayHours.toString(),
      mondayOvertime: mondayOvertime.toString(),
      tuesdayOvertime: tuesdayOvertime.toString(),
      wednesdayOvertime: wednesdayOvertime.toString(),
      thursdayOvertime: thursdayOvertime.toString(),
      fridayOvertime: fridayOvertime.toString(),
      saturdayOvertime: saturdayOvertime.toString(),
      sundayOvertime: sundayOvertime.toString(),
      status: 'calculated'
    };

    return await this.createMonthlyTimesheet(monthlyData);
  },

  async getAllMonthlyTimesheets(options: { page?: number; limit?: number; candidateId?: number } = {}): Promise<{ timesheets: any[]; total: number }> {
    const { page = 1, limit = 10, candidateId } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    
    if (candidateId) {
      whereConditions.push(eq(monthlyTimesheets.candidateId, candidateId));
    }

    const whereCondition = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ count: count() })
      .from(monthlyTimesheets)
      .where(whereCondition);

    const total = countResult[0]?.count || 0;

    // Get paginated results with candidate information
    const timesheets = await db
      .select({
        id: monthlyTimesheets.id,
        candidateId: monthlyTimesheets.candidateId,
        candidateName: users.fullName,
        candidateEmail: users.email,
        year: monthlyTimesheets.year,
        month: monthlyTimesheets.month,
        monthName: monthlyTimesheets.monthName,
        periodStartDate: monthlyTimesheets.periodStartDate,
        periodEndDate: monthlyTimesheets.periodEndDate,
        totalHours: monthlyTimesheets.totalHours,
        totalAmount: monthlyTimesheets.totalAmount,
        totalWeeks: monthlyTimesheets.totalWeeks,
        mondayHours: monthlyTimesheets.mondayHours,
        tuesdayHours: monthlyTimesheets.tuesdayHours,
        wednesdayHours: monthlyTimesheets.wednesdayHours,
        thursdayHours: monthlyTimesheets.thursdayHours,
        fridayHours: monthlyTimesheets.fridayHours,
        saturdayHours: monthlyTimesheets.saturdayHours,
        sundayHours: monthlyTimesheets.sundayHours,
        status: monthlyTimesheets.status,
        createdAt: monthlyTimesheets.createdAt,
        currency: candidateBilling.currency
      })
      .from(monthlyTimesheets)
      .leftJoin(users, eq(monthlyTimesheets.candidateId, users.id))
      .leftJoin(candidateBilling, eq(monthlyTimesheets.candidateId, candidateBilling.candidateId))
      .where(whereCondition)
      .orderBy(desc(monthlyTimesheets.year), desc(monthlyTimesheets.month))
      .limit(limit)
      .offset(offset);

    return { timesheets, total };
  }
};

export async function getJobApplicationsWithDetails(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<{ data: any[], meta: { total: number; page: number; limit: number; pages: number } }> {
  const offset = (page - 1) * limit;

  // Build where conditions
  const whereConditions: any[] = [];

  // Add search condition
  if (search) {
    const searchTerm = search.toLowerCase();
    whereConditions.push(
      or(
        sql`LOWER(${users.fullName}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${users.email}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${users.phone}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${users.location}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${users.skills}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${jobListings.title}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${jobListings.company}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${jobListings.location}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${jobApplications.skills}) LIKE ${`%${searchTerm}%`}`,
        sql`LOWER(${jobApplications.coverLetter}) LIKE ${`%${searchTerm}%`}`,
        // Add application date search
        sql`DATE(${jobApplications.appliedDate}) = ${searchTerm}`,
        sql`STRFTIME('%Y-%m-%d', ${jobApplications.appliedDate}) LIKE ${`%${searchTerm}%`}`,
        sql`STRFTIME('%m/%d/%Y', ${jobApplications.appliedDate}) LIKE ${`%${searchTerm}%`}`,
        sql`STRFTIME('%d/%m/%Y', ${jobApplications.appliedDate}) LIKE ${`%${searchTerm}%`}`
      )
    );
  }

  // Add status condition
  if (status && status !== "all_statuses") {
    whereConditions.push(eq(jobApplications.status, status));
  }

  // Create the where condition
  const whereCondition = whereConditions.length > 0
    ? and(...whereConditions)
    : undefined;

  // Get total count first
  const countQuery = db
    .select({ count: count() })
    .from(jobApplications)
    .leftJoin(users, eq(jobApplications.userId, users.id))
    .leftJoin(jobListings, eq(jobApplications.jobId, jobListings.id))
    .where(whereCondition);

  const totalResult = await countQuery;
  const total = totalResult[0]?.count || 0;

  // Get paginated applications with proper joins
  const applications = await db
    .select({
      id: jobApplications.id,
      jobId: jobApplications.jobId,
      userId: jobApplications.userId,
      status: jobApplications.status,
      coverLetter: jobApplications.coverLetter,
      resumeUrl: jobApplications.resumeUrl,
      experience: jobApplications.experience,
      skills: jobApplications.skills,
      education: jobApplications.education,
      additionalInfo: jobApplications.additionalInfo,
      billRate: jobApplications.billRate,
      payRate: jobApplications.payRate,
      appliedDate: jobApplications.appliedDate,
      lastUpdated: jobApplications.lastUpdated,
      createdAt: jobApplications.createdAt,
      // User data fields directly
      userFullName: users.fullName,      userEmail: users.email,
      userPhone: users.phone,
      userExperience: users.experience,
      userNoticePeriod: users.noticePeriod,
      userCurrentCtc: users.currentCtc,
      userExpectedCtc: users.expectedCtc,
      userLocation: users.location,
      userCity: users.city,
      userCountry: users.country,
      userZipCode: users.zipCode,
      userSkills: users.skills,
      // Job data fields directly
      jobTitle: jobListings.title,
      jobCompany: jobListings.company,
      jobType: jobListings.jobType,
      jobSalary: jobListings.salary,
      jobCategory: jobListings.category,
      jobExperienceLevel: jobListings.experienceLevel,
      jobPostedDate: jobListings.postedDate
    })
    .from(jobApplications)
    .leftJoin(users, eq(jobApplications.userId, users.id))
    .leftJoin(jobListings, eq(jobApplications.jobId, jobListings.id))
    .where(whereCondition)
    .orderBy(desc(jobApplications.appliedDate))
    .limit(limit)
    .offset(offset);

  // Transform the results to match the expected structure
  const transformedApplications = applications.map(app => ({
    id: app.id,
    jobId: app.jobId,
    userId: app.userId,
    status: app.status,
    coverLetter: app.coverLetter,
    resumeUrl: app.resumeUrl,
    experience: app.experience,
    skills: app.skills,
    education: app.education,
    additionalInfo: app.additionalInfo,
    billRate: app.billRate,
    payRate: app.payRate,
    appliedDate: app.appliedDate,
    lastUpdated: app.lastUpdated,
    createdAt: app.createdAt,
    user: {
      id: app.userId,
      fullName: app.userFullName || 'Unknown User',
      email: app.userEmail || '',
      phone: app.userPhone || '',
      experience: app.userExperience || '',
      noticePeriod: app.userNoticePeriod || '',
      currentCtc: app.userCurrentCtc || '',
      expectedCtc: app.userExpectedCtc || '',
      location: app.userLocation || '',
      city: app.userCity || '',
      country: app.userCountry || '',
      zipCode: app.userZipCode || '',
      skills: app.userSkills || ''
    },
    job: {
      id: app.jobId,
      title: app.jobTitle || 'Unknown Job',
      company: app.jobCompany || '',
      location: app.jobLocation || '',
      jobType: app.jobType || '',
      salary: app.jobSalary || '',
      category: app.jobCategory || '',
      experienceLevel: app.jobExperienceLevel || '',
      postedDate: app.jobPostedDate || ''
    }
  }));

  return {
    data: transformedApplications,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

// Client Companies Management
export const createClientCompany = async (data: InsertClientCompany): Promise<ClientCompany> => {
  return await withRetry(async () => {
    const [result] = await db.insert(clientCompanies).values(data).returning();
    return result;
  });
};

export const getClientCompanies = async (params: { page?: number; limit?: number; search?: string; isActive?: boolean } = {}): Promise<{ data: ClientCompany[]; meta: { total: number; page: number; limit: number; pages: number } }> => {
  return await withRetry(async () => {
    const { page = 1, limit = 10, search, isActive } = params;
    const offset = (page - 1) * limit;

    let query = db.select().from(clientCompanies);
    let countQuery = db.select({ count: count() }).from(clientCompanies);

    // Add filters
    const conditions = [];
    if (search) {
      conditions.push(ilike(clientCompanies.name, `%${search}%`));
    }
    if (isActive !== undefined) {
      conditions.push(eq(clientCompanies.isActive, isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    const [results, totalResults] = await Promise.all([
      query.orderBy(desc(clientCompanies.createdAt)).limit(limit).offset(offset),
      countQuery
    ]);

    const total = totalResults[0]?.count || 0;

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

export const getClientCompanyById = async (id: number): Promise<ClientCompany | null> => {
  return await withRetry(async () => {
    const [result] = await db.select().from(clientCompanies).where(eq(clientCompanies.id, id));
    return result || null;
  });
};

export const updateClientCompany = async (id: number, data: Partial<InsertClientCompany>): Promise<ClientCompany | null> => {
  return await withRetry(async () => {
    const [result] = await db.update(clientCompanies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clientCompanies.id, id))
      .returning();
    return result || null;
  });
};

export const deleteClientCompany = async (id: number): Promise<boolean> => {
  return await withRetry(async () => {
    const result = await db.delete(clientCompanies).where(eq(clientCompanies.id, id));
    return result.rowCount > 0;
  });
};

// Company Settings Management
export const createCompanySettings = async (data: InsertCompanySettings): Promise<CompanySettings> => {
  return await withRetry(async () => {
    // If this is set as default, remove default from others
    if (data.isDefault) {
      await db.update(companySettings).set({ isDefault: false }).where(eq(companySettings.isDefault, true));
    }

    const [result] = await db.insert(companySettings).values(data).returning();
    return result;
  });
};

export const getCompanySettings = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: CompanySettings[]; meta: { total: number; page: number; limit: number; pages: number } }> => {
  return await withRetry(async () => {
    const { page = 1, limit = 10, search } = params;
    const offset = (page - 1) * limit;

    let query = db.select().from(companySettings);
    let countQuery = db.select({ count: count() }).from(companySettings);

    // Add search filter
    if (search) {
      const condition = ilike(companySettings.name, `%${search}%`);
      query = query.where(condition);
      countQuery = countQuery.where(condition);
    }

    const [results, totalResults] = await Promise.all([
      query.orderBy(desc(companySettings.isDefault), desc(companySettings.createdAt)).limit(limit).offset(offset),
      countQuery
    ]);

    const total = totalResults[0]?.count || 0;

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  });
};

export const getDefaultCompanySettings = async (): Promise<CompanySettings | null> => {
  return await withRetry(async () => {
    const [result] = await db.select().from(companySettings).where(eq(companySettings.isDefault, true));
    return result || null;
  });
};

export const getCompanySettingsById = async (id: number): Promise<CompanySettings | null> => {
  return await withRetry(async () => {
    const [result] = await db.select().from(companySettings).where(eq(companySettings.id, id));
    return result || null;
  });
};

export const updateCompanySettings = async (id: number, data: Partial<InsertCompanySettings>): Promise<CompanySettings | null> => {
  return await withRetry(async () => {
    // If this is set as default, remove default from others
    if (data.isDefault) {
      await db.update(companySettings).set({ isDefault: false }).where(ne(companySettings.id, id));
    }

    const [result] = await db.update(companySettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companySettings.id, id))
      .returning();
    return result || null;
  });
};

export const deleteCompanySettings = async (id: number): Promise<boolean> => {
  return await withRetry(async () => {
    const result = await db.delete(companySettings).where(eq(companySettings.id, id));
    return result.rowCount > 0;
  });
};

// End Users Management
export const createEndUser = async (data: InsertEndUser): Promise<EndUser> => {
  return await withRetry(async () => {
    const [result] = await db.insert(endUsers).values(data).returning();
    return result;
  });
};

export const getEndUsersByClientCompany = async (clientCompanyId: number): Promise<EndUser[]> => {
  return await withRetry(async () => {
    return await db.select().from(endUsers)
      .where(and(eq(endUsers.clientCompanyId, clientCompanyId), eq(endUsers.isActive, true)))
      .orderBy(asc(endUsers.name));
  });
};

export const getEndUserById = async (id: number): Promise<EndUser | null> => {
  return await withRetry(async () => {
    const [result] = await db.select().from(endUsers).where(eq(endUsers.id, id));
    return result || null;
  });
};

export const updateEndUser = async (id: number, data: Partial<InsertEndUser>): Promise<EndUser | null> => {
  return await withRetry(async () => {
    const [result] = await db.update(endUsers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(endUsers.id, id))
      .returning();
    return result || null;
  });
};

export const deleteEndUser = async (id: number): Promise<boolean> => {
  return await withRetry(async () => {
    const result = await db.delete(endUsers).where(eq(endUsers.id, id));
    return result.rowCount > 0;
  });
};

// Extract end users from submitted candidates data (format: "Company/EndUser")
export const getEndUsersFromSubmittedCandidates = async (clientCompanyName: string): Promise<string[]> => {
  return await withRetry(async () => {
    // Get all submitted candidates with client data
    const results = await db.select({ client: submittedCandidates.client })
      .from(submittedCandidates)
      .where(isNotNull(submittedCandidates.client));
    
    const endUsers: string[] = [];
    
    for (const result of results) {
      if (result.client && result.client.includes('/')) {
        const parts = result.client.split('/');
        const companyPart = parts[0].trim();
        const endUserPart = parts.slice(1).join('/').trim();
        
        // Precise matching algorithm - more strict matching
        const normalizedClientName = clientCompanyName.toLowerCase().trim();
        const normalizedCompanyPart = companyPart.toLowerCase().trim();
        
        // Check for exact match or specific name mappings
        let isMatch = false;
        
        // Exact match first
        if (normalizedCompanyPart === normalizedClientName) {
          isMatch = true;
        }
        // More precise company mappings - check if the selected company name contains the database company name
        else if (normalizedClientName.includes('wimmer') && normalizedCompanyPart === 'wimmer') {
          isMatch = true;
        }
        else if (normalizedClientName.includes('scadea') && normalizedCompanyPart === 'scadea') {
          isMatch = true;
        }
        else if (normalizedClientName.includes('capwave') && normalizedCompanyPart.includes('capwave')) {
          isMatch = true;
        }
        else if (normalizedClientName.includes('kpmg') && normalizedCompanyPart.includes('kpmg')) {
          isMatch = true;
        }
        else if (normalizedClientName.includes('google') && normalizedCompanyPart.includes('google')) {
          isMatch = true;
        }
        
        if (isMatch && endUserPart.length > 0) {
          endUsers.push(endUserPart);
        }
      }
      // Note: We don't process clients without '/' (like "SCADEA") since they have no end users
    }
    
    // Remove duplicates and return
    return [...new Set(endUsers)];
  });
};

// This file includes database utility functions with added methods for user and job retrieval.
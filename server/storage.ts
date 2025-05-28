import { db } from "@db";
import { 
  contactSubmissions, 
  testimonials, 
  clients,
  jobListings,
  jobApplications,
  users,
  submittedCandidates,
  demoRequests,
  InsertContactSubmission,
  ContactSubmission,
  Testimonial,
  Client,
  JobListing,
  InsertJobListing,
  JobApplication,
  InsertJobApplication,
  User,
  InsertUser,
  SubmittedCandidate,
  InsertSubmittedCandidate,
  DemoRequest,
  InsertDemoRequest,
  seoPages,
  seoPageSchema,
  SeoPage,
  InsertSeoPage
} from "@shared/schema";
import { eq, desc, and, like, or, asc, inArray, sql, ilike, count } from "drizzle-orm";

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
      console.log('Applying priority filter:', priority); // Debug log
      switch (priority) {
        case 'urgent':
          whereConditions.push(eq(jobListings.urgent, true));
          console.log('Added urgent filter condition - filtering for urgent = true'); // Debug log
          break;
        case 'priority':
          whereConditions.push(eq(jobListings.priority, true));
          console.log('Added priority filter condition - filtering for priority = true'); // Debug log
          break;
        case 'open':
          whereConditions.push(eq(jobListings.isOpen, true));
          console.log('Added open filter condition - filtering for isOpen = true'); // Debug log
          break;
        case 'featured':
          whereConditions.push(eq(jobListings.featured, true));
          console.log('Added featured filter condition - filtering for featured = true'); // Debug log
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

    console.log('Storage getJobListings called with options:', {
      page, limit, search, category, experienceLevel, jobType, status, featured, priority
    });
    console.log('Where conditions:', whereConditions.length);

    // Count total matching records for pagination
    const result = await db.query.jobListings.findMany({
      where: whereCondition
    });
    const totalCount = result.length;

    console.log('Total jobs found:', totalCount);
    console.log('Jobs status distribution:', result.map(job => ({ id: job.id, status: job.status })));

    // Get paginated job listings
    const jobListingsResult = await db.query.jobListings.findMany({
      where: whereCondition,
      orderBy: [desc(jobListings.featured), desc(jobListings.postedDate)],
      limit,
      offset: (page - 1) * limit,
    });

    console.log('Query results count:', jobListingsResult.length);
    console.log('Priority filter results:', jobListingsResult.map(job => ({
      id: job.id,
      title: job.title,
      urgent: job.urgent,
      priority: job.priority,
      isOpen: job.isOpen,
      featured: job.featured
    })));

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
    return await db.query.users.findFirst({
      where: eq(users.id, id)
    });
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.username, username)
    });
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.email, email)
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
  async getAllSeoPages(): Promise<SeoPage[]> {
    return db.query.seoPages.findMany({
      orderBy: asc(seoPages.pagePath)
    });
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
      console.log(`SEO page updated for ${pagePath} with ${recentJobs.length} recent jobs`);

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
}
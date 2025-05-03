import { db } from "@db";
import { 
  contactSubmissions, 
  testimonials, 
  clients, 
  InsertContactSubmission,
  ContactSubmission,
  Testimonial,
  Client
} from "@shared/schema";
import { eq } from "drizzle-orm";

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
  }
};

import { db } from "./index";
import { testimonials, clients } from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");
    
    // Seed testimonials
    console.log("Seeding testimonials...");
    const testimonialsData = [
      {
        name: "Michael Johnson",
        role: "CTO",
        company: "TechCorp",
        quote: "Andela helped us scale our engineering team quickly with top talent. The quality of developers and their integration into our team has been seamless.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Sarah Williams",
        role: "Software Engineer",
        company: "",
        quote: "Joining Andela was the best career decision I've made. I've worked with amazing teams on challenging projects, all while growing professionally.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "David Chen",
        role: "VP of Engineering",
        company: "InnovateX",
        quote: "The talent we've accessed through Andela has been exceptional. Their team understood our needs and matched us with perfect candidates.",
        rating: 4,
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80"
      }
    ];
    
    // Check if testimonials already exist
    const existingTestimonials = await db.query.testimonials.findMany();
    if (existingTestimonials.length === 0) {
      await db.insert(testimonials).values(testimonialsData);
      console.log(`Added ${testimonialsData.length} testimonials`);
    } else {
      console.log("Testimonials already exist, skipping seeding");
    }
    
    // Seed clients
    console.log("Seeding clients...");
    const clientsData = [
      {
        name: "Microsoft",
        logo: "https://via.placeholder.com/150x60?text=Microsoft"
      },
      {
        name: "Goldman Sachs",
        logo: "https://via.placeholder.com/150x60?text=Goldman+Sachs"
      },
      {
        name: "JP Morgan",
        logo: "https://via.placeholder.com/150x60?text=JP+Morgan"
      },
      {
        name: "ViacomCBS",
        logo: "https://via.placeholder.com/150x60?text=ViacomCBS"
      },
      {
        name: "GitHub",
        logo: "https://via.placeholder.com/150x60?text=GitHub"
      },
      {
        name: "Coursera",
        logo: "https://via.placeholder.com/150x60?text=Coursera"
      }
    ];
    
    // Check if clients already exist
    const existingClients = await db.query.clients.findMany();
    if (existingClients.length === 0) {
      await db.insert(clients).values(clientsData);
      console.log(`Added ${clientsData.length} clients`);
    } else {
      console.log("Clients already exist, skipping seeding");
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();

import { db, pool } from "./index";
import { testimonials, clients, jobListings, users, contactSubmissions, jobApplications, submittedCandidates, demoRequests } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seeding...");
    await pool.query('SELECT 1'); // Test connection

    // Create tables
    console.log("Creating tables if they don't exist...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        experience TEXT,
        notice_period TEXT,
        current_ctc TEXT,
        expected_ctc TEXT,
        skills TEXT,
        location TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        zip_code TEXT,
        resume_url TEXT,
        last_logout TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        session_id TEXT NOT NULL UNIQUE,
        session_data TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT,
        quote TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS job_listings (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        job_type TEXT NOT NULL,
        experience_level TEXT NOT NULL,
        salary TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        benefits TEXT,
        application_url TEXT,
        contact_email TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        featured BOOLEAN NOT NULL DEFAULT false,
        posted_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expiry_date TIMESTAMP,
        category TEXT NOT NULL,
        skills TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL REFERENCES job_listings(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        cover_letter TEXT,
        resume_url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        experience TEXT,
        skills TEXT NOT NULL,
        education TEXT,
        additional_info TEXT,
        bill_rate TEXT,
        pay_rate TEXT,
        applied_date TIMESTAMP NOT NULL DEFAULT NOW(),
        last_updated TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS submitted_candidates (
        id SERIAL PRIMARY KEY,
        submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
        sourced_by TEXT NOT NULL,
        client TEXT NOT NULL,
        poc TEXT NOT NULL,
        skills TEXT NOT NULL,
        candidate_name TEXT NOT NULL,
        contact_no TEXT NOT NULL,
        email_id TEXT NOT NULL,
        experience TEXT NOT NULL,
        notice_period TEXT NOT NULL,
        location TEXT NOT NULL,
        current_ctc TEXT NOT NULL,
        expected_ctc TEXT NOT NULL,
        bill_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
        pay_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
        margin_per_hour DECIMAL(10,2) NOT NULL DEFAULT 0,
        profit_per_month DECIMAL(10,2) NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'new',
        salary_in_lacs DECIMAL(10,2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS demo_requests (
        id SERIAL PRIMARY KEY,
        work_email TEXT NOT NULL UNIQUE,
        phone_number TEXT NOT NULL,
        message TEXT,
        company_name TEXT,
        full_name TEXT,
        job_title TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        accepted_terms BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        scheduled_date TIMESTAMP,
        admin_notes TEXT
      );
    `);

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

    // Seed job listings
    console.log("Seeding job listings...");
    const jobListingsData = [
      {
        title: "Senior React Developer",
        company: "Andela",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Senior",
        salary: "$120,000 - $150,000",
        description: "We are looking for a Senior React Developer to join our team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows. You will also be responsible for profiling and improving front-end performance and documenting our front-end codebase.",
        requirements: "5+ years of experience with React.js\nStrong proficiency in JavaScript, including DOM manipulation and the JavaScript object model\nThorough understanding of React.js and its core principles\nExperience with popular React.js workflows (such as Flux or Redux)\nExperience with data structure libraries (e.g., Immutable.js)\nKnowledge of isomorphic React is a plus\nFamiliarity with RESTful APIs\nKnowledge of modern authorization mechanisms, such as JSON Web Token\nFamiliarity with modern front-end build pipelines and tools",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@andela.com",
        status: "active",
        featured: true,
        postedDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: "Engineering",
        skills: "React, JavaScript, TypeScript, Redux, GraphQL",
      },
      {
        title: "Product Manager",
        company: "Andela",
        location: "New York, NY",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$100,000 - $130,000",
        description: "We are seeking a talented Product Manager to join our team. In this role, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product and customer requirements, defining the product vision, and working closely with engineering, sales, marketing and support to ensure revenue and customer satisfaction goals are met.",
        requirements: "3+ years of experience in Product Management\nProven ability to develop product strategies and effectively communicate recommendations to executive management\nStrong problem-solving skills and willingness to roll up one's sleeves to get the job done\nSkilled at working effectively with cross-functional teams in a matrix organization\nExcellent written and verbal communication skills\nMS/BS degree in Computer Science, Engineering or equivalent preferred",
        benefits: "Competitive salary\nFlexible work hours\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@andela.com",
        status: "active",
        featured: false,
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        category: "Product",
        skills: "Product Management, Agile, UX, User Research, Roadmapping",
      },
      {
        title: "DevOps Engineer",
        company: "Andela",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$110,000 - $140,000",
        description: "We are looking for a DevOps Engineer to help us build and maintain our infrastructure. You will be responsible for the availability, performance, and scalability of our production systems. You will also be responsible for implementing automation to make our infrastructure more reliable and easier to manage.",
        requirements: "3+ years of experience in a DevOps role\nStrong knowledge of Linux/Unix administration\nExperience with cloud services (AWS, Azure, or GCP)\nFamiliarity with infrastructure as code tools (Terraform, CloudFormation)\nExperience with containerization (Docker, Kubernetes)\nUnderstanding of CI/CD pipelines\nKnowledge of monitoring tools (Prometheus, Grafana, ELK stack)\nFamiliarity with scripting languages (Python, Bash)",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@andela.com",
        status: "active",
        featured: true,
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        category: "Engineering",
        skills: "AWS, Docker, Kubernetes, Terraform, CI/CD, Linux",
      },
      {
        title: "UX/UI Designer",
        company: "Andela",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$90,000 - $120,000",
        description: "We are looking for a UX/UI Designer to turn our software into easy-to-use products for our clients. You will be responsible for the user experience design of our products. Your work will include gathering user requirements, designing graphic elements and building navigation components.",
        requirements: "3+ years of experience in UX/UI design\nProven experience as a UI/UX Designer or similar role\nPortfolio of design projects\nKnowledge of wireframe tools (e.g. Figma, Sketch, Adobe XD)\nUp-to-date knowledge of design software like Adobe Illustrator and Photoshop\nTeam spirit; strong communication skills to collaborate with various stakeholders\nCreative thinking",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@andela.com",
        status: "active",
        featured: false,
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
        category: "Design",
        skills: "UI, UX, Figma, Sketch, Adobe XD, Design Systems",
      },
    ];
    
    // Check if job listings already exist
    const existingJobListings = await db.query.jobListings.findMany();
    if (existingJobListings.length === 0) {
      await db.insert(jobListings).values(jobListingsData);
      console.log(`Added ${jobListingsData.length} job listings`);
    } else {
      console.log("Job listings already exist, skipping seeding");
    }

    // Seed admin user in users table
    console.log("Seeding admin user...");
    const adminPassword = "admin123"; // Default admin password
    const hashedPassword = await hashPassword(adminPassword);

    // Check if admin user exists
    const existingUser = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.username, "admin")
    });

    if (!existingUser) {
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        email: "admin@niddik.com",
        fullName: "Niddik Admin",
        role: "admin",
      });

      console.log(`Added admin user with username: admin and password: ${adminPassword}`);
      console.log("IMPORTANT: Change this password after first login for security!");
    } else {
      console.log("Admin user already exists, skipping seeding.");
    }

    console.log("Seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
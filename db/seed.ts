import { db, pool } from "./index";
import { testimonials, clients, jobListings, users, contactSubmissions, jobApplications, submittedCandidates, demoRequests, seoPages } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";

// Add ilike import for the contact submissions query
function ilike(column: any, pattern: string) {
  return sql`${column} ILIKE ${pattern}`;
}

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

      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT NOT NULL,
        interest TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
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
        urgent BOOLEAN NOT NULL DEFAULT false,
        priority BOOLEAN NOT NULL DEFAULT false,
        is_open BOOLEAN NOT NULL DEFAULT false,
        posted_date TEXT NOT NULL,
        expiry_date TEXT,
        category TEXT NOT NULL,
        skills TEXT NOT NULL
      );

      -- Add missing columns if they don't exist
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_listings' AND column_name = 'urgent') THEN
          ALTER TABLE job_listings ADD COLUMN urgent BOOLEAN NOT NULL DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_listings' AND column_name = 'priority') THEN
          ALTER TABLE job_listings ADD COLUMN priority BOOLEAN NOT NULL DEFAULT false;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_listings' AND column_name = 'is_open') THEN
          ALTER TABLE job_listings ADD COLUMN is_open BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;

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

      CREATE TABLE IF NOT EXISTS seo_pages (
        id SERIAL PRIMARY KEY,
        page_path TEXT NOT NULL UNIQUE,
        page_title TEXT NOT NULL,
        meta_description TEXT NOT NULL,
        meta_keywords TEXT,
        og_title TEXT,
        og_description TEXT,
        og_image TEXT,
        og_type TEXT NOT NULL DEFAULT 'website',
        og_url TEXT,
        twitter_card TEXT NOT NULL DEFAULT 'summary_large_image',
        twitter_site TEXT,
        twitter_title TEXT,
        twitter_description TEXT,
        twitter_image TEXT,
        twitter_creator TEXT,
        canonical_url TEXT,
        robots_directive TEXT NOT NULL DEFAULT 'index,follow',
        structured_data TEXT,
        itemprop_name TEXT,
        itemprop_description TEXT,
        itemprop_image TEXT,
        head_scripts TEXT,
        body_scripts TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Add missing columns if they don't exist
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'seo_pages' AND column_name = 'head_scripts') THEN
          ALTER TABLE seo_pages ADD COLUMN head_scripts TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'seo_pages' AND column_name = 'body_scripts') THEN
          ALTER TABLE seo_pages ADD COLUMN body_scripts TEXT;
        END IF;

        -- Migrate data from old columns if they exist
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'seo_pages' AND column_name = 'head_script') THEN
          UPDATE seo_pages SET head_scripts = head_script WHERE head_script IS NOT NULL;
          ALTER TABLE seo_pages DROP COLUMN IF EXISTS head_script;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'seo_pages' AND column_name = 'body_script') THEN
          UPDATE seo_pages SET body_scripts = body_script WHERE body_script IS NOT NULL;
          ALTER TABLE seo_pages DROP COLUMN IF EXISTS body_script;
        END IF;
      END $$;
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
        company: "Niddik",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Senior",
        salary: "$120,000 - $150,000",
        description: "We are looking for a Senior React Developer to join our team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows. You will also be responsible for profiling and improving front-end performance and documenting our front-end codebase.",
        requirements: "5+ years of experience with React.js\nStrong proficiency in JavaScript, including DOM manipulation and the JavaScript object model\nThorough understanding of React.js and its core principles\nExperience with popular React.js workflows (such as Flux or Redux)\nExperience with data structure libraries (e.g., Immutable.js)\nKnowledge of isomorphic React is a plus\nFamiliarity with RESTful APIs\nKnowledge of modern authorization mechanisms, such as JSON Web Token\nFamiliarity with modern front-end build pipelines and tools",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@niddik.com",
        status: "active",
        featured: true,
        urgent: false,
        priority: true,
        isOpen: true,
        postedDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: "Web, Mobile, & Software Development",
        skills: "React, JavaScript, TypeScript, Redux, GraphQL",
      },
      {
        title: "Product Manager",
        company: "Niddik",
        location: "New York, NY",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$100,000 - $130,000",
        description: "We are seeking a talented Product Manager to join our team. In this role, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product and customer requirements, defining the product vision, and working closely with engineering, sales, marketing and support to ensure revenue and customer satisfaction goals are met.",
        requirements: "3+ years of experience in Product Management\nProven ability to develop product strategies and effectively communicate recommendations to executive management\nStrong problem-solving skills and willingness to roll up one's sleeves to get the job done\nSkilled at working effectively with cross-functional teams in a matrix organization\nExcellent written and verbal communication skills\nMS/BS degree in Computer Science, Engineering or equivalent preferred",
        benefits: "Competitive salary\nFlexible work hours\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@niddik.com",
        status: "active",
        featured: false,
        urgent: true,
        priority: false,
        isOpen: true,
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        category: "Product",
        skills: "Product Management, Agile, UX, User Research, Roadmapping",
      },
      {
        title: "DevOps Engineer",
        company: "Niddik",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$110,000 - $140,000",
        description: "We are looking for a DevOps Engineer to help us build and maintain our infrastructure. You will be responsible for the availability, performance, and scalability of our production systems. You will also be responsible for implementing automation to make our infrastructure more reliable and easier to manage.",
        requirements: "3+ years of experience in a DevOps role\nStrong knowledge of Linux/Unix administration\nExperience with cloud services (AWS, Azure, or GCP)\nFamiliarity with infrastructure as code tools (Terraform, CloudFormation)\nExperience with containerization (Docker, Kubernetes)\nUnderstanding of CI/CD pipelines\nKnowledge of monitoring tools (Prometheus, Grafana, ELK stack)\nFamiliarity with scripting languages (Python, Bash)",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@niddik.com",
        status: "active",
        featured: true,
        urgent: false,
        priority: true,
        isOpen: false,
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        category: "IT & Networking",
        skills: "AWS, Docker, Kubernetes, Terraform, CI/CD, Linux",
      },
      {
        title: "UX/UI Designer",
        company: "Niddik",
        location: "Remote",
        jobType: "Full-time",
        experienceLevel: "Mid",
        salary: "$90,000 - $120,000",
        description: "We are looking for a UX/UI Designer to turn our software into easy-to-use products for our clients. You will be responsible for the user experience design of our products. Your work will include gathering user requirements, designing graphic elements and building navigation components.",
        requirements: "3+ years of experience in UX/UI design\nProven experience as a UI/UX Designer or similar role\nPortfolio of design projects\nKnowledge of wireframe tools (e.g. Figma, Sketch, Adobe XD)\nUp-to-date knowledge of design software like Adobe Illustrator and Photoshop\nTeam spirit; strong communication skills to collaborate with various stakeholders\nCreative thinking",
        benefits: "Competitive salary\nFlexible work hours\nRemote work\nHealth insurance\nPaid time off\n401(k) matching",
        applicationUrl: "https://example.com/apply",
        contactEmail: "careers@niddik.com",
        status: "active",
        featured: false,
        urgent: true,
        priority: false,
        isOpen: true,
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

    // Seed contact submissions
    console.log("Seeding contact submissions...");
    const contactSubmissionsData = [
      {
        fullName: "John Smith",
        email: "john.smith@techcorp.com",
        company: "TechCorp Solutions",
        interest: "Full RPO"
      },
      {
        fullName: "Sarah Johnson",
        email: "sarah.j@innovatetech.com",
        company: "InnovateTech",
        interest: "On-Demand"
      },
      {
        fullName: "Michael Brown",
        email: "m.brown@digitalstartup.com",
        company: "Digital Startup Inc",
        interest: "Hybrid RPO"
      },
      {
        fullName: "Emily Davis",
        email: "emily.davis@healthtech.com",
        company: "HealthTech Solutions",
        interest: "Contingent"
      },
      {
        fullName: "David Wilson",
        email: "d.wilson@financeplus.com",
        company: "Finance Plus",
        interest: "Web App Solutions"
      }
    ];

    // Check if contact submissions already exist
    const existingContactSubmissions = await db.query.contactSubmissions.findMany();
    if (existingContactSubmissions.length === 0) {
      await db.insert(contactSubmissions).values(contactSubmissionsData);
      console.log(`Added ${contactSubmissionsData.length} contact submissions`);
    } else {
      console.log("Contact submissions already exist, skipping seeding");
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

    // Seed SEO pages with default data
    console.log("Seeding SEO pages...");
    const seoPageData = [
      {
        pagePath: "/",
        pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
        metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies. Expert RPO, contingent staffing, and web development services.",
        metaKeywords: "IT recruitment, staffing solutions, RPO, contingent staffing, web development, tech talent",
        ogTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
        ogDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-og-home.jpg",
        ogType: "website",
        ogUrl: "https://niddik.com",
        twitterCard: "summary_large_image",
        twitterSite: "@niddik",
        twitterTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
        twitterDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
        twitterImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-twitter-home.jpg",
        twitterCreator: "@niddik",
        canonicalUrl: "https://niddik.com",
        robotsDirective: "index,follow",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Niddik",
          "url": "https://niddik.com",
          "logo": "https://niddik.com/images/niddik_logo.png",
          "description": "Premier IT recruitment and staffing solutions provider",
          "sameAs": ["https://twitter.com/niddik", "https://linkedin.com/company/niddik"],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "customer service"
          }
        }),
        itemPropName: "Niddik - Premier IT Recruitment & Staffing Solutions",
        itemPropDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
        itemPropImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-itemprop-home.jpg"
      },
      {
        pagePath: "/landing",
        pageTitle: "Niddik Landing - IT Recruitment Solutions",
        metaDescription: "Explore Niddik's comprehensive IT recruitment and staffing solutions. Connecting exceptional talent with innovative companies worldwide.",
        metaKeywords: "IT recruitment, tech staffing, landing page, talent solutions",
        ogTitle: "Niddik Landing - IT Recruitment Solutions",
        ogDescription: "Explore Niddik's comprehensive IT recruitment and staffing solutions.",
        canonicalUrl: "https://niddik.com/landing"
      },
      {
        pagePath: "/services",
        pageTitle: "IT Recruitment Services - RPO, Staffing & More | Niddik",
        metaDescription: "Comprehensive IT recruitment services including RPO, contingent staffing, permanent placement, and web development solutions. Expert talent acquisition.",
        metaKeywords: "IT recruitment services, RPO, contingent staffing, permanent placement, talent acquisition",
        ogTitle: "IT Recruitment Services - RPO, Staffing & More",
        ogDescription: "Comprehensive IT recruitment services including RPO, contingent staffing, permanent placement, and web development solutions.",
        canonicalUrl: "https://niddik.com/services",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "IT Recruitment Services",
          "provider": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Comprehensive IT recruitment and staffing services"
        })
      },
      {
        pagePath: "/web-app-solutions",
        pageTitle: "Web App Development Solutions | Niddik",
        metaDescription: "Custom web application development solutions. Expert developers for React, Node.js, and full-stack development projects.",
        metaKeywords: "web app development, custom software, React, Node.js, full-stack development",
        ogTitle: "Web App Development Solutions | Niddik",
        ogDescription: "Custom web application development solutions. Expert developers for React, Node.js, and full-stack development projects.",
        canonicalUrl: "https://niddik.com/web-app-solutions"
      },
      {
        pagePath: "/adaptive-hiring",
        pageTitle: "Adaptive Hiring Solutions | Niddik",
        metaDescription: "Innovative adaptive hiring strategies for modern businesses. Flexible recruitment approaches tailored to your company's needs.",
        metaKeywords: "adaptive hiring, flexible recruitment, hiring strategies, talent acquisition",
        ogTitle: "Adaptive Hiring Solutions | Niddik",
        ogDescription: "Innovative adaptive hiring strategies for modern businesses.",
        canonicalUrl: "https://niddik.com/adaptive-hiring"
      },
      {
        pagePath: "/adaptive-hiring-fixed",
        pageTitle: "Fixed Adaptive Hiring Model | Niddik",
        metaDescription: "Structured adaptive hiring solutions with fixed parameters. Predictable and efficient recruitment processes.",
        metaKeywords: "fixed hiring model, structured recruitment, adaptive hiring",
        ogTitle: "Fixed Adaptive Hiring Model | Niddik",
        ogDescription: "Structured adaptive hiring solutions with fixed parameters.",
        canonicalUrl: "https://niddik.com/adaptive-hiring-fixed"
      },
      {
        pagePath: "/whitepaper",
        pageTitle: "Recruitment Industry Whitepapers | Niddik",
        metaDescription: "Access industry-leading whitepapers on recruitment trends, hiring strategies, and talent acquisition best practices.",
        metaKeywords: "recruitment whitepaper, hiring trends, talent acquisition research",
        ogTitle: "Recruitment Industry Whitepapers | Niddik",
        ogDescription: "Access industry-leading whitepapers on recruitment trends and hiring strategies.",
        canonicalUrl: "https://niddik.com/whitepaper"
      },
      {
        pagePath: "/insights",
        pageTitle: "IT Recruitment Insights & Industry Analysis | Niddik",
        metaDescription: "Latest insights on IT recruitment trends, market analysis, and industry developments. Stay ahead with expert perspectives.",
        metaKeywords: "IT recruitment insights, market trends, industry analysis, hiring trends",
        ogTitle: "IT Recruitment Insights & Industry Analysis | Niddik",
        ogDescription: "Latest insights on IT recruitment trends, market analysis, and industry developments.",
        canonicalUrl: "https://niddik.com/insights"
      },
      {
        pagePath: "/facts-and-trends",
        pageTitle: "Recruitment Facts & Industry Trends | Niddik",
        metaDescription: "Discover key facts and emerging trends in the recruitment industry. Data-driven insights for better hiring decisions.",
        metaKeywords: "recruitment facts, industry trends, hiring statistics, market data",
        ogTitle: "Recruitment Facts & Industry Trends | Niddik",
        ogDescription: "Discover key facts and emerging trends in the recruitment industry.",
        canonicalUrl: "https://niddik.com/facts-and-trends"
      },
      {
        pagePath: "/hiring-advice",
        pageTitle: "Expert Hiring Advice & Best Practices | Niddik",
        metaDescription: "Professional hiring advice from recruitment experts. Learn best practices for effective talent acquisition and team building.",
        metaKeywords: "hiring advice, recruitment tips, best practices, talent acquisition",
        ogTitle: "Expert Hiring Advice & Best Practices | Niddik",
        ogDescription: "Professional hiring advice from recruitment experts.",
        canonicalUrl: "https://niddik.com/hiring-advice"
      },
      {
        pagePath: "/corporate-social-responsibilities",
        pageTitle: "Corporate Social Responsibility | Niddik",
        metaDescription: "Learn about Niddik's commitment to corporate social responsibility, community engagement, and sustainable business practices.",
        metaKeywords: "corporate social responsibility, CSR, community engagement, sustainability",
        ogTitle: "Corporate Social Responsibility | Niddik",
        ogDescription: "Learn about Niddik's commitment to corporate social responsibility and community engagement.",
        canonicalUrl: "https://niddik.com/corporate-social-responsibilities"
      },
      {
        pagePath: "/career-advice",
        pageTitle: "IT Career Advice & Development Tips | Niddik",
        metaDescription: "Expert career advice for IT professionals. Tips on career development, skill building, and advancing in technology roles.",
        metaKeywords: "career advice, IT careers, professional development, tech career tips",
        ogTitle: "IT Career Advice & Development Tips | Niddik",
        ogDescription: "Expert career advice for IT professionals and technology careers.",
        canonicalUrl: "https://niddik.com/career-advice"
      },
      {
        pagePath: "/six-factor-recruiting-model",
        pageTitle: "Six Factor Recruiting Model | Niddik",
        metaDescription: "Learn about Niddik's proprietary six factor recruiting model for effective talent acquisition and candidate matching.",
        metaKeywords: "six factor model, recruiting methodology, talent acquisition strategy",
        ogTitle: "Six Factor Recruiting Model | Niddik",
        ogDescription: "Learn about Niddik's proprietary six factor recruiting model.",
        canonicalUrl: "https://niddik.com/six-factor-recruiting-model"
      },
      {
        pagePath: "/agile-approach-based-recruiting",
        pageTitle: "Agile Approach Based Recruiting | Niddik",
        metaDescription: "Discover how agile methodologies enhance recruitment processes. Flexible, iterative approaches to talent acquisition.",
        metaKeywords: "agile recruiting, agile methodology, flexible hiring, iterative recruitment",
        ogTitle: "Agile Approach Based Recruiting | Niddik",
        ogDescription: "Discover how agile methodologies enhance recruitment processes.",
        canonicalUrl: "https://niddik.com/agile-approach-based-recruiting"
      },
      {
        pagePath: "/community-involvement",
        pageTitle: "Community Involvement & Engagement | Niddik",
        metaDescription: "Explore Niddik's community involvement initiatives, partnerships, and commitment to giving back to the tech community.",
        metaKeywords: "community involvement, tech community, partnerships, social impact",
        ogTitle: "Community Involvement & Engagement | Niddik",
        ogDescription: "Explore Niddik's community involvement initiatives and partnerships.",
        canonicalUrl: "https://niddik.com/community-involvement"
      },
      {
        pagePath: "/partners/it",
        pageTitle: "IT Partners & Technology Alliances | Niddik",
        metaDescription: "Meet our IT partners and technology alliances. Strategic partnerships that enhance our recruitment capabilities.",
        metaKeywords: "IT partners, technology alliances, strategic partnerships, tech companies",
        ogTitle: "IT Partners & Technology Alliances | Niddik",
        ogDescription: "Meet our IT partners and technology alliances.",
        canonicalUrl: "https://niddik.com/partners/it"
      },
      {
        pagePath: "/partners/non-it",
        pageTitle: "Non-IT Partners & Business Alliances | Niddik",
        metaDescription: "Explore our non-IT partnerships and business alliances that support comprehensive recruitment solutions.",
        metaKeywords: "non-IT partners, business alliances, partnerships, recruitment support",
        ogTitle: "Non-IT Partners & Business Alliances | Niddik",
        ogDescription: "Explore our non-IT partnerships and business alliances.",
        canonicalUrl: "https://niddik.com/partners/non-it"
      },
      {
        pagePath: "/partners/healthcare",
        pageTitle: "Healthcare Partners & Medical IT Recruitment | Niddik",
        metaDescription: "Specialized healthcare IT recruitment through our healthcare partners. Medical technology talent solutions.",
        metaKeywords: "healthcare partners, medical IT, healthcare technology, medical recruitment",
        ogTitle: "Healthcare Partners & Medical IT Recruitment | Niddik",
        ogDescription: "Specialized healthcare IT recruitment through our healthcare partners.",
        canonicalUrl: "https://niddik.com/partners/healthcare"
      },
      {
        pagePath: "/search",
        pageTitle: "Search Jobs & Opportunities | Niddik",
        metaDescription: "Search for IT jobs and career opportunities. Find your next role with top technology companies through Niddik.",
        metaKeywords: "job search, IT jobs, career opportunities, tech jobs, job listings",
        ogTitle: "Search Jobs & Opportunities | Niddik",
        ogDescription: "Search for IT jobs and career opportunities with top technology companies.",
        canonicalUrl: "https://niddik.com/search"
      },
      {
        pagePath: "/clients",
        pageTitle: "Our Clients & Success Stories | Niddik",
        metaDescription: "Meet our clients and discover their success stories. Leading companies trust Niddik for their IT recruitment needs.",
        metaKeywords: "clients, success stories, case studies, customer testimonials",
        ogTitle: "Our Clients & Success Stories | Niddik",
        ogDescription: "Meet our clients and discover their success stories.",
        canonicalUrl: "https://niddik.com/clients"
      },
      {
        pagePath: "/testimonials",
        pageTitle: "Client Testimonials & Reviews | Niddik",
        metaDescription: "Read testimonials and reviews from satisfied clients and candidates. See why companies choose Niddik for IT recruitment.",
        metaKeywords: "testimonials, reviews, client feedback, candidate reviews",
        ogTitle: "Client Testimonials & Reviews | Niddik",
        ogDescription: "Read testimonials and reviews from satisfied clients and candidates.",
        canonicalUrl: "https://niddik.com/testimonials"
      },
      {
        pagePath: "/contact",
        pageTitle: "Contact Niddik - Get In Touch With Our Recruitment Experts",
        metaDescription: "Contact Niddik's recruitment experts today. Get personalized IT staffing solutions and connect with top talent. Reach out for all your hiring needs.",
        metaKeywords: "contact niddik, recruitment experts, IT staffing, hiring solutions, get in touch",
        ogTitle: "Contact Niddik - Get In Touch With Our Recruitment Experts",
        ogDescription: "Contact Niddik's recruitment experts today. Get personalized IT staffing solutions and connect with top talent.",
        canonicalUrl: "https://niddik.com/contact",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Niddik"
        })
      },
      {
        pagePath: "/privacy-policy",
        pageTitle: "Privacy Policy | Niddik",
        metaDescription: "Read Niddik's privacy policy to understand how we collect, use, and protect your personal information.",
        metaKeywords: "privacy policy, data protection, personal information, GDPR compliance",
        ogTitle: "Privacy Policy | Niddik",
        ogDescription: "Read Niddik's privacy policy to understand how we protect your personal information.",
        canonicalUrl: "https://niddik.com/privacy-policy"
      },
      {
        pagePath: "/terms-of-service",
        pageTitle: "Terms of Service | Niddik",
        metaDescription: "Read Niddik's terms of service and understand the conditions for using our recruitment platform and services.",
        metaKeywords: "terms of service, legal terms, service conditions, user agreement",
        ogTitle: "Terms of Service | Niddik",
        ogDescription: "Read Niddik's terms of service and service conditions.",
        canonicalUrl: "https://niddik.com/terms-of-service"
      },
      {
        pagePath: "/cookie-policy",
        pageTitle: "Cookie Policy | Niddik",
        metaDescription: "Learn about Niddik's cookie policy and how we use cookies to improve your browsing experience.",
        metaKeywords: "cookie policy, cookies, website tracking, user experience",
        ogTitle: "Cookie Policy | Niddik",
        ogDescription: "Learn about Niddik's cookie policy and how we use cookies.",
        canonicalUrl: "https://niddik.com/cookie-policy"
      },
      {
        pagePath: "/about-us",
        pageTitle: "About Niddik - Leading IT Recruitment Company",
        metaDescription: "Learn about Niddik's mission to connect exceptional IT talent with innovative companies. Our experienced team delivers personalized recruitment solutions.",
        metaKeywords: "about niddik, IT recruitment company, tech staffing, our mission, team",
        ogTitle: "About Niddik - Leading IT Recruitment Company",
        ogDescription: "Learn about Niddik's mission to connect exceptional IT talent with innovative companies.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-og-about.jpg",
        canonicalUrl: "https://niddik.com/about-us",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Niddik",
          "description": "Learn about Niddik's mission to connect exceptional IT talent with innovative companies."
        })
      },
      {
        pagePath: "/why-us",
        pageTitle: "Why Choose Niddik - IT Recruitment Advantages",
        metaDescription: "Discover why companies choose Niddik for IT recruitment. Our unique advantages, proven track record, and expert team.",
        metaKeywords: "why choose niddik, recruitment advantages, IT staffing benefits",
        ogTitle: "Why Choose Niddik - IT Recruitment Advantages",
        ogDescription: "Discover why companies choose Niddik for IT recruitment.",
        canonicalUrl: "https://niddik.com/why-us"
      },
      {
        pagePath: "/leadership-team",
        pageTitle: "Leadership Team | Niddik",
        metaDescription: "Meet Niddik's leadership team. Experienced executives driving innovation in IT recruitment and talent acquisition.",
        metaKeywords: "leadership team, executives, management, company leaders",
        ogTitle: "Leadership Team | Niddik",
        ogDescription: "Meet Niddik's experienced leadership team driving innovation in IT recruitment.",
        canonicalUrl: "https://niddik.com/leadership-team"
      },
      {
        pagePath: "/faqs",
        pageTitle: "Frequently Asked Questions | Niddik",
        metaDescription: "Find answers to frequently asked questions about Niddik's IT recruitment services, processes, and solutions.",
        metaKeywords: "FAQs, frequently asked questions, help, support, recruitment questions",
        ogTitle: "Frequently Asked Questions | Niddik",
        ogDescription: "Find answers to frequently asked questions about Niddik's services.",
        canonicalUrl: "https://niddik.com/faqs"
      },
      {
        pagePath: "/careers",
        pageTitle: "IT Jobs & Career Opportunities | Niddik",
        metaDescription: "Discover exciting IT career opportunities with top companies. Browse our latest job openings in software development, engineering, and technology roles.",
        metaKeywords: "IT jobs, career opportunities, software developer jobs, tech careers, job openings",
        ogTitle: "IT Jobs & Career Opportunities | Niddik",
        ogDescription: "Discover exciting IT career opportunities with top companies. Browse our latest job openings.",
        canonicalUrl: "https://niddik.com/careers",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Various IT career opportunities available"
        })
      },
      {
        pagePath: "/request-demo",
        pageTitle: "Request Demo - See Niddik in Action | Niddik",
        metaDescription: "Request a demo to see how Niddik's IT recruitment solutions can transform your hiring process. Schedule your personalized demonstration.",
        metaKeywords: "request demo, recruitment demo, hiring solutions demo, schedule demo",
        ogTitle: "Request Demo - See Niddik in Action | Niddik",
        ogDescription: "Request a demo to see how Niddik's solutions can transform your hiring process.",
        canonicalUrl: "https://niddik.com/request-demo"
      },
      {
        pagePath: "/services/full-rpo",
        pageTitle: "Full RPO Services - Complete Recruitment Process Outsourcing | Niddik",
        metaDescription: "Comprehensive Full RPO services from Niddik. Complete recruitment process outsourcing with dedicated teams, scalable solutions, and end-to-end talent acquisition.",
        metaKeywords: "full RPO, recruitment process outsourcing, complete RPO, dedicated recruitment team, scalable hiring",
        ogTitle: "Full RPO Services - Complete Recruitment Process Outsourcing | Niddik",
        ogDescription: "Comprehensive Full RPO services with dedicated teams and scalable solutions for complete talent acquisition.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-full-rpo-og.jpg",
        ogType: "website",
        ogUrl: "https://niddik.com/services/full-rpo",
        twitterCard: "summary_large_image",
        twitterSite: "@niddik",
        twitterTitle: "Full RPO Services - Complete Recruitment Process Outsourcing | Niddik",
        twitterDescription: "Comprehensive Full RPO services with dedicated teams and scalable solutions.",
        twitterImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-full-rpo-twitter.jpg",
        twitterCreator: "@niddik",
        canonicalUrl: "https://niddik.com/services/full-rpo",
        robotsDirective: "index,follow",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Full RPO Services",
          "provider": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Complete recruitment process outsourcing with dedicated teams and scalable solutions",
          "serviceType": "Recruitment Process Outsourcing"
        }),
        itemPropName: "Full RPO Services - Complete Recruitment Process Outsourcing",
        itemPropDescription: "Comprehensive Full RPO services with dedicated teams and scalable solutions for complete talent acquisition.",
        itemPropImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-full-rpo-itemprop.jpg"
      },
      {
        pagePath: "/services/on-demand",
        pageTitle: "On-Demand Recruitment Services - Flexible IT Staffing | Niddik",
        metaDescription: "Flexible on-demand recruitment services from Niddik. Scale your hiring up or down based on business needs with our agile IT staffing solutions.",
        metaKeywords: "on-demand recruitment, flexible staffing, agile hiring, scalable recruitment, IT staffing on-demand",
        ogTitle: "On-Demand Recruitment Services - Flexible IT Staffing | Niddik",
        ogDescription: "Flexible on-demand recruitment services. Scale your hiring based on business needs with agile IT staffing solutions.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-on-demand-og.jpg",
        ogType: "website",
        ogUrl: "https://niddik.com/services/on-demand",
        twitterCard: "summary_large_image",
        twitterSite: "@niddik",
        twitterTitle: "On-Demand Recruitment Services - Flexible IT Staffing | Niddik",
        twitterDescription: "Flexible on-demand recruitment services. Scale your hiring based on business needs.",
        twitterImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-on-demand-twitter.jpg",
        twitterCreator: "@niddik",
        canonicalUrl: "https://niddik.com/services/on-demand",
        robotsDirective: "index,follow",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "On-Demand Recruitment Services",
          "provider": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Flexible on-demand recruitment services that scale with your business needs",
          "serviceType": "On-Demand Staffing"
        }),
        itemPropName: "On-Demand Recruitment Services - Flexible IT Staffing",
        itemPropDescription: "Flexible on-demand recruitment services. Scale your hiring up or down based on business needs with our agile IT staffing solutions.",
        itemPropImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-on-demand-itemprop.jpg"
      },
      {
        pagePath: "/services/hybrid-rpo",
        pageTitle: "Hybrid RPO Services - Blended Recruitment Solutions | Niddik",
        metaDescription: "Hybrid RPO services combining the best of internal and external recruitment. Flexible, scalable solutions that adapt to your specific hiring needs.",
        metaKeywords: "hybrid RPO, blended recruitment, flexible RPO, scalable hiring solutions, mixed recruitment model",
        ogTitle: "Hybrid RPO Services - Blended Recruitment Solutions | Niddik",
        ogDescription: "Hybrid RPO services combining internal and external recruitment for flexible, scalable hiring solutions.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-hybrid-rpo-og.jpg",
        ogType: "website",
        ogUrl: "https://niddik.com/services/hybrid-rpo",
        twitterCard: "summary_large_image",
        twitterSite: "@niddik",
        twitterTitle: "Hybrid RPO Services - Blended Recruitment Solutions | Niddik",
        twitterDescription: "Hybrid RPO services combining internal and external recruitment for flexible solutions.",
        twitterImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-hybrid-rpo-twitter.jpg",
        twitterCreator: "@niddik",
        canonicalUrl: "https://niddik.com/services/hybrid-rpo",
        robotsDirective: "index,follow",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Hybrid RPO Services",
          "provider": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Blended recruitment solutions combining internal and external hiring strategies",
          "serviceType": "Hybrid Recruitment Process Outsourcing"
        }),
        itemPropName: "Hybrid RPO Services - Blended Recruitment Solutions",
        itemPropDescription: "Hybrid RPO services combining the best of internal and external recruitment. Flexible, scalable solutions that adapt to your specific hiring needs.",
        itemPropImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-hybrid-rpo-itemprop.jpg"
      },
      {
        pagePath: "/services/contingent",
        pageTitle: "Contingent Staffing Services - Project-Based IT Recruitment | Niddik",
        metaDescription: "Expert contingent staffing services for project-based IT roles. Quick placement of skilled professionals for short-term and contract positions.",
        metaKeywords: "contingent staffing, contract recruitment, project-based hiring, temporary IT staff, contract placement",
        ogTitle: "Contingent Staffing Services - Project-Based IT Recruitment | Niddik",
        ogDescription: "Expert contingent staffing services for project-based IT roles. Quick placement of skilled professionals.",
        ogImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-contingent-og.jpg",
        ogType: "website",
        ogUrl: "https://niddik.com/services/contingent",
        twitterCard: "summary_large_image",
        twitterSite: "@niddik",
        twitterTitle: "Contingent Staffing Services - Project-Based IT Recruitment | Niddik",
        twitterDescription: "Expert contingent staffing services for project-based IT roles and contract positions.",
        twitterImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-contingent-twitter.jpg",
        twitterCreator: "@niddik",
        canonicalUrl: "https://niddik.com/services/contingent",
        robotsDirective: "index,follow",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Contingent Staffing Services",
          "provider": {
            "@type": "Organization",
            "name": "Niddik"
          },
          "description": "Project-based IT recruitment and contingent staffing solutions",
          "serviceType": "Contingent Staffing"
        }),
        itemPropName: "Contingent Staffing Services - Project-Based IT Recruitment",
        itemPropDescription: "Expert contingent staffing services for project-based IT roles. Quick placement of skilled professionals for short-term and contract positions.",
        itemPropImage: "https://res.cloudinary.com/your-cloud/image/upload/v1/niddik-contingent-itemprop.jpg"
      }
    ];

    // Check if SEO pages already exist
    const existingSeoPages = await db.query.seoPages?.findMany() || [];
    if (existingSeoPages.length === 0) {
      await db.insert(seoPages).values(seoPageData);
      console.log(`Added ${seoPageData.length} SEO pages`);
    } else {
      console.log("SEO pages already exist, checking for missing service pages...");
      
      // Check for missing individual service pages
      const servicePaths = [
        '/services/full-rpo',
        '/services/on-demand', 
        '/services/hybrid-rpo',
        '/services/contingent'
      ];
      
      const missingServicePages = [];
      for (const servicePath of servicePaths) {
        const existingPage = existingSeoPages.find(page => page.pagePath === servicePath);
        if (!existingPage) {
          const servicePageData = seoPageData.find(page => page.pagePath === servicePath);
          if (servicePageData) {
            missingServicePages.push(servicePageData);
          }
        }
      }
      
      if (missingServicePages.length > 0) {
        await db.insert(seoPages).values(missingServicePages);
        console.log(`Added ${missingServicePages.length} missing service SEO pages:`, missingServicePages.map(p => p.pagePath));
      } else {
        console.log("All service pages already exist");
      }
    }

    console.log("Seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
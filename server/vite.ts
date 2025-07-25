import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

// Setup __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Serve static files from public directory BEFORE other middleware
  app.use('/images', express.static(path.resolve(__dirname, '..', 'public', 'images')));
  app.use(express.static(path.resolve(__dirname, '..', 'public')));

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      // Server-side SEO metadata injection
      try {
        const { storage } = await import("./storage");
        const pathname = req.originalUrl.split('?')[0]; // Remove query params

        // Skip API routes and static assets
        if (pathname.startsWith('/api/') || 
            pathname.startsWith('/images/') || 
            pathname.startsWith('/assets/') ||
            pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
          return next();
        }

        console.log(`Serving page: ${pathname} with server-side SEO`);

        // Fetch SEO data for the current path
        let seoData = await storage.getSeoPageByPath(pathname);
        
        // Also fetch root page scripts for global injection
        let rootSeoData = null;
        if (pathname !== '/') {
          rootSeoData = await storage.getRootSeoPage();
        }

        // Handle job detail pages dynamically
        const jobPageMatch = pathname.match(/^\/jobs\/(\d+)$/);
        if (jobPageMatch && !seoData) {
          const jobId = parseInt(jobPageMatch[1]);
          try {
            const jobData = await storage.getJobListing(jobId);
            if (jobData) {
              seoData = {
                pageTitle: `${jobData.title} at ${jobData.company} - ${jobData.location} | Niddik Jobs`,
                metaDescription: `Apply for ${jobData.title} position at ${jobData.company} in ${jobData.location}. ${jobData.experienceLevel} level ${jobData.jobType} role. ${jobData.description?.substring(0, 100)}...`,
                metaKeywords: `${jobData.title}, ${jobData.company}, ${jobData.location}, ${jobData.category}, ${jobData.experienceLevel}, ${jobData.jobType}, IT jobs, career opportunities`,
                ogTitle: `${jobData.title} at ${jobData.company} | Niddik`,
                ogDescription: `Join ${jobData.company} as ${jobData.title} in ${jobData.location}. ${jobData.experienceLevel} level position with competitive benefits.`,
                ogType: "article",
                twitterTitle: `${jobData.title} at ${jobData.company}`,
                twitterDescription: `${jobData.experienceLevel} level ${jobData.title} role at ${jobData.company} in ${jobData.location}. Apply now!`,
                canonicalUrl: `https://niddik.com/jobs/${jobData.id}`,
                structuredData: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "JobPosting",
                  "title": jobData.title,
                  "description": jobData.description,
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": jobData.company
                  },
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": jobData.location
                    }
                  },
                  "employmentType": jobData.jobType?.toUpperCase(),
                  "experienceRequirements": jobData.experienceLevel,
                  "skills": jobData.skills ? jobData.skills.split(',').map((s: string) => s.trim()) : [],
                  "datePosted": jobData.postedDate || jobData.createdAt,
                  "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                  "url": `https://niddik.com/jobs/${jobData.id}`
                })
              };
            }
          } catch (error) {
            console.error('Error fetching job data for SEO:', error);
          }
        }

        // Enhanced SEO data for careers and home pages with recent jobs
        if ((pathname === '/careers' || pathname === '/') && !seoData) {
          try {
            const recentJobs = await storage.getRecentJobListings(5, 7);
            const jobTitles = recentJobs.slice(0, 3).map(job => job.title).join(', ');

            if (pathname === '/careers') {
              seoData = {
                pageTitle: "Careers - Join Our Team | Niddik",
                metaDescription: `Join Niddik and explore exciting career opportunities. Latest positions: ${jobTitles}. Premier IT recruitment and staffing company.`,
                structuredData: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "Careers - Niddik",
                  "url": "https://niddik.com/careers",
                  "description": "Join Niddik and explore exciting career opportunities in IT recruitment and staffing.",
                  "mainEntity": {
                    "@type": "Organization",
                    "name": "Niddik",
                    "url": "https://niddik.com",
                    "description": "Premier IT recruitment and staffing solutions provider"
                  },
                  "about": recentJobs.map(job => ({
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
                    "url": `https://niddik.com/jobs/${job.id}`
                  }))
                })
              };
            } else {
              seoData = {
                pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
                metaDescription: `Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies. Latest job opportunities: ${jobTitles}.`,
                structuredData: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Niddik",
                  "url": "https://niddik.com",
                  "description": "Premier IT recruitment and staffing solutions provider",
                  "logo": "https://niddik.com/images/niddik_logo.png",
                  "sameAs": [
                    "https://twitter.com/niddik",
                    "https://linkedin.com/company/niddik"
                  ],
                  "about": recentJobs.map(job => ({
                    "@type": "JobPosting",
                    "title": job.title,
                    "datePosted": job.postedDate || job.createdAt,
                    "hiringOrganization": {
                      "@type": "Organization",
                      "name": job.company
                    },
                    "url": `https://niddik.com/jobs/${job.id}`
                  }))
                })
              };
            }
          } catch (error) {
            console.error('Error fetching recent jobs for SEO:', error);
          }
        }

        // Use default SEO if no specific data found
        if (!seoData) {
          seoData = {
            pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
            metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
            ogTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
            ogDescription: "Niddik provides world-class IT recruitment and staffing solutions.",
            canonicalUrl: `https://niddik.com${pathname}`
          };
        }

        // Prepare scripts for injection
        let headScripts = '';
        let bodyScripts = '';
        
        // Add root page scripts first (global scripts)
        if (rootSeoData?.headScripts) {
          headScripts += `\n          ${rootSeoData.headScripts}`;
        }
        if (rootSeoData?.bodyScripts) {
          bodyScripts += `\n          ${rootSeoData.bodyScripts}`;
        }
        
        // Add page-specific scripts
        if (seoData.headScripts) {
          headScripts += `\n          ${seoData.headScripts}`;
        }
        if (seoData.bodyScripts) {
          bodyScripts += `\n          ${seoData.bodyScripts}`;
        }

        // Inject SEO metadata into HTML head (excluding title since we replace it separately)
        const headContent = `
          <meta name="description" content="${seoData.metaDescription}" />
          ${seoData.metaKeywords ? `<meta name="keywords" content="${seoData.metaKeywords}" />` : ''}
          ${seoData.robotsDirective ? `<meta name="robots" content="${seoData.robotsDirective}" />` : ''}

          <!-- Open Graph Meta Tags -->
          <meta property="og:title" content="${seoData.ogTitle || seoData.pageTitle}" />
          <meta property="og:description" content="${seoData.ogDescription || seoData.metaDescription}" />
          <meta property="og:type" content="${seoData.ogType || 'website'}" />
          <meta property="og:url" content="${seoData.ogUrl || seoData.canonicalUrl || `https://niddik.com${pathname}`}" />
          <meta property="og:site_name" content="Niddik" />
          ${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}

          <!-- Twitter Card Meta Tags -->
          <meta name="twitter:card" content="${seoData.twitterCard || 'summary_large_image'}" />
          ${seoData.twitterSite ? `<meta name="twitter:site" content="${seoData.twitterSite}" />` : ''}
          <meta name="twitter:title" content="${seoData.twitterTitle || seoData.ogTitle || seoData.pageTitle}" />
          <meta name="twitter:description" content="${seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription}" />
          ${seoData.twitterCreator ? `<meta name="twitter:creator" content="${seoData.twitterCreator}" />` : ''}
          ${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}" />` : ''}

          <!-- Canonical URL -->
          <link rel="canonical" href="${seoData.canonicalUrl || `https://niddik.com${pathname}`}" />

          <!-- Schema.org Structured Data -->
          ${seoData.structuredData ? `<script type="application/ld+json">${seoData.structuredData}</script>` : ''}

          <!-- Additional meta tags for better SEO -->
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="en" />
          <meta name="revisit-after" content="7 days" />
          <meta name="author" content="Niddik" />

          <!-- Favicon and icons -->
          <link rel="icon" type="image/png" href="/images/niddik_logo.png" />
          <link rel="apple-touch-icon" href="/images/niddik_logo.png" />
          
          <!-- Custom Head Scripts -->${headScripts}
        `;

        // Replace the title tag first
        template = template.replace(
          /<title>.*?<\/title>/,
          `<title>${seoData.pageTitle}</title>`
        );
        
        // Insert additional head content before the closing </head> tag
        template = template.replace('</head>', `${headContent}\n</head>`);
        
        // Insert body scripts before closing </body> tag if any exist
        if (bodyScripts) {
          const bodyScriptContent = `
          <!-- Custom Body Scripts -->${bodyScripts}`;
          template = template.replace('</body>', `${bodyScriptContent}\n</body>`);
        }

      } catch (error) {
        console.error('Error injecting SEO data:', error);
        // Fall back to serving the original HTML if there's an error
      }
      //    import { serve } from "@hono/node-server/serve-static";
      //    import fs from "fs";
      //    import path from "path";
      //    import { storage } from "./storage";

      //    export function registerVite(app: any, server: any) {
      //      const __dirname = path.dirname(new URL(import.meta.url).pathname);
      //      const distPath = path.resolve(__dirname, "..", "dist");

      //      if (!fs.existsSync(distPath)) {
      //        throw new Error(
      //          `Static files not found at ${distPath}. Please build the project first with 'npm run build'.`
      //        );
      //      }

      //      // Serve static files from the dist directory
      //      app.use(
      //        "/assets/*",
      //        serve({
      //          root: distPath,
      //          rewriteRequestPath: (path: string) => path.replace(/^\/assets/, "/assets"),
      //        })
      //      );

      //      // Handle the root and any other routes by serving index.html with SEO injection
      //      app.get("*", async (c: any) => {
      //        const indexPath = path.join(distPath, "index.html");
      //        let html = fs.readFileSync(indexPath, "utf-8");

      //        try {
      //          const pathname = c.req.path;

      //          // Skip API routes
      //          if (pathname.startsWith('/api/')) {
      //            return c.next();
      //          }

      //          console.log(`Serving page: ${pathname} with server-side SEO`);

      //          // Fetch SEO data for the current path
      //          let seoData = await storage.getSeoPageByPath(pathname);

      //          // Handle job detail pages dynamically
      //          const jobPageMatch = pathname.match(/^\/jobs\/(\d+)$/);
      //          if (jobPageMatch && !seoData) {
      //            const jobId = parseInt(jobPageMatch[1]);
      //            try {
      //              const jobData = await storage.getJobListingById(jobId);
      //              if (jobData) {
      //                seoData = {
      //                  pageTitle: `${jobData.title} at ${jobData.company} - ${jobData.location} | Niddik Jobs`,
      //                  metaDescription: `Apply for ${jobData.title} position at ${jobData.company} in ${jobData.location}. ${jobData.experienceLevel} level ${jobData.jobType} role. ${jobData.description?.substring(0, 100)}...`,
      //                  metaKeywords: `${jobData.title}, ${jobData.company}, ${jobData.location}, ${jobData.category}, ${jobData.experienceLevel}, ${jobData.jobType}, IT jobs, career opportunities`,
      //                  ogTitle: `${jobData.title} at ${jobData.company} | Niddik`,
      //                  ogDescription: `Join ${jobData.company} as ${jobData.title} in ${jobData.location}. ${jobData.experienceLevel} level position with competitive benefits.`,
      //                  ogType: "article",
      //                  twitterTitle: `${jobData.title} at ${jobData.company}`,
      //                  twitterDescription: `${jobData.experienceLevel} level ${jobData.title} role at ${jobData.company} in ${jobData.location}. Apply now!`,
      //                  canonicalUrl: `https://niddik.com/jobs/${jobData.id}`,
      //                  structuredData: JSON.stringify({
      //                    "@context": "https://schema.org",
      //                    "@type": "JobPosting",
      //                    "title": jobData.title,
      //                    "description": jobData.description,
      //                    "hiringOrganization": {
      //                      "@type": "Organization",
      //                      "name": jobData.company
      //                    },
      //                    "jobLocation": {
      //                      "@type": "Place",
      //                      "address": {
      //                        "@type": "PostalAddress",
      //                        "addressLocality": jobData.location
      //                      }
      //                    },
      //                    "employmentType": jobData.jobType?.toUpperCase(),
      //                    "experienceRequirements": jobData.experienceLevel,
      //                    "skills": jobData.skills ? jobData.skills.split(',').map((s: string) => s.trim()) : [],
      //                    "datePosted": jobData.postedDate || jobData.createdAt,
      //                    "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      //                    "url": `https://niddik.com/jobs/${jobData.id}`
      //                  })
      //                };
      //              }
      //            } catch (error) {
      //              console.error('Error fetching job data for SEO:', error);
      //            }
      //          }

      //          // Enhanced SEO data for careers and home pages with recent jobs
      //          if ((pathname === '/careers' || pathname === '/') && !seoData) {
      //            try {
      //              const recentJobs = await storage.getRecentJobListings(5, 7);
      //              const jobTitles = recentJobs.slice(0, 3).map(job => job.title).join(', ');

      //              if (pathname === '/careers') {
      //                seoData = {
      //                  pageTitle: "Careers - Join Our Team | Niddik",
      //                  metaDescription: `Join Niddik and explore exciting career opportunities. Latest positions: ${jobTitles}. Premier IT recruitment and staffing company.`,
      //                  structuredData: JSON.stringify({
      //                    "@context": "https://schema.org",
      //                    "@type": "WebPage",
      //                    "name": "Careers - Niddik",
      //                    "url": "https://niddik.com/careers",
      //                    "description": "Join Niddik and explore exciting career opportunities in IT recruitment and staffing.",
      //                    "mainEntity": {
      //                      "@type": "Organization",
      //                      "name": "Niddik",
      //                      "url": "https://niddik.com",
      //                      "description": "Premier IT recruitment and staffing solutions provider"
      //                    },
      //                    "about": recentJobs.map(job => ({
      //                      "@type": "JobPosting",
      //                      "title": job.title,
      //                      "datePosted": job.postedDate || job.createdAt,
      //                      "hiringOrganization": {
      //                        "@type": "Organization",
      //                        "name": job.company
      //                      },
      //                      "jobLocation": {
      //                        "@type": "Place",
      //                        "address": job.location
      //                      },
      //                      "url": `https://niddik.com/jobs/${job.id}`
      //                    }))
      //                  })
      //                };
      //              } else {
      //                seoData = {
      //                  pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
      //                  metaDescription: `Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies. Latest job opportunities: ${jobTitles}.`,
      //                  structuredData: JSON.stringify({
      //                    "@context": "https://schema.org",
      //                    "@type": "Organization",
      //                    "name": "Niddik",
      //                    "url": "https://niddik.com",
      //                    "description": "Premier IT recruitment and staffing solutions provider",
      //                    "logo": "https://niddik.com/images/niddik_logo.png",
      //                    "sameAs": [
      //                      "https://twitter.com/niddik",
      //                      "https://linkedin.com/company/niddik"
      //                    ],
      //                    "about": recentJobs.map(job => ({
      //                      "@type": "JobPosting",
      //                      "title": job.title,
      //                      "datePosted": job.postedDate || job.createdAt,
      //                      "hiringOrganization": {
      //                        "@type": "Organization",
      //                        "name": job.company
      //                      },
      //                      "url": `https://niddik.com/jobs/${job.id}`
      //                    }))
      //                  })
      //                };
      //              }
      //            } catch (error) {
      //              console.error('Error fetching recent jobs for SEO:', error);
      //            }
      //          }

      //          // Use default SEO if no specific data found
      //          if (!seoData) {
      //            seoData = {
      //              pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
      //              metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
      //              ogTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
      //              ogDescription: "Niddik provides world-class IT recruitment and staffing solutions.",
      //              canonicalUrl: `https://niddik.com${pathname}`
      //            };
      //          }

      //          // Inject SEO metadata into HTML head
      //          const headContent = `
      //            <title>${seoData.pageTitle}</title>
      //            <meta name="description" content="${seoData.metaDescription}" />
      //            ${seoData.metaKeywords ? `<meta name="keywords" content="${seoData.metaKeywords}" />` : ''}
      //            ${seoData.robotsDirective ? `<meta name="robots" content="${seoData.robotsDirective}" />` : ''}

      //            <!-- Open Graph Meta Tags -->
      //            <meta property="og:title" content="${seoData.ogTitle || seoData.pageTitle}" />
      //            <meta property="og:description" content="${seoData.ogDescription || seoData.metaDescription}" />
      //            <meta property="og:type" content="${seoData.ogType || 'website'}" />
      //            <meta property="og:url" content="${seoData.ogUrl || seoData.canonicalUrl || `https://niddik.com${pathname}`}" />
      //            <meta property="og:site_name" content="Niddik" />
      //            ${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}

      //            <!-- Twitter Card Meta Tags -->
      //            <meta name="twitter:card" content="${seoData.twitterCard || 'summary_large_image'}" />
      //            ${seoData.twitterSite ? `<meta name="twitter:site" content="${seoData.twitterSite}" />` : ''}
      //            <meta name="twitter:title" content="${seoData.twitterTitle || seoData.ogTitle || seoData.pageTitle}" />
      //            <meta name="twitter:description" content="${seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription}" />
      //            ${seoData.twitterCreator ? `<meta name="twitter:creator" content="${seoData.twitterCreator}" />` : ''}
      //            ${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}" />` : ''}

      //            <!-- Canonical URL -->
      //            <link rel="canonical" href="${seoData.canonicalUrl || `https://niddik.com${pathname}`}" />

      //            <!-- Schema.org Structured Data -->
      //            ${seoData.structuredData ? `<script type="application/ld+json">${seoData.structuredData}</script>` : ''}

      //            <!-- Additional meta tags for better SEO -->
      //            <meta name="viewport" content="width=device-width, initial-scale=1" />
      //            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      //            <meta name="language" content="en" />
      //            <meta name="revisit-after" content="7 days" />
      //            <meta name="author" content="Niddik" />

      //            <!-- Favicon and icons -->
      //            <link rel="icon" type="image/png" href="/images/niddik_logo.png" />
      //            <link rel="apple-touch-icon" href="/images/niddik_logo.png" />
      //          `;

      //          // Insert the head content before the closing </head> tag
      //          html = html.replace('</head>', `${headContent}\n</head>`);

      //        } catch (error) {
      //          console.error('Error injecting SEO data:', error);
      //          // Fall back to serving the original HTML if there's an error
      //        }

      //        return c.html(html);
      //      });
      //    }
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export async function serveStatic(app: Express) {
  const distPath = path.resolve("dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Please run \`npm run build\` first.`
    );
  }

  // Serve static assets with proper caching headers
  app.use('/assets', express.static(path.join(distPath, 'assets'), {
    maxAge: '1y',
    etag: true
  }));
  
  app.use('/images', express.static(path.join(distPath, 'images'), {
    maxAge: '1d',
    etag: true
  }));

  // Handle all other routes through SSR
  app.get("*", async (req, res) => {
    try {
      const { storage } = await import("./storage");
      const pathname = req.path;

      // Get SEO data for the current path
      let seoData = null;
      try {
        seoData = await storage.getSeoPageByPath(pathname);
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }

      // Handle job detail pages - check if SEO page exists first
      const isJobDetailPage = pathname.match(/^\/jobs\/(\d+)$/);
      if (isJobDetailPage && !seoData) {
        const jobId = parseInt(isJobDetailPage[1]);
        try {
          const jobData = await storage.getJobListing(jobId);
          if (jobData) {
            seoData = {
              pageTitle: `${jobData.title} at ${jobData.company} - ${jobData.location} | Niddik Jobs`,
              metaDescription: `Apply for ${jobData.title} position at ${jobData.company} in ${jobData.location}. ${jobData.experienceLevel} level ${jobData.jobType} role.`,
              metaKeywords: `${jobData.title}, ${jobData.company}, ${jobData.location}, ${jobData.category}, IT jobs`,
              ogTitle: `${jobData.title} at ${jobData.company} | Niddik`,
              ogDescription: `Join ${jobData.company} as ${jobData.title} in ${jobData.location}. ${jobData.experienceLevel} level position.`,
              canonicalUrl: `https://niddik.com/jobs/${jobData.id}`,
              structuredData: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "JobPosting",
                "title": jobData.title,
                "description": jobData.description,
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": jobData.company
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": jobData.location
                  }
                },
                "employmentType": jobData.jobType?.toUpperCase(),
                "experienceRequirements": jobData.experienceLevel,
                "skills": jobData.skills ? jobData.skills.split(',').map(s => s.trim()) : [],
                "baseSalary": jobData.salary ? {
                  "@type": "MonetaryAmount",
                  "currency": "USD",
                  "value": {
                    "@type": "QuantitativeValue",
                    "value": jobData.salary
                  }
                } : undefined,
                "datePosted": jobData.postedDate || jobData.createdAt,
                "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                "url": `https://niddik.com/jobs/${jobData.id}`
              })
            };
          }
        } catch (error) {
          console.error('Error fetching job data:', error);
        }
      }

      // Use default SEO if no specific data found
      if (!seoData) {
        seoData = {
          pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
          metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
          ogTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
          ogDescription: "Niddik provides world-class IT recruitment and staffing solutions.",
          canonicalUrl: `https://niddik.com${pathname}`
        };
      }

      // Read the base HTML file
      const htmlPath = path.resolve(distPath, "index.html");
      let html = fs.readFileSync(htmlPath, 'utf-8');

      // Prepare scripts for injection (similar to development)
      let headScripts = '';
      let bodyScripts = '';
      
      // Add root page scripts first (global scripts)
      const rootSeoData = pathname !== '/' ? await storage.getRootSeoPage() : null;
      if (rootSeoData?.headScripts) {
        headScripts += `\n          ${rootSeoData.headScripts}`;
      }
      if (rootSeoData?.bodyScripts) {
        bodyScripts += `\n          ${rootSeoData.bodyScripts}`;
      }
      
      // Add page-specific scripts
      if (seoData.headScripts) {
        headScripts += `\n          ${seoData.headScripts}`;
      }
      if (seoData.bodyScripts) {
        bodyScripts += `\n          ${seoData.bodyScripts}`;
      }

      // Inject SEO metadata into HTML head (excluding title since we replace it separately)
      const headContent = `
        <meta name="description" content="${seoData.metaDescription}" />
        ${seoData.metaKeywords ? `<meta name="keywords" content="${seoData.metaKeywords}" />` : ''}
        ${seoData.robotsDirective ? `<meta name="robots" content="${seoData.robotsDirective}" />` : ''}

        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${seoData.ogTitle || seoData.pageTitle}" />
        <meta property="og:description" content="${seoData.ogDescription || seoData.metaDescription}" />
        <meta property="og:type" content="${seoData.ogType || 'website'}" />
        <meta property="og:url" content="${seoData.ogUrl || seoData.canonicalUrl || `https://niddik.com${pathname}`}" />
        <meta property="og:site_name" content="Niddik" />
        ${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}

        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="${seoData.twitterCard || 'summary_large_image'}" />
        ${seoData.twitterSite ? `<meta name="twitter:site" content="${seoData.twitterSite}" />` : ''}
        <meta name="twitter:title" content="${seoData.twitterTitle || seoData.ogTitle || seoData.pageTitle}" />
        <meta name="twitter:description" content="${seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription}" />
        ${seoData.twitterCreator ? `<meta name="twitter:creator" content="${seoData.twitterCreator}" />` : ''}
        ${seoData.twitterImage ? `<meta name="twitter:image" content="${seoData.twitterImage}" />` : ''}

        <!-- Canonical URL -->
        <link rel="canonical" href="${seoData.canonicalUrl || `https://niddik.com${pathname}`}" />

        <!-- Schema.org Structured Data -->
        ${seoData.structuredData ? `<script type="application/ld+json">${seoData.structuredData}</script>` : ''}

        <!-- Additional meta tags for better SEO -->
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Niddik" />

        <!-- Favicon and icons -->
        <link rel="icon" type="image/png" href="/images/niddik_logo.png" />
        <link rel="apple-touch-icon" href="/images/niddik_logo.png" />
        
        <!-- Custom Head Scripts -->${headScripts}
      `;

      // Replace the title tag first
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${seoData.pageTitle}</title>`
      );
      
      // Insert additional head content before the closing </head> tag
      html = html.replace('</head>', `${headContent}\n</head>`);
      
      // Insert body scripts before closing </body> tag if any exist
      if (bodyScripts) {
        const bodyScriptContent = `
        <!-- Custom Body Scripts -->${bodyScripts}`;
        html = html.replace('</body>', `${bodyScriptContent}\n</body>`);
      }

      res.send(html);
    } catch (error) {
      console.error('Error in SSR:', error);
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
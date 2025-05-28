
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

interface SEOData {
  pageTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  structuredData?: string;
  itemPropName?: string;
  itemPropDescription?: string;
  itemPropImage?: string;
}

interface SEOProps {
  pagePath?: string;
  fallback?: Partial<SEOData>;
}

const SEO: React.FC<SEOProps> = ({ pagePath, fallback }) => {
  const [location] = useLocation();
  const currentPath = pagePath || location;

  // Check if this is a job detail page
  const isJobDetailPage = currentPath.match(/^\/jobs\/(\d+)$/);
  const jobId = isJobDetailPage ? isJobDetailPage[1] : null;

  // Fetch job data for dynamic SEO if it's a job page
  const { data: jobData } = useQuery<{ data: any }>({
    queryKey: [`/api/job-listings/${jobId}`],
    queryFn: async () => {
      const response = await fetch(`/api/job-listings/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job data');
      }
      return response.json();
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch recent jobs for careers and home pages
  const { data: recentJobsData } = useQuery<{ data: any[] }>({
    queryKey: ['/api/job-listings/recent'],
    queryFn: async () => {
      const response = await fetch('/api/job-listings/recent?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch recent jobs');
      }
      return response.json();
    },
    enabled: currentPath === '/careers' || currentPath === '/',
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: seoData } = useQuery<{ 
    success: boolean; 
    data: SEOData; 
    isDefault?: boolean 
  }>({
    queryKey: ['/api/seo-pages/by-path', currentPath],
    queryFn: async () => {
      const response = await fetch(`/api/seo-pages/by-path?path=${encodeURIComponent(currentPath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch SEO data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Helper function to get recent jobs from last week
  const getRecentJobs = () => {
    if (!recentJobsData?.data) return [];
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return recentJobsData.data.filter(job => {
      const jobDate = new Date(job.postedDate || job.createdAt);
      return jobDate >= oneWeekAgo;
    }).slice(0, 5); // Limit to 5 most recent jobs
  };

  // Generate enhanced structured data with recent jobs
  const generateEnhancedStructuredData = (baseSeo: SEOData) => {
    const recentJobs = getRecentJobs();
    
    if ((currentPath === '/careers' || currentPath === '/') && recentJobs.length > 0) {
      // Try to parse existing structured data from admin SEO settings
      let baseStructuredData;
      try {
        if (baseSeo.structuredData) {
          baseStructuredData = typeof baseSeo.structuredData === 'string' 
            ? JSON.parse(baseSeo.structuredData) 
            : baseSeo.structuredData;
        }
      } catch (error) {
        console.warn('Could not parse existing structured data, using defaults');
      }

      // Default structured data if none exists or parsing failed
      if (!baseStructuredData) {
        baseStructuredData = currentPath === '/careers' ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Careers - Niddik",
          "url": "https://niddik.com/careers",
          "description": "Join Niddik and explore exciting career opportunities in IT recruitment and staffing.",
          "mainEntity": {
            "@type": "Organization",
            "name": "Niddik",
            "url": "https://niddik.com",
            "description": "Premier IT recruitment and staffing solutions provider",
            "logo": "https://niddik.com/images/niddik_logo.png"
          }
        } : {
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
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "customer service"
          }
        };
      }

      // Enhanced data with recent jobs - always add fresh job data
      const enhancedData = {
        ...baseStructuredData,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://niddik.com/careers?search={search_term}",
          "query-input": "required name=search_term"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Job Opportunities",
          "numberOfItems": recentJobs.length,
          "itemListElement": recentJobs.map((job, index) => ({
            "@type": "Offer",
            "position": index + 1,
            "itemOffered": {
              "@type": "JobPosting",
              "title": job.title,
              "datePosted": job.postedDate || job.createdAt,
              "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "hiringOrganization": {
                "@type": "Organization", 
                "name": job.company || "Niddik",
                "url": "https://niddik.com"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": job.location || "Remote"
                }
              },
              "employmentType": job.jobType?.toUpperCase() || "FULL_TIME",
              "experienceRequirements": job.experienceLevel || "Entry Level",
              "skills": job.skills ? job.skills.split(',').map(s => s.trim()) : [],
              "url": `https://niddik.com/jobs/${job.id}`,
              "description": job.description ? (job.description.length > 200 ? job.description.substring(0, 200) + "..." : job.description) : `Join ${job.company || 'our team'} as ${job.title}`,
              "baseSalary": job.salary ? {
                "@type": "MonetaryAmount",
                "currency": "USD",
                "value": {
                  "@type": "QuantitativeValue",
                  "value": job.salary,
                  "unitText": "YEAR"
                }
              } : undefined
            }
          }))
        },
        // Also keep the simple "about" structure for broader compatibility
        "about": recentJobs.slice(0, 3).map(job => ({
          "@type": "JobPosting",
          "title": job.title,
          "datePosted": job.postedDate || job.createdAt,
          "hiringOrganization": {
            "@type": "Organization", 
            "name": job.company || "Niddik"
          },
          "jobLocation": {
            "@type": "Place",
            "address": job.location || "Remote"
          },
          "url": `https://niddik.com/jobs/${job.id}`,
          "description": job.description ? (job.description.length > 150 ? job.description.substring(0, 150) + "..." : job.description) : `${job.title} position at ${job.company || 'Niddik'}`
        }))
      };

      return JSON.stringify(enhancedData, null, 2);
    }

    return baseSeo.structuredData;
  };

  // Generate dynamic SEO for job pages or use fetched/fallback data
  let seo: SEOData;
  
  if (isJobDetailPage && jobData?.data) {
    const job = jobData.data;
    // Generate dynamic SEO for job detail page
    seo = {
      pageTitle: `${job.title} at ${job.company} - ${job.location} | Niddik Jobs`,
      metaDescription: `Apply for ${job.title} position at ${job.company} in ${job.location}. ${job.experienceLevel} level ${job.jobType} role. ${job.description?.substring(0, 100)}...`,
      metaKeywords: `${job.title}, ${job.company}, ${job.location}, ${job.category}, ${job.experienceLevel}, ${job.jobType}, ${job.skills?.replace(/,/g, ', ')}, IT jobs, career opportunities`,
      ogTitle: `${job.title} at ${job.company} | Niddik`,
      ogDescription: `Join ${job.company} as ${job.title} in ${job.location}. ${job.experienceLevel} level position with competitive benefits.`,
      ogType: "article",
      twitterTitle: `${job.title} at ${job.company}`,
      twitterDescription: `${job.experienceLevel} level ${job.title} role at ${job.company} in ${job.location}. Apply now!`,
      canonicalUrl: `https://niddik.com/jobs/${job.id}`,
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.company
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.location
          }
        },
        "employmentType": job.jobType?.toUpperCase(),
        "experienceRequirements": job.experienceLevel,
        "skills": job.skills ? job.skills.split(',').map((s: string) => s.trim()) : [],
        "baseSalary": job.salary ? {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": {
            "@type": "QuantitativeValue",
            "value": job.salary
          }
        } : undefined,
        "datePosted": job.postedDate || job.createdAt,
        "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        "url": `https://niddik.com/jobs/${job.id}`
      })
    };
  } else {
    // Use fetched data, fallback props, or default values
    const baseSeo = seoData?.data || fallback || {
      pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
      metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
    };

    // Enhance meta descriptions with recent jobs info
    const recentJobs = getRecentJobs();
    if ((currentPath === '/careers' || currentPath === '/') && recentJobs.length > 0) {
      const jobTitles = recentJobs.slice(0, 3).map(job => job.title).join(', ');
      const jobCount = recentJobs.length;
      const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (currentPath === '/careers') {
        baseSeo.metaDescription = `Join Niddik and explore ${jobCount} exciting career opportunities this week. Latest positions: ${jobTitles}. Apply now for ${currentDate} openings!`;
      } else {
        baseSeo.metaDescription = `${baseSeo.metaDescription} ${jobCount} new job opportunities this week: ${jobTitles}. Updated ${currentDate}.`;
      }
      
      // Also enhance keywords with job-related terms
      const jobSkills = recentJobs
        .map(job => job.skills)
        .filter(Boolean)
        .join(',')
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean)
        .slice(0, 5)
        .join(', ');
      
      if (jobSkills && baseSeo.metaKeywords) {
        baseSeo.metaKeywords = `${baseSeo.metaKeywords}, ${jobSkills}, recent jobs, ${currentDate}`;
      } else if (jobSkills) {
        baseSeo.metaKeywords = `${jobSkills}, careers, job opportunities, ${currentDate}`;
      }
    }

    seo = {
      ...baseSeo,
      structuredData: generateEnhancedStructuredData(baseSeo)
    };
  }

  // Parse structured data if it exists
  let structuredDataObj = null;
  if (seo.structuredData) {
    try {
      structuredDataObj = typeof seo.structuredData === 'string' 
        ? JSON.parse(seo.structuredData) 
        : seo.structuredData;
    } catch (error) {
      console.error('Error parsing structured data:', error);
    }
  }

  const baseUrl = "https://niddik.com";
  const fullUrl = seo.canonicalUrl || `${baseUrl}${currentPath}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.pageTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}
      {seo.robotsDirective && <meta name="robots" content={seo.robotsDirective} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seo.ogTitle || seo.pageTitle} />
      <meta property="og:description" content={seo.ogDescription || seo.metaDescription} />
      <meta property="og:type" content={seo.ogType || "website"} />
      <meta property="og:url" content={seo.ogUrl || fullUrl} />
      <meta property="og:site_name" content="Niddik" />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seo.twitterCard || "summary_large_image"} />
      {seo.twitterSite && <meta name="twitter:site" content={seo.twitterSite} />}
      <meta name="twitter:title" content={seo.twitterTitle || seo.ogTitle || seo.pageTitle} />
      <meta name="twitter:description" content={seo.twitterDescription || seo.ogDescription || seo.metaDescription} />
      {seo.twitterCreator && <meta name="twitter:creator" content={seo.twitterCreator} />}
      {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
      {seo.twitterImage && <meta name="twitter:image:alt" content={seo.twitterTitle || seo.pageTitle} />}
      
      {/* Schema.org Microdata */}
      {seo.itemPropName && <meta itemProp="name" content={seo.itemPropName} />}
      {seo.itemPropDescription && <meta itemProp="description" content={seo.itemPropDescription} />}
      {seo.itemPropImage && <meta itemProp="image" content={seo.itemPropImage} />}
      
      {/* Structured Data (JSON-LD) */}
      {structuredDataObj && (
        <script type="application/ld+json">
          {JSON.stringify(structuredDataObj)}
        </script>
      )}
      
      {/* Additional meta tags for better SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Niddik" />
      
      {/* Favicon and icons */}
      <link rel="icon" type="image/png" href="/images/niddik_logo.png" />
      <link rel="apple-touch-icon" href="/images/niddik_logo.png" />
    </Helmet>
  );
};

export default SEO;

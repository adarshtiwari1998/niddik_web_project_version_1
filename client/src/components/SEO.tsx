
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
      const baseStructuredData = currentPath === '/careers' ? {
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

      // Add recent jobs to structured data
      const enhancedData = {
        ...baseStructuredData,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://niddik.com/careers?search={search_term}",
          "query-input": "required name=search_term"
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
          "url": `https://niddik.com/jobs/${job.id}`,
          "description": job.description?.substring(0, 150) + "..."
        }))
      };

      return JSON.stringify(enhancedData);
    }

    return baseSeo.structuredData;
  };

  // Generate dynamic SEO for job pages or use fetched/fallback data
  let seo: SEOData;
  
  if (isJobDetailPage) {
    // For job detail pages, prefer server-side generated SEO data
    // Server-side rendering should handle job detail SEO
    if (seoData?.data) {
      seo = seoData.data;
    } else {
      // Fallback only if no server-side data at all
      seo = fallback || {
        pageTitle: "Job Details | Niddik",
        metaDescription: "View detailed job information and apply for exciting career opportunities with top companies.",
      };
    }
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
      baseSeo.metaDescription = currentPath === '/careers' 
        ? `Join Niddik and explore exciting career opportunities. Latest positions: ${jobTitles}. ${baseSeo.metaDescription}`
        : `${baseSeo.metaDescription} Latest job opportunities: ${jobTitles}.`;
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

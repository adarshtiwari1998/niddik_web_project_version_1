
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

  // Use fetched data, fallback props, or default values
  const seo = seoData?.data || fallback || {
    pageTitle: "Niddik - Premier IT Recruitment & Staffing Solutions",
    metaDescription: "Niddik provides world-class IT recruitment and staffing solutions. Connect with top talent and leading companies.",
  };

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

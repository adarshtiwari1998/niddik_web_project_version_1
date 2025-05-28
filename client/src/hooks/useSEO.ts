
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

export const useSEO = (pagePath?: string) => {
  const [location] = useLocation();
  const currentPath = pagePath || location;

  const { data: seoData, isLoading, error } = useQuery<{ 
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

  return {
    seoData: seoData?.data,
    isDefault: seoData?.isDefault || false,
    isLoading,
    error
  };
};

export default useSEO;

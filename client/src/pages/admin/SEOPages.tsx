import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Globe, Search, Image, Code, FileText, Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Helmet } from 'react-helmet-async';

interface SeoPage {
  id: number;
  pagePath: string;
  pageTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: string;
  ogUrl?: string;
  twitterCard: string;
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robotsDirective: string;
  structuredData?: string;
  itemPropName?: string;
  itemPropDescription?: string;
  itemPropImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  headScripts?: string;
  bodyScripts?: string;
}

const commonPaths = [
  { value: "/", label: "Home Page" },
  { value: "/about-us", label: "About Us" },
  { value: "/services", label: "Services" },
  { value: "/careers", label: "Careers" },
  { value: "/contact", label: "Contact" },
  { value: "/why-us", label: "Why Us" },
  { value: "/leadership-team", label: "Leadership Team" },
  { value: "/testimonials", label: "Testimonials" },
  { value: "/clients", label: "Clients" },
  { value: "/request-demo", label: "Request Demo" },
  { value: "/web-app-solutions", label: "Web App Solutions" },
  { value: "/adaptive-hiring", label: "Adaptive Hiring" },
  { value: "/adaptive-hiring-fixed", label: "Adaptive Hiring Fixed" },
  { value: "/whitepaper", label: "Whitepaper" },
  { value: "/insights", label: "Insights" },
  { value: "/facts-and-trends", label: "Facts and Trends" },
  { value: "/hiring-advice", label: "Hiring Advice" },
  { value: "/career-advice", label: "Career Advice" },
  { value: "/six-factor-recruiting-model", label: "Six Factor Model" },
  { value: "/agile-approach-based-recruiting", label: "Agile Recruiting" },
  { value: "/community-involvement", label: "Community Involvement" },
  { value: "/corporate-social-responsibilities", label: "Corporate Responsibilities" },
  { value: "/partners/it", label: "IT Partners" },
  { value: "/partners/non-it", label: "Non-IT Partners" },
  { value: "/partners/healthcare", label: "Healthcare Partners" },
  { value: "/search", label: "Search Page" },
  { value: "/faqs", label: "FAQs" },
  { value: "/privacy-policy", label: "Privacy Policy" },
  { value: "/terms-of-service", label: "Terms of Service" },
  { value: "/cookie-policy", label: "Cookie Policy" },
  { value: "/auth", label: "Authentication" },
];

const getDefaultStructuredData = (pagePath: string) => {
  const baseData = {
    "@context": "https://schema.org",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Niddik",
      "url": "https://niddik.com"
    }
  };

  switch (pagePath) {
    case '/':
      return {
        ...baseData,
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

    case '/about-us':
      return {
        ...baseData,
        "@type": "AboutPage",
        "name": "About Niddik",
        "description": "Learn about Niddik's mission to connect exceptional IT talent with innovative companies.",
        "url": "https://niddik.com/about-us"
      };

    case '/careers':
      return {
        ...baseData,
        "@type": "WebPage",
        "name": "Careers - Niddik",
        "description": "Join Niddik and explore exciting career opportunities in IT recruitment and staffing.",
        "url": "https://niddik.com/careers"
      };

    case '/services':
      return {
        ...baseData,
        "@type": "Service",
        "name": "IT Recruitment Services",
        "description": "Comprehensive IT recruitment and staffing services including RPO, contingent staffing, and web development.",
        "url": "https://niddik.com/services",
        "provider": {
          "@type": "Organization",
          "name": "Niddik"
        }
      };

    case '/contact':
      return {
        ...baseData,
        "@type": "ContactPage",
        "name": "Contact Niddik",
        "description": "Get in touch with Niddik for your IT recruitment and staffing needs.",
        "url": "https://niddik.com/contact"
      };

    default:
      return {
        ...baseData,
        "@type": "WebPage",
        "name": "",
        "description": "",
        "url": `https://niddik.com${pagePath}`
      };
  }
};

export default function SEOPages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SeoPage | null>(null);
  const [search, setSearch] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [lastSchemaUpdate, setLastSchemaUpdate] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    pagePath: "",
    pageTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    ogUrl: "",
    twitterCard: "summary_large_image",
    twitterSite: "@niddik",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    twitterCreator: "@niddik",
    canonicalUrl: "",
    robotsDirective: "index,follow",
    structuredData: JSON.stringify(getDefaultStructuredData(""), null, 2),
    itemPropName: "",
    itemPropDescription: "",
    itemPropImage: "",
    isActive: true,
    headScripts: "",
    bodyScripts: "",
  });

  // Fetch SEO pages
  const { data: seoPages, isLoading } = useQuery<{ success: boolean; data: SeoPage[] }>({
    queryKey: ['/api/admin/seo-pages'],
    queryFn: async () => {
      const res = await fetch('/api/admin/seo-pages');
      if (!res.ok) throw new Error('Failed to fetch SEO pages');
      return res.json();
    },
  });

  // Get home page scripts for inheritance display
  const homePageScripts = seoPages?.data?.find(page => page.pagePath === '/');

  // Create SEO page mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/admin/seo-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create SEO page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] });
      // Invalidate public SEO endpoints cache
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      setLastSchemaUpdate(new Date().toISOString());
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ 
        title: "SEO page created successfully",
        description: "Public SEO endpoints (sitemap, schema, robots.txt) have been updated"
      });
    },
    onError: (error) => {
      toast({ title: "Error creating SEO page", description: error.message, variant: "destructive" });
    },
  });

  // Update SEO page mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await fetch(`/api/admin/seo-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update SEO page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] });
      // Invalidate public SEO endpoints cache
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      setLastSchemaUpdate(new Date().toISOString());
      setIsEditDialogOpen(false);
      setEditingPage(null);
      resetForm();
      toast({ 
        title: "SEO page updated successfully",
        description: "Public SEO endpoints (sitemap, schema, robots.txt) have been updated"
      });
    },
    onError: (error) => {
      toast({ title: "Error updating SEO page", description: error.message, variant: "destructive" });
    },
  });

  // Delete SEO page mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/seo-pages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete SEO page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] });
      // Invalidate public SEO endpoints cache
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      toast({ 
        title: "SEO page deleted successfully",
        description: "Public SEO endpoints (sitemap, schema, robots.txt) have been updated"
      });
    },
    onError: (error) => {
      toast({ title: "Error deleting SEO page", description: error.message, variant: "destructive" });
    },
  });

  // Update SEO pages with job data mutation
  const updateJobDataMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/admin/seo-pages/update-job-data', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update SEO pages with job data');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] });
      setLastSchemaUpdate(new Date().toISOString());
      const { updated, errors } = data.data;

      if (updated.length > 0) {
        toast({ 
          title: "SEO pages updated successfully", 
          description: `Updated pages: ${updated.join(', ')}` 
        });
      }

      if (errors.length > 0) {
        toast({ 
          title: "Some updates failed", 
          description: errors.join(', '), 
          variant: "destructive" 
        });
      }
    },
    onError: (error) => {
      toast({ 
        title: "Error updating SEO pages", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  // Mutation to upload SEO meta images
  const imageUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-seo-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setUploadedImageUrl(data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setUploadingImage(true);
    },
    onSettled: () => {
      setUploadingImage(false);
    },
  });

  const resetForm = () => {
    setFormData({
      pagePath: "",
      pageTitle: "",
      metaDescription: "",
      metaKeywords: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogType: "website",
      ogUrl: "",
      twitterCard: "summary_large_image",
      twitterSite: "@niddik",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      twitterCreator: "@niddik",
      canonicalUrl: "",
      robotsDirective: "index,follow",
      structuredData: JSON.stringify(getDefaultStructuredData(""), null, 2),
      itemPropName: "",
      itemPropDescription: "",
      itemPropImage: "",
      isActive: true,
      headScripts: "",
      bodyScripts: "",
    });
  };

  const handleEdit = (page: SeoPage) => {
    setEditingPage(page);
    setUploadedImageUrl("");

    // Use existing structured data or generate appropriate default
    const structuredData = page.structuredData || JSON.stringify(getDefaultStructuredData(page.pagePath), null, 2);

    setFormData({
      pagePath: page.pagePath,
      pageTitle: page.pageTitle,
      metaDescription: page.metaDescription,
      metaKeywords: page.metaKeywords || "",
      ogTitle: page.ogTitle || "",
      ogDescription: page.ogDescription || "",
      ogImage: page.ogImage || "",
      ogType: page.ogType,
      ogUrl: page.ogUrl || "",
      twitterCard: page.twitterCard,
      twitterSite: page.twitterSite || "",
      twitterTitle: page.twitterTitle || "",
      twitterDescription: page.twitterDescription || "",
      twitterImage: page.twitterImage || "",
      twitterCreator: page.twitterCreator || "",
      canonicalUrl: page.canonicalUrl || "",
      robotsDirective: page.robotsDirective,
      structuredData: structuredData,
      itemPropName: page.itemPropName || "",
      itemPropDescription: page.itemPropDescription || "",
      itemPropImage: page.itemPropImage || "",
      isActive: page.isActive,
      headScripts: page.headScripts || "",
      bodyScripts: page.bodyScripts || "",
    });
    setIsEditDialogOpen(true);
  };

    const handleAdd = () => {
      setEditingPage(null);
      setUploadedImageUrl("");
      setIsCreateDialogOpen(true);
    };

  const filteredPages = seoPages?.data?.filter(page =>
    page.pagePath.toLowerCase().includes(search.toLowerCase()) ||
    page.pageTitle.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout title="SEO Pages Management" description="Manage SEO metadata for all pages">
      <Helmet>
        <title>SEO Pages Management | Admin Dashboard</title>
        <meta name="description" content="Manage SEO metadata, Open Graph tags, Twitter cards, and structured data for all website pages." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-3xl font-bold">SEO Pages Management</h1>
            <p className="text-muted-foreground">Manage SEO metadata for all website pages</p> */}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => updateJobDataMutation.mutate()}
              disabled={updateJobDataMutation.isPending}
            >
              {updateJobDataMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Update Job Data
                </>
              )}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add SEO Page
                </Button>
              </DialogTrigger>
              <SEOPageDialog
                title="Create SEO Page"
                formData={formData}
                setFormData={setFormData}
                onSubmit={() => createMutation.mutate(formData)}
                isLoading={createMutation.isPending}
                onCancel={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
              />
            </Dialog>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Automatic Job Data Updates</h3>
                <p className="text-sm text-blue-700 mt-1">
                  SEO pages for <code>/</code> and <code>/careers</code> are automatically updated with the latest job postings from the last 7 days. 
                  Updates happen when jobs are created/modified, or you can trigger manual updates using the "Update Job Data" button.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  This enhances meta descriptions, keywords, and structured data with fresh job content for better SEO performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Script Inheritance Info Card */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2">
                <Code className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Script Inheritance System</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Scripts added to the <strong>Home Page (/)</strong> are automatically applied to all other pages across the website. 
                  This includes tracking codes like Google Analytics, Facebook Pixel, etc.
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Pages showing <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 mx-1">+ Home Scripts Applied</Badge> 
                  inherit and execute the home page scripts in addition to their own page-specific scripts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by page path or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schema Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              SEO Files Management
            </CardTitle>
            <CardDescription>
              View and manage your public SEO endpoints for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Schema URL</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This URL contains all active SEO pages in JSON-LD format for search engines
                  </p>
                  <code className="text-sm bg-background px-2 py-1 rounded mt-2 inline-block">
                    {window.location.origin}/schema
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/schema`);
                      toast({ title: "URL copied to clipboard" });
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${window.location.origin}/schema`, '_blank')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    View Schema
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sitemap.xml URL</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dynamic sitemap containing all active pages and job listings
                  </p>
                  <code className="text-sm bg-background px-2 py-1 rounded mt-2 inline-block">
                    {window.location.origin}/sitemap.xml
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/sitemap.xml`);
                      toast({ title: "URL copied to clipboard" });
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${window.location.origin}/sitemap.xml`, '_blank')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    View Sitemap
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Robots.txt URL</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically generated robots.txt file for search engine crawlers
                  </p>
                  <code className="text-sm bg-background px-2 py-1 rounded mt-2 inline-block">
                    {window.location.origin}/robots.txt
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/robots.txt`);
                      toast({ title: "URL copied to clipboard" });
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${window.location.origin}/robots.txt`, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Robots.txt
                  </Button>
                </div>
              </div>
            </div>

            {lastSchemaUpdate && (
              <div className="text-sm text-muted-foreground">
                Last schema update: {new Date(lastSchemaUpdate).toLocaleString()}
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-1">
                  <Globe className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Important Note</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Only <strong>Active</strong> SEO pages appear in public endpoints (sitemap.xml, schema, robots.txt). 
                    Inactive pages are hidden from search engines and public access.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <strong>For Google Search Console:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Copy the schema URL above</li>
                <li>Go to Google Search Console → Sitemaps</li>
                <li>Add the schema URL as a sitemap</li>
                <li>Submit for indexing</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* SEO Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Pages ({filteredPages.length})</CardTitle>
            <CardDescription>
              Configure SEO metadata, Open Graph tags, Twitter cards, and structured data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading SEO pages...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Path</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Scripts & Inheritance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <code className="text-sm bg-muted px-1 rounded">{page.pagePath}</code>
                          {(page.pagePath === '/' || page.pagePath === '/careers') && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Auto-Updated
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={page.pageTitle}>
                          {page.pageTitle}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={page.metaDescription}>
                          {page.metaDescription}
                        </div>
                      </TableCell>
                       <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          <div className="truncate" title={`${page.headScripts || ''}\n${page.bodyScripts || ''}`}>
                            {(page.headScripts || page.bodyScripts) ? "Has Scripts" : "No Scripts"}
                          </div>
                          {page.pagePath !== '/' && homePageScripts?.headScripts && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              + Home Scripts Applied
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(page.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete SEO Page</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the SEO configuration for "{page.pagePath}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(page.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SEOPageDialog
            title="Edit SEO Page"
            formData={formData}
            setFormData={setFormData}
            onSubmit={() => editingPage && updateMutation.mutate({ id: editingPage.id, data: formData })}
            isLoading={updateMutation.isPending}
            isEdit={true}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingPage(null);
              resetForm();
            }}
          />
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// SEO Page Dialog Component
interface SEOPageDialogProps {
  title: string;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEdit?: boolean;
  onCancel: () => void;
}

function SEOPageDialog({ title, formData, setFormData, onSubmit, isLoading, isEdit, onCancel }: SEOPageDialogProps) {
  const { toast } = useToast();
    const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [lastSchemaUpdate, setLastSchemaUpdate] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };

      // Auto-populate structured data when page path changes
      if (field === 'pagePath' && value && !isEdit) {
        newData.structuredData = JSON.stringify(getDefaultStructuredData(value), null, 2);
      }

      return newData;
    });
  };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        imageUploadMutation.mutate(file);
      }
    };

    const handleImageUrlSet = (url: string, field: 'ogImage' | 'twitterImage' | 'itemPropImage') => {
      setFormData(prev => ({ ...prev, [field]: url }));
      setUploadedImageUrl("");
    };

      const imageUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-seo-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setUploadedImageUrl(data.url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
       queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setUploadingImage(true);
    },
    onSettled: () => {
      setUploadingImage(false);
    },
  });

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Configure SEO metadata, social media tags, and structured data
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="pagePath">Page Path *</Label>
                {isEdit ? (
                  <Input
                    id="pagePath"
                    value={formData.pagePath}
                    disabled
                    className="bg-muted"
                  />
                ) : (
                  <Select
                    value={formData.pagePath}
                    onValueChange={(value) => handleInputChange('pagePath', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a page path" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonPaths.map((path) => (
                        <SelectItem key={path.value} value={path.value}>
                          {path.label} ({path.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!isEdit && (
                  <div className="mt-2">
                    <Input
                      placeholder="Or enter custom path (e.g., /custom-page)"
                      value={formData.pagePath.startsWith('/') && !commonPaths.find(p => p.value === formData.pagePath) ? formData.pagePath : ''}
                      onChange={(e) => handleInputChange('pagePath', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="pageTitle">Page Title * (50-60 characters recommended)</Label>
                <Input
                  id="pageTitle"
                  value={formData.pageTitle}
                  onChange={(e) => handleInputChange('pageTitle', e.target.value)}
                  placeholder="Enter page title"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.pageTitle.length}/60 characters
                </div>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description * (150-160 characters recommended)</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Enter meta description"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescription.length}/160 characters
                </div>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords (comma-separated)</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Scripts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="headScripts">Head Scripts</Label>
                <Textarea
                  id="headScripts"
                  value={formData.headScripts}
                  onChange={(e) => handleInputChange('headScripts', e.target.value)}
                  placeholder="Enter scripts to be placed in the head"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="bodyScripts">Body Scripts</Label>
                <Textarea
                  id="bodyScripts"
                  value={formData.bodyScripts}
                  onChange={(e) => handleInputChange('bodyScripts', e.target.value)}
                  placeholder="Enter scripts to be placed in the body"
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Open Graph (Facebook)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  value={formData.ogTitle}
                  onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                  placeholder="Leave blank to use page title"
                />
              </div>

              <div>
                <Label htmlFor="ogType">OG Type</Label>
                <Select
                  value={formData.ogType}
                  onChange={(value) => handleInputChange('ogType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="business.business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={formData.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                placeholder="Leave blank to use meta description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ogImage"
                      value={formData.ogImage}
                      onChange={(e) => handleInputChange('ogImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="ogImageUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById('ogImageUpload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                  {uploadedImageUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm truncate">{uploadedImageUrl}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleImageUrlSet(uploadedImageUrl, 'ogImage')}
                      >
                        Use
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedImageUrl("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

              <div>
                <Label htmlFor="ogUrl">OG URL</Label>
                <Input
                  id="ogUrl"
                  value={formData.ogUrl}
                  onChange={(e) => handleInputChange('ogUrl', e.target.value)}
                  placeholder="Leave blank to auto-generate"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Twitter Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Twitter Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitterCard">Twitter Card Type</Label>
                <Select
                  value={formData.twitterCard}
                  onChange={(value) => handleInputChange('twitterCard', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="twitterSite">Twitter Site Handle</Label>
                <Input
                  id="twitterSite"
                  value={formData.twitterSite}
                  onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                  placeholder="@niddik"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitterTitle">Twitter Title</Label>
                <Input
                  id="twitterTitle"
                  value={formData.twitterTitle}
                  onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                  placeholder="Leave blank to use OG title"
                />
              </div>

              <div>
                <Label htmlFor="twitterCreator">Twitter Creator</Label>
                <Input
                  id="twitterCreator"
                  value={formData.twitterCreator}
                  onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                  placeholder="@niddik"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                value={formData.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                placeholder="Leave blank to use OG description"
                rows={2}
              />
            </div>

               <div className="space-y-2">
                  <Label htmlFor="twitterImage">Twitter Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="twitterImage"
                      value={formData.twitterImage}
                      onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                      placeholder="https://example.com/twitter-image.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="ogImageUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById('ogImageUpload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                  {uploadedImageUrl && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="text-sm truncate">{uploadedImageUrl}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleImageUrlSet(uploadedImageUrl, 'twitterImage')}
                      >
                        Use
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedImageUrl("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
          </CardContent>
        </Card>

        {/* Schema.org Microdata */}
        <Card>
          <CardHeader>
            <CardTitle>Schema.org Microdata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="itemPropName">ItemProp Name</Label>
                <Input
                  id="itemPropName"
                  value={formData.itemPropName}
                  onChange={(e) => handleInputChange('itemPropName', e.target.value)}
                  placeholder="Page name for microdata"
                />
              </div>

              <div>
                <Label htmlFor="itemPropDescription">ItemProp Description</Label>
                <Input
                  id="itemPropDescription"
                  value={formData.itemPropDescription}
                  onChange={(e) => handleInputChange('itemPropDescription', e.target.value)}
                  placeholder="Page description for microdata"
                />
              </div>

              <div>
                <Label htmlFor="itemPropImage">ItemProp Image</Label>
                <Input
                  id="itemPropImage"
                  value={formData.itemPropImage}
                  onChange={(e) => handleInputChange('itemPropImage', e.target.value)}
                  placeholder="Image URL for microdata"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  placeholder="Leave blank to auto-generate"
                />
              </div>

              <div>
                <Label htmlFor="robotsDirective">Robots Directive</Label>
                <Select
                  value={formData.robotsDirective}
                  onChange={(value) => handleInputChange('robotsDirective', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index,follow">Index, Follow</SelectItem>
                    <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                    <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                    <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="structuredData">Structured Data (JSON-LD)</Label>
              <Textarea
                id="structuredData"
                value={formData.structuredData}
                onChange={(e) => handleInputChange('structuredData', e.target.value)}
                placeholder="Enter JSON-LD structured data"
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save SEO Page"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
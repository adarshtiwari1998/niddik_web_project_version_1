
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Globe, Search, Image, Code, FileText } from "lucide-react";
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

const defaultStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "",
  "description": "",
  "url": "",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Niddik",
    "url": "https://niddik.com"
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
    structuredData: JSON.stringify(defaultStructuredData, null, 2),
    itemPropName: "",
    itemPropDescription: "",
    itemPropImage: "",
    isActive: true,
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
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "SEO page created successfully" });
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
      setIsEditDialogOpen(false);
      setEditingPage(null);
      resetForm();
      toast({ title: "SEO page updated successfully" });
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
      toast({ title: "SEO page deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting SEO page", description: error.message, variant: "destructive" });
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
      structuredData: JSON.stringify(defaultStructuredData, null, 2),
      itemPropName: "",
      itemPropDescription: "",
      itemPropImage: "",
      isActive: true,
    });
  };

  const handleEdit = (page: SeoPage) => {
    setEditingPage(page);
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
      structuredData: page.structuredData || JSON.stringify(defaultStructuredData, null, 2),
      itemPropName: page.itemPropName || "",
      itemPropDescription: page.itemPropDescription || "",
      itemPropImage: page.itemPropImage || "",
      isActive: page.isActive,
    });
    setIsEditDialogOpen(true);
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
            <h1 className="text-3xl font-bold">SEO Pages Management</h1>
            <p className="text-muted-foreground">Manage SEO metadata for all website pages</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
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
            />
          </Dialog>
        </div>

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
                      <TableCell>
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(page.updatedAt).toLocaleDateString()}
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
}

function SEOPageDialog({ title, formData, setFormData, onSubmit, isLoading, isEdit }: SEOPageDialogProps) {
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

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
                  onValueChange={(value) => handleInputChange('ogType', value)}
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
              <div>
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={formData.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
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
                  onValueChange={(value) => handleInputChange('twitterCard', value)}
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

            <div>
              <Label htmlFor="twitterImage">Twitter Image URL</Label>
              <Input
                id="twitterImage"
                value={formData.twitterImage}
                onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                placeholder="https://example.com/twitter-image.jpg"
              />
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
                  onValueChange={(value) => handleInputChange('robotsDirective', value)}
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
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save SEO Page"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

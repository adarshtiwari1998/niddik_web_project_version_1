import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { Briefcase, Clock, MapPin, Search, Filter, Loader2, Award, FileText, User, Mail, Globe, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CareersLayout from "@/components/careers/CareersLayout";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/use-auth";

export default function CareerPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all_categories");
  const [jobType, setJobType] = useState("all_types");
  const [experienceLevel, setExperienceLevel] = useState("all_levels");
  const [priority, setPriority] = useState("all_priorities");

  const { data, isLoading, error } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { 
      status: 'active',
      page: 1,
      limit: 1000
    }],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Admin-only queries for dashboard stats - using same queries as AdminDashboard
  const { data: applicationsData } = useQuery<{ 
    success: boolean; 
    data: Array<any>;
    meta: { total: number; page: number; limit: number; pages: number }
  }>({
    queryKey: ['/api/admin/applications'],
    queryFn: async () => {
      const res = await fetch('/api/admin/applications', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: submittedCandidatesData } = useQuery<{
    success: boolean;
    data: any[];
    meta: { total: number; page: number; limit: number; pages: number }
  }>({
    queryKey: ['/api/submitted-candidates'],
    queryFn: async () => {
      const res = await fetch('/api/submitted-candidates?page=1&limit=1', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch submitted candidates');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: demoRequestsData } = useQuery<{
    success: boolean;
    data: any[];
    meta: { total: number; page: number; limit: number; pages: number }
  }>({
    queryKey: ['/api/admin/demo-requests'],
    queryFn: async () => {
      const res = await fetch('/api/admin/demo-requests?page=1&limit=1', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch demo requests');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: contactSubmissionsData } = useQuery<{
    success: boolean;
    data: any[];
    meta: { total: number; page: number; limit: number; pages: number }
  }>({
    queryKey: ['/api/admin/contact-submissions'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contact-submissions?page=1&limit=1', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch contact submissions');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { data: seoData } = useQuery<{
    success: boolean;
    data: any[];
  }>({
    queryKey: ['/api/admin/seo-pages'],
    queryFn: async () => {
      const res = await fetch('/api/admin/seo-pages', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch SEO pages');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Query for job applicants
  const { 
    data: applicantsData, 
    isLoading: isLoadingApplicants,
    refetch: refetchApplicants 
  } = useQuery({
    queryKey: ['/api/submitted-candidates/job-applicants'],
    queryFn: async () => {
      // Assuming apiRequest is defined elsewhere
      const apiRequest = async (method: string, url: string) => {
        const res = await fetch(url, { method });
        return res;
      };
      const res = await apiRequest("GET", `/api/submitted-candidates/job-applicants`);
      if (!res.ok) throw new Error("Failed to fetch job applicants");
      return await res.json();
    },
    enabled: false // Don't load automatically, only when requested
  });

  // Query for application counts per job (admin only)
  const { data: applicationCountsData } = useQuery({
    queryKey: ['/api/admin/job-application-counts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/job-application-counts', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch application counts');
      return res.json();
    },
    enabled: user?.role === 'admin',
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Get unique values for filter options from available jobs
  const availableCategories = Array.from(new Set(data?.data.map(job => job.category).filter(Boolean))) || [];
  const availableJobTypes = Array.from(new Set(data?.data.map(job => job.jobType).filter(Boolean))) || [];
  const availableExperienceLevels = Array.from(new Set(data?.data.map(job => job.experienceLevel).filter(Boolean))) || [];

  // Filter the data client-side for real-time search
  const filteredJobs = data?.data.filter((job) => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = searchLower === '' || 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.category.toLowerCase().includes(searchLower) ||
      job.experienceLevel.toLowerCase().includes(searchLower) ||
      job.jobType.toLowerCase().includes(searchLower) ||
      (job.skills && job.skills.toLowerCase().includes(searchLower)) ||
      (job.requirements && job.requirements.toLowerCase().includes(searchLower)) ||
      (job.salary && job.salary.toLowerCase().includes(searchLower));

    const matchesCategory = category === 'all_categories' || job.category === category;
    const matchesJobType = jobType === 'all_types' || job.jobType === jobType;
    const matchesExperienceLevel = experienceLevel === 'all_levels' || job.experienceLevel === experienceLevel;

    const matchesPriority = priority === 'all_priorities' ||
      (priority === 'urgent' && job.urgent) ||
      (priority === 'priority' && job.priority) ||
      (priority === 'open' && job.isOpen) ||
      (priority === 'featured' && job.featured);

    return matchesSearch && matchesCategory && matchesJobType && matchesExperienceLevel && matchesPriority;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is now handled automatically by the filteredJobs computation
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all_categories");
    setJobType("all_types");
    setExperienceLevel("all_levels");
    setPriority("all_priorities");
  };

  // Function to calculate time difference
  const timeAgo = (dateString: string): string => {
    if (!dateString) return 'Recently';
    
    // Create dates and ensure we're comparing at midnight for day calculations
    const postedDate = new Date(dateString);
    const now = new Date();
    
    // Check if the date is valid
    if (isNaN(postedDate.getTime())) {
      return 'Recently';
    }
    
    // Normalize both dates to midnight for accurate day comparison
    const postedDateNormalized = new Date(postedDate.getFullYear(), postedDate.getMonth(), postedDate.getDate());
    const nowNormalized = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate difference in milliseconds
    const diff = nowNormalized.getTime() - postedDateNormalized.getTime();
    
    // If the date is in the future, return "Recently"
    if (diff < 0) {
      return 'Recently';
    }
    
    // Calculate days based on normalized dates
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Debug logging (can be removed in production)
    console.log(`Date calculation: Posted: ${dateString}, Today: ${now.toDateString()}, Days diff: ${days}`);

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return '1 day ago';
    } else if (days > 1) {
      return `${days} days ago`;
    } else {
      return 'Recently';
    }
  };


  return (
    <>
      <SEO pagePath="/careers" />
      <CareersLayout>
        <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Admin Dashboard Cards - Only visible to admin users */}
        {user && user.role === 'admin' && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Admin Dashboard Overview</h2>
              <p className="text-muted-foreground">Quick stats and analytics for your recruitment platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Active Jobs */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-2xl font-bold">{data?.meta.total || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
                  <p className="text-xs text-gray-500 mb-3">Job listings currently active ({data?.meta.total || 0} total)</p>
                  <Link href="/admin/jobs">
                    <Button variant="link" className="text-xs p-0 h-auto text-green-600 hover:text-green-800">
                      View all jobs →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Total Candidates */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-2xl font-bold">{applicationsData?.data?.length || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Candidates</p>
                  <p className="text-xs text-gray-500 mb-3">All job applications received</p>
                  <Link href="/admin/candidates">
                    <Button variant="link" className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800">
                      View all candidates →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* New Applications */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-2xl font-bold">
                        {applicationsData?.data?.filter((app: any) => app.status === 'new').length || 0}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Applications</p>
                  <p className="text-xs text-gray-500 mb-3">Applications awaiting review</p>
                  <Link href="/admin/candidates">
                    <Button variant="link" className="text-xs p-0 h-auto text-purple-600 hover:text-purple-800">
                      Review applications →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Interview Stage */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-2xl font-bold">
                        {applicationsData?.data?.filter((app: any) => app.status === 'interview').length || 0}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Interview Stage</p>
                  <p className="text-xs text-gray-500 mb-3">Candidates in interview process</p>
                  <Link href="/admin/candidates">
                    <Button variant="link" className="text-xs p-0 h-auto text-orange-600 hover:text-orange-800">
                      See interview pipeline →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Submitted Candidates */}
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-2xl font-bold">{submittedCandidatesData?.meta?.total || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Submitted Candidates</p>
                  <p className="text-xs text-gray-500 mb-3">Candidates submitted to clients</p>
                  <Link href="/admin/submitted-candidates">
                    <Button variant="link" className="text-xs p-0 h-auto text-indigo-600 hover:text-indigo-800">
                      View submissions →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Demo Requests */}
              <Card className="border-l-4 border-l-pink-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-pink-600" />
                      <CardTitle className="text-2xl font-bold">{demoRequestsData?.meta?.total || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Demo Requests</p>
                  <p className="text-xs text-gray-500 mb-3">Pending demo requests</p>
                  <Link href="/admin/demo-requests">
                    <Button variant="link" className="text-xs p-0 h-auto text-pink-600 hover:text-pink-800">
                      Manage requests →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Submissions */}
              <Card className="border-l-4 border-l-teal-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-teal-600" />
                      <CardTitle className="text-2xl font-bold">{contactSubmissionsData?.meta?.total || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Contact Submissions</p>
                  <p className="text-xs text-gray-500 mb-3">Messages from contact form</p>
                  <Link href="/admin/contact-submissions">
                    <Button variant="link" className="text-xs p-0 h-auto text-teal-600 hover:text-teal-800">
                      View messages →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* SEO Pages */}
              <Card className="border-l-4 border-l-cyan-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-cyan-600" />
                      <CardTitle className="text-2xl font-bold">{seoData?.data?.length || 0}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active SEO Pages</p>
                  <p className="text-xs text-gray-500 mb-3">SEO optimized pages ({seoData?.data?.length || 0} total)</p>
                  <Link href="/admin/seo-pages">
                    <Button variant="link" className="text-xs p-0 h-auto text-cyan-600 hover:text-cyan-800">
                      Manage SEO →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-8" />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          {user && user.role === 'admin' ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Talent Acquisition Dashboard</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Manage your recruitment pipeline, track candidate applications, and oversee all talent acquisition activities from this centralized admin dashboard.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover opportunities to grow your career with Niddik. We're looking for talented individuals to help us build the future of talent acquisition.
              </p>
            </>
          )}
        </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job title or keywords"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:w-2/3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">All Categories</SelectItem>
                    {availableCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    {availableJobTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                    {availableExperienceLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_priorities">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Clear Filters
              </Button>
              <Button type="submit">Search Jobs</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Available Positions</h2>
          {data && (
            <p className="text-muted-foreground">
              Showing {filteredJobs.length} of {data.meta.total} opportunities
            </p>
          )}
        </div>

        <Separator className="my-6" />

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load jobs. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No jobs match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}


<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const isDraft = job.status === 'draft';
            const CardComponent = ({ children }: { children: React.ReactNode }) => {
              if (isDraft) {
                return (
                  <Card className={`overflow-hidden transition-shadow duration-300 opacity-40 cursor-not-allowed relative`}>
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-gray-500 text-white text-xs font-bold">DRAFT</Badge>
                    </div>
                    {children}
                  </Card>
                );
              }
              return (
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {children}
                </Card>
              );
            };

            return (
              <CardComponent key={job.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">{job.title}</CardTitle>
                      <CardDescription className="text-sm">{job.company}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {job.featured && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">Featured</Badge>
                      )}
                      {job.urgent && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">
                          <span className="animate-pulse">🔥</span> Urgent
                        </Badge>
                      )}
                      {job.priority && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">
                          ⚡ Priority
                        </Badge>
                      )}
                      {job.isOpen && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                          ✅ Open
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <Badge variant="outline">{job.jobType}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="h-3 w-3 mr-1" />
                      <span>{job.experienceLevel}</span>
                    </div>
                    <span className="font-medium text-primary">{job.salary}</span>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Award className="h-3 w-3 mr-1" />
                          <span>Category:</span>
                        </div>
                        <span className="font-medium">{job.category}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Posted On:</span>
                        </div>
                        <span className="font-medium">
                          {(() => {
                            if (!job.postedDate) return "Recently";
                            
                            const postedDate = new Date(job.postedDate);
                            if (isNaN(postedDate.getTime())) return "Recently";
                            
                            const formattedDate = format(postedDate, "MMM dd, yyyy");
                            const timeAgoText = timeAgo(job.postedDate);
                            
                            return `${formattedDate} (${timeAgoText})`;
                          })()}
                        </span>

                      </div>
                    </div>

                    {/* Display application counts for admin */}
                    {user?.role === 'admin' && applicationCountsData && (
                      <div className="mt-2 text-center">
                        <span className="text-blue-500 font-semibold">
                          {applicationCountsData.data?.[job.id] || 0} Candidates Applied
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  {isDraft ? (
                    <Button disabled className="w-full cursor-not-allowed opacity-50">
                      Draft - Not Available
                    </Button>
                  ) : (
                    <Link href={`/jobs/${job.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  )}
                </CardFooter>
              </CardComponent>
            );
          })}
        </div>

        {/* Pagination can be added here later */}
      </div>
      </div>
      </CareersLayout>
    </>
  );
}
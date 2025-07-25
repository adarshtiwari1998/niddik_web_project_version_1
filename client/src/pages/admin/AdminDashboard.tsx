import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Briefcase, Users, Calendar, Activity, Clock, ChevronRight, CreditCard, Box, RefreshCw, Mail, Globe, UserCheck, CalendarClock, FileText } from "lucide-react";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";
import AdminLayout from "@/components/layout/AdminLayout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { JobListing, JobApplication } from "@shared/schema";
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Get tab from URL parameters
  const getActiveTabFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'account' || tab === 'password') {
      return tab;
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL);

  // Watch for location changes to update active tab
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location]);

  // Listen for URL changes to update active tab
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getActiveTabFromURL());
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Check URL on component mount to set correct initial tab
    setActiveTab(getActiveTabFromURL());
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const newURL = tab === 'overview' 
      ? '/admin/dashboard' 
      : `/admin/dashboard?tab=${tab}`;
    window.history.pushState(null, '', newURL);
  };

  useEffect(() => {
    document.title = "Admin Dashboard | NiDDiK"

    const isComingFromLogin = sessionStorage.getItem('admin_dashboard_loading') === 'true';
    if (isComingFromLogin) {
      setInitialLoading(true);
      sessionStorage.removeItem('admin_dashboard_loading');
    }
  }, []);

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery<{ data: JobListing[] }>({
    queryKey: ['/api/job-listings', { page: 1, limit: 1000 }],
    queryFn: async () => {
      const res = await fetch('/api/job-listings?page=1&limit=1000', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch job listings');
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const { data: applicationsData, isLoading: isLoadingApplications } = useQuery<{ 
    success: boolean; 
    data: Array<JobApplication & { user: any; job: any }>;
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
    refetchInterval: 15000, // Refetch every 15 seconds for more frequent updates
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data stale immediately
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const { data: submittedCandidatesData, isLoading: isLoadingSubmittedCandidates } = useQuery<{
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
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const { data: demoRequestsData, isLoading: isLoadingDemoRequests } = useQuery<{
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
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const { data: contactSubmissionsData, isLoading: isLoadingContactSubmissions } = useQuery<{
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
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const { data: seoData, isLoading: isLoadingSEO } = useQuery<{
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
    refetchInterval: 60000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  // Job counts by status
  const activeJobs = jobsData?.data?.filter(job => job.status === 'active')?.length || 0;
  const draftJobs = jobsData?.data?.filter(job => job.status === 'draft')?.length || 0;
  const filledJobs = jobsData?.data?.filter(job => job.status === 'filled')?.length || 0;
  const expiredJobs = jobsData?.data?.filter(job => job.status === 'expired')?.length || 0;
  const totalJobs = jobsData?.data?.length || 0;
  
  const totalApplications = applicationsData?.data?.length || 0;

  const newApplications = applicationsData?.data?.filter(app => app.status === 'new')?.length || 0;
  const reviewingApplications = applicationsData?.data?.filter(app => app.status === 'reviewing')?.length || 0;
  const interviewApplications = applicationsData?.data?.filter(app => app.status === 'interview')?.length || 0;
  const hiredApplications = applicationsData?.data?.filter(app => app.status === 'hired')?.length || 0;

  // Additional dashboard data
  const totalSubmittedCandidates = submittedCandidatesData?.meta?.total || 0;
  const totalDemoRequests = demoRequestsData?.meta?.total || 0;
  const totalContactSubmissions = contactSubmissionsData?.meta?.total || 0;
  const totalSEOPages = seoData?.data?.length || 0;
  const activeSEOPages = seoData?.data?.filter(page => page.isActive)?.length || 0;

  const recentApplications = applicationsData?.data?.slice(0, 5) || [];

  useEffect(() => {
    if (!isLoadingJobs && !isLoadingApplications && !isLoadingSubmittedCandidates && !isLoadingDemoRequests && !isLoadingContactSubmissions && !isLoadingSEO) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoadingJobs, isLoadingApplications, isLoadingSubmittedCandidates, isLoadingDemoRequests, isLoadingContactSubmissions, isLoadingSEO]);

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/job-listings', { page: 1, limit: 1000 }] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/submitted-candidates'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/demo-requests'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-submissions'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/admin/seo-pages'] })
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout title="Dashboard" description="Overview and insights">
      <Helmet>
        <title>Admin Dashboard | Niddik</title>
        <meta name="description" content="Manage job listings, applications, and candidate profiles." />
        <meta property="og:title" content="Admin Dashboard | Niddik" />
        <meta property="og:description" content="Manage job listings, applications, and candidate profiles." />
      </Helmet>
      {initialLoading && <LoadingScreen message="Loading admin dashboard..." />}
      
      <div className="flex justify-end items-center mb-6">
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="mb-6 overflow-x-auto">
          <TabsList className="w-full min-w-fit flex-nowrap">
            <TabsTrigger value="overview" className="whitespace-nowrap">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="account" className="whitespace-nowrap">Account Settings</TabsTrigger>
            <TabsTrigger value="password" className="whitespace-nowrap">Change Password</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary relative">
              {isLoadingJobs && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    {isLoadingJobs ? "..." : activeJobs}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground space-y-1">
                      {draftJobs > 0 && <div>Draft: {draftJobs}</div>}
                      {filledJobs > 0 && <div>Filled: {filledJobs}</div>}
                      {expiredJobs > 0 && <div>Expired: {expiredJobs}</div>}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Active Jobs</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Job listings currently active ({totalJobs} total)
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/jobs" className="flex items-center text-xs text-primary hover:underline">
                  View all jobs
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-green-500 relative">
              {isLoadingApplications && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  {isLoadingApplications ? "..." : totalApplications}
                </CardTitle>
                <CardDescription>Total Candidates</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  All job applications received
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/candidates" className="flex items-center text-xs text-primary hover:underline">
                  View all candidates
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-blue-500 relative">
              {isLoadingApplications && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  {isLoadingApplications ? "..." : newApplications}
                </CardTitle>
                <CardDescription>New Applications</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Applications awaiting review
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/candidates" className="flex items-center text-xs text-primary hover:underline">
                  Review applications
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-amber-500 relative">
              {isLoadingApplications && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-amber-500" />
                  {isLoadingApplications ? "..." : interviewApplications}
                </CardTitle>
                <CardDescription>Interview Stage</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Candidates in interview process
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/candidates" className="flex items-center text-xs text-primary hover:underline">
                  See interview pipeline
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-purple-500 relative">
              {isLoadingSubmittedCandidates && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-500" />
                  {isLoadingSubmittedCandidates ? "..." : totalSubmittedCandidates}
                </CardTitle>
                <CardDescription>Submitted Candidates</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Candidates submitted to clients
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/submitted-candidates" className="flex items-center text-xs text-primary hover:underline">
                  View submissions
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-orange-500 relative">
              {isLoadingDemoRequests && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-orange-500" />
                  {isLoadingDemoRequests ? "..." : totalDemoRequests}
                </CardTitle>
                <CardDescription>Demo Requests</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Pending demo requests
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/demo-requests" className="flex items-center text-xs text-primary hover:underline">
                  Manage requests
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-cyan-500 relative">
              {isLoadingContactSubmissions && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-cyan-500" />
                  {isLoadingContactSubmissions ? "..." : totalContactSubmissions}
                </CardTitle>
                <CardDescription>Contact Submissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Messages from contact form
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/contact-submissions" className="flex items-center text-xs text-primary hover:underline">
                  View messages
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-teal-500 relative">
              {isLoadingSEO && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-teal-500" />
                    {isLoadingSEO ? "..." : activeSEOPages}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {totalSEOPages > activeSEOPages && <div>Inactive: {totalSEOPages - activeSEOPages}</div>}
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>Active SEO Pages</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  SEO optimized pages ({totalSEOPages} total)
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/seo-pages" className="flex items-center text-xs text-primary hover:underline">
                  Manage SEO
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-indigo-500 relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  0
                </CardTitle>
                <CardDescription>Timesheet Management</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Manage candidate timesheets and billing
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/timesheets" className="flex items-center text-xs text-primary hover:underline">
                  Manage timesheets
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Breakdown of all applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                      <span>New</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{newApplications}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({totalApplications > 0 ? Math.round((newApplications / totalApplications) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      <span>Reviewing</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{reviewingApplications}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({totalApplications > 0 ? Math.round((reviewingApplications / totalApplications) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                      <span>Interview</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{interviewApplications}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({totalApplications > 0 ? Math.round((interviewApplications / totalApplications) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Hired</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{hiredApplications}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({totalApplications > 0 ? Math.round((hiredApplications / totalApplications) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest candidate applications</CardDescription>
                </div>
                <Link href="/admin/candidates">
                  <div className="text-sm text-primary hover:underline flex items-center">
                    View all
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="py-4 text-center text-muted-foreground">Loading applications...</div>
                ) : recentApplications.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground">No applications found</div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application, index) => (
                      <div key={application.id} className={`flex justify-between items-start ${index < recentApplications.length - 1 ? 'pb-4 border-b' : ''}`}>
                        <div>
                          <div className="font-medium">{application.user?.fullName || 'Unknown Candidate'}</div>
                          <div className="text-xs text-muted-foreground">Applied for: {application.job?.title || 'Unknown Position'}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(application.appliedDate)}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${application.status === 'new' ? 'bg-primary/10 text-primary' : 
                            application.status === 'reviewing' ? 'bg-purple-500/10 text-purple-500' : 
                            application.status === 'interview' ? 'bg-amber-500/10 text-amber-500' : 
                            application.status === 'hired' ? 'bg-green-500/10 text-green-500' : 
                            'bg-gray-500/10 text-gray-500'}`}>
                          {application.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
              <CardDescription>
                Admin account details and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Username</h4>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h4>
                    <p className="text-lg font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Role</h4>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-primary" />
                      <p className="text-lg font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <AdminPasswordChange />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
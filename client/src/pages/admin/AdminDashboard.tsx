import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Briefcase, Users, Calendar, Activity, Clock, ChevronRight, CreditCard, Box } from "lucide-react";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";
import AdminLayout from "@/components/layout/AdminLayout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { JobListing, JobApplication } from "@shared/schema";
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Niddik</title>
        <meta name="description" content="Manage job listings, applications, and candidate profiles." />
        <meta property="og:title" content="Admin Dashboard | Niddik" />
        <meta property="og:description" content="Manage job listings, applications, and candidate profiles." />
      </Helmet>
      

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [initialLoading, setInitialLoading] = useState(true);

  // Show loading screen as soon as component mounts
  useEffect(function() {
    document.title = "Admin Dashboard | NiDDiK"

    // Check if we're coming from login (which sets this flag)
    const isComingFromLogin = sessionStorage.getItem('admin_dashboard_loading') === 'true';
    
    if (isComingFromLogin) {
      // Keep loading state true
      setInitialLoading(true);
      // Clear the flag
      sessionStorage.removeItem('admin_dashboard_loading');
    }
  }, []);

  // Fetch job statistics
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery<{ data: JobListing[] }>({
    queryKey: ['/api/job-listings'],
    queryFn: async () => {
      const res = await fetch('/api/job-listings');
      if (!res.ok) throw new Error('Failed to fetch job listings');
      return res.json();
    },
  });

  // Fetch application statistics
  const { data: applicationsData, isLoading: isLoadingApplications } = useQuery<{ 
    success: boolean; 
    data: Array<JobApplication & { user: any; job: any }>;
    meta: { total: number; page: number; limit: number; pages: number }
  }>({
    queryKey: ['/api/admin/applications'],
    queryFn: async () => {
      const res = await fetch('/api/admin/applications');
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    },
  });

  // Calculate statistics from the fetched data
  const totalJobs = jobsData?.data?.length || 0;
  const totalApplications = applicationsData?.data?.length || 0;

  // Calculate application statuses
  const newApplications = applicationsData?.data?.filter(app => app.status === 'new')?.length || 0;
  const reviewingApplications = applicationsData?.data?.filter(app => app.status === 'reviewing')?.length || 0;
  const interviewApplications = applicationsData?.data?.filter(app => app.status === 'interview')?.length || 0;
  const hiredApplications = applicationsData?.data?.filter(app => app.status === 'hired')?.length || 0;

  // Fetch recent applications for the dashboard
  const recentApplications = applicationsData?.data?.slice(0, 5) || [];

  // Effect to manage loading state
  useEffect(() => {
    // Check if data has loaded
    if (!isLoadingJobs && !isLoadingApplications) {
      // Shorter delay to ensure smooth transition
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoadingJobs, isLoadingApplications]);

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <AdminLayout title="Dashboard" description="Overview and insights">
      {initialLoading && <LoadingScreen message="Loading admin dashboard..." />}
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  {isLoadingJobs ? "..." : totalJobs}
                </CardTitle>
                <CardDescription>Active Jobs</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Total job listings currently active
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/admin/jobs" className="flex items-center text-xs text-primary hover:underline">
                  View all jobs
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-green-500">
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

            <Card className="border-l-4 border-l-blue-500">
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

            <Card className="border-l-4 border-l-amber-500">
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
          </div>

          {/* Status Breakdown */}
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
    </>
  );
}

export default AdminDashboard;
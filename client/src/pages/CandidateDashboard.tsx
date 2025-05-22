import { useState, useEffect  } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Building, Briefcase, MapPin, Calendar, FileCheck, Clock, BarChart3, 
  FileText, ExternalLink, Mail, Phone, UserCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobListing, JobApplication } from "@shared/schema";
import { format } from "date-fns";
import { Link, useRouter } from "wouter"; // Import useRouter
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Helmet } from 'react-helmet-async';

type ApplicationWithJob = JobApplication & {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salary: string;
    category: string;
    experienceLevel: string;
    postedDate: string;
  };
};

const CandidateDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Candidate Dashboard | Niddik</title>
        <meta name="description" content="Manage your job applications, track progress, and update your profile." />
        <meta property="og:title" content="Candidate Dashboard | Niddik" />
        <meta property="og:description" content="Manage your job applications, track progress, and update your profile." />
      </Helmet>


  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const {navigate} = useRouter(); // Initialize useRouter

  useEffect(function() {
    async function checkSession() {
      try {
        // Attempt to fetch user data from /api/user
        const response = await fetch("/api/user");

        if (response.status === 401) {
          // Session is invalid, redirect to /auth
          console.log("Session is invalid, redirecting to /auth");
          navigate("/auth", { replace: true }); // Use navigate for redirection
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // Handle error appropriately (e.g., redirect to an error page)
        navigate("/auth", { replace: true });
      }
    }
    checkSession();
  }, [navigate]);

  // Fetch recent job listings
  const { data: recentJobs, isLoading: isLoadingJobs } = useQuery<{ success: boolean; data: JobListing[] }>({
    queryKey: ['/api/job-listings/recent', 5],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Fetch user's applications
  const { data: applicationsData, isLoading: isLoadingApplications } = useQuery<{
    success: boolean;
    data: ApplicationWithJob[];
    meta: { total: number; pages: number; }
  }>({
    queryKey: ['/api/my-applications'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user
  });

  // Format date to a readable string
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };

  // Get applications count by status
  const newApplicationsCount = applicationsData?.data?.filter(app => app.status === 'new')?.length || 0;
  const reviewingApplicationsCount = applicationsData?.data?.filter(app => app.status === 'reviewing')?.length || 0;
  const interviewApplicationsCount = applicationsData?.data?.filter(app => app.status === 'interview')?.length || 0;
  const hiredApplicationsCount = applicationsData?.data?.filter(app => app.status === 'hired')?.length || 0;
  const totalApplicationsCount = applicationsData?.data?.length || 0;

  // Redirect to login if not authenticated
  if (!user) {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <CandidateLayout activeTab="dashboard">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hello, {user.fullName || user.username}</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to your candidate dashboard. Track your applications and find new job opportunities.
        </p>

        {/* Dashboard Overview Content */}
        <div className="space-y-6">
          {/* Application Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  {totalApplicationsCount}
                </CardTitle>
                <CardDescription>Total Applications</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  All your job applications
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/candidate/applications" className="flex items-center text-xs text-primary hover:underline">
                  View all applications
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  {newApplicationsCount}
                </CardTitle>
                <CardDescription>New Applications</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Applications pending review
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/candidate/applications" className="flex items-center text-xs text-primary hover:underline">
                  Check status
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-500" />
                  {interviewApplicationsCount}
                </CardTitle>
                <CardDescription>Interviews</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Applications in interview stage
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/candidate/applications" className="flex items-center text-xs text-primary hover:underline">
                  Check interviews
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-purple-500" />
                  {hiredApplicationsCount}
                </CardTitle>
                <CardDescription>Hired</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Successful applications
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <Link href="/candidate/applications" className="flex items-center text-xs text-primary hover:underline">
                  View offers
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Jobs + Recent Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Job Listings</span>
                  <Link href="/candidate/jobs">
                    <Button variant="link" className="p-0 h-auto">View All</Button>
                  </Link>
                </CardTitle>
                <CardDescription>New job opportunities matching your profile</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingJobs ? (
                  <div className="text-center py-4">Loading jobs...</div>
                ) : !recentJobs?.data || recentJobs.data.length === 0 ? (
                  <div className="text-center py-4">No jobs available at the moment</div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.data.slice(0, 5).map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <Link href={`/candidate/jobs/${job.id}`}>
                          <h3 className="font-medium mb-2 hover:text-primary cursor-pointer">{job.title}</h3>
                        </Link>
                        <div className="flex flex-wrap gap-y-2 gap-x-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-3.5 w-3.5 mr-1" />
                            <span>{job.jobType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href="/candidate/jobs">
                  <Button variant="outline" className="w-full">Browse All Jobs</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Applications</span>
                  <Link href="/candidate/applications">
                    <Button variant="link" className="p-0 h-auto">View All</Button>
                  </Link>
                </CardTitle>
                <CardDescription>Status of your recent job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="text-center py-4">Loading applications...</div>
                ) : !applicationsData?.data || applicationsData.data.length === 0 ? (
                  <div className="text-center py-4">You haven't applied to any jobs yet</div>
                ) : (
                  <div className="space-y-4">
                    {applicationsData.data.slice(0, 5).map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <Link href={`/candidate/jobs/${application.jobId}`}>
                            <h3 className="font-medium hover:text-primary cursor-pointer">{application.job.title}</h3>
                          </Link>
                          <Badge className={
                            application.status === 'new' ? 'bg-blue-500' :
                            application.status === 'reviewing' ? 'bg-amber-500' :
                            application.status === 'interview' ? 'bg-green-500' :
                            application.status === 'hired' ? 'bg-emerald-500' :
                            application.status === 'rejected' ? 'bg-red-500' :
                            application.status === 'withdrawn' ? 'bg-slate-500' :
                            'bg-gray-500'
                          }>
                            {application.status === 'new' ? 'New' :
                             application.status === 'reviewing' ? 'Under Review' :
                             application.status === 'interview' ? 'Interview' :
                             application.status === 'hired' ? 'Hired' :
                             application.status === 'rejected' ? 'Rejected' :
                             application.status === 'withdrawn' ? 'Withdrawn' :
                             application.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            <span>{application.job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{application.job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Applied on {formatDate(application.appliedDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href="/candidate/applications">
                  <Button variant="outline" className="w-full">View All Applications</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </CandidateLayout>
     </>
  );
}

export default CandidateDashboard;
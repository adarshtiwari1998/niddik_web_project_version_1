import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Building, Briefcase, MapPin, Calendar, FileCheck, Clock, UserRound, User, 
  BarChart3, FileText, ExternalLink, LogOut, Mail, Phone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobListing, JobApplication } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

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

export default function CandidateDashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-card border-r border-border">
        <div className="p-4 border-b border-border flex flex-col items-center md:items-start">
          <h2 className="font-bold text-xl">Niddik</h2>
          <p className="text-sm text-muted-foreground">Candidate Portal</p>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">{user.fullName || user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link href="/candidate/dashboard">
              <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'overview' ? 'bg-muted font-medium' : ''}`}>
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </Link>
            <Link href="/my-applications">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                <Briefcase className="h-4 w-4" />
                <span>My Applications</span>
              </div>
            </Link>
            <Link href="/careers">
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                <FileText className="h-4 w-4" />
                <span>Job Listings</span>
              </div>
            </Link>
            <Link href="/profile">
              <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'profile' ? 'bg-muted font-medium' : ''}`}>
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </div>
            </Link>
          </nav>
          
          <div className="pt-6 mt-6 border-t border-border">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center space-x-2 p-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-2">Hello, {user.fullName || user.username}</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to your candidate dashboard. Track your applications and find new job opportunities.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6 w-full max-w-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                  <Link href="/my-applications" className="flex items-center text-xs text-primary hover:underline">
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
                  <Link href="/my-applications" className="flex items-center text-xs text-primary hover:underline">
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
                  <Link href="/my-applications" className="flex items-center text-xs text-primary hover:underline">
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
                  <Link href="/my-applications" className="flex items-center text-xs text-primary hover:underline">
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
                    <Link href="/careers">
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
                          <Link href={`/jobs/${job.id}`}>
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
                  <Link href="/careers">
                    <Button variant="outline" className="w-full">Browse All Jobs</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Applications</span>
                    <Link href="/my-applications">
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
                            <Link href={`/jobs/${application.jobId}`}>
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
                  <Link href="/my-applications">
                    <Button variant="outline" className="w-full">View All Applications</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track and manage all your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="text-center py-4">Loading applications...</div>
                ) : !applicationsData?.data || applicationsData.data.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="mb-4">You haven't applied to any jobs yet</p>
                    <Link href="/careers">
                      <Button>Browse Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicationsData.data.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                          <div>
                            <Link href={`/jobs/${application.jobId}`}>
                              <h3 className="text-xl font-medium hover:text-primary cursor-pointer">{application.job.title}</h3>
                            </Link>
                            <div className="flex flex-wrap gap-y-2 gap-x-3 text-sm text-muted-foreground mt-2">
                              <div className="flex items-center">
                                <Building className="h-3.5 w-3.5 mr-1" />
                                <span>{application.job.company}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{application.job.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1" />
                                <span>{application.job.jobType}</span>
                              </div>
                            </div>
                          </div>

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

                        <Separator className="my-3" />

                        <div className="text-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              <span>Applied on {formatDate(application.appliedDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {application.status !== 'withdrawn' && application.status !== 'rejected' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 border-red-300 hover:bg-red-50"
                            >
                              Withdraw Application
                            </Button>
                          )}
                          
                          {application.resumeUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                                View Resume
                              </a>
                            </Button>
                          )}
                          
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/jobs/${application.jobId}`}>
                              View Job
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Your personal and professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.fullName || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{user.location || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{user.experience || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Notice Period</p>
                        <p className="font-medium">{user.noticePeriod || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phone || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Link href="/profile">
                    <Button>Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
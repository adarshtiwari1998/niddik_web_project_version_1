import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Building, Briefcase, MapPin, Calendar, FileCheck, Clock, UserRound, User, Mail, Phone, Award, 
  BarChart3, FileText, ExternalLink } from "lucide-react";
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
  const { user } = useAuth();
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

  return (
    <div className="container mx-auto py-8 px-4">
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
                        <div className="flex flex-col items-end gap-2">
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
                          <div className="text-sm text-muted-foreground">
                            Applied on {formatDate(application.appliedDate)}
                          </div>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex flex-col md:flex-row md:justify-between mt-3">
                        <div className="text-sm">
                          <span className="font-medium">Cover Letter:</span>
                          <p className="mt-1 text-muted-foreground line-clamp-2">{application.coverLetter}</p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                          {application.status === 'new' || application.status === 'reviewing' ? (
                            <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
                              Withdraw
                            </Button>
                          ) : null}
                          <Link href={`/jobs/${application.jobId}`}>
                            <Button size="sm">View Job</Button>
                          </Link>
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
        </TabsContent>

        {/* My Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Full Name</span>
                      </div>
                      <p className="text-muted-foreground">{user.fullName || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      <p className="text-muted-foreground">{user.email || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Phone Number</span>
                      </div>
                      <p className="text-muted-foreground">{user.phone || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UserRound className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Username</span>
                      </div>
                      <p className="text-muted-foreground">{user.username}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Experience</span>
                        </div>
                        <p className="text-muted-foreground">{user.experience || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Notice Period</span>
                        </div>
                        <p className="text-muted-foreground">{user.noticePeriod || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Current CTC</span>
                        </div>
                        <p className="text-muted-foreground">{user.currentCtc || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Expected CTC</span>
                        </div>
                        <p className="text-muted-foreground">{user.expectedCtc || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Location</span>
                        </div>
                        <p className="text-muted-foreground">{user.location || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">City/State</span>
                        </div>
                        <p className="text-muted-foreground">
                          {user.city ? `${user.city}${user.state ? `, ${user.state}` : ''}` : "Not provided"}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Country</span>
                        </div>
                        <p className="text-muted-foreground">{user.country || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Zip Code</span>
                        </div>
                        <p className="text-muted-foreground">{user.zipCode || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link href="/profile">
                    <Button>Update Profile</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Your uploaded resume</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.resumeUrl ? (
                    <div className="flex flex-col items-center text-center">
                      <FileText className="h-16 w-16 text-primary mb-4" />
                      <p className="text-sm">Resume uploaded successfully</p>
                      <div className="mt-4 flex flex-col gap-2 w-full">
                        <a 
                          href={user.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary underline flex items-center justify-center gap-1 hover:text-primary-dark"
                        >
                          View Resume <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground mb-4">No resume uploaded yet</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Link href="/profile">
                    <Button variant="outline">Update Resume</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/my-applications">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      My Applications
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
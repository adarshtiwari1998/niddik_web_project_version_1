import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  Building, Briefcase, MapPin, Calendar, FileCheck, Clock, BarChart3, 
  FileText, ExternalLink, Mail, Phone, UserCircle, Loader2, Trash
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JobListing, JobApplication } from "@shared/schema";
import { format } from "date-fns";
import { Link, useRouter } from "wouter";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Helmet } from 'react-helmet-async';
import { useToast } from "@/hooks/use-toast";

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

// Easy Apply form schema
const applicationFormSchema = z.object({
  note: z.string().min(10, "Cover letter must be at least 10 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { navigate } = useRouter();
  const { toast } = useToast();
  
  // Easy Apply state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDragOverDialog, setIsDragOverDialog] = useState(false);

  // Form setup
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      note: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.status === 401) {
          console.log("Session is invalid, redirecting to /auth");
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/auth", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  // PDF validation function
  const validatePDFFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return `Invalid file type. Only PDF files are allowed. Received: ${file.type}`;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB.';
    }
    
    return null;
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setResumeFile(file);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to upload resume.");
      }

      const data = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Unable to upload resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Resume removal handler
  const handleResumeRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch("/api/remove-resume", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to remove resume.");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setResumeFile(null);

      toast({
        title: "Resume removed",
        description: "Your resume has been removed successfully.",
      });

    } catch (error) {
      toast({
        title: "Removal failed",
        description: "Unable to remove resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Drag and drop handlers
  const handleDialogDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverDialog(true);
  };

  const handleDialogDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverDialog(false);
  };

  const handleDialogDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverDialog(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validatePDFFile(file);
      if (error) {
        toast({
          title: 'Invalid file',
          description: error,
          variant: 'destructive',
        });
        return;
      }
      handleFileUpload(file);
    }
  };

  const handleDialogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validatePDFFile(file);
      if (error) {
        toast({
          title: 'Invalid file',
          description: error,
          variant: 'destructive',
        });
        return;
      }
      handleFileUpload(file);
    }
  };

  const { data: recentJobs, isLoading: isLoadingJobs } = useQuery<{ success: boolean; data: JobListing[] }>({
    queryKey: ['/api/job-listings/recent', 5],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: applicationsData, isLoading: isLoadingApplications } = useQuery<{
    success: boolean;
    data: ApplicationWithJob[];
    meta: { total: number; pages: number; }
  }>({
    queryKey: ['/api/my-applications'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
    refetchInterval: 2000, // Refetch every 2 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0 // Consider data stale immediately
  });

  // Application submission mutation
  const applyMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      if (!user) throw new Error("User not authenticated");
      if (!resumeFile && !user.resumeUrl) throw new Error("Resume is required");

      try {
        if (resumeFile) {
          const uploadFormData = new FormData();
          uploadFormData.append('resume', resumeFile);

          const uploadResponse = await fetch('/api/upload-resume', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload resume");
          }

          const uploadResult = await uploadResponse.json();

          const applicationData = {
            jobId: selectedJobId,
            coverLetter: data.note,
            resumeUrl: uploadResult.url,
            skills: user.skills || selectedJob?.skills || '',
          };

          const response = await apiRequest("/api/job-applications", {
            method: "POST",
            body: JSON.stringify(applicationData),
          });

          return response;
        } else {
          const applicationData = {
            jobId: selectedJobId,
            coverLetter: data.note,
            resumeUrl: user.resumeUrl,
            skills: user.skills || selectedJob?.skills || '',
          };

          const response = await apiRequest("/api/job-applications", {
            method: "POST",
            body: JSON.stringify(applicationData),
          });

          return response;
        }
      } catch (error) {
        console.error("Application error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-applications'] });
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
      setIsDialogOpen(false);
      form.reset();
      setResumeFile(null);
      setSelectedJobId(null);
      setSelectedJob(null);
    },
    onError: (error) => {
      console.error("Application error:", error);
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    }
  });

  // Easy Apply handler
  const handleEasyApply = (job: JobListing) => {
    if (user?.role === 'admin') {
      toast({
        title: "Admin account",
        description: "Admin users cannot apply for jobs",
        variant: "default"
      });
      return;
    }

    setSelectedJobId(job.id);
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  // Check if user has applied to a job
  const hasAppliedToJob = (jobId: number) => {
    return applicationsData?.data?.some(app => app.jobId === jobId);
  };

  // Get application date for a job
  const getApplicationDate = (jobId: number) => {
    const application = applicationsData?.data?.find(app => app.jobId === jobId);
    return application ? formatDate(application.appliedDate) : null;
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  };

  const newApplicationsCount = applicationsData?.data?.filter(app => app.status === 'new')?.length || 0;
  const reviewingApplicationsCount = applicationsData?.data?.filter(app => app.status === 'reviewing')?.length || 0;
  const interviewApplicationsCount = applicationsData?.data?.filter(app => app.status === 'interview')?.length || 0;
  const hiredApplicationsCount = applicationsData?.data?.filter(app => app.status === 'hired')?.length || 0;
  const totalApplicationsCount = applicationsData?.data?.length || 0;

  if (!user) {
    return null;
  }

  return (
    <CandidateLayout activeTab="dashboard">
      <Helmet>
        <title>Candidate Dashboard | Niddik</title>
        <meta name="description" content="Manage your job applications, track progress, and update your profile." />
        <meta property="og:title" content="Candidate Dashboard | Niddik" />
        <meta property="og:description" content="Manage your job applications, track progress, and update your profile." />
      </Helmet>
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
                    {recentJobs.data.slice(0, 5).map((job) => {
                      const hasApplied = hasAppliedToJob(job.id);
                      const applicationDate = getApplicationDate(job.id);
                      
                      return (
                        <div key={job.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="font-medium hover:text-primary cursor-pointer">{job.title}</h3>
                            </Link>
                            {hasApplied ? (
                              <Badge variant="secondary" className="text-xs">
                                Applied {applicationDate}
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleEasyApply(job)}
                                className="text-xs"
                              >
                                Easy Apply
                              </Button>
                            )}
                          </div>
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
                      );
                    })}
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
                <Link href="/candidate/applications">
                  <Button variant="outline" className="w-full">View All Applications</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Easy Apply Dialog */}
        {selectedJob && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent 
              className="sm:max-w-[500px]"
              onDragOver={handleDialogDragOver}
              onDragLeave={handleDialogDragLeave}
              onDrop={handleDialogDrop}
            >
              <DialogHeader>
                <DialogTitle>Easy Apply - {selectedJob.title}</DialogTitle>
                <DialogDescription>
                  Apply quickly using your profile information.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {/* User Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input 
                      value={user?.fullName || user?.username || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input 
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                {/* Resume Section */}
                <div className="space-y-4">
                  {user?.resumeUrl ? (
                    <div className="p-4 border rounded-md bg-muted/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <a href={user.resumeUrl} target="_blank" className="underline">
                            View Resume
                          </a>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleResumeRemove}
                          disabled={isRemoving}
                        >
                          {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              <strong>PDF files only.</strong> Please upload your resume in PDF format.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOverDialog ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}>
                        <input
                          type="file"
                          id="resume-upload-dialog"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleDialogFileChange}
                        />
                        <label htmlFor="resume-upload-dialog" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-muted-foreground">PDF files only (max 5MB)</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => applyMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us why you're interested in this position..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={applyMutation.isPending || isUploading}
                        className="flex-1"
                      >
                        {applyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </CandidateLayout>
  );
};

export default CandidateDashboard;
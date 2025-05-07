import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, MapPin, Calendar, Briefcase, Clock, Building, Award, ArrowLeftIcon, FileText, ExternalLink, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import CareersHeader from "@/components/careers/CareersHeader";
import CareersFooter from "@/components/careers/CareersFooter";

// Define simplified application form schema for inline application
const applicationSchema = z.object({
  note: z.string().min(1, "Cover letter/note is required"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const jobId = parseInt(params.id);

  // Fetch job details
  const { data: jobData, isLoading, error } = useQuery<{ data: JobListing }>({
    queryKey: [`/api/job-listings/${jobId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !isNaN(jobId)
  });

  const job = jobData?.data;

  // Check if user has already applied for this job
  const { data: userApplicationsData } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ['/api/my-applications'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user
  });
  
  // Determine if user has already applied to this job
  const hasApplied = React.useMemo(() => {
    if (!userApplicationsData?.data) return false;
    return userApplicationsData.data.some(app => app.jobId === jobId);
  }, [userApplicationsData, jobId]);
  
  // Get application date if user has applied
  const applicationDate = React.useMemo(() => {
    if (!hasApplied || !userApplicationsData?.data) return null;
    const application = userApplicationsData.data.find(app => app.jobId === jobId);
    return application ? new Date(application.appliedDate).toLocaleDateString() : null;
  }, [userApplicationsData, jobId, hasApplied]);

  // Form initialization
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      note: "",
    },
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      if (!user) throw new Error("User not authenticated");
      
      try {
        // Prepare application data - simplified for direct submission
        const applicationData = {
          jobId: jobId,
          coverLetter: data.note,
          resumeUrl: user.resumeUrl,
          skills: user.skills || job.skills || '', // Use user skills if available, otherwise job skills or empty string
        };
        
        const response = await apiRequest("POST", "/api/job-applications", applicationData);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit application");
        }
        
        return response.json();
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
      setLocation("/candidate/dashboard");
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

  const onSubmit = (data: ApplicationFormValues) => {
    applyMutation.mutate(data);
  };

  // Apply for job function
  const handleApply = () => {
    // If user has already applied, don't do anything
    if (hasApplied) {
      toast({
        title: "Already applied",
        description: `You have already applied to this job on ${applicationDate}`,
        variant: "default"
      });
      return;
    }
    
    // If user is not logged in, redirect to auth page
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to apply for this job",
        variant: "default"
      });
      setLocation(`/auth?redirect=/jobs/${jobId}`);
      return;
    }

    // If user is logged in, open the application dialog
    setIsDialogOpen(true);
  };

  // Back button handler
  const goBack = () => {
    setLocation("/careers");
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">The job you're looking for might have been removed or doesn't exist.</p>
        <Button onClick={goBack}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <CareersHeader />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="mb-6 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeftIcon size={16} />
            Back to Jobs
          </Button>

          {/* Job Header */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span className="capitalize">{job.jobType}</span>
                </div>
                {job.featured && (
                  <>
                    <span>•</span>
                    <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start">
              {hasApplied ? (
                <Button disabled variant="outline" size="lg" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Applied {applicationDate ? `on ${applicationDate}` : ''}
                </Button>
              ) : (
                <Button onClick={handleApply} size="lg">Apply Now</Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Job Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              {job.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{job.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Job Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Location</p>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Job Type</p>
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="capitalize">{job.jobType}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Experience Level</p>
                    <div className="flex items-center text-muted-foreground">
                      <Award className="h-4 w-4 mr-2" />
                      <span className="capitalize">{job.experienceLevel}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Salary Range</p>
                    <div className="flex items-center text-muted-foreground">
                      <span>{job.salary || "Competitive"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <div className="flex items-center text-muted-foreground">
                      <span className="capitalize">{job.category}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Posted On</p>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Recently</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {hasApplied ? (
                    <Button disabled variant="outline" className="w-full gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Applied {applicationDate ? `on ${applicationDate}` : ''}
                    </Button>
                  ) : (
                    <Button onClick={handleApply} className="w-full">Apply for this position</Button>
                  )}
                </CardFooter>
              </Card>

              {/* Skills */}
              {job.skills && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.split(',').map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/5">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Application Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Easy Apply - {job.title}</DialogTitle>
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

                {/* Resume Link */}
                {user?.resumeUrl && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Resume</label>
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm truncate flex-1">{user.resumeUrl.split('/').pop()}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Application Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter / Note *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us why you're interested in this position and how your experience makes you a great fit."
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <CareersFooter />
    </div>
  );
}
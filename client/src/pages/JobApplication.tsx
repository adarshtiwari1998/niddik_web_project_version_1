import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeftIcon, Upload, FileText } from "lucide-react";

// Define application form schema
const applicationSchema = z.object({
  coverLetter: z.string().min(1, "Cover letter is required"),
  currentCompany: z.string().optional(),
  currentRole: z.string().optional(),
  expectedSalary: z.string().optional(),
  startDate: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  skills: z.string().min(3, "Please list at least a few skills"),
  // Resume file will be handled separately
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function JobApplication() {
  const params = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const jobId = parseInt(params.id);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to apply for this job",
        variant: "default"
      });
      setLocation(`/auth?redirect=/apply/${jobId}`);
    }
  }, [user, jobId, setLocation, toast]);

  // Fetch job details
  const { data: jobData, isLoading: isJobLoading, error: jobError } = useQuery<{ data: JobListing }>({
    queryKey: [`/api/job-listings/${jobId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !isNaN(jobId) && !!user
  });

  const job = jobData?.data;

  // Form initialization
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      currentCompany: user?.currentCompany || "",
      currentRole: user?.currentRole || "",
      expectedSalary: user?.expectedSalary || "",
      startDate: user?.noticePeriod || "Immediately",
      phoneNumber: user?.phone || "",
      skills: user?.skills || "",
    },
  });

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      if (!user) throw new Error("User not authenticated");
      if (!resumeFile && !user.resumeUrl) throw new Error("Resume is required");

      setIsUploading(true);

      try {
        // Prepare application data
        const applicationData = {
          jobId: jobId,
          coverLetter: data.coverLetter,
          currentCompany: data.currentCompany || "",
          currentRole: data.currentRole || "",
          expectedSalary: data.expectedSalary || "",
          availableFrom: data.startDate || "Immediately",
          phoneNumber: data.phoneNumber,
          skills: data.skills,
        };

        // If a new resume is being uploaded, use multipart form
        if (resumeFile) {
          const formData = new FormData();

          // Add the resume file
          formData.append('resume', resumeFile);

          // Add all other application data as form fields
          Object.entries(applicationData).forEach(([key, value]) => {
            formData.append(key, value.toString());
          });

          // Submit using FormData for multipart/form-data
          const response = await fetch('/api/job-applications', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit application");
          }

          return response.json();
        } else {
          // No new resume, use the existing resume URL and JSON request
          const response = await apiRequest("POST", "/api/job-applications", {
            ...applicationData,
            resumeUrl: user.resumeUrl,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit application");
          }

          return response.json();
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
      setLocation("/my-applications");
    },
    onError: (error) => {
      console.error("Application error:", error);
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const onSubmit = (data: ApplicationFormValues) => {
    applyMutation.mutate(data);
  };

  // Back button handler
  const goBack = () => {
    setLocation(`/jobs/${jobId}`);
  };

  // Handle loading and error states
  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isJobLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">The job you're looking for might have been removed or doesn't exist.</p>
        <Button onClick={() => setLocation("/careers")}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={goBack} 
        className="mb-6 flex items-center gap-2 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeftIcon size={16} />
        Back to Job
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Apply for {job.title}</CardTitle>
              <CardDescription>
                Submit your application for the {job.title} position at {job.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Alert className="mb-6">
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Fields marked with an asterisk (*) are required. Please ensure your resume is up-to-date before submitting.
                    </AlertDescription>
                  </Alert>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input 
                          value={user.fullName || user.username || ""} 
                          disabled 
                          className="bg-muted/50"
                          placeholder="Your full name"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your name from your profile
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input 
                          value={user.email || ""} 
                          disabled 
                          className="bg-muted/50"
                          placeholder="Your email address"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your email from your profile
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your phone number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currentCompany"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Company</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your current company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Role</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your current job title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expectedSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Salary</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Your salary expectations" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability to Start</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="When can you start?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Immediately">Immediately</SelectItem>
                                <SelectItem value="2 weeks">2 weeks</SelectItem>
                                <SelectItem value="1 month">1 month</SelectItem>
                                <SelectItem value="2 months">2 months</SelectItem>
                                <SelectItem value="3 months">3 months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <FormLabel>Skills *</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="List your relevant skills (e.g., React, Node.js, UX Design, Project Management)"
                                className="min-h-[80px]"
                              />
                            </FormControl>
                            <FormDescription>
                              List skills relevant to this position, separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Application Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Application Details</h3>

                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter / Note *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us why you're interested in this position and how your experience makes you a great fit."
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Resume *</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const ext = file.name.split('.').pop()?.toLowerCase();
                                if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
                                  toast({
                                    title: "Invalid file format",
                                    description: "Please upload only PDF, DOC, or DOCX files",
                                    variant: "destructive"
                                  });
                                  e.target.value = '';
                                  return;
                                }
                                handleFileChange(e);
                              }
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          />
                        </div>
                        {user.resumeUrl && (
                          <a
                            href={user.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-sm text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View Current Resume
                          </a>
                        )}
                      </div>
                      {resumeFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected file: {resumeFile.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {user.resumeUrl 
                          ? "Your existing resume will be used if you don't upload a new one." 
                          : "Please upload your resume in PDF, DOC, or DOCX format (max 5MB)."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goBack}
                      disabled={applyMutation.isPending || isUploading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={applyMutation.isPending || isUploading}
                    >
                      {(applyMutation.isPending || isUploading) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Job Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Position</p>
                <p className="text-sm text-muted-foreground">{job.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Job Type</p>
                <p className="text-sm text-muted-foreground capitalize">{job.jobType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Experience Level</p>
                <p className="text-sm text-muted-foreground capitalize">{job.experienceLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Salary Range</p>
                <p className="text-sm text-muted-foreground">{job.salary || "Competitive"}</p>
              </div>
              <Separator />
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Brief Description</p>
                <p className="text-sm text-muted-foreground line-clamp-4">{job.description}</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm mt-1"
                  onClick={goBack}
                >
                  View full job details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
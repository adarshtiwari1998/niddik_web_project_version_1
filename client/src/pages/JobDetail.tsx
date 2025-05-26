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
import { Loader2, MapPin, Calendar, Briefcase, Clock, Building, Award, ArrowLeftIcon, FileText, ExternalLink, CheckCircle, Trash } from "lucide-react";
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

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

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
    enabled: !!user && user.role !== 'admin'
  });

  // Fetch application count for admin users
  const { data: applicationCountData } = useQuery<{ success: boolean; count: number }>({
    queryKey: [`/api/admin/job-applications-count/${jobId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.role === 'admin' && !isNaN(jobId)
  });

  // Determine if user has already applied to this job (excluding withdrawn applications)
  const hasApplied = React.useMemo(() => {
    if (!userApplicationsData?.data) return false;
    return userApplicationsData.data.some(app => 
      app.jobId === jobId && app.status !== 'withdrawn'
    );
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
          resumeUrl: resumeFile ? resumeFile.name : user.resumeUrl,
          skills: user.skills || job.skills || '', // Use user skills if available, otherwise job skills or empty string
        };

        const response = await apiRequest("POST", "/api/job-applications", applicationData);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit application");
        }

        // After successful application submission, update user's resume URL in the database if a new resume was uploaded
        if (resumeFile) {
          try {
            // Fetch the updated user information to get the new resume URL after upload
            const updatedUserResponse = await apiRequest("GET", "/api/user");
            if (updatedUserResponse.ok) {
              const updatedUserData = await updatedUserResponse.json();
              // Optimistically update the user object in the auth context if available
              // This assumes that the /api/user endpoint returns the complete user object
              // which includes the updated resume URL
              if (updatedUserData && updatedUserData.resumeUrl) {
                // Assuming useAuth provides a method to update the user object
                // For example: updateUser(updatedUserData)
                // You'll need to adapt this part to match the actual implementation of useAuth
                // If useAuth does not provide such a method, you may need to refetch user data
                // or manually update the user object in the component's state

                // Placeholder for the actual update logic
                // updateUser(updatedUserData);
                console.log("Resume URL updated in user profile:", updatedUserData.resumeUrl);
              }
            } else {
              console.error("Failed to fetch updated user data:", updatedUserResponse.status);
            }
          } catch (updateError) {
            console.error("Error updating resume URL in user profile:", updateError);
            toast({
              title: "Update failed",
              description: "Unable to update resume URL in your profile. Please try again.",
              variant: "destructive",
            });
          }
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


   // Handle resume upload
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to upload resume.");
      }

      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // Refresh user data
      setResumeFile(null);
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

  // Handle resume removal
// Handle resume removal
const handleResumeRemove = async () => {
  setIsRemoving(true);

  try {
    const response = await apiRequest("DELETE", "/api/remove-resume");

    if (!response.ok) {
      throw new Error("Unable to remove resume.");
    }

    toast({
      title: "Resume removed",
      description: "Your resume has been removed successfully.",
    });

    // Invalidate the user cache to refresh the data
    await queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // Refresh user data

    // Optionally, reset the resume file state explicitly if needed
    setResumeFile(null); // Clear local resume file state if necessary
  } catch (error) {
    toast({
      title: "Remove failed",
      description: "Unable to remove resume. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsRemoving(false);
  }
};


  // Apply for job function
  const handleApply = () => {
    // Admin users shouldn't apply for jobs
    if (user?.role === 'admin') {
      toast({
        title: "Admin account",
        description: "Admin users cannot apply for jobs",
        variant: "default"
      });
      return;
    }

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

  if (error || !job || (job.status !== 'active' && user?.role !== 'admin')) {
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
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-4">
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
              </div>
              
              {/* Job Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                    ⭐ Featured
                  </Badge>
                )}
                {job.urgent && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 text-sm font-semibold shadow-lg animate-pulse">
                    🔥 Urgent Hiring
                  </Badge>
                )}
                {job.priority && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                    ⚡ Priority Role
                  </Badge>
                )}
                {job.isOpen && (
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                    ✅ Actively Hiring
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-start">
              {user?.role === 'admin' ? (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {applicationCountData?.count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {applicationCountData?.count === 1 ? 'Application' : 'Applications'}
                  </div>
                </div>
              ) : hasApplied ? (
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
                  {/* Extract and highlight employment details */}
                  {(() => {
                    const description = job.description;
                    const employmentKeywords = [
                      'Employment Type:', 'Job Type:', 'Position Type:',
                      'Experience:', 'Years of Experience:', 'Required Experience:',
                      'Notice Period:', 'Joining:', 'Availability:',
                      'Salary:', 'Package:', 'CTC:', 'Compensation:',
                      'Location:', 'Work Location:', 'Office Location:',
                      'Work Mode:', 'Remote:', 'Hybrid:', 'Onsite:'
                    ];
                    
                    // Extract employment details
                    const employmentDetails = [];
                    const lines = description.split('\n');
                    
                    lines.forEach(line => {
                      const trimmedLine = line.trim();
                      if (employmentKeywords.some(keyword => 
                        trimmedLine.toLowerCase().includes(keyword.toLowerCase())
                      )) {
                        employmentDetails.push(trimmedLine);
                      }
                    });
                    
                    // Remove employment details from main description
                    let cleanDescription = description;
                    employmentDetails.forEach(detail => {
                      cleanDescription = cleanDescription.replace(detail, '');
                    });
                    
                    return (
                      <div className="space-y-6">
                        {/* Highlighted Employment Details */}
                        {employmentDetails.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Key Employment Details
                              </h3>
                            </div>
                            <div className="grid gap-3">
                              {employmentDetails.map((detail, index) => {
                                const [label, ...valueParts] = detail.split(':');
                                const value = valueParts.join(':').trim();
                                
                                if (label && value) {
                                  return (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/30 rounded-lg border border-blue-100/50 dark:border-blue-800/20">
                                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                          {label.trim()}:
                                        </div>
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                          {value}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Handle cases where the format might be different
                                return (
                                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-900/30 rounded-lg border border-blue-100/50 dark:border-blue-800/20">
                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                                      {detail}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Main Job Description */}
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="whitespace-pre-line">
                            {cleanDescription.split(/\d+\./).map((item, index) => {
                              if (index === 0) {
                                // First part before any numbering
                                return item.trim() && (
                                  <p key={index} className="mb-4">
                                    {item.trim()}
                                  </p>
                                );
                              }
                              return item.trim() && (
                                <div key={index} className="mb-3">
                                  <div className="flex items-start gap-2">
                                    <span className="font-semibold text-primary mt-0.5">{index}.</span>
                                    <span className="flex-1">{item.trim()}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line">
                      {job.requirements.split(/\d+\./).map((item, index) => {
                        if (index === 0) {
                          // First part before any numbering
                          return item.trim() && (
                            <p key={index} className="mb-4">
                              {item.trim()}
                            </p>
                          );
                        }
                        return item.trim() && (
                          <div key={index} className="mb-3">
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-primary mt-0.5">{index}.</span>
                              <span className="flex-1">{item.trim()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              {job.benefits && (
                <div className="relative">
                  {/* Section Header with Gradient Background */}
                  <div className="relative mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border border-blue-200/30 dark:border-blue-800/30 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          What's in it for you?
                        </h2>
                      </div>
                      <p className="text-muted-foreground">Discover the amazing benefits and perks that come with this role</p>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid gap-4">
                    {job.benefits.split('\n').filter(item => item.trim()).length > 1 ? (
                      // Handle benefits that are separated by newlines or contain bullet points
                      job.benefits.split('\n').filter(item => item.trim()).map((item, index) => (
                        <div 
                          key={index} 
                          className="group relative p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
                        >
                          {/* Hover Effect Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-300"></div>
                          
                          <div className="relative z-10 flex items-start gap-4">
                            {/* Dynamic Benefit Icon */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            
                            {/* Benefit Content */}
                            <div className="flex-1 pt-1">
                              <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                                {item.trim().replace(/^[-•]\s*/, '')}
                              </p>
                            </div>
                            
                            {/* Arrow Icon */}
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Bottom Gradient Line */}
                          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))
                    ) : job.benefits.includes('.') ? (
                      job.benefits.split(/\d+\./).map((item, index) => {
                        if (index === 0) {
                          // First part before any numbering - show as intro text
                          return item.trim() && (
                            <div key={index} className="mb-6 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.trim()}</p>
                              </div>
                            </div>
                          );
                        }
                        
                        return item.trim() && (
                          <div 
                            key={index} 
                            className="group relative p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
                          >
                            {/* Hover Effect Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-300"></div>
                            
                            <div className="relative z-10 flex items-start gap-4">
                              {/* Dynamic Benefit Icon */}
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-lg">{index}</span>
                              </div>
                              
                              {/* Benefit Content */}
                              <div className="flex-1 pt-1">
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                                  {item.trim()}
                                </p>
                              </div>
                              
                              {/* Arrow Icon */}
                              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Bottom Gradient Line */}
                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/60 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        );
                      })
                    ) : (
                      // Single benefit item
                      <div className="p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/60">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed pt-1">{job.benefits}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Call-to-Action */}
                  <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200/50 dark:border-green-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">Ready to unlock these benefits?</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Join our team and start enjoying these perks today</p>
                        </div>
                      </div>
                      {user?.role === 'admin' ? (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary">
                            {applicationCountData?.count || 0} Applications Received
                          </div>
                        </div>
                      ) : !hasApplied && (
                        <Button onClick={handleApply} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Job Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Overview */}
                  {(job.featured || job.urgent || job.priority || job.isOpen) && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Position Status</p>
                      <div className="flex flex-wrap gap-1">
                        {job.featured && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            Featured
                          </Badge>
                        )}
                        {job.urgent && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            Urgent
                          </Badge>
                        )}
                        {job.priority && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                            Priority
                          </Badge>
                        )}
                        {job.isOpen && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Open
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
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
                      <span>{job.postedDate ? format(new Date(job.postedDate), "MMM dd, yyyy") : "Recently"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user?.role === 'admin' ? (
                    <Card className="w-full">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            {applicationCountData?.count || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {applicationCountData?.count === 1 ? 'Candidate Applied' : 'Candidates Applied'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : hasApplied ? (
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

              {/* Company Information - Only show for non-admin users */}
              {user?.role !== 'admin' && (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src="https://c97bc9b7-d459-4d54-aa25-a500aa3482fe-00-17pkxb2ueb99z.sisko.replit.dev/images/niddik_logo.png"
                        alt="Niddik Logo"
                        className="w-16 h-16 object-contain flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl">About Niddik</CardTitle>
                        <CardDescription className="mt-1">
                          <a 
                            href="https://www.linkedin.com/company/niddik/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-sm"
                          >
                            View on LinkedIn <ExternalLink className="h-3 w-3" />
                          </a>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">5</div>
                        <div className="text-xs text-muted-foreground mt-1">US, IN, UK</div>
                        <div className="text-xs font-medium mt-1 leading-tight">Core Technology Markets</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">92%</div>
                        <div className="text-xs font-medium mt-1 leading-tight">Talent Retention</div>
                        <div className="text-xs text-muted-foreground mt-1">After one year</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">7-14</div>
                        <div className="text-xs text-muted-foreground mt-1">Days</div>
                        <div className="text-xs font-medium mt-1 leading-tight">Average Time to Hire</div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400">10K+</div>
                        <div className="text-xs font-medium mt-1 leading-tight">Successful Placements</div>
                        <div className="text-xs text-muted-foreground mt-1">Made</div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">4</div>
                        <div className="text-xs font-medium leading-tight">Empaneled Customers</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">12+</div>
                        <div className="text-xs font-medium leading-tight">Placements</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">10K+</div>
                        <div className="text-xs font-medium leading-tight">Communities</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">500K+</div>
                        <div className="text-xs font-medium leading-tight">Talent Pools</div>
                      </div>
                    </div>

                    {/* Performance Improvements */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-xl border border-green-200/50 dark:border-green-800/30">
                      <h4 className="font-semibold text-base mb-3 text-center">Performance Improvements</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">30%</div>
                          <div className="text-xs font-medium leading-tight">Optimize Recruiting Spend</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">40%</div>
                          <div className="text-xs font-medium leading-tight">Improvement in Response %</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">50%</div>
                          <div className="text-xs font-medium leading-tight">Decrease in Time to Submit</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">70%</div>
                          <div className="text-xs font-medium leading-tight">Increase in Talent Quality</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Company Story */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base">Our Story</h4>
                      <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
                        <p>
                          Our journey is deeply rooted in a legacy passed down from my grandfather, <a  className="text-andela-green" href="https://www.washingtontechnology.com/1998/08/anstec-inc/332231/" target="_blank"  rel="no-follow">Late Shri Satyendra Prasad Shrivastava</a>. A true visionary, he was a recipient of the 1996 Ernst & Young Entrepreneur of the Year Award, the 1994 KPMG Peat Marwick High-Tech Entrepreneur Award, and the 1994 Small Business Person of the Year award for the Washington area.
                        </p>
                        <p>
                          His achievements were a constant source of inspiration, yet in the early days, I was held back. A lack of awareness and corporate experience meant that it took me over two decades to finally embark on my own entrepreneurial path.
                        </p>
                        <p>
                          But his spirit never faded. I carried his stories, his values, and his entrepreneurial drive with me. And now, fueled by that long-standing inspiration, we've built this company. We aim to honor his legacy by creating something meaningful, just as he did in his time.
                        </p>
                      </div>
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
                <div className="container mx-100">
                  {/* Resume Management */}
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
                      <div className="space-y-2">
                        <div>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const fileType = file.type;
                                const validTypes = [
                                  'application/pdf',
                                  'application/msword',
                                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                ];
                                if (!validTypes.includes(fileType)) {
                                  toast({
                                    title: "Invalid file format",
                                    description: "Please upload only PDF, DOC, or DOCX files",
                                    variant: "destructive"
                                  });
                                  e.target.value = '';
                                  return;
                                }
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

                                  // Update user data to reflect new resume URL
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
                                  setResumeFile(null);
                                  e.target.value = '';
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                            placeholder="Upload resume"
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          />
                          {isUploading && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading resume...
                            </div>
                          )}
                {user?.resumeUrl && !isUploading && (
                            <div className="p-4 border rounded-md bg-muted/5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <a href={user?.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                                    View Resume
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
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
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <CareersFooter />
    </div>
  );
}
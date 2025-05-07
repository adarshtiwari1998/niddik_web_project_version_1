import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Calendar, Briefcase, Clock, Building, Award, ArrowLeftIcon } from "lucide-react";
import { format } from "date-fns";

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const jobId = parseInt(params.id);

  // Fetch job details
  const { data: jobData, isLoading, error } = useQuery<{ data: JobListing }>({
    queryKey: [`/api/job-listings/${jobId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !isNaN(jobId)
  });

  const job = jobData?.data;

  // Apply for job function
  const handleApply = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to apply for this job",
        variant: "default"
      });
      setLocation(`/auth?redirect=/jobs/${jobId}`);
      return;
    }

    // Navigate to application page
    setLocation(`/apply/${jobId}`);
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
          <Button onClick={handleApply} size="lg">Apply Now</Button>
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
              
              {job.createdAt && (
                <div>
                  <p className="text-sm font-medium mb-1">Posted On</p>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleApply} className="w-full">Apply for this position</Button>
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
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import  AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { jobListingSchema } from "@shared/schema";
import { ChevronLeft } from 'lucide-react';

// Form schema based on the job listing schema
const formSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  jobType: z.string().min(2, "Job type is required"),
  experienceLevel: z.string().min(2, "Experience level is required"),
  salary: z.string().min(2, "Salary information is required"),
  description: z.string().min(50, "Job description must be detailed"),
  requirements: z.string().min(30, "Job requirements must be detailed"),
  benefits: z.string().optional(),
  applicationUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
  status: z.string(),
  featured: z.boolean().default(false),
  urgent: z.boolean().default(false),
  priority: z.boolean().default(false),
  isOpen: z.boolean().default(false),
  expiryDate: z.date().optional(),
  category: z.string().min(2, "Category is required"),
  skills: z.string().min(3, "Skills are required"),
});

export default function JobForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isNewJob, setIsNewJob] = useState(true);
  const [jobId, setJobId] = useState<number | null>(null);

  // Check if we're on the edit path
  const [match, params] = useRoute("/admin/jobs/:id/edit");

  useEffect(() => {
    if (match && params?.id) {
      setIsNewJob(false);
      setJobId(parseInt(params.id));
    }
  }, [match, params]);

  // If editing, fetch the job data
  const { data: jobData, isLoading: isLoadingJob } = useQuery({
    queryKey: [`/api/job-listings/${jobId}`],
    enabled: !isNewJob && jobId !== null,
  });

  // Form initialization with async default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (!isNewJob && jobId) {
        try {
          const response = await fetch(`/api/job-listings/${jobId}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });
          const data = await response.json();
          const job = data.data;

          // Ensure proper case for values that need to match SelectItem values
          const normalizedJobType = job.jobType === 'full-time' ? 'Full-time' : 
                                  job.jobType === 'part-time' ? 'Part-time' : 
                                  job.jobType === 'contract' ? 'Contract' : 
                                  job.jobType === 'freelance' ? 'Freelance' : 
                                  job.jobType === 'internship' ? 'Internship' : job.jobType;

          const normalizedExperienceLevel = job.experienceLevel === 'entry' ? 'Entry' :
                                          job.experienceLevel === 'mid' ? 'Mid' :
                                          job.experienceLevel === 'senior' ? 'Senior' :
                                          job.experienceLevel === 'executive' ? 'Executive' : job.experienceLevel;

          return {
            title: job.title,
            company: job.company,
            location: job.location,
            jobType: normalizedJobType,
            experienceLevel: normalizedExperienceLevel,
            salary: job.salary,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits || "",
            applicationUrl: job.applicationUrl || "",
            contactEmail: job.contactEmail || "",
            status: job.status || "active",
            featured: Boolean(job.featured),
            urgent: Boolean(job.urgent),
            priority: Boolean(job.priority),
            isOpen: Boolean(job.isOpen),
            category: job.category,
            skills: job.skills,
            expiryDate: job.expiryDate ? new Date(job.expiryDate) : undefined,
          };
        } catch (error) {
          console.error("Error fetching job data:", error);
          return {
            title: "",
            company: "NIDDIK (An IT Division of NIDDIKKARE LLP)",
            location: "",
            jobType: "Full-time",
            experienceLevel: "Mid",
            salary: "",
            description: "",
            requirements: "",
            benefits: "",
            applicationUrl: "",
            contactEmail: "",
            status: "active",
            featured: false,
            category: "Engineering & Architecture",
            skills: "",
          };
        }
      }

      // Default values for new job
      return {
        title: "",
        company: "NIDDIK (An IT Division of NIDDIKKARE LLP)",
        location: "",
        jobType: "Full-time",
        experienceLevel: "Entry",
        salary: "",
        description: "",
        requirements: "",
        benefits: "",
        applicationUrl: "",
        contactEmail: "",
        status: "active",
        featured: false,
        urgent: false,
        priority: false,
        isOpen: false,
        category: "Administrative",
        skills: "",
      };
    },
  });

  useEffect(() => {
    if (!isNewJob && jobData?.data) {
      const job = jobData.data;
      console.log("Editing job listing - Job Data:", {
        id: job.id,
        title: job.title,
        company: job.company,
        status: job.status,
        expiryDate: job.expiryDate,
        allData: job
      });

      form.reset({
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits || "",
        applicationUrl: job.applicationUrl || "",
        contactEmail: job.contactEmail || "",
        status: job.status,
        featured: Boolean(job.featured),
        urgent: Boolean(job.urgent),
        priority: Boolean(job.priority),
        isOpen: Boolean(job.isOpen),
        category: job.category,
        skills: job.skills,
        expiryDate: job.expiryDate ? new Date(job.expiryDate) : undefined,
      });
    }
  }, [isNewJob, jobData, form]);

  // Create job mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      console.log("Mutation: Sending data to API:", data);
      return await apiRequest("/api/job-listings", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: (result) => {
      console.log("Mutation: Job created successfully:", result);
      queryClient.invalidateQueries({ queryKey: ["/api/job-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/job-listings-all"] });
      toast({
        title: "Job listing created",
        description: "Your job listing has been created successfully.",
      });
      navigate("/admin/jobs");
    },
    onError: (error: any) => {
      console.error("Mutation: Error creating job listing:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error creating the job listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update job mutation
  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      apiRequest(`/api/job-listings/${jobId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      // Invalidate both the list and the individual job query
      queryClient.invalidateQueries({ queryKey: ["/api/job-listings"] });
      queryClient.invalidateQueries({ queryKey: [`/api/job-listings/${jobId}`] });

      // Refetch the current job data
      queryClient.refetchQueries({ queryKey: [`/api/job-listings/${jobId}`] });

      toast({
        title: "Job listing updated",
        description: "Your job listing has been updated successfully.",
      });
      navigate("/admin/jobs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error updating the job listing. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating job listing:", error);
    },
  });

  // Submit handler
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submission data:", data);

    // Convert dates to timestamps ISO format and ensure all required fields are present
    const formattedData = {
      title: data.title,
      company: data.company,
      location: data.location,
      jobType: data.jobType,
      experienceLevel: data.experienceLevel,
      salary: data.salary,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits || "",
      applicationUrl: data.applicationUrl || "",
      contactEmail: data.contactEmail || "",
      status: data.status || "active",
      featured: Boolean(data.featured),
      urgent: Boolean(data.urgent),
      priority: Boolean(data.priority),
      isOpen: Boolean(data.isOpen),
      category: data.category,
      skills: data.skills,
      postedDate: new Date().toISOString(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null
    };

    console.log("Formatted submission data:", formattedData);

    if (isNewJob) {
      createMutation.mutate(formattedData);
    } else {
      updateMutation.mutate(formattedData);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/admin/jobs")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isNewJob ? "Create Job Listing" : `Edit Job Listing - ${jobData?.data?.title || ''}`}
              </h1>
              {!isNewJob && jobId && (
                <p className="text-sm text-muted-foreground">Job ID: {jobId}</p>
              )}
              <p className="text-muted-foreground mt-2">
                {isNewJob
                  ? "Create a new job listing for your company."
                  : "Update the details of an existing job listing."}
              </p>
            </div>
          </div>
        </div>

        {!isNewJob && isLoadingJob ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about the job posting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior React Developer" {...field} />
                          </FormControl>
                          <FormDescription>
                            Keep the title clear and specific.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Remote, New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                              <SelectItem value="Internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Entry">Entry Level</SelectItem>
                              <SelectItem value="Mid">Mid Level</SelectItem>
                              <SelectItem value="Senior">Senior Level</SelectItem>
                              <SelectItem value="Executive">Executive Level</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Administrative">Administrative</SelectItem>
                              <SelectItem value="Agriculture">Agriculture</SelectItem>
                              <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                              <SelectItem value="Construction & Trades">Construction & Trades</SelectItem>
                              <SelectItem value="Corporate Affairs">Corporate Affairs</SelectItem>
                              <SelectItem value="Creative & Media">Creative & Media</SelectItem>
                              <SelectItem value="Customer Success">Customer Success</SelectItem>
                              <SelectItem value="Data Science & Analytics">Data Science & Analytics</SelectItem>
                              <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                              <SelectItem value="Education & Training">Education & Training</SelectItem>
                              <SelectItem value="Engineering & Architecture">Engineering & Architecture</SelectItem>
                              <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                              <SelectItem value="Healthcare, Pharmaceutical & Medical">Healthcare, Pharmaceutical & Medical</SelectItem>
                              <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                              <SelectItem value="HR & Recruiting">HR & Recruiting</SelectItem>
                              <SelectItem value="IT & Networking">IT & Networking</SelectItem>
                              <SelectItem value="Legal & Law Enforcement">Legal & Law Enforcement</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                              <SelectItem value="Science & Research">Science & Research</SelectItem>
                              <SelectItem value="Web, Mobile, & Software Development">Web, Mobile, & Software Development</SelectItem>
                              <SelectItem value="Writing">Writing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>
                    Provide detailed information about the job.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the job..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include information about the role, responsibilities, and
                          team.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Requirements*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the requirements for the job..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List the qualifications, skills, and experience required
                          for the role.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefits (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the benefits offered..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List the benefits and perks offered with this position.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. React, TypeScript, Node.js"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter comma-separated skills required for the job.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                  <CardDescription>
                    Provide information about the application process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="applicationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. https://example.com/apply"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            URL where candidates can apply for the job.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. info@niddik.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Email where candidates can reach out with questions.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="filled">Filled</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Current status of the job listing.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When the job listing should expire.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                          <div className="space-y-1">
                            <FormLabel>Featured Listing</FormLabel>
                            <FormDescription>
                              Featured listings appear at the top of the job board.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="urgent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                          <div className="space-y-1">
                            <FormLabel className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Urgent
                              </span>
                              Job
                            </FormLabel>
                            <FormDescription>
                              Mark this job as urgent for immediate hiring.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                          <div className="space-y-1">
                            <FormLabel className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Priority
                              </span>
                              Job
                            </FormLabel>
                            <FormDescription>
                              Mark this job as priority for faster processing.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isOpen"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                          <div className="space-y-1">
                            <FormLabel className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Open
                              </span>
                              Position
                            </FormLabel>
                            <FormDescription>
                              Mark this position as actively open for applications.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-start gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/jobs")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isNewJob ? "Create Job Listing" : "Edit Job Listing"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
}
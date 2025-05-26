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
            urgent: false,
            priority: false,
            isOpen: false,
            category: "Engineering & Architecture",
            skills: "",
          };
<div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Featured
                                </span>
                                Listing
                              </FormLabel>
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

                      <FormField
                        control={form.control}
                        name="urgent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  • Urgent
                                </span>
                                Listing
                              </FormLabel>
                              <FormDescription>
                                Urgent listings are highlighted with special urgency indicators.
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
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  • Priority
                                </span>
                                Listing
                              </FormLabel>
                              <FormDescription>
                                Priority listings get enhanced visibility and placement.
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
                          <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                            <div className="space-y-1">
                              <FormLabel className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  • Open
                                </span>
                                Listing
                              </FormLabel>
                              <FormDescription>
                                Open listings are clearly marked as actively accepting applications.
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { Briefcase, Clock, MapPin, Search, Filter, Loader2, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CareersLayout from "@/components/careers/CareersLayout";
import { format } from "date-fns";
import SEO from "@/components/SEO";

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all_categories");
  const [jobType, setJobType] = useState("all_types");
  const [experienceLevel, setExperienceLevel] = useState("all_levels");
  const [priority, setPriority] = useState("all_priorities");

  const { data, isLoading, error } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { 
      status: 'active',
      page: 1,
      limit: 1000
    }],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Get unique values for filter options from available jobs
  const availableCategories = Array.from(new Set(data?.data.map(job => job.category).filter(Boolean))) || [];
  const availableJobTypes = Array.from(new Set(data?.data.map(job => job.jobType).filter(Boolean))) || [];
  const availableExperienceLevels = Array.from(new Set(data?.data.map(job => job.experienceLevel).filter(Boolean))) || [];

  // Filter the data client-side for real-time search
  const filteredJobs = data?.data.filter((job) => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = searchLower === '' || 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.category.toLowerCase().includes(searchLower) ||
      job.experienceLevel.toLowerCase().includes(searchLower) ||
      job.jobType.toLowerCase().includes(searchLower) ||
      (job.skills && job.skills.toLowerCase().includes(searchLower)) ||
      (job.requirements && job.requirements.toLowerCase().includes(searchLower)) ||
      (job.salary && job.salary.toLowerCase().includes(searchLower));

    const matchesCategory = category === 'all_categories' || job.category === category;
    const matchesJobType = jobType === 'all_types' || job.jobType === jobType;
    const matchesExperienceLevel = experienceLevel === 'all_levels' || job.experienceLevel === experienceLevel;

    const matchesPriority = priority === 'all_priorities' ||
      (priority === 'urgent' && job.urgent) ||
      (priority === 'priority' && job.priority) ||
      (priority === 'open' && job.isOpen) ||
      (priority === 'featured' && job.featured);

    return matchesSearch && matchesCategory && matchesJobType && matchesExperienceLevel && matchesPriority;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is now handled automatically by the filteredJobs computation
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all_categories");
    setJobType("all_types");
    setExperienceLevel("all_levels");
    setPriority("all_priorities");
  };

  return (
    <>
      <SEO pagePath="/careers" />
      <CareersLayout>
        <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover opportunities to grow your career with Niddik. We're looking for talented individuals to help us build the future of talent acquisition.
          </p>
        </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job title or keywords"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:w-2/3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">All Categories</SelectItem>
                    {availableCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    {availableJobTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                    {availableExperienceLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_priorities">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Clear Filters
              </Button>
              <Button type="submit">Search Jobs</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Available Positions</h2>
          {data && (
            <p className="text-muted-foreground">
              Showing {filteredJobs.length} of {data.meta.total} opportunities
            </p>
          )}
        </div>

        <Separator className="my-6" />

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load jobs. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No jobs match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const isDraft = job.status === 'draft';
            const CardComponent = ({ children }: { children: React.ReactNode }) => {
              if (isDraft) {
                return (
                  <Card className={`overflow-hidden transition-shadow duration-300 opacity-40 cursor-not-allowed relative`}>
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-gray-500 text-white text-xs font-bold">DRAFT</Badge>
                    </div>
                    {children}
                  </Card>
                );
              }
              return (
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {children}
                </Card>
              );
            };

            return (
              <CardComponent key={job.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">{job.title}</CardTitle>
                      <CardDescription className="text-sm">{job.company}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {job.featured && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs">Featured</Badge>
                      )}
                      {job.urgent && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">
                          <span className="animate-pulse">🔥</span> Urgent
                        </Badge>
                      )}
                      {job.priority && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">
                          ⚡ Priority
                        </Badge>
                      )}
                      {job.isOpen && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                          ✅ Open
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <Badge variant="outline">{job.jobType}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="h-3 w-3 mr-1" />
                      <span>{job.experienceLevel}</span>
                    </div>
                    <span className="font-medium text-primary">{job.salary}</span>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Award className="h-3 w-3 mr-1" />
                          <span>Category:</span>
                        </div>
                        <span className="font-medium">{job.category}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Posted On:</span>
                        </div>
                        <span className="font-medium">
                          {job.postedDate && !isNaN(new Date(job.postedDate).getTime()) 
                            ? format(new Date(job.postedDate), "MMM dd, yyyy")
                            : "Recently"
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="line-clamp-3">{job.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  {isDraft ? (
                    <Button disabled className="w-full cursor-not-allowed opacity-50">
                      Draft - Not Available
                    </Button>
                  ) : (
                    <Link href={`/jobs/${job.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  )}
                </CardFooter>
              </CardComponent>
            );
          })}
        </div>

        {/* Pagination can be added here later */}
      </div>
      </div>
      </CareersLayout>
    </>
  );
}
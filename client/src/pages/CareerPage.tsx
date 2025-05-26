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

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all_categories");
  const [jobType, setJobType] = useState("all_types");
  const [experienceLevel, setExperienceLevel] = useState("all_levels");
  const [priority, setPriority] = useState("all_priorities");

  const { data, isLoading, error } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { 
      status: 'active' 
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
          {!isLoading && !error && filteredJobs.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.company}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    {job.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                        ⭐ Featured
                      </Badge>
                    )}
                    {job.urgent && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 text-xs font-semibold shadow-lg animate-pulse">
                        🔥 Urgent Hiring
                      </Badge>
                    )}
                    {job.priority && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                        ⚡ Priority Role
                      </Badge>
                    )}
                    {job.isOpen && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                        ✅ Actively Hiring
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  </div>

                {/* Job Summary Section */}
                <div className="space-y-2 text-sm mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Job Summary</h4>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Award className="h-3 w-3 mr-1" />
                        <span>Experience Level:</span>
                      </div>
                      <span className="font-medium capitalize">{job.experienceLevel}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Salary Range:</span>
                      <span className="font-medium">{job.salary || "Competitive"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category:</span>
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
                <Link href={`/jobs/${job.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination can be added here later */}
      </div>
      </div>
    </CareersLayout>
  );
}
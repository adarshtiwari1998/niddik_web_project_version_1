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
import { Briefcase, Clock, MapPin, Search, Filter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CareersLayout from "@/components/careers/CareersLayout";

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all_categories");
  const [jobType, setJobType] = useState("all_types");
  const [experienceLevel, setExperienceLevel] = useState("all_levels");

  const { data, isLoading, error } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { search, category, jobType, experienceLevel, status: 'active' }],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will auto-refresh with the state changes
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all_categories");
    setJobType("all_types");
    setExperienceLevel("all_levels");
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-2/3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_categories">All Categories</SelectItem>
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

                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
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
              Showing {data.data.length} of {data.meta.total} opportunities
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

        {!isLoading && !error && data?.data.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No jobs match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!isLoading && !error && data?.data.map((job) => (
            <Card key={job.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">{job.company}</CardDescription>
                  </div>
                  {job.featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Recently added
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm line-clamp-3">{job.description}</p>
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
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ChevronRight } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'page' | 'service' | 'career' | 'insight';
  category?: string;
}

const allSearchableContent: SearchResult[] = [
  // Main Pages
  {
    id: '1',
    title: 'About Us',
    description: 'Learn about Niddik\'s story, mission, and values in transforming talent acquisition.',
    url: '/about-us',
    type: 'page',
    category: 'Company'
  },
  {
    id: '2',
    title: 'Why Niddik',
    description: 'Discover what makes Niddik different and why companies choose us for their talent needs.',
    url: '/why-us',
    type: 'page',
    category: 'Company'
  },
  {
    id: '3',
    title: 'Career Opportunities',
    description: 'Explore job opportunities and join our team of talented professionals.',
    url: '/careers',
    type: 'career',
    category: 'Careers'
  },
  {
    id: '4',
    title: 'Request Demo',
    description: 'Schedule a personalized demo to see how Niddik can transform your hiring process.',
    url: '/request-demo',
    type: 'page',
    category: 'Services'
  },
  {
    id: '5',
    title: 'Community Involvement',
    description: 'Learn about our commitment to community development and social responsibility.',
    url: '/community-involvement',
    type: 'page',
    category: 'Company'
  },

  // Services
  {
    id: '6',
    title: 'Services Overview',
    description: 'Explore our comprehensive range of talent acquisition and recruitment services.',
    url: '/services',
    type: 'service',
    category: 'Services'
  },
  {
    id: '7',
    title: 'Full RPO',
    description: 'Complete recruitment process outsourcing solutions for your organization.',
    url: '/services/full-rpo',
    type: 'service',
    category: 'Services'
  },
  {
    id: '8',
    title: 'On-Demand',
    description: 'Flexible recruitment services when you need them most.',
    url: '/services/on-demand',
    type: 'service',
    category: 'Services'
  },
  {
    id: '9',
    title: 'Hybrid RPO',
    description: 'Combine internal and external recruitment capabilities for optimal results.',
    url: '/services/hybrid-rpo',
    type: 'service',
    category: 'Services'
  },
  {
    id: '10',
    title: 'Contingent',
    description: 'Contingent recruitment services for specialized talent needs.',
    url: '/services/contingent',
    type: 'service',
    category: 'Services'
  },
  {
    id: '11',
    title: 'Web App Solutions',
    description: 'Custom web application development and digital solutions.',
    url: '/web-app-solutions',
    type: 'service',
    category: 'Services'
  },

  // Partners
  {
    id: '12',
    title: 'IT Partners',
    description: 'Technology partnerships and IT talent acquisition specialists.',
    url: '/partners/it',
    type: 'page',
    category: 'Partners'
  },
  {
    id: '13',
    title: 'Non-IT Partners',
    description: 'Non-technology sector partnerships and recruitment expertise.',
    url: '/partners/non-it',
    type: 'page',
    category: 'Partners'
  },
  {
    id: '14',
    title: 'Healthcare Partners',
    description: 'Healthcare industry partnerships and specialized medical recruitment.',
    url: '/partners/healthcare',
    type: 'page',
    category: 'Partners'
  },

  // Adaptive Hiring
  {
    id: '15',
    title: 'Adaptive Hiring',
    description: 'AI-driven recruiting and adaptive hiring methodologies.',
    url: '/adaptive-hiring',
    type: 'service',
    category: 'Innovation'
  },
  {
    id: '16',
    title: 'AI Driven Recruiting',
    description: 'Leverage artificial intelligence for smarter recruitment decisions.',
    url: '/adaptive-hiring',
    type: 'service',
    category: 'Innovation'
  },
  {
    id: '17',
    title: '6-Factor Recruiting Model',
    description: 'Our comprehensive six-factor approach to successful recruitment.',
    url: '/six-factor-recruiting-model',
    type: 'service',
    category: 'Innovation'
  },
  {
    id: '18',
    title: 'Agile Approach Based Recruiting',
    description: 'Agile methodologies applied to recruitment and talent acquisition.',
    url: '/agile-approach-based-recruiting',
    type: 'service',
    category: 'Innovation'
  },

  // Insights
  {
    id: '19',
    title: 'Facts & Trends',
    description: 'Stay updated with the latest recruitment industry trends and market insights.',
    url: '/facts-and-trends',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '20',
    title: 'Whitepaper',
    description: 'In-depth research and analysis on recruitment strategies and best practices.',
    url: '/whitepaper',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '21',
    title: 'Hiring Advice',
    description: 'Expert guidance and tips for effective hiring and talent acquisition.',
    url: '/hiring-advice',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '22',
    title: 'Career Advice',
    description: 'Professional development tips and career guidance for job seekers.',
    url: '/career-advice',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '23',
    title: 'Corporate Social Responsibilities',
    description: 'Our commitment to ethical business practices and social impact.',
    url: '/corporate-social-responsibilities',
    type: 'insight',
    category: 'Company'
  },
];

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'service':
      return 'bg-blue-100 text-blue-700';
    case 'career':
      return 'bg-green-100 text-green-700';
    case 'insight':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function SearchPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch job listings
  const { data: jobsData } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { status: 'active' }],
    queryFn: getQueryFn({ on401: "ignore" }),
  });

  // Convert job listings to search results format
  const jobSearchResults: SearchResult[] = jobsData?.data?.map(job => ({
    id: `job-${job.id}`,
    title: job.title,
    description: `${job.company} • ${job.location} • ${job.jobType} • ${job.experienceLevel}`,
    url: `/jobs/${job.id}`,
    type: 'career' as const,
    category: 'Jobs'
  })) || [];

  // Combine static content with job listings
  const allSearchableContentWithJobs = [...allSearchableContent, ...jobSearchResults];

  // Extract query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location]);

  // Filter results based on search term and category
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allSearchableContentWithJobs.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower);

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredResults(filtered);
  }, [searchTerm, selectedCategory, jobSearchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const categories = Array.from(new Set(allSearchableContentWithJobs.map(item => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBar />
      <Navbar />
      <Container className="py-12 mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find information about our services, insights, careers, and more
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for services, insights, careers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="bg-andela-green hover:bg-andela-green/90">
                  Search
                </Button>
              </div>

              <div className="flex gap-4 items-center">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Categories ({allSearchableContentWithJobs.length})</SelectItem>
                    {categories.map((category) => {
                      const count = allSearchableContentWithJobs.filter(item => item.category === category).length;
                      return (
                        <SelectItem key={category} value={category}>
                          {category} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {searchTerm ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  Search Results for "{searchTerm}"
                </h2>
                <p className="text-gray-600">
                  Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </p>
              </div>

              {filteredResults.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No results found</h3>
                      <p>Try adjusting your search terms or browse our categories.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Link href={result.url}>
                          <div className="flex items-start justify-between group cursor-pointer">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-andela-dark group-hover:text-andela-green transition-colors">
                                  {result.title}
                                </h3>
                                <Badge className={getTypeBadgeColor(result.type)}>
                                  {result.type}
                                </Badge>
                                {result.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.category}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {result.description}
                              </p>
                              <div className="flex items-center mt-3 text-andela-green group-hover:text-andela-dark transition-colors">
                                <span className="text-sm font-medium">Learn more</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Popular Categories */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Link href="/careers">
                        <div className="mb-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 text-xl">💼</span>
                          </div>
                          <h3 className="font-semibold text-sm">Jobs</h3>
                          <p className="text-xs text-gray-500 mt-1">Career opportunities</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Link href="/services">
                        <div className="mb-2">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <span className="text-green-600 text-xl">🔧</span>
                          </div>
                          <h3 className="font-semibold text-sm">Services</h3>
                          <p className="text-xs text-gray-500 mt-1">Our solutions</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Link href="/facts-and-trends">
                        <div className="mb-2">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <span className="text-purple-600 text-xl">📊</span>
                          </div>
                          <h3 className="font-semibold text-sm">Insights</h3>
                          <p className="text-xs text-gray-500 mt-1">Industry trends</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Link href="/about-us">
                        <div className="mb-2">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <span className="text-orange-600 text-xl">🏢</span>
                          </div>
                          <h3 className="font-semibold text-sm">Company</h3>
                          <p className="text-xs text-gray-500 mt-1">About Niddik</p>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Active Job Listings */}
              {jobsData?.data && jobsData.data.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Latest Job Opportunities</h2>
                    <Link href="/careers">
                      <Button variant="outline" className="text-sm">
                        View All Jobs
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {jobsData.data.slice(0, 6).map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <Link href={`/jobs/${job.id}`}>
                            <div className="group cursor-pointer">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-andela-dark group-hover:text-andela-green transition-colors">
                                  {job.title}
                                </h3>
                                {job.featured && (
                                  <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Featured</Badge>
                                )}
                                <Badge variant="outline" className="text-xs">Job</Badge>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">
                                {job.company} • {job.location} • {job.jobType}
                              </p>
                              <div className="flex items-center text-andela-green group-hover:text-andela-dark transition-colors">
                                <span className="text-sm font-medium">Apply Now</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Links */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Popular Links</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {allSearchableContent.slice(0, 8).map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Link href={item.url}>
                          <div className="group cursor-pointer">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-andela-dark group-hover:text-andela-green transition-colors">
                                {item.title}
                              </h3>
                              <Badge className={getTypeBadgeColor(item.type)}>
                                {item.type}
                              </Badge>
                              {item.category && (
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                              {item.description}
                            </p>
                            <div className="flex items-center text-andela-green group-hover:text-andela-dark transition-colors">
                              <span className="text-sm font-medium">Learn more</span>
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
}
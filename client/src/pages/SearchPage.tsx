
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, FileText, Users, Briefcase, Building, ArrowRight } from "lucide-react";
import Container from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

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
    id: '10',
    title: 'Full RPO',
    description: 'Complete recruitment process outsourcing solutions for enterprise organizations.',
    url: '/services/full-rpo',
    type: 'service',
    category: 'Services'
  },
  {
    id: '11',
    title: 'On-Demand Recruiting',
    description: 'Flexible recruiting services when you need them, how you need them.',
    url: '/services/on-demand',
    type: 'service',
    category: 'Services'
  },
  {
    id: '12',
    title: 'Hybrid RPO',
    description: 'Blended approach combining internal team capabilities with external expertise.',
    url: '/services/hybrid-rpo',
    type: 'service',
    category: 'Services'
  },
  {
    id: '13',
    title: 'Contingent Recruiting',
    description: 'Success-based recruiting services for specialized and hard-to-fill positions.',
    url: '/services/contingent',
    type: 'service',
    category: 'Services'
  },
  {
    id: '14',
    title: 'Web App Solutions',
    description: 'Custom web application development and digital transformation services.',
    url: '/web-app-solutions',
    type: 'service',
    category: 'Services'
  },

  // Insights & Resources
  {
    id: '20',
    title: 'Facts & Trends',
    description: 'Stay updated with the latest recruitment industry trends and market insights.',
    url: '/facts-and-trends',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '21',
    title: 'Whitepaper',
    description: 'In-depth research and analysis on recruitment strategies and best practices.',
    url: '/whitepaper',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '22',
    title: 'Hiring Advice',
    description: 'Expert guidance and tips for effective hiring and talent acquisition.',
    url: '/hiring-advice',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '23',
    title: 'Career Advice',
    description: 'Professional development tips and career guidance for job seekers.',
    url: '/career-advice',
    type: 'insight',
    category: 'Insights'
  },
  {
    id: '24',
    title: 'Corporate Social Responsibilities',
    description: 'Our commitment to ethical business practices and social impact.',
    url: '/corporate-social-responsibilities',
    type: 'insight',
    category: 'Company'
  },

  // Partners
  {
    id: '30',
    title: 'IT Partners',
    description: 'Technology sector recruitment expertise and strategic partnerships.',
    url: '/partners/it',
    type: 'page',
    category: 'Partners'
  },
  {
    id: '31',
    title: 'Non-IT Partners',
    description: 'Diverse industry recruitment solutions beyond technology.',
    url: '/partners/non-it',
    type: 'page',
    category: 'Partners'
  },
  {
    id: '32',
    title: 'Healthcare Partners',
    description: 'Specialized recruitment services for healthcare and medical professionals.',
    url: '/partners/healthcare',
    type: 'page',
    category: 'Partners'
  },

  // Adaptive Hiring
  {
    id: '40',
    title: 'Adaptive Hiring',
    description: 'AI-driven recruiting solutions that adapt to your unique hiring needs.',
    url: '/adaptive-hiring',
    type: 'service',
    category: 'Innovation'
  },
  {
    id: '41',
    title: '6-Factor Recruiting Model',
    description: 'Our proprietary methodology for comprehensive talent assessment.',
    url: '/six-factor-recruiting-model',
    type: 'insight',
    category: 'Innovation'
  },
  {
    id: '42',
    title: 'Agile Approach Based Recruiting',
    description: 'Flexible and iterative recruiting methodologies for dynamic organizations.',
    url: '/agile-approach-based-recruiting',
    type: 'insight',
    category: 'Innovation'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'service':
      return <Building className="w-4 h-4" />;
    case 'career':
      return <Briefcase className="w-4 h-4" />;
    case 'insight':
      return <FileText className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

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
    const filtered = allSearchableContent.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower);

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredResults(filtered);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const categories = Array.from(new Set(allSearchableContent.map(item => item.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find information about our services, insights, careers, and more
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pl-10 text-lg py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Category Filters */}
        {filteredResults.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Results ({filteredResults.length})
              </Button>
              {categories.map(category => {
                const count = filteredResults.filter(item => item.category === category).length;
                if (count === 0) return null;
                
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="space-y-4">
            {filteredResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find anything matching "{searchTerm}". Try different keywords or browse our main sections.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link href="/services">
                      <Button variant="outline">Browse Services</Button>
                    </Link>
                    <Link href="/careers">
                      <Button variant="outline">View Careers</Button>
                    </Link>
                    <Link href="/facts-and-trends">
                      <Button variant="outline">Read Insights</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </h2>
                </div>
                
                {filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center text-gray-500">
                              {getTypeIcon(result.type)}
                            </div>
                            <Badge className={`text-xs ${getTypeBadgeColor(result.type)}`}>
                              {result.category}
                            </Badge>
                          </div>
                          
                          <Link href={result.url}>
                            <h3 className="text-xl font-semibold text-andela-dark hover:text-andela-green transition-colors mb-2 cursor-pointer">
                              {result.title}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-600 mb-3">
                            {result.description}
                          </p>
                          
                          <Link href={result.url}>
                            <div className="inline-flex items-center text-andela-green hover:text-andela-dark transition-colors cursor-pointer">
                              <span className="text-sm font-medium">Learn more</span>
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* Default State - No Search */}
        {!searchTerm && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">What can we help you find?</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Search our services, insights, career opportunities, and more to find exactly what you're looking for.
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Link href="/services">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Building className="w-8 h-8 text-andela-green mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Services</h3>
                    <p className="text-sm text-gray-600">Explore our recruitment solutions</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/careers">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Briefcase className="w-8 h-8 text-andela-green mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Careers</h3>
                    <p className="text-sm text-gray-600">Join our talented team</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/facts-and-trends">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 text-andela-green mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Insights</h3>
                    <p className="text-sm text-gray-600">Industry trends and advice</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/about-us">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-andela-green mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-gray-600">Learn about our story</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

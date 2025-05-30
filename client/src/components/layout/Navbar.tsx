
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChevronDown, ChevronRight, User, Briefcase, Users, Clock, TrendingUp, FileText, Activity } from "lucide-react";
import Container from "@/components/ui/container";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

interface NavbarProps {
  hasAnnouncementAbove?: boolean;
}

interface SearchResult {
  label: string;
  href: string;
  type: "parent" | "child" | "job";
  parent?: string;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: "Insights",
    dropdown: [
      { label: "AI Insights", href: "/insights" },
      { label: "Facts & Trends", href: "/facts-and-trends" },
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Hiring Advice", href: "/hiring-advice" },
      { label: "Career Advice", href: "/career-advice" },
      { label: "Corporate Social Responsibilities", href: "/corporate-social-responsibilities" }
    ]
  },
  {
    label: "Services",
    href: "/services",
    dropdown: [
      { label: "Full RPO", href: "/services/full-rpo" },
      { label: "On-Demand", href: "/services/on-demand" },
      { label: "Hybrid RPO", href: "/services/hybrid-rpo" },
      { label: "Contingent", href: "/services/contingent" },
      { label: "Web App Solutions", href: "/web-app-solutions" }
    ]
  },
  {
    label: "Client",
    dropdown: [
      { label: "Our Clients", href: "/clients" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "IT", href: "/partners/it" },
      { label: "Non-IT", href: "/partners/non-it" },
      { label: "Healthcare", href: "/partners/healthcare" },
      { label: "Pharma", href: "#" },
      { label: "Case Studies", href: "#" },
    ]
  },
  {
    label: "Adaptive Hiring",
    dropdown: [
      { label: "AI Driven Recruiting", href: "/adaptive-hiring" },
      { label: "6-Factor Recruiting Model", href: "/six-factor-recruiting-model" },
      { label: "Agile Approach Based Recruiting", href: "/agile-approach-based-recruiting" } 
    ]
  },
  {
    label: "About us",
    dropdown: [
      { label: "Our Story", href: "/about-us" },
      { label: "Why NiDDik", href: "/why-us" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Community Involvement", href: "/community-involvement" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
      { label: "Apply to Niddik", href: "/careers" },
    ]
  },
  { 
  	label: "Contact Us", 
  	href: "/contact"
  },
];

const Navbar: React.FC<NavbarProps> = ({ hasAnnouncementAbove = true }) => {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [mobileDropdown, setMobileDropdown] = useState(-1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get user from auth context
  const { user } = useAuth();

  // Check if we're on specific pages that should have white background
  const isAdminPage = location.startsWith("/admin");
  const isAuthPage = location.startsWith("/auth");
  const isCandidatePage = location.startsWith("/candidate");
  const isHomePage = location === "/";

  // Fetch admin stats if user is admin
  const { data: adminStatsData } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: getQueryFn({ on401: "ignore" }),
    enabled: !!user && user.role === 'admin',
  });

  // Fetch job listings for admin stats
  const { data: jobsData } = useQuery({
    queryKey: ['/api/job-listings'],
    queryFn: getQueryFn({ on401: "ignore" }),
    enabled: !!user && user.role === 'admin',
  });

  // Fetch applications for admin stats
  const { data: applicationsData } = useQuery({
    queryKey: ['/api/applications'],
    queryFn: getQueryFn({ on401: "ignore" }),
    enabled: !!user && user.role === 'admin',
  });

  // Fetch candidate applications if user is candidate
  const { data: candidateApplicationsData } = useQuery({
    queryKey: ['/api/my-applications'],
    queryFn: getQueryFn({ on401: "ignore" }),
    enabled: !!user && user.role !== 'admin',
  });

  // Calculate admin stats
  const adminStats = user?.role === 'admin' ? {
    activeJobs: jobsData?.data?.filter(job => job.status === 'active')?.length || 0,
    totalJobs: jobsData?.data?.length || 0,
    totalApplications: applicationsData?.data?.length || 0,
    newApplications: applicationsData?.data?.filter(app => app.status === 'new')?.length || 0,
  } : null;

  // Calculate candidate stats
  const candidateStats = user?.role !== 'admin' ? {
    totalApplications: candidateApplicationsData?.data?.length || 0,
    newApplications: candidateApplicationsData?.data?.filter(app => app.status === 'new')?.length || 0,
    interviewStage: candidateApplicationsData?.data?.filter(app => app.status === 'interview')?.length || 0,
    availableJobs: jobsData?.data?.filter(job => job.status === 'active')?.length || 0,
  } : null;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Apply transparency logic
      if (isAdminPage || isAuthPage || isCandidatePage) {
        setIsTransparent(false);
      } else if (isHomePage) {
        setIsTransparent(scrollY < 50);
      } else {
        setIsTransparent(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnnouncementAbove, isAdminPage, isAuthPage, isCandidatePage, isHomePage]);

  // Fetch job listings for search
  const { data: searchJobsData } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
    queryKey: ['/api/job-listings', { status: 'active' }],
    queryFn: getQueryFn({ on401: "ignore" }),
  });

  // Enhanced search functionality that includes individual dropdown items and job listings
  useEffect(() => {
    if (searchTerm) {
      const results = [];

      // Search through all nav items and their dropdown items
      navItems.forEach(item => {
        // Check if parent item matches
        if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            label: item.label,
            href: item.href || "#",
            type: "parent"
          });
        }

        // Check dropdown items
        if (item.dropdown) {
          item.dropdown.forEach(dropdownItem => {
            if (dropdownItem.label.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push({
                label: dropdownItem.label,
                href: dropdownItem.href,
                type: "child",
                parent: item.label
              });
            }
          });
        }
      });

      // Search through job listings
      if (searchJobsData?.data) {
        searchJobsData.data.forEach(job => {
          const searchLower = searchTerm.toLowerCase();
          if (
            job.title.toLowerCase().includes(searchLower) ||
            job.company.toLowerCase().includes(searchLower) ||
            job.location.toLowerCase().includes(searchLower) ||
            job.skills?.toLowerCase().includes(searchLower) ||
            job.category?.toLowerCase().includes(searchLower)
          ) {
            results.push({
              label: job.title,
              href: `/jobs/${job.id}`,
              type: "job",
              description: `${job.company} • ${job.location} • ${job.jobType}`
            });
          }
        });
      }

      setSearchResults(results.slice(0, 8)); // Limit to 8 results for dropdown
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchJobsData]);

  const isDarkPage = false;

  return (
    <header className={cn(
      "fixed w-full z-40",
      hasAnnouncementAbove ? "top-[40px]" : "top-0",
      isTransparent 
        ? "bg-transparent"
        : "bg-white/95 backdrop-blur-md border-b border-gray-200/50",
      isScrolled && !isTransparent ? "shadow-lg" : "",
      "transition-all duration-300 ease-in-out"
    )}>
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo with slogan */}
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center">
              <Link href="/" className="block">
                <Logo className="h-12" />
              </Link>
              <div className="marquee-container overflow-hidden relative w-full">
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.dropdown ? (
                <div key={index} className="relative group">
                  <div className="flex items-center">
                    <Link 
                      href={item.href || "#"} 
                      className={cn(
                        "group-hover:text-andela-green font-medium transition-colors",
                        isTransparent 
                          ? (isHomePage ? "text-white" : isDarkPage ? "text-white" : "text-andela-dark")
                          : (isDarkPage ? "text-black" : "text-andela-dark")
                      )}
                    >
                      {item.label}
                    </Link>
                    <ChevronDown className={cn(
                      "ml-1 w-4 h-4 group-hover:text-andela-green transition-colors",
                      isTransparent 
                        ? (isHomePage ? "text-white" : isDarkPage ? "text-white" : "text-andela-dark")
                        : (isDarkPage ? "text-white" : "text-andela-dark")
                    )} />
                  </div>
                  <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white/95 backdrop-blur-md p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50 border border-gray-200/20">
                    {item.dropdown.map((dropdownItem, idx) => (
                      <div key={idx} className="block py-2 text-gray-900 hover:text-andela-green transition-colors">
                        <Link href={dropdownItem.href}>
                          {dropdownItem.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={index} className={cn(
                  "hover:text-andela-green font-medium transition-colors whitespace-nowrap",
                  isTransparent 
                    ? (isHomePage ? "text-white" : isDarkPage ? "text-white" : "text-andela-dark")
                    : (isDarkPage ? "text-white" : "text-andela-dark")
                )}>
                  <Link href={item.href || "#"}>
                    {item.label}
                  </Link>
                </div>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4 text-nowrap">
            {/* Show Dashboard link if user is authenticated */}
            {user ? (
              <div className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-4 py-2 rounded-md font-medium">
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard'} className="text-white text-sm">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
              </div>
            ) : (
              <div className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-4 py-2 rounded-md font-medium flex items-center">
                <Link href="/request-demo" className="text-white text-sm">Hire Talent</Link>
              </div>
            )}

            {/* Search Icon and Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "hover:text-andela-green font-medium transition-colors",
                  isTransparent 
                    ? (isHomePage ? "text-white" : isDarkPage ? "text-white" : "text-andela-dark")
                    : (isDarkPage ? "text-white" : "text-andela-dark")
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl bg-white/95 backdrop-blur-md p-4 opacity-100 visible transition-all duration-300 transform origin-top-right z-50 border border-gray-200/20">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm.trim()) {
                      setIsSearchOpen(false);
                      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                    }
                  }}>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-andela-green"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                  {searchTerm ? (
                    searchResults.length > 0 ? (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-2 px-1">
                          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1">
                          {searchResults.map((result, index) => (
                            <div key={index} className="block py-2 px-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                              <Link 
                                href={result.href || "#"}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchTerm("");
                                }}
                                className="block w-full text-left"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{result.label}</span>
                                  {result.type === "child" && result.parent && (
                                    <span className="text-xs text-gray-500">in {result.parent}</span>
                                  )}
                                  {result.type === "job" && result.description && (
                                    <span className="text-xs text-gray-500">{result.description}</span>
                                  )}
                                  {result.type === "job" && (
                                    <span className="text-xs text-andela-green font-medium">Job Opening</span>
                                  )}
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-center py-4">
                        <div className="text-sm text-gray-500">No results found</div>
                        <div className="text-xs text-gray-400 mt-1">Try different keywords</div>
                      </div>
                    )
                  ) : (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-2 px-1">Popular searches</div>
                      <div className="space-y-1">
                        <div className="block py-2 px-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <Link 
                            href="/careers"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm("");
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Job Opportunities</span>
                              <span className="text-xs text-gray-500">Browse all available positions</span>
                            </div>
                          </Link>
                        </div>
                        <div className="block py-2 px-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <Link 
                            href="/services"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm("");
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Our Services</span>
                              <span className="text-xs text-gray-500">Recruitment solutions</span>
                            </div>
                          </Link>
                        </div>
                        <div className="block py-2 px-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <Link 
                            href="/adaptive-hiring"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm("");
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Adaptive Hiring</span>
                              <span className="text-xs text-gray-500">AI-driven recruiting</span>
                            </div>
                          </Link>
                        </div>
                        <div className="block py-2 px-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                          <Link 
                            href="/request-demo"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchTerm("");
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">Request Demo</span>
                              <span className="text-xs text-gray-500">See our platform in action</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!user && (
              <div className={cn(
                "border px-4 py-2 rounded-md font-medium flex items-center transition-colors",
                isTransparent && isHomePage
                  ? "border-white text-white hover:bg-white/20 hover:backdrop-blur-sm"
                  : isTransparent && isDarkPage
                    ? "border-white text-white hover:bg-white/20 hover:backdrop-blur-sm"
                    : isDarkPage 
                      ? "border-white text-white hover:bg-white/20 hover:backdrop-blur-sm" 
                      : "border-andela-green text-andela-green hover:bg-andela-green hover:text-white"
              )}>
                <Link 
                  href="/careers" 
                  className={cn(
                    "text-sm transition-colors",
                    isTransparent && isHomePage
                      ? "text-white hover:text-white"
                      : isTransparent && isDarkPage
                        ? "text-white hover:text-white"
                        : isDarkPage 
                          ? "text-white hover:text-white" 
                          : "text-andela-green hover:text-white"
                  )}
                >
                  Apply as Talent
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className={cn(
              "w-6 h-6 transition-colors",
              isTransparent 
                ? (isHomePage ? "text-white" : isDarkPage ? "text-white" : "text-andela-dark")
                : (isDarkPage ? "text-white" : "text-andela-dark")
            )} />
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed left-0 top-0 w-[85%] h-screen bg-white shadow-xl z-[99999] p-6 overflow-y-auto mobile-menu",
          isMobileMenuOpen && "open"
        )}
        style={{
          height: '100dvh',
          zIndex: 99999
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="h-14" />
              </Link>
              <div id="marquee-container" className="marquee-container overflow-hidden relative w-full">
              </div>
            </div>
          </div>
          <button 
            className="text-andela-dark"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-andela-green rounded-full flex items-center justify-center text-white font-medium">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">{user.fullName || user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-andela-green font-medium">
                  {user.role === 'admin' ? 'Admin' : 'Candidate'}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Quick Stats</h3>
              {user.role === 'admin' && adminStats ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="flex items-center">
                      <Briefcase className="h-3 w-3 text-blue-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-blue-700">{adminStats.activeJobs}</div>
                        <div className="text-xs text-blue-600">Active Jobs</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-100">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 text-green-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-green-700">{adminStats.totalApplications}</div>
                        <div className="text-xs text-green-600">Candidates</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-100">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-orange-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-orange-700">{adminStats.newApplications}</div>
                        <div className="text-xs text-orange-600">New Apps</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-100">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 text-purple-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-purple-700">{adminStats.totalJobs}</div>
                        <div className="text-xs text-purple-600">Total Jobs</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : candidateStats ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 text-blue-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-blue-700">{candidateStats.totalApplications}</div>
                        <div className="text-xs text-blue-600">My Apps</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-100">
                    <div className="flex items-center">
                      <Activity className="h-3 w-3 text-green-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-green-700">{candidateStats.interviewStage}</div>
                        <div className="text-xs text-green-600">Interviews</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded border border-orange-100">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-orange-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-orange-700">{candidateStats.newApplications}</div>
                        <div className="text-xs text-orange-600">Pending</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded border border-purple-100">
                    <div className="flex items-center">
                      <Briefcase className="h-3 w-3 text-purple-600 mr-1" />
                      <div>
                        <div className="text-sm font-semibold text-purple-700">{candidateStats.availableJobs}</div>
                        <div className="text-xs text-purple-600">New Jobs</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Dashboard Button */}
            <Button 
              className="w-full" 
              onClick={() => setIsMobileMenuOpen(false)}
              asChild
            >
              <Link href={user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard'}>
                <User className="mr-2 h-4 w-4" />
                Go to {user.role === 'admin' ? 'Admin' : 'My'} Dashboard
              </Link>
            </Button>
          </div>
        )}

        <nav className="flex flex-col space-y-4">
          {navItems.map((item, index) => (
            <div key={index} className="py-2 border-b border-gray-100">
              {item.dropdown ? (
                <div>
                  <div className="flex items-center justify-between w-full mb-2">
                    <Link 
                      href={item.href || "#"} 
                      className="font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      onClick={() => setMobileDropdown(index === mobileDropdown ? -1 : index)}
                      className="ml-2"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${index === mobileDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {index === mobileDropdown && (
                    <div className="ml-4 space-y-2 py-2">
                      {item.dropdown?.map((dropdownItem, idx) => (
                        <div key={idx} className="py-1">
                          <Link 
                            href={dropdownItem.href}
                            className="text-andela-gray hover:text-andela-green transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href || "#"} className="font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 flex flex-col space-y-3">
            {!user && (
              <div>
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="font-medium">Sign In</div>
                  <button
                    onClick={() => setMobileDropdown(mobileDropdown === 99 ? -1 : 99)}
                    className="ml-2"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === 99 ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {mobileDropdown === 99 && (
                  <div className="ml-4 space-y-2 py-2">
                    <div className="py-1">
                      <Link 
                        href="/admin"
                        className="text-andela-gray hover:text-andela-green transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in as Admin/Member
                      </Link>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/auth"
                        className="text-andela-gray hover:text-andela-green transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in as Candidate
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!user && (
              <>
                <div className="bg-andela-green text-white px-4 py-2 rounded-md font-medium text-center">
                  <Link href="/request-demo" onClick={() => setIsMobileMenuOpen(false)}>
                    Hire Talent
                  </Link>
                </div>
                <div className="border border-andela-green text-andela-green px-4 py-2 rounded-md font-medium text-center">
                  <Link href="/careers" className="text-andela-green" onClick={() => setIsMobileMenuOpen(false)}>Apply as Talent</Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

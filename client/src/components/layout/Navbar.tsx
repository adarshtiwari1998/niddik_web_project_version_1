import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import Container from "@/components/ui/container";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { JobListing } from "@shared/schema";
import { cn } from "@/lib/utils";

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
      { label: "IT", href: "/partners/it" },
      { label: "Non-IT", href: "/partners/non-it" },
      { label: "Healthcare", href: "/partners/healthcare" },
      { label: "Pharma", href: "#" },
      { label: "Testimonials", href: "#" },
      { label: "Case Studies", href: "#" },
      // { label: "Learning Community", href: "#" },
      // { label: "Expert Network", href: "#" }
    ]
  },
  // { label: "Adaptive Hiring", href: "/adaptive-hiring" },
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
      // { label: "Whitepaper", href: "/whitepaper" }
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

  // Check if we're on specific pages that should have white background
  const isAdminPage = location.startsWith("/admin");
  const isAuthPage = location.startsWith("/auth");
  const isCandidatePage = location.startsWith("/candidate");
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Apply transparency logic
      if (isAdminPage || isAuthPage || isCandidatePage) {
        // On admin, auth, and candidate pages, always use white background
        setIsTransparent(false);
      } else if (isHomePage) {
        // On home page, start transparent and become solid when scrolled
        setIsTransparent(scrollY < 50);
      } else {
        // On all other pages, always use white background (never transparent)
        setIsTransparent(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnnouncementAbove, isAdminPage, isAuthPage, isCandidatePage, isHomePage]);

  // Fetch job listings for search
  const { data: jobsData } = useQuery<{ data: JobListing[], meta: { total: number, pages: number } }>({
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
      if (jobsData?.data) {
        jobsData.data.forEach(job => {
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
  }, [searchTerm, jobsData]);

  const isDarkPage = false; // Remove dark page treatment for facts-and-trends

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
                {/* <div className="marquee text-gray-500 mt-1 whitespace-nowrap" style={{fontSize: "10px", marginTop: "1px"}}>
                  Connecting People, Changing Lives
                </div> */}
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
            <div className="relative group">
              <div className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-4 py-2 rounded-md font-medium flex items-center">
                <Link href="/request-demo" className="text-white text-sm">Hire Talent</Link>
              </div>
            </div>

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
                      // Use wouter's navigate for client-side routing
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
      <div className={cn(
        "fixed top-0 left-0 h-full w-4/5 bg-white shadow-xl z-[9999] p-6 overflow-y-auto mobile-menu",
        isMobileMenuOpen && "open"
      )}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="h-14" />
              </Link>
              <div 	id="marquee-container" className="marquee-container overflow-hidden relative w-full">
                {/* <div className="marquee text-gray-500 mt-1 whitespace-nowrap" style={{fontSize: "11px", marginTop: "1px"}}>
                  Connecting People, Changing Lives
                </div> */}
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
                <Link href={item.href || "#"} className="font-medium">
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 flex flex-col space-y-3">
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
            <div className="bg-andela-green text-white px-4 py-2 rounded-md font-medium text-center">
              <div className="flex items-center justify-center">
                <span>Hire Talent</span>
                <ChevronDown className="ml-1 w-4 h-4 text-white" />
              </div>
              <div className="mt-2 space-y-2 bg-white rounded-md p-2">
                <div className="text-andela-dark hover:text-andela-green transition-colors text-center">
                  <Link href="/request-demo" onClick={() => setIsMobileMenuOpen(false)}>
                    Request Demo
                  </Link>
                </div>
                <div className="text-andela-dark hover:text-andela-green transition-colors text-center">
                  <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
            <div className="border border-andela-green text-andela-green px-4 py-2 rounded-md font-medium text-center">
              <Link href="/careers" className="text-andela-green" onClick={() => setIsMobileMenuOpen(false)}>Apply as Talent</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
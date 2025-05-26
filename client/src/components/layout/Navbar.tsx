import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import Container from "@/components/ui/container";

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

const navItems: NavItem[] = [
  {
    label: "Insights",
    dropdown: [
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
    label: "Partners",
    dropdown: [
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
      { label: "Leadership Team", href: "#" },
      { label: "Community Involvement", href: "/community-involvement" },
      { label: "Contact Us", href: "#" },
      // { label: "Whitepaper", href: "/whitepaper" }
      { label: "Apply to Niddik", href: "/careers" },
    ]
  },
  { 
  	label: "Contact Us", 
  	href: "#"
  },
];

const Navbar: React.FC<NavbarProps> = ({ hasAnnouncementAbove = true }) => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [mobileDropdown, setMobileDropdown] = useState(-1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Check if we're on the home page
  const isHomePage = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50); // Start white background sooner

      // Only apply transparency logic on home page
      if (isHomePage) {
        // Make it less transparent sooner for better visibility
        setIsTransparent(scrollY < 100);
      } else {
        // On other pages, always use white background
        setIsTransparent(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnnouncementAbove, isHomePage]);

  // Basic search functionality (replace with your actual search logic)
  useEffect(() => {
    if (searchTerm) {
      // Simulate a search API call or local filtering
      const results = navItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.dropdown && item.dropdown.some(dropdownItem =>
          dropdownItem.label.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <header className={cn(
      "fixed w-full z-40",
      hasAnnouncementAbove ? "top-[40px]" : "top-0",
      isHomePage && isTransparent 
        ? "bg-black/20 backdrop-blur-sm border-b border-white/10" 
        : "bg-white/95 backdrop-blur-md border-b border-gray-200/50",
      isScrolled ? "shadow-lg" : "",
      "transition-all duration-500 ease-in-out"
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
                        isTransparent ? "text-white" : "text-andela-dark"
                      )}
                    >
                      {item.label}
                    </Link>
                    <ChevronDown className={cn(
                      "ml-1 w-4 h-4 group-hover:text-andela-green transition-colors",
                      isTransparent ? "text-white" : "text-andela-dark"
                    )} />
                  </div>
                  <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
                    {item.dropdown.map((dropdownItem, idx) => (
                      <div key={idx} className="block py-2 hover:text-andela-green transition-colors">
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
                  isTransparent ? "text-white" : "text-andela-dark"
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
                  isTransparent ? "text-white" : "text-andela-dark"
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl bg-white p-4 opacity-100 visible transition-all duration-300 transform origin-top-right z-50">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm.trim()) {
                      setIsSearchOpen(false);
                      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
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
                  {searchResults.length > 0 && (
                    <div className="mt-2">
                      {searchResults.map((result, index) => (
                        <div key={index} className="block py-2 hover:text-andela-green transition-colors cursor-pointer">
                          <Link 
                            href={result.href || "#"}
                            onClick={() => setIsSearchOpen(false)}
                            className="block w-full text-left"
                          >
                            {result.label}
                          </Link>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2">
                        <Link 
                          href={`/search?q=${encodeURIComponent(searchTerm)}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="block py-2 text-sm text-andela-green hover:text-andela-dark transition-colors"
                        >
                          View all results for "{searchTerm}"
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border border-andela-green text-andela-green hover:bg-andela-green hover:text-white px-4 py-2 rounded-md font-medium flex items-center">
              <Link 
                href="/careers" 
                className={cn(
                  "text-sm",
                  isTransparent ? "text-white" : "text-andela-green",
                  "hover:text-white transition-colors"
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
              isTransparent ? "text-white" : "text-andela-dark"
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
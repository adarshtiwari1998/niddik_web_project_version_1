import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
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
    label: "For Business",
    dropdown: [
      { label: "Enterprise", href: "#" },
      { label: "Hiring Solutions", href: "#" },
      { label: "Case Studies", href: "#" }
    ]
  },
  {
    label: "Solutions",
    href: "/services",
    dropdown: [
      { label: "Full RPO", href: "/services/full-rpo" },
      { label: "On-Demand", href: "/services/on-demand" },
      { label: "Hybrid RPO", href: "/services/hybrid-rpo" },
      { label: "Contingent", href: "/services/contingent" }
    ]
  },
  {
    label: "For Technologists",
    dropdown: [
      { label: "Apply to Niddik", href: "#" },
      { label: "Learning Community", href: "#" },
      { label: "Expert Network", href: "#" }
    ]
  },
  { label: "Enterprise", href: "#" },
  { label: "Resources", href: "#" },
  {
    label: "Company",
    dropdown: [
      { label: "About Us", href: "/about-us" },
      { label: "Why Us", href: "/why-us" }
    ]
  }
];

const Navbar: React.FC<NavbarProps> = ({ hasAnnouncementAbove = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnnouncementAbove]);

  return (
    <header className={cn(
      "sticky w-full bg-white z-40 transition-all duration-300",
      isScrolled ? "shadow-md" : "shadow-sm",
      "transition-all duration-300"
    )}>
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Logo className="h-10" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.dropdown ? (
                <div key={index} className="relative group">
                  <div className="flex items-center">
                    <Link 
                      href={item.href || "#"} 
                      className="text-andela-dark group-hover:text-andela-green font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                    <ChevronDown className="ml-1 w-4 h-4 text-andela-dark group-hover:text-andela-green" />
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
                <div key={index} className="text-andela-dark hover:text-andela-green font-medium transition-colors">
                  <Link href={item.href || "#"}>
                    {item.label}
                  </Link>
                </div>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="hover:text-andela-green font-medium transition-colors">
              <a href="#">Sign In</a>
            </div>
            <div className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-6 py-2 rounded-md font-medium">
              <a href="#" className="text-white">Hire Talent</a>
            </div>
            <div className="border border-andela-green text-andela-green hover:bg-andela-green hover:text-white transition-colors px-6 py-2 rounded-md font-medium">
              <a href="#" className="text-andela-green hover:text-white">Apply as Talent</a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-4/5 bg-white shadow-xl z-50 p-6 overflow-y-auto mobile-menu",
        isMobileMenuOpen && "open"
      )}>
        <div className="flex justify-between items-center mb-8">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo className="h-8" />
          </Link>
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
            <div className="font-medium">
              <a href="#">Sign In</a>
            </div>
            <div className="bg-andela-green text-white px-4 py-2 rounded-md font-medium text-center">
              <a href="#" className="text-white">Hire Talent</a>
            </div>
            <div className="border border-andela-green text-andela-green px-4 py-2 rounded-md font-medium text-center">
              <a href="#" className="text-andela-green">Apply as Talent</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

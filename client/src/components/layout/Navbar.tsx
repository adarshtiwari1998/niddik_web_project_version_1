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
    label: "For Technologists",
    dropdown: [
      { label: "Apply to Andela", href: "#" },
      { label: "Learning Community", href: "#" },
      { label: "Expert Network", href: "#" }
    ]
  },
  { label: "Enterprise", href: "#" },
  { label: "Resources", href: "#" },
  { label: "About Us", href: "#" }
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed w-full bg-white z-50 transition-shadow duration-300",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      <Container>
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="block">
                <Logo className="h-10" />
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              item.dropdown ? (
                <div key={index} className="relative group">
                  <button className="flex items-center text-andela-dark group-hover:text-andela-green font-medium transition-colors">
                    {item.label}
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                    {item.dropdown.map((dropdownItem, idx) => (
                      <Link key={idx} href={dropdownItem.href}>
                        <a className="block py-2 hover:text-andela-green transition-colors">
                          {dropdownItem.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={index} href={item.href || "#"}>
                  <a className="text-andela-dark hover:text-andela-green font-medium transition-colors">
                    {item.label}
                  </a>
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="#">
              <a className="hover:text-andela-green font-medium transition-colors">
                Sign In
              </a>
            </Link>
            <Link href="#">
              <a className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-6 py-2 rounded-md font-medium">
                Hire Talent
              </a>
            </Link>
            <Link href="#">
              <a className="border border-andela-green text-andela-green hover:bg-andela-green hover:text-white transition-colors px-6 py-2 rounded-md font-medium">
                Apply as Talent
              </a>
            </Link>
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
          <Logo className="h-8" />
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
                <button className="flex items-center justify-between w-full text-left font-medium">
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <Link href={item.href || "#"}>
                  <a className="font-medium">{item.label}</a>
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 flex flex-col space-y-3">
            <Link href="#">
              <a className="font-medium">Sign In</a>
            </Link>
            <Link href="#">
              <a className="bg-andela-green text-white px-4 py-2 rounded-md font-medium text-center">
                Hire Talent
              </a>
            </Link>
            <Link href="#">
              <a className="border border-andela-green text-andela-green px-4 py-2 rounded-md font-medium text-center">
                Apply as Talent
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

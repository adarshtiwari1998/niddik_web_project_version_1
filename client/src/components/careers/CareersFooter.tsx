import { Link } from "wouter";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram 
} from "lucide-react";

export default function CareersFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12 px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-bold text-xl">
              Niddik
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Empowering talent acquisition with intelligent matching technology that connects the right people with the right opportunities.
            </p>
            <div className="flex mt-4 space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/candidate/dashboard" className="text-muted-foreground hover:text-primary text-sm">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/candidate/applications" className="text-muted-foreground hover:text-primary text-sm">
                  My Applications
                </Link>
              </li>
              <li>
                <Link href="/candidate/profile" className="text-muted-foreground hover:text-primary text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="text-muted-foreground hover:text-primary text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="text-muted-foreground hover:text-primary text-sm">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/adaptive-hiring" className="text-muted-foreground hover:text-primary text-sm">
                  Adaptive Hiring
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-muted-foreground hover:text-primary text-sm">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Platina Heights, Sector 59, Noida - 201301</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+91 9717312058 (INDIA), +1 (646) 889-9517 (USA)</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">info@niddik.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} Niddik. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-3">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
              <Link href="#" className="hover:text-primary">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
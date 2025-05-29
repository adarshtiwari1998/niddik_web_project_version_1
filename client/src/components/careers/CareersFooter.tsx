
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react";

const CareersFooter = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/images/niddik_logo.png" 
                alt="Niddik Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">Niddik</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Empowering talent acquisition with intelligent matching technology that connects the right people with the right opportunities.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://facebook.com/niddik" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/niddik" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/company/niddik" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/niddik" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Dynamic Section based on user role */}
          <div className="space-y-4">
            {user && user.role === 'admin' ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900">ADMIN PANEL</h3>
                <div className="space-y-2">
                  <Link href="/admin/dashboard" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link href="/admin/jobs" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Manage Job Listings
                  </Link>
                  <Link href="/admin/candidates" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Candidates
                  </Link>
                  <Link href="/admin/submitted-candidates" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Submitted Candidates
                  </Link>
                  <Link href="/admin/users" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Users Management
                  </Link>
                  <Link href="/admin/demo-requests" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Demo Requests
                  </Link>
                  <Link href="/admin/contact-submissions" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Contact Submissions
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">JOB SEEKERS</h3>
                <div className="space-y-2">
                  <Link href="/careers" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    Browse Jobs
                  </Link>
                  {user && user.role !== 'admin' ? (
                    <>
                      <Link href="/candidate/dashboard" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        Candidate Dashboard
                      </Link>
                      <Link href="/candidate/applications" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        My Applications
                      </Link>
                      <Link href="/candidate/profile" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        Profile
                      </Link>
                    </>
                  ) : !user ? (
                    <>
                      <Link href="/auth" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        Candidate Dashboard
                      </Link>
                      <Link href="/auth" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        My Applications
                      </Link>
                      <Link href="/auth" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        Profile
                      </Link>
                    </>
                  ) : null}
                </div>
              </>
            )}
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">COMPANY</h3>
            <div className="space-y-2">
              <Link href="/about-us" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                About Us
              </Link>
              <Link href="/why-us" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Why Choose Us
              </Link>
              <Link href="/services" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="/adaptive-hiring" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Adaptive Hiring
              </Link>
              <Link href="/whitepaper" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Whitepaper
              </Link>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">CONTACT US</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Platina Heights, Sector 59, Noida - 201301
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  +91 9773120558 (INDIA), +1 (646) 899-9537 (USA)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Link href="mailto:info@niddik.com" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  info@niddik.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Niddik. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CareersFooter;

import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {RectangleEllipsis, Globe, Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, Youtube } from "lucide-react";
import GlobalNetworkMap from "@/components/sections/GlobalNetworkMap";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";
interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const Footer = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const isContactPage = location === "/contact";

  const footerColumns: FooterColumn[] = [
    {
      title: "Insights",
      links: [
        { label: "AI Insights", href: "/insights" },
        { label: "Facts & Trends", href: "/facts-and-trends" },
        { label: "Whitepaper", href: "/whitepaper" },
        { label: "Hiring Advice", href: "/hiring-advice" },
        { label: "Career Advice", href: "/career-advice" },
        { label: "Corporate Social Responsibilities", href: "/corporate-social-responsibilities" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Services", href: "/services" },
        { label: "Full RPO", href: "/services/full-rpo" },
        { label: "On-Demand", href: "/services/on-demand" },
        { label: "Hybrid RPO", href: "/services/hybrid-rpo" },
        { label: "Contingent", href: "/services/contingent" },
        { label: "Web App Solutions", href: "/web-app-solutions" }
      ]
    },
    {
      title: "Client",
      links: [
        { label: "Our Clients", href: "/clients" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "IT", href: "/partners/it" },
        { label: "Non-IT", href: "/partners/non-it" },
        { label: "Healthcare", href: "/partners/healthcare" },
        { label: "Pharma", href: "#" },
        { label: "Case Studies", href: "#" }
      ]
    },
    {
      title: "Adaptive Hiring",
      links: [
        { label: "AI Driven Recruiting", href: "/adaptive-hiring" },
        { label: "6-Factor Recruiting Model", href: "/six-factor-recruiting-model" },
        { label: "Agile Approach Based Recruiting", href: "/agile-approach-based-recruiting" }
      ]
    }
  ];

  const aboutUsColumn: FooterColumn = {
    title: "About us",
    links: [
      { label: "Our Story", href: "/about-us" },
      { label: "Why NiDDik", href: "/why-us" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Community Involvement", href: "/community-involvement" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
      { label: "Apply to Niddik", href: "/careers" },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Global Network Map Section - Only show when NOT on contact page */}
      {!isContactPage && (
      <section className="py-20 bg-gray-900">
        <Container>
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Global Network
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Connected across three major technology markets - India, United States, and Canada. 
              Our network enables seamless talent acquisition and deployment worldwide.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlobalNetworkMap />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">India Hub</h3>
              <p className="text-gray-400">Our headquarters in Noida serves as the central command for our global operations and talent pool.</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">US Market</h3>
              <p className="text-gray-400">Strategic presence across major US tech hubs including New York, San Francisco, and Austin.</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RectangleEllipsis className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Canada Network</h3>
              <p className="text-gray-400">Growing presence in Toronto, Vancouver, and Montreal connecting top Canadian talent.</p>
            </motion.div>
          </div>
        </Container>
      </section>
      )}
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Info - Takes 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/images/niddik_logo.png" 
                alt="Niddik Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold">Niddik</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Empowering talent acquisition with intelligent matching technology that connects the right people with the right opportunities.
            </p>

            {/* User-specific Navigation */}
            {user ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Quick Access</h4>
                <div className="space-y-2">
                  {user.role === 'admin' ? (
                    <>
                      <Link href="/admin/dashboard" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Admin Dashboard
                      </Link>
                      <Link href="/admin/jobs" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Manage Job Listings
                      </Link>
                      <Link href="/admin/candidates" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Candidates
                      </Link>
                      <Link href="/admin/submitted-candidates" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Submitted Candidates
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/candidate/dashboard" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                        My Dashboard
                      </Link>
                      <Link href="/candidate/applications" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                        My Applications
                      </Link>
                      <Link href="/candidate/profile" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                        My Profile
                      </Link>
                      <Link href="/careers" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                        Browse Jobs
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Get Started</h4>
                <div className="space-y-2">
                  <Link href="/careers" className="block text-sm text-green-400 hover:text-green-300 transition-colors">
                    Browse Jobs
                  </Link>
                  <Link href="/auth" className="block text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Sign In / Register
                  </Link>
                  <Link href="/request-demo" className="block text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Request Demo
                  </Link>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/company/niddik/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
              >
                <Linkedin className="text-white" size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@NiddikkareLLP" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
              >
                <svg className="text-white" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                <Twitter className="text-white" size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                <Facebook className="text-white" size={20} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full">
                <Instagram className="text-white" size={20} />
              </a>
            </div>
          </div>

          {/* All Footer Columns Container - Takes remaining 9 columns */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Footer Columns */}
              {footerColumns.map((column) => (
                <div key={column.title} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <div className="space-y-3">
                    {column.links.map((link) => (
                      <Link 
                        key={link.label}
                        href={link.href}
                        className="block text-sm text-gray-300 hover:text-white transition-colors leading-relaxed"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* About Us Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{aboutUsColumn.title}</h3>
                <div className="space-y-3">
                  {aboutUsColumn.links.map((link) => (
                    <Link 
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-gray-300 hover:text-white transition-colors leading-relaxed"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Address</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Platina Heights, Sector 59, Noida - 201301
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  +91 9773120558 (INDIA)<br />
                  +1 (646) 899-9537 (USA)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <Link 
                  href="mailto:info@niddik.com" 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  info@niddik.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © 2025 Niddik. All rights reserved.
              </p>
              {/* <p className="text-xs text-gray-500 mt-1">
                Managed and maintained by{" "}
                <a 
                  href="https://itweblens.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Itweblens.com
                </a>
              </p> */}
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
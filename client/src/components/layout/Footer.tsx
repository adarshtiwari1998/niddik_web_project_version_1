
import { Link } from "wouter";
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram,
  Youtube
} from "lucide-react";
import Container from "@/components/ui/container";
import Logo from "@/components/ui/logo";

interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "For Businesses",
    links: [
      { label: "Services", href: "/services" },
      { label: "Request Demo", href: "/request-demo" },
      { label: "Our Clients", href: "/clients" },
      { label: "Testimonials", href: "/testimonials" }
    ]
  },
  {
    title: "For Technologists",
    links: [
      { label: "Apply as Talent", href: "/careers" },
      { label: "Career Advice", href: "/career-advice" },
      { label: "Leadership Team", href: "/leadership-team" },
      { label: "Community Involvement", href: "/community-involvement" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "Full RPO", href: "/services/full-rpo" },
      { label: "On-Demand", href: "/services/on-demand" },
      { label: "Hybrid RPO", href: "/services/hybrid-rpo" },
      { label: "Contingent", href: "/services/contingent" },
      { label: "Web App Solutions", href: "/web-app-solutions" }
    ]
  },
  {
    title: "About Niddik",
    links: [
      { label: "Our Story", href: "/about-us" },
      { label: "Why NiDDik", href: "/why-us" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="bg-andela-dark py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Logo className="h-10 mb-6" white />
            <p className="text-gray-300 mb-6 text-sm">
              Niddik is a global talent marketplace that connects companies with vetted, remote technical talent in emerging markets.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/niddik/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@NiddikkareLLP" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerColumns.map((column, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4 text-sm">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Niddik. All rights reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-gray-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

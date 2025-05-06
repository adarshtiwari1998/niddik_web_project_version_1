import { Link } from "wouter";
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram 
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
      { label: "Enterprise", href: "#" },
      { label: "Hire Talent", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Events", href: "#" }
    ]
  },
  {
    title: "For Technologists",
    links: [
      { label: "Apply as Talent", href: "#" },
      { label: "Learning Community", href: "#" },
      { label: "Tech Leadership", href: "#" },
      { label: "Remote Work", href: "#" },
      { label: "Success Stories", href: "#" }
    ]
  },
  {
    title: "About Niddik",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Leadership", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact Us", href: "#" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="bg-andela-dark py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Logo className="h-10 mb-6" white />
            <p className="text-gray-300 mb-6">
              Niddik is a global talent marketplace that connects companies with vetted, remote technical talent in emerging markets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
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
            <div key={index}>
              <h4 className="text-white font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
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
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import { Link } from "wouter";
import { Search, UserCog, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

interface BusinessCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  linkText: string;
  linkColor: string;
  href: string;
}

const BusinessCard = ({
  icon,
  iconBgColor,
  title,
  description,
  linkText,
  linkColor,
  href
}: BusinessCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-8 shadow-lg transition-transform hover:scale-105"
      whileHover={{ y: -5 }}
    >
      <div className={`${iconBgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-andela-gray mb-6">{description}</p>
      <Link href={href}>
        <a className={`${linkColor} font-medium flex items-center`}>
          {linkText}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </Link>
    </motion.div>
  );
};

const businessCards = [
  {
    icon: <Search className="text-andela-green text-2xl" />,
    iconBgColor: "bg-andela-green/10",
    title: "Source Talent",
    description: "Access our global network of pre-vetted, world-class tech professionals ready to join your team.",
    linkText: "Learn More",
    linkColor: "text-andela-green",
    href: "#"
  },
  {
    icon: <UserCog className="text-andela-blue text-2xl" />,
    iconBgColor: "bg-andela-blue/10",
    title: "Build Teams",
    description: "Quickly assemble high-performing teams for your projects with our managed team solution.",
    linkText: "Learn More",
    linkColor: "text-andela-blue",
    href: "#"
  },
  {
    icon: <Rocket className="text-purple-600 text-2xl" />,
    iconBgColor: "bg-purple-100",
    title: "Enterprise Solution",
    description: "Flexible talent solutions designed specifically for enterprise needs and compliance requirements.",
    linkText: "Learn More",
    linkColor: "text-purple-600",
    href: "#"
  }
];

const ForBusinesses = () => {
  return (
    <section className="py-20 bg-andela-dark">
      <Container>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">For Businesses</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find exceptional talent to augment your workforce and scale your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BusinessCard {...card} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ForBusinesses;

import { Link } from "wouter";
import { Globe, TrendingUp, Banknote, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-andela-green/10 p-3 rounded-full flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-andela-gray">{description}</p>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Globe className="text-andela-green" />,
    title: "Work Globally",
    description: "Access remote opportunities with companies from around the world."
  },
  {
    icon: <TrendingUp className="text-andela-green" />,
    title: "Grow Your Career",
    description: "Gain experience with industry leaders and advance your skills."
  },
  {
    icon: <Banknote className="text-andela-green" />,
    title: "Competitive Compensation",
    description: "Earn competitive rates based on your skills and experience."
  }
];

const ForTechnologists = () => {
  return (
    <section className="py-20 bg-andela-light">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For Technologists</h2>
            <p className="text-lg text-andela-gray mb-8">
              Join our global community of tech professionals and connect with opportunities to work with leading companies.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Feature {...feature} />
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="#">
                <a className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-8 py-3 rounded-md font-medium inline-block">
                  Apply as Talent
                </a>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1573496773905-f5b17e717f05?auto=format&fit=crop&w=800&q=80" 
              alt="Diverse tech professional working" 
              className="rounded-xl shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-andela-blue h-12 w-12 rounded-full flex items-center justify-center text-white">
                  <Laptop className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold">175+</p>
                  <p className="text-sm text-andela-gray">Countries Represented</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ForTechnologists;

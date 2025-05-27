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
              <Link href="/careers" className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-8 py-3 rounded-md font-medium inline-block">
                Apply as Talent
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
            <div className="absolute -bottom-10 -right-10 bg-gradient-to-r from-blue-600 to-green-500 p-1 rounded-2xl shadow-xl hidden md:block backdrop-blur-md overflow-hidden">
              <div className="relative bg-white/90 backdrop-blur-md p-5 rounded-xl border-t border-l border-white/50 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border-2 border-white">US</div>
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold border-2 border-white">IN</div>
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border-2 border-white">UK</div>
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold border-2 border-white">CA</div>
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border-2 border-white">AU</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs py-1 px-2 rounded-full ml-3">
                      Top 5
                    </div>
                  </div>
                  <h4 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">5 Core Countries</h4>
                  <p className="text-xs text-andela-gray mt-1">Where our best talent is based</p>
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

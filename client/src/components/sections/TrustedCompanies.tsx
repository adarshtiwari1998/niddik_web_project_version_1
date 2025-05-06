import React, { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";
import { 
  FaMicrosoft, 
  FaGithub, 
  FaAmazon, 
  FaGoogle, 
  FaBuilding, 
  FaCreditCard
} from "react-icons/fa";
// Remove problematic imports that don't exist
import "./marquee.css";

// Company logos and reliable icons 
const companies = [
  { name: "Microsoft", logo: <FaMicrosoft size={32} color="#666" /> },
  { name: "KPMG", logo: <FaBuilding size={32} color="#666" /> },
  { name: "JP Morgan", logo: <FaCreditCard size={32} color="#666" /> },
  { name: "Goldman Sachs", logo: <FaBuilding size={32} color="#666" /> },
  { name: "GitHub", logo: <FaGithub size={32} color="#666" /> },
  { name: "Amazon", logo: <FaAmazon size={32} color="#666" /> },
  { name: "Google", logo: <FaGoogle size={32} color="#666" /> }
];

// Component for a smooth marquee animation effect
const InfiniteMarquee = ({ children, pauseOnHover = true, speed = 15 }: {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  speed?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div 
      className="marquee-container" 
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="marquee-content"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          animationDuration: `${speed}s`,
        }}
      >
        {/* Original content */}
        {children}
        
        {/* Duplicate content with unique keys */}
        <div className="marquee-content-duplicate">
          {React.Children.toArray(children).map((child, i) => 
            React.isValidElement(child) && child.props.key ? 
              React.cloneElement(child, { key: `dup-${child.props.key}` }) : 
              child
          )}
        </div>
      </div>
    </div>
  );
};

// Simple component to match the reference image with marquee effect
const TrustedCompanies = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <Container>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-start">
            {/* Left column with text */}
            <motion.div 
              className="md:w-1/3 mb-8 md:mb-0 pr-0 md:pr-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-andela-dark mb-4">
                Trusted by leading companies worldwide
              </h2>
              <p className="text-andela-gray">
                Join thousands of businesses using our platform to connect with top tech talent around the globe.
              </p>
            </motion.div>
            
            {/* Right column with company logos in marquee */}
            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <InfiniteMarquee speed={30}>
                {companies.map((company, index) => (
                  <div 
                    key={`company-${index}`}
                    className="flex-none mx-10 grayscale hover:grayscale-0 transition-all duration-300"
                  >
                    <div className="w-28 h-16 flex items-center justify-center">
                      {company.logo}
                    </div>
                  </div>
                ))}
              </InfiniteMarquee>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

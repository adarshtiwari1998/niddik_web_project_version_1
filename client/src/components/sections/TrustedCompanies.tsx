import React, { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";
// React icons removed as we're now using actual client logos
// Remove problematic imports that don't exist
import "./marquee.css";

// Company logos with actual client images
const companies = [
  { 
    name: "KPMG", 
    logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_kpmg_hlzxx3.png" alt="KPMG" className="h-12 w-28 object-contain" />
  },
  { 
    name: "Wimmer", 
    logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_wimmer_dpw6yf.png" alt="Wimmer" className="h-12 w-28 object-contain" />
  },
  { 
    name: "Schneider Electric", 
    logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748559345/niddik_client_schneider-electric-v2_tlu18y.png" alt="Schneider Electric" className="h-12 w-28 object-contain" />
  },
  { 
    name: "FACTORYFIX", 
    logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748559345/niddik_client_factoryfix-v2_w97uc0.png" alt="Factoryfix" className="h-12 w-28 object-contain" />
  },
  { 
    name: "Google", 
    logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748559344/niddik_client_google-v2_n6sn3b.png" alt="Google" className="h-12 w-28 object-contain" />
  },
  // { 
  //   name: "Nordstrom", 
  //   logo: <img src="https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_nordstorm_oep8ef.png" alt="Nordstrom" className="h-12 w-28 object-contain" />
  // }
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
            React.isValidElement(child) ? 
              React.cloneElement(child, { key: `dup-${i}` }) : 
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
                    className="flex-none mx-8 grayscale hover:grayscale-0 transition-all duration-300"
                  >
                    <div className="w-32 h-20 flex items-center justify-center">
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

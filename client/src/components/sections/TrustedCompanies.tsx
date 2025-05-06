import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FaMicrosoft, 
  FaGithub, 
  FaAmazon, 
  FaGoogle, 
  FaApple, 
  FaFacebookF,
  FaUniversity,
  FaBuilding
} from "react-icons/fa";
import { 
  SiGithub,
  SiAmazon,
  SiGoogle,
  SiCbs,
  SiJpmorgan
} from "react-icons/si";
import Container from "@/components/ui/container";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ClientData } from "@/lib/types";
import "./marquee.css";

// Company logos in modern style matching the reference image
const fallbackCompanies = [
  { name: "Microsoft", logo: <FaMicrosoft className="w-full h-full" /> },
  { name: "KPMG", logo: <FaBuilding className="w-full h-full" /> },
  { name: "JP Morgan", logo: <FaUniversity className="w-full h-full" /> },
  { name: "Goldman Sachs", logo: <FaBuilding className="w-full h-full" /> },
  { name: "Viacom CBS", logo: <SiCbs className="w-full h-full" /> },
  { name: "GitHub", logo: <SiGithub className="w-full h-full" /> },
  { name: "Amazon", logo: <SiAmazon className="w-full h-full" /> },
  { name: "Google", logo: <SiGoogle className="w-full h-full" /> }
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

const TrustedCompanies = () => {
  // Fetch clients from API
  const { data: apiResponse, isLoading } = useQuery<{success: boolean, data: ClientData[]}>({
    queryKey: ['/api/clients'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Determine which data to use (API data or fallback)
  const clients = apiResponse && apiResponse.data && apiResponse.data.length > 0 
    ? apiResponse.data
    : null;

  // Function to render logos
  const renderLogos = () => {
    // Create function to render a single logo with consistent styling
    const renderLogo = (id: string | number, name: string, logo: string | JSX.Element) => (
      <div 
        key={`${id}`}
        className="flex-none mx-6 grayscale hover:grayscale-0 transition-all duration-300 w-32 h-16 flex items-center justify-center"
      >
        {typeof logo === 'string' ? (
          <img 
            src={logo} 
            alt={name}
            className="max-h-12 max-w-full object-contain"
          />
        ) : (
          <div className="w-20 h-10 text-andela-dark">
            {logo}
          </div>
        )}
      </div>
    );
    
    // Determine which dataset to use
    if (clients && clients.length > 0) {
      return clients.map((client: ClientData) => 
        renderLogo(client.id, client.name, client.logo)
      );
    } else {
      return fallbackCompanies.map((company, index) => 
        renderLogo(`fallback-${index}`, company.name, company.logo)
      );
    }
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <Container>
        {/* Static version matching the reference image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-andela-dark mb-4">
            Trusted by leading companies worldwide
          </h2>
          <p className="text-andela-gray max-w-2xl mx-auto">
            Join thousands of businesses using our platform to connect with top tech talent around the globe.
          </p>
        </motion.div>
        
        {/* Logo grid - static layout matching reference image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8"
        >
          {fallbackCompanies.map((company, index) => (
            <div 
              key={`company-${index}`}
              className="grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center"
            >
              <div className="w-24 h-12 flex items-center justify-center text-gray-600">
                {company.logo}
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

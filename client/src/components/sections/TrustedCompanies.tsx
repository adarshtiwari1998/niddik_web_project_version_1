import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrosoft, FaGithub, FaAmazon, FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import Container from "@/components/ui/container";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ClientData } from "@/lib/types";
import "./marquee.css";

// Fallback data with React icons in case the API is not returning data
const fallbackCompanies = [
  { name: "Microsoft", logo: <FaMicrosoft className="w-full h-full" /> },
  { name: "GitHub", logo: <FaGithub className="w-full h-full" /> },
  { name: "Amazon", logo: <FaAmazon className="w-full h-full" /> },
  { name: "Google", logo: <FaGoogle className="w-full h-full" /> },
  { name: "Apple", logo: <FaApple className="w-full h-full" /> },
  { name: "Facebook", logo: <FaFacebookF className="w-full h-full" /> }
];

// Component for a smooth marquee animation effect
const InfiniteMarquee = ({ children, pauseOnHover = true, speed = 30 }: {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  speed?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const duration = speed; // in seconds
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [copied, setCopied] = useState(false);

  // Ensure the animation is properly calibrated based on content width
  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        // Get the actual width of the content
        const newWidth = contentRef.current.scrollWidth;
        
        if (newWidth > 0 && newWidth !== contentWidth) {
          setContentWidth(newWidth);
          setCopied(true);
        }
      }
    };
    
    // Update immediately and then again after a short delay to ensure images are loaded
    updateWidth();
    const timer = setTimeout(updateWidth, 500);
    
    // Also update on window resize for responsiveness
    window.addEventListener('resize', updateWidth);
    
    // Clean up event listener and timer
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [children, contentWidth]);

  return (
    <div 
      ref={containerRef}
      className="marquee-container" 
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ 
        // This ensures seamless looping
        '--content-width': `${contentWidth}px` 
      } as React.CSSProperties}
    >
      <div 
        ref={contentRef}
        className="marquee-content marquee-content-primary"
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
          animationDuration: `${duration}s`,
        }}
      >
        {children}
      </div>
      {copied && (
        <div 
          className="marquee-content marquee-content-secondary"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
            animationDuration: `${duration}s`,
          }}
        >
          {children}
        </div>
      )}
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
    if (clients) {
      return clients.map((client: ClientData, index) => (
        <div 
          key={`${client.id}-${index}`}
          className="flex-none mx-10 grayscale hover:grayscale-0 transition-all duration-300 w-32 h-16 flex items-center justify-center"
        >
          <img 
            src={client.logo} 
            alt={client.name}
            className="max-h-12 max-w-full object-contain"
          />
        </div>
      ));
    } else {
      return fallbackCompanies.map((company, index) => (
        <div 
          key={`${company.name}-${index}`}
          className="flex-none mx-10 grayscale hover:grayscale-0 transition-all duration-300 w-32 h-16 flex items-center justify-center"
        >
          <div className="w-20 h-10 text-andela-dark">
            {company.logo}
          </div>
        </div>
      ));
    }
  };

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left side - Heading and description */}
          <motion.div 
            className="lg:col-span-4"
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
          
          {/* Right side - Logo carousel */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InfiniteMarquee speed={15}>
              {renderLogos()}
            </InfiniteMarquee>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

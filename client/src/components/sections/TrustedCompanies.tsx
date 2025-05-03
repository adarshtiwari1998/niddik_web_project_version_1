import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { FaMicrosoft, FaGithub, FaAmazon, FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import Container from "@/components/ui/container";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ClientData } from "@/lib/types";

// Fallback data with React icons in case the API is not returning data
const fallbackCompanies = [
  { name: "Microsoft", logo: <FaMicrosoft className="w-full h-full" /> },
  { name: "GitHub", logo: <FaGithub className="w-full h-full" /> },
  { name: "Amazon", logo: <FaAmazon className="w-full h-full" /> },
  { name: "Google", logo: <FaGoogle className="w-full h-full" /> },
  { name: "Apple", logo: <FaApple className="w-full h-full" /> },
  { name: "Facebook", logo: <FaFacebookF className="w-full h-full" /> }
];

const TrustedCompanies = () => {
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true
  });

  // Fetch clients from API
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Determine which data to use (API data or fallback)
  const clients = clientsData?.data && clientsData.data.length > 0 
    ? clientsData.data 
    : null;

  // Set up autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = () => {
      if (!emblaApi || !emblaApi.canScrollNext()) return;
      emblaApi.scrollNext();
    };

    // Start autoplay
    const interval = setInterval(autoplay, 3000);
    setAutoplayInterval(interval);

    // Clear interval on unmount
    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [emblaApi]);

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  };

  // Resume autoplay on mouse leave
  const handleMouseLeave = () => {
    if (!emblaApi) return;
    
    const autoplay = () => {
      if (!emblaApi || !emblaApi.canScrollNext()) return;
      emblaApi.scrollNext();
    };
    
    const interval = setInterval(autoplay, 3000);
    setAutoplayInterval(interval);
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
            <div 
              className="overflow-hidden" 
              ref={emblaRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center">
                {/* If API data exists, use it */}
                {clients ? (
                  // Duplicate logos to create an infinite feel
                  [...clients, ...clients].map((client: ClientData, index) => (
                    <div 
                      key={`${client.id}-${index}`}
                      className="flex-none mx-8 grayscale hover:grayscale-0 transition-all duration-300 w-28 h-12 flex items-center justify-center"
                    >
                      <img 
                        src={client.logo} 
                        alt={client.name}
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                  ))
                ) : (
                  // Use fallback icons
                  [...fallbackCompanies, ...fallbackCompanies].map((company, index) => (
                    <div 
                      key={`${company.name}-${index}`}
                      className="flex-none mx-8 grayscale hover:grayscale-0 transition-all duration-300 w-28 h-12 flex items-center justify-center"
                    >
                      <div className="w-16 h-8 text-andela-dark">
                        {company.logo}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, MonitorSmartphone, Globe, Award, Zap } from "lucide-react";
import Container from "@/components/ui/container";
import { useEffect, useRef, useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 }
  })
};

// Key points for the section below the hero
const keyPoints = [
  {
    icon: <MonitorSmartphone className="h-6 w-6" />,
    title: "Vetted Talent",
    description: "Access top 1% of global tech professionals"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Reach",
    description: "Connect with experts from over 100 countries"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast Placement",
    description: "Match with the right talent in as little as 48 hours"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Quality Guarantee",
    description: "Our rigorous vetting ensures the perfect fit"
  }
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Set a timeout to check if video loads within a reasonable time
    const timeoutId = setTimeout(() => {
      if (!isVideoLoaded) {
        setShowFallback(true);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isVideoLoaded]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setShowFallback(true);
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Video Background with Fallback */}
      <div className="absolute inset-0 w-full h-full z-0">
        {!showFallback ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`object-cover w-full h-full ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src="https://cdn.coverr.co/videos/coverr-a-business-team-in-a-meeting-1574/1080p.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
        
        {/* Fallback Image (shown if video fails to load) */}
        {(showFallback || !isVideoLoaded) && (
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
            alt="Diverse tech team collaborating" 
            className="object-cover w-full h-full"
          />
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 flex-grow flex items-center pt-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Find tech experts for your projects in record time
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              We help you source, evaluate, and deliver world-class teams and technologists – fully vetted, compliant, and tailored to your needs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="#" className="bg-andela-green hover:bg-opacity-90 transition-all duration-300 text-white px-8 py-4 rounded-md font-medium text-center transform hover:scale-105">
                Hire Talent
              </Link>
              <Link href="#" className="bg-white text-andela-green hover:bg-gray-100 transition-all duration-300 px-8 py-4 rounded-md font-medium text-center transform hover:scale-105">
                Apply as Talent
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
      
      {/* Key Points Section */}
      <div className="relative z-20 pb-12 mt-auto">
        <Container>
          <div className="bg-white rounded-lg shadow-xl py-8 px-6 md:px-10 -mb-20 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                >
                  <div className="bg-andela-green/10 p-3 rounded-full flex-shrink-0">
                    <div className="text-andela-green">
                      {point.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{point.title}</h3>
                    <p className="text-andela-gray text-sm">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
      
      {/* Ad Overlay Box */}
      <motion.div 
        className="absolute top-32 right-8 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-30 max-w-xs hidden md:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-andela-green h-12 w-12 rounded-full flex items-center justify-center text-white">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-andela-dark">96% Success Rate</p>
            <p className="text-sm text-andela-gray">Join companies achieving their tech goals</p>
          </div>
        </div>
        <Link href="#" className="text-andela-green text-sm font-medium mt-2 block hover:underline">
          Learn how →
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;

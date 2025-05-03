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
            className={`hero-video object-cover w-full h-full ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src="https://res.cloudinary.com/dhanz6zty/video/upload/v1746298068/Project_03-26_4K_HIGH_FR60_26mb_fxvo0l.mp4" type="video/mp4" />
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
        
        {/* Gradient Overlay - more sophisticated than a simple dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 flex-grow flex items-center pt-24">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left-aligned text container */}
            <div className="max-w-2xl text-left md:mr-auto">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold leading-tight text-white mb-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                Unlock Global Talent to Accelerate Your Vision
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-200 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="text-white font-semibold">Connecting People, Changing Lives</span> - We empower businesses to scale with precision through our global network of exceptional talent.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
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
              
              {/* Social proof stats with horizontal dividers - only visible on desktop */}
              <motion.div 
                className="hidden lg:flex items-center gap-8 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">96%</span>
                  <div className="w-12 h-0.5 bg-white/40 my-2"></div>
                  <span className="text-gray-300 text-sm">Success Rate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">100+</span>
                  <div className="w-12 h-0.5 bg-white/40 my-2"></div>
                  <span className="text-gray-300 text-sm">Countries</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">48h</span>
                  <div className="w-12 h-0.5 bg-white/40 my-2"></div>
                  <span className="text-gray-300 text-sm">Average Matching</span>
                </div>
              </motion.div>
            </div>
            
            {/* Right side empty space (for video focus) */}
            <div className="hidden md:block md:w-1/3"></div>
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
      
      {/* Modern floating highlight badge */}
      <motion.div 
        className="absolute top-32 right-8 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg z-30 max-w-xs hidden md:block border border-white/20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-andela-green h-12 w-12 rounded-full flex items-center justify-center text-white">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-white">Trusted by Industry Leaders</p>
            <p className="text-sm text-gray-200">Global leaders choose NIDDIK expertise</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

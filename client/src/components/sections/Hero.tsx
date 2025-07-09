import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, MonitorSmartphone, Globe, Award, Zap, ArrowRight } from "lucide-react";
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

interface Job {
  id: number;
  title: string;
}

// Enhanced Job Marquee Component
const SimpleJobMarquee = ({ jobs }: { jobs: Job[] }) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Add CSS animation for marquee
    const style = document.createElement('style');
    style.textContent = `
      @keyframes smoothMarquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-container {
        mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
        -webkit-mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
      }
      .marquee-content {
        display: flex;
        animation: smoothMarquee 60s linear infinite;
        width: max-content;
      }
      .marquee-content.paused {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!jobs.length) return null;

  // Create enough duplicates for seamless scrolling
  const duplicatedJobs = [...jobs, ...jobs, ...jobs];

  return (
    <div className="py-6 bg-gradient-to-r from-andela-green/5 via-white/50 to-andela-green/5  border-andela-green/10">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-andela-green/20">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-andela-green tracking-wide">🔥 LIVE OPPORTUNITIES</span>
        </div>
      </div>
      
      {/* Marquee */}
      <div 
        className="marquee-container overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`marquee-content ${isPaused ? 'paused' : ''}`}>
          {duplicatedJobs.map((job, index) => (
            <Link 
              key={`${job.id}-${index}`} 
              href={`/jobs/${job.id}`}
              className="flex-shrink-0 inline-flex items-center px-6 py-3 mx-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap border border-gray-200 hover:border-andela-green/40 group"
            >
              <div className="w-2 h-2 bg-andela-green rounded-full mr-3 group-hover:animate-pulse"></div>
              <span className="text-gray-800 group-hover:text-andela-green font-medium text-sm transition-colors duration-300">
                {job.title}
              </span>
              <ArrowRight className="h-4 w-4 ml-3 text-gray-400 group-hover:text-andela-green transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="text-center mt-4">
        <Link 
          href="/careers" 
          className="inline-flex items-center gap-2 text-sm text-white hover:text-andela-green/80 font-medium transition-colors duration-300"
        >
          <span>View All {jobs.length} Open Positions</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
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
    title: "Core Markets Focus",
    description: "Specialized talent from 5 key technology markets"
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
  const [showFallback, setShowFallback] = useState(true); // Start with fallback visible
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Set a timeout to check if video loads within a reasonable time
    const timeoutId = setTimeout(() => {
      if (!isVideoLoaded) {
        setShowFallback(true);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isVideoLoaded]);

  useEffect(() => {
    // Fetch jobs for marquee
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/job-listings?status=active&page=1&limit=1000');
        if (response.ok) {
          const data = await response.json();
          // Only keep id and title for simplified marquee
          const simplifiedJobs = data.data.map((job: any) => ({
            id: job.id,
            title: job.title
          }));
          setJobs(simplifiedJobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        // Fallback demo data
        setJobs([
          { id: 1, title: "Senior Full Stack Developer" },
          { id: 2, title: "DevOps Engineer" },
          { id: 3, title: "Frontend React Developer" },
          { id: 4, title: "Backend Node.js Developer" },
          { id: 5, title: "Mobile App Developer" }
        ]);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Ensure video loops seamlessly
    const video = videoRef.current;
    if (video) {
      const handleVideoEnd = () => {
        // Immediately restart without any delay
        video.currentTime = 0;
        video.play().catch(console.error);
      };

      const handleCanPlay = () => {
        // Video is ready to play, hide fallback
        setIsVideoLoaded(true);
        setShowFallback(false);
        video.play().catch(console.error);
      };

      const handleTimeUpdate = () => {
        // For extra seamless looping, restart slightly before the end
        if (video.duration && video.currentTime >= video.duration - 0.1) {
          video.currentTime = 0;
        }
      };

      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    setShowFallback(false);
  };

  const handleVideoError = () => {
    setShowFallback(true);
  };

  return (
    <section className="relative overflow-hidden md:h-[120vh] sm:h-[120vh] flex flex-col">
      {/* Video Background with Fallback */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Fallback Image - always present, hidden when video loads */}
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
          alt="Diverse tech team collaborating" 
          className={`object-cover w-full h-full transition-opacity duration-300 ${showFallback ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Video element - always present */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`hero-video object-cover w-full h-full absolute inset-0 transition-opacity duration-300 ${isVideoLoaded && !showFallback ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={{ minHeight: '100vh', objectPosition: 'center center' }}
        >
          <source src="https://res.cloudinary.com/dw4glwrrn/video/upload/v1750407588/Project_05-09_4K_MEDIUM_FR30_1_1_upjz6y.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient Overlay - more sophisticated than a simple dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 flex-grow flex items-center pt-32 pb-8">
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
              className="flex flex-col sm:flex-row gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
          >
              <Link
                  href="/request-demo"
                  className="bg-andela-green hover:bg-opacity-90 transition-all duration-300 text-white px-8 py-4 rounded-md font-medium text-center transform hover:scale-105"
              >
                  Hire Talent
              </Link>
              <Link
                  href="/careers"
                  className="bg-white text-andela-green hover:bg-gray-100 transition-all duration-300 px-8 py-4 rounded-md font-medium text-center transform hover:scale-105"
              >
                  Apply as Talent
              </Link>
              <Link
                  href="/adaptive-hiring"
                  className="text-white hover:underline transition-all duration-300 font-medium text-center"
              >
                  Adaptive Hiring
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
                <div className="flex flex-col relative">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white mr-2">5</span>
                    <div className="flex -space-x-1 scale-75 origin-left">
                      <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold border border-white">US</div>
                      <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold border border-white">IN</div>
                      <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold border border-white">UK</div>
                    </div>
                  </div>
                  <div className="w-12 h-0.5 bg-white/40 my-2"></div>
                  <span className="text-gray-300 text-sm">Core Countries</span>
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
      
      {/* Live Jobs Marquee */}
      {jobs.length > 0 && (
        <div className="relative z-20 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <SimpleJobMarquee jobs={jobs} />
          </motion.div>
        </div>
      )}

      {/* Key Points Section - Now positioned below marquee */}
                      <div className="relative z-20 pb-12 mt-auto">
                        <Container>
                          <div className="bg-white rounded-lg shadow-xl py-6 md:py-8 px-4 md:px-10 -mb-20 relative z-30">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10">
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 group hover:bg-andela-green/5 p-2 md:p-4 rounded-xl transition-all duration-300 text-center md:text-left"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                >
                  <div className="bg-andela-green/10 group-hover:bg-andela-green/20 p-2 md:p-3 rounded-full flex-shrink-0 transition-all duration-300">
                    <div className="text-andela-green group-hover:scale-110 transition-transform duration-300 w-4 h-4 md:w-6 md:h-6">
                      {point.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs md:text-lg mb-1 md:mb-2 text-gray-800 group-hover:text-andela-green transition-colors duration-300 leading-tight">{point.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed hidden md:block">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
      
      {/* Modern floating highlight badge - now positioned relatively at bottom */}
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

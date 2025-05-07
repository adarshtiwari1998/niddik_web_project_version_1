import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Target, Database, ChevronDown, Clock, BarChart3 } from "lucide-react";

// How Adaptive Hiring Works Component
const AdaptiveHiringWorkflow = () => {
  const sections = [
    {
      id: "projects",
      label: "Projects",
      icon: <Target className="w-4 h-4 text-blue-600" />,
      title: "Define Technical Requirements",
      description: "Clearly outline the technical needs for your project, team augmentation, or specialized roles. We'll match you with professionals who have the exact skills you need.",
    },
    {
      id: "skills",
      label: "Skills",
      icon: <BarChart3 className="w-4 h-4 text-blue-600" />,
      title: "Match with Pre-Vetted Talent",
      description: "Our AI matching system identifies professionals from our network who best fit your requirements, considering technical skills, industry experience, and team compatibility.",
    },
    {
      id: "talent",
      label: "Talent",
      icon: <Database className="w-4 h-4 text-blue-600" />,
      title: "Collaborate and Evaluate",
      description: "Meet selected candidates through streamlined interviews focused on your specific needs. Our platform facilitates technical evaluations tailored to your project requirements.",
    },
    {
      id: "adapt",
      label: "Adapt",
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      title: "Scale Your Team Dynamically",
      description: "Quickly integrate new team members and scale your technical capabilities up or down as project needs evolve, with ongoing support from our team.",
    },
    {
      id: "change",
      label: "Change",
      icon: <ChevronDown className="w-4 h-4 text-blue-600" />,
      title: "Continuously Improve",
      description: "Benefit from data-driven insights and regular check-ins to optimize team performance and adapt to changing technical requirements.",
    }
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  
  // Track when component enters and exits viewport to control fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      const sectionElement = componentRef.current;
      const bottomSentinel = bottomSentinelRef.current;
      const firstContentBlock = sectionRefs.current[0];
      
      if (!sectionElement || !bottomSentinel || !firstContentBlock) return;
      
      const scrollPosition = window.scrollY;
      
      // Get the position of the first content block (this is when we want the image to become fixed)
      const firstBlockTop = firstContentBlock.getBoundingClientRect().top + window.scrollY - 100;
      
      // Get the position of the bottom sentinel
      const sectionBottom = bottomSentinel.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      
      // The image should be fixed when:
      // 1. We've scrolled past the first content block
      // 2. We haven't reached the bottom of the section yet
      const pastFirstBlock = scrollPosition >= firstBlockTop;
      const beforeBottomSentinel = scrollPosition <= (sectionBottom + 300); // Add 300px buffer
      
      setIsInViewport(pastFirstBlock && beforeBottomSentinel);
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize on component mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // For tracking which content section is active
  useEffect(() => {
    // Using a simple scroll-based approach instead of IntersectionObserver
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Center point of the viewport
      
      // Find which section is at the center of the viewport
      let closestSection = -1;
      let closestDistance = Infinity;
      
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = rect.bottom + window.scrollY;
        const sectionCenter = (absoluteTop + absoluteBottom) / 2;
        
        const distance = Math.abs(scrollPosition - sectionCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = index;
        }
      });
      
      if (closestSection !== -1 && closestSection !== activeSection) {
        setActiveSection(closestSection);
      }
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize on mount
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]); // Depend on activeSection to avoid unnecessary re-calculations

  // Image content based on active section
  const getImageContent = () => {
    switch(activeSection) {
      case 0: // PROJECTS
        return (
          <motion.div 
            key="project-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <div className="flex justify-center mb-6">
              <h4 className="font-semibold text-xl text-gray-700">Development team</h4>
            </div>
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-400"></div>
                <div className="w-12 h-12 rounded-full bg-green-400"></div>
                <div className="w-12 h-12 rounded-full bg-indigo-400"></div>
                <div className="w-12 h-12 rounded-full bg-yellow-400"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Project Lead</div>
                    <div className="text-lg font-medium">Alex M.</div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 1: // SKILLS
        return (
          <motion.div 
            key="skills-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <div className="mb-6">
              <h4 className="font-semibold text-xl text-blue-600">SKILLS ASSESSMENT</h4>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 h-8 bg-blue-200/50 rounded-full relative">
                  <div className="absolute inset-y-0 left-0 bg-blue-200 w-[80%] rounded-full"></div>
                </div>
                <span className="text-base font-medium text-gray-700 w-20 text-right">React</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 h-8 bg-green-200/50 rounded-full relative">
                  <div className="absolute inset-y-0 left-0 bg-green-200 w-[65%] rounded-full"></div>
                </div>
                <span className="text-base font-medium text-gray-700 w-20 text-right">Node.js</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 h-8 bg-yellow-200/50 rounded-full relative">
                  <div className="absolute inset-y-0 left-0 bg-yellow-200 w-[70%] rounded-full"></div>
                </div>
                <span className="text-base font-medium text-gray-700 w-20 text-right">UX/UI</span>
              </div>
            </div>
          </motion.div>
        );
      case 2: // FIND TALENT
        return (
          <motion.div
            key="talent-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-xl text-blue-600">TALENT MATCHING</h4>
              <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full">4 matches found</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-md shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-base">
                  JS
                </div>
                <div>
                  <div className="text-base font-semibold">Jason S.</div>
                  <div className="text-sm text-gray-500">React Expert</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-md shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-base">
                  AT
                </div>
                <div>
                  <div className="text-base font-semibold">Amy T.</div>
                  <div className="text-sm text-gray-500">Full Stack</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-md shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-base">
                  RK
                </div>
                <div>
                  <div className="text-base font-semibold">Raj K.</div>
                  <div className="text-sm text-gray-500">Node.js Dev</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-md shadow-md flex items-center gap-4">
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-base">
                  ML
                </div>
                <div>
                  <div className="text-base font-semibold">Maria L.</div>
                  <div className="text-sm text-gray-500">UI Designer</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3: // ADAPT QUICKLY
        return (
          <motion.div 
            key="adapt-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <h4 className="font-semibold text-xl text-blue-600 mb-8">TEAM SCALING</h4>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Team Size</span>
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-3">+2</span>
                  <div className="flex -space-x-3">
                    <div className="w-12 h-12 bg-blue-400 rounded-full border-2 border-white z-30"></div>
                    <div className="w-12 h-12 bg-green-400 rounded-full border-2 border-white z-20"></div>
                    <div className="w-12 h-12 bg-yellow-400 rounded-full border-2 border-white z-10"></div>
                  </div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full w-full">
                <div className="h-3 bg-blue-500 rounded-full w-2/3"></div>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Current: 3</span>
                <span>Target: 5</span>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <span className="text-lg font-medium">Duration</span>
                <span className="text-lg font-semibold">3 months</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full w-full">
                <div className="h-3 bg-green-500 rounded-full w-1/4"></div>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Flexible</span>
                <span>Extendable</span>
              </div>
            </div>
          </motion.div>
        );
      case 4: // CHANGE QUICKLY
        return (
          <motion.div 
            key="change-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <h4 className="font-semibold text-xl text-blue-600 mb-8">BUSINESS AGILITY</h4>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-lg font-medium">Current Sprint</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-full">Active</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-full mb-3">
                  <div className="h-3 bg-green-500 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between text-base text-gray-500">
                  <span>Week 2 of 3</span>
                  <span>75% Complete</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-lg font-medium">Team Velocity</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 mt-4">
                  <div className="w-32 h-32 rounded-full border-8 border-blue-200 flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-500">92%</div>
                  </div>
                  <div className="text-base">
                    <div className="font-medium text-lg">Efficiency</div>
                    <div className="text-gray-500 text-base mt-1">Above target</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div 
            key="default-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-12 flex items-center justify-center w-full"
          >
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-5">
                <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
              </div>
              <h4 className="font-semibold text-2xl text-gray-700 mb-2">Adaptive Hiring</h4>
              <p className="text-lg text-gray-500 mt-3">Scroll to explore our workflow</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div id="how-adaptive-hiring-works" className="relative pb-16" ref={componentRef}>
      {/* Top sentinel element to detect when section enters viewport */}
      <div ref={topSentinelRef} className="absolute top-0 h-1 w-full" />
      
      <div className="relative">
        {/* Background container with two-column layout */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block"></div> {/* Left column spacer */}
          <div className="hidden lg:block bg-blue-50/30"></div> {/* Right column background */}
        </div>
        
        {/* Content container */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column - Content */}
          <div className="py-8 px-6 lg:px-8"> {/* Added padding for both sides */}
            {sections.map((section, index) => (
              <div 
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                className="scroll-mt-40 mb-96" // Large margin bottom for better section detection
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-4">
                  <div className="flex items-center bg-blue-100 p-1.5 rounded-full">
                    {section.icon}
                  </div>
                  <span className="uppercase">{section.label}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-5 text-gray-800">
                  {section.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Right Column - Image with fixed positioning when section is in viewport */}
          <div className="hidden lg:block">
            <div 
              className={`${
                isInViewport 
                  ? 'fixed top-1/2 transform -translate-y-1/2 w-[calc(50%-2rem)] pr-8 transition-all duration-300 ease-out' // Fixed position with smooth transition
                  : 'relative w-full transition-all duration-300 ease-out'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-xl"> {/* Increased max-width for larger images */}
                  <AnimatePresence mode="wait">
                    {getImageContent()}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom sentinel element to detect when section exits viewport */}
      <div ref={bottomSentinelRef} className="absolute bottom-0 h-1 w-full" />
    </div>
  );
};

export default AdaptiveHiringWorkflow;
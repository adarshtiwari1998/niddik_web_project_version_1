import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Briefcase, 
  Users, 
  Target, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  Database,
  Cloud,
  Code,
  ChevronDown,
  ChevronUp,
  Clock,
  XCircle,
  PlusCircle
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BusinessChallengesSection from "@/components/sections/BusinessChallengesSection";
import BasicAccordion from "@/components/sections/BasicAccordion";
// UseCasesSection now implemented directly in this file

// Data for sections in the scrolling component
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

// How Adaptive Hiring Works Component
const AdaptiveHiringWorkflow = () => {
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

const AdaptiveHiring = () => {
  // State for announcement bar
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const features = [
    {
      icon: <Target className="h-12 w-12 text-blue-500" />,
      title: "Precision Matching",
      description: "Our AI-powered platform analyzes over 100 data points to find the perfect match between company needs and candidate capabilities."
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-green-500" />,
      title: "Dynamic Skill Assessment",
      description: "Evaluate candidates through customized technical and soft skills assessments designed for your specific requirements."
    },
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Team Compatibility Analysis",
      description: "Beyond skills, we assess how candidates will integrate with your existing team culture and dynamics."
    },
    {
      icon: <Briefcase className="h-12 w-12 text-green-500" />,
      title: "Flexible Engagement Models",
      description: "Choose from project-based, full-time, or hybrid work arrangements that adapt to your business needs."
    }
  ];

  const benefits = [
    {
      title: "Reduced Time-to-Hire",
      description: "Our adaptive process shortens hiring cycles by 60% compared to traditional methods.",
      stat: "60%",
      icon: <Award className="h-8 w-8 text-white" />
    },
    {
      title: "Improved Retention",
      description: "92% of professionals matched through our platform remain with companies for at least one year.",
      stat: "92%",
      icon: <Users className="h-8 w-8 text-white" />
    },
    {
      title: "Cost Efficiency",
      description: "Reduce hiring costs by up to 45% through our streamlined matching and onboarding process.",
      stat: "45%",
      icon: <Target className="h-8 w-8 text-white" />
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden pt-0">
      {/* Fixed header components */}
      <AnnouncementBar 
        text="Download our new whitepaper on scaling tech teams effectively."
        linkText="Get it now"
        linkUrl="/whitepaper"
        bgColor="bg-green-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Add minimal padding to account for fixed elements */}
      <div className={`${isAnnouncementVisible ? 'pt-[80px]' : 'pt-[40px]'} transition-all duration-300`}>
        <main>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-green-400/5 blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-32 right-1/4 w-8 h-8 border-2 border-blue-400/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-green-400/30 rounded-full"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 bg-blue-400/30 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-green-400/20 rounded-lg rotate-45"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="inline-block mb-3">
                <div className="px-4 py-1 bg-blue-500/10 rounded-full text-blue-500 text-sm font-medium tracking-wider uppercase">
                  Next-Generation Recruitment
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Adaptive Hiring
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700 font-light mb-16 max-w-3xl mx-auto"
            >
              A dynamic, data-driven approach that evolves with your needs to find the perfect technical talent match for your team.
            </motion.p>
            
            {/* Call to action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-md hover:shadow-lg transition-shadow"
              >
                Start Adaptive Hiring
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Learn The Process
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* How Adaptive Hiring Works Section */}
      <section className="py-20 bg-white relative">
        <Container>
          <div className="mb-20 space-y-6 text-center">
            <h2 className="text-4xl font-bold text-center text-andela-dark">How Adaptive Hiring works: Bringing agile principles to tech hiring</h2>
            <p className="text-xl text-center text-andela-gray max-w-3xl mx-auto">
              Our innovative approach streamlines the hiring process for technical roles, making it more efficient, effective, and aligned with modern business needs.
            </p>
          </div>
          <div className="relative py-10">
            <AdaptiveHiringWorkflow />
          </div>
        </Container>
      </section>
      
      {/* Business Challenges Section - Shows common challenges that Niddik solves using AI */}
      <BusinessChallengesSection />
      
      {/* Use Cases Section - Shows use cases for adaptive hiring with SVG illustration */}
      <section className="py-20 bg-[#f0f7fb] relative overflow-hidden">
        {/* Background decorative pattern - Using CSS background pattern instead of SVG overlay */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2336b37e' stroke-width='0.5'%3E%3Ccircle cx='90' cy='90' r='60' /%3E%3Ccircle cx='180' cy='180' r='60' /%3E%3Ccircle cx='0' cy='180' r='60' /%3E%3Ccircle cx='180' cy='0' r='60' /%3E%3Ccircle cx='0' cy='0' r='60' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            pointerEvents: 'none' // Explicitly disable pointer events
          }}
        ></div>

        <Container className="px-6 md:px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Common use cases for Adaptive Hiring
          </h2>

          {/* Accordion with integrated graphics for each tab */}
          <div className="w-full max-w-4xl mx-auto">
            <BasicAccordion />
          </div>
        </Container>
      </section>
      
      {/* Comparison Section - Now after the Use Cases Section */}
      <section className="py-20 bg-gray-50 relative">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">
              Why you need a new kind of partner to deliver Adaptive Hiring
            </h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Traditional hiring approaches can't keep up with today's rapidly evolving tech landscape.
            </p>
          </motion.div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left column - Categories */}
              <div className="md:col-span-3 bg-gray-50 py-4">
                {/* Category Headers */}
                <div className="h-20 flex items-center px-8 font-medium text-lg border-b border-gray-100">
                  Location
                </div>
                <div className="h-20 flex items-center px-8 font-medium text-lg border-b border-gray-100">
                  Hiring Time
                </div>
                <div className="h-20 flex items-center px-8 font-medium text-lg border-b border-gray-100">
                  Deployment
                </div>
                <div className="h-20 flex items-center px-8 font-medium text-lg border-b border-gray-100">
                  Scalability
                </div>
                <div className="h-20 flex items-center px-8 font-medium text-lg">
                  Turnover
                </div>
              </div>
              
              {/* Middle column - Traditional Hiring */}
              <div className="md:col-span-4 border-r border-gray-200">
                <div className="h-16 bg-blue-50 flex items-center justify-center font-semibold text-lg">
                  Traditional Hiring
                </div>
                
                {/* Traditional Hiring Sections */}
                <div className="border-b border-gray-100 p-4 h-20">
                  <div className="flex items-center text-red-500 mb-1">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Mostly Local</span>
                  </div>
                  <p className="text-sm text-gray-600">Limits hiring pool and diversity of ideas</p>
                </div>
                
                <div className="border-b border-gray-100 p-4 h-20">
                  <div className="flex items-center text-red-500 mb-1">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">12+ Weeks</span>
                  </div>
                  <p className="text-sm text-gray-600">Lack of global network and matching tech</p>
                </div>
                
                <div className="border-b border-gray-100 p-4 h-20">
                  <div className="flex items-center text-red-500 mb-1">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Lagging ROI</span>
                  </div>
                  <p className="text-sm text-gray-600">Slow onboarding periods for new talent</p>
                </div>
                
                <div className="border-b border-gray-100 p-4 h-20">
                  <div className="flex items-center text-red-500 mb-1">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Limited Scalability</span>
                  </div>
                  <p className="text-sm text-gray-600">MSA limits ability to scale up and down</p>
                </div>
                
                <div className="p-4 h-20">
                  <div className="flex items-center text-red-500 mb-1">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">High Turnover</span>
                  </div>
                  <p className="text-sm text-gray-600">Highly-skilled talent turnover up by 50%</p>
                </div>
              </div>
              
              {/* Right column - Adaptive Hiring */}
              <div className="md:col-span-5 bg-green-900 text-white">
                <div className="h-16 flex items-center justify-center font-semibold text-lg">
                  Adaptive Hiring
                </div>
                
                {/* Adaptive Hiring Sections */}
                <div className="border-b border-green-800 p-4 h-20">
                  <div className="flex items-center text-green-300 mb-1">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Borderless</span>
                  </div>
                  <p className="text-sm text-green-100">Larger hiring pool and more diversity</p>
                </div>
                
                <div className="border-b border-green-800 p-4 h-20">
                  <div className="flex items-center text-green-300 mb-1">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">48 Hours</span>
                  </div>
                  <p className="text-sm text-green-100">Global network & tech powers fast hiring</p>
                </div>
                
                <div className="border-b border-green-800 p-4 h-20">
                  <div className="flex items-center text-green-300 mb-1">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Quick ROI</span>
                  </div>
                  <p className="text-sm text-green-100">Talent onboards in days, not months</p>
                </div>
                
                <div className="border-b border-green-800 p-4 h-20">
                  <div className="flex items-center text-green-300 mb-1">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Maximum Scalability</span>
                  </div>
                  <p className="text-sm text-green-100">Scale up & down with business demands</p>
                </div>
                
                <div className="p-4 h-20">
                  <div className="flex items-center text-green-300 mb-1">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm uppercase">Low Turnover</span>
                  </div>
                  <p className="text-sm text-green-100">Talent retention is 25% higher</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Niddik Makes Adaptive Hiring Easier Section */}
      <section className="py-20 bg-white relative">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">
              Niddik makes Adaptive Hiring easier
            </h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              We provide the tools, technology, and talent network to make adaptive hiring work for your organization.
            </p>
          </motion.div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-[#2C5F2C] text-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Measurable Business Impact
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-green-100">
              Adaptive Hiring delivers real business value through improved efficiency and better talent matches.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="rounded-lg p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="rounded-full w-16 h-16 bg-green-800 flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-lg font-bold text-green-300 mb-4">{benefit.stat}</p>
                <p className="text-green-100">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-andela-dark"
            >
              Ready to transform your hiring process?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl mb-10 text-andela-gray"
            >
              Get started with Adaptive Hiring today and find the perfect technical talent for your team.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="px-8 py-4 bg-[#2C5F2C] text-white font-semibold rounded-lg hover:shadow-lg transition-shadow inline-flex items-center"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdaptiveHiring;
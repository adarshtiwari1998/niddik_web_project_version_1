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
  Clock,
  XCircle,
  PlusCircle
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import ChallengesSection from "@/components/sections/ChallengesSection";
import BusinessChallengesSection from "@/components/sections/BusinessChallengesSection";

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
                  <div className="text-base font-semibold">Min L.</div>
                  <div className="text-sm text-gray-500">UI Designer</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3: // ADAPT
        return (
          <motion.div
            key="adapt-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <div className="mb-6">
              <h4 className="font-semibold text-xl text-blue-600">TEAM SCALING</h4>
            </div>
            
            <div className="space-y-8">
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">3x</div>
                  <div className="text-sm text-gray-600">Faster Scaling</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">60%</div>
                  <div className="text-sm text-gray-600">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      Q1
                    </div>
                    <span className="font-medium">Initial Team</span>
                  </div>
                  <span className="text-lg font-semibold">4 devs</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      Q2
                    </div>
                    <span className="font-medium">Scale Up</span>
                  </div>
                  <span className="text-lg font-semibold">8 devs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">
                      Q3
                    </div>
                    <span className="font-medium">Project Phase</span>
                  </div>
                  <span className="text-lg font-semibold">5 devs</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4: // CHANGE
        return (
          <motion.div
            key="change-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full"
          >
            <div className="mb-6">
              <h4 className="font-semibold text-xl text-blue-600">CONTINUOUS IMPROVEMENT</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-5 rounded-lg shadow-md flex gap-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Weekly Progress Reviews</div>
                  <div className="text-sm text-gray-600">Regular check-ins to assess project progress and address challenges</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md flex gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Performance Metrics</div>
                  <div className="text-sm text-gray-600">Data-driven insights to optimize team efficiency and output quality</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md flex gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">Team Dynamics Optimization</div>
                  <div className="text-sm text-gray-600">Continuous assessment of team collaboration and skill complementarity</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div ref={componentRef} className="relative min-h-[700px]">
      <div ref={topSentinelRef} className="absolute top-0 h-1 w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left side: Navigation */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className={`${isInViewport ? 'fixed top-32' : ''} w-full max-w-[300px]`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">How It Works</h3>
              </div>
              <div className="p-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeSection === index 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveSection(index);
                      const sectionEl = sectionRefs.current[index];
                      if (sectionEl) {
                        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    <span className="flex-shrink-0">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side: Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-16">
          {/* Content blocks */}
          {sections.map((section, index) => (
            <div
              key={section.id}
              ref={el => sectionRefs.current[index] = el}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">{section.title}</h3>
                <p className="mt-2 text-gray-600">{section.description}</p>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeSection === index && getImageContent()}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div ref={bottomSentinelRef} className="absolute bottom-0 h-1 w-full" />
    </div>
  );
};

const AdaptiveHiringFixed = () => {
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
          
          {/* Comparison Section - Now right after the Challenges Section */}
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
                  Ready to transform your technical hiring?
                </h2>
                <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                  Get started with Niddik's Adaptive Hiring approach today.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              >
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white font-medium rounded-md inline-flex items-center justify-center"
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdaptiveHiringFixed;
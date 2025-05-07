import { motion } from "framer-motion";
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
  ArrowRight as ArrowRightIcon,
  XCircle,
  PlusCircle
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";

// Use Cases with Sticky Image Component
const UsesCasesWithStickyImage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const useCasesRef = useRef<HTMLDivElement>(null);
  
  const useCases = [
    {
      id: "application-development",
      title: "Application Development",
      items: [
        "Scale development with qualified talent, on demand",
        "Reduce complexity and enhance user experience",
        "Get your critical projects done faster"
      ],
      icon: <Code className="w-5 h-5" />
    },
    {
      id: "data-science",
      title: "Data Science and Artificial Intelligence",
      items: [
        "Find specialized data scientists for your unique needs",
        "Implement ML/AI solutions with experienced professionals",
        "Transform raw data into actionable business insights"
      ],
      icon: <Database className="w-5 h-5" />
    },
    {
      id: "data-engineering",
      title: "Data Engineering and Analytics",
      items: [
        "Build scalable data pipelines with skilled engineers",
        "Integrate disparate data sources efficiently",
        "Develop dashboards and reporting solutions"
      ],
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: "cloud-devops",
      title: "Cloud and DevOps",
      items: [
        "Accelerate cloud migration with specialized talent",
        "Implement CI/CD pipelines and automation",
        "Optimize infrastructure for performance and cost"
      ],
      icon: <Cloud className="w-5 h-5" />
    }
  ];

  // For the Use Cases section, we'll ensure the image is never fixed
  useEffect(() => {
    // Always set isInViewport to false to prevent fixed positioning
    setIsInViewport(false);
  }, []);

  useEffect(() => {
    // Programmatically click on first use case to make sure it's open
    setTimeout(() => {
      setActiveIndex(0);
    }, 100);

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -40% 0px',
      threshold: 0.1
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = tabsRef.current.findIndex(tab => tab === entry.target);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    tabsRef.current.forEach(tab => {
      if (tab) observer.observe(tab);
    });

    return () => {
      tabsRef.current.forEach(tab => {
        if (tab) observer.unobserve(tab);
      });
    };
  }, []);

  // Images to display for each use case (static for this example)
  const renderImage = () => {
    switch(activeIndex) {
      case 0:
        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full" style={{ backgroundColor: '#f0f7ff' }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-lg bg-white shadow-md p-3 flex items-center justify-center">
                      <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white">
                        <Code className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="absolute w-20 h-0.5 bg-gray-200 -right-20 top-1/2"></div>
                    <div className="absolute w-16 h-16 rounded-lg bg-white shadow-md p-3 flex items-center justify-center -right-32 -top-6">
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white text-xs">
                        JS
                      </div>
                    </div>
                    <div className="absolute w-16 h-16 rounded-lg bg-white shadow-md p-3 flex items-center justify-center -right-36 top-8">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                        UI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full" style={{ backgroundColor: '#f0fff4' }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="text-blue-500 w-6 h-6" />
                      <h4 className="font-bold">Data Analysis</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-blue-100 rounded-full w-full relative">
                        <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full w-3/4"></div>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full w-full relative">
                        <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full w-1/2"></div>
                      </div>
                      <div className="h-2 bg-purple-100 rounded-full w-full relative">
                        <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-full w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full" style={{ backgroundColor: '#f5f0ff' }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white rounded-lg shadow-md p-4 w-64">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Analytics Pipeline</h4>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-12 h-6 bg-blue-500 rounded-l flex items-center justify-center text-white text-xs">
                        ETL
                      </div>
                      <div className="w-12 h-6 bg-green-500 flex items-center justify-center text-white text-xs">
                        DW
                      </div>
                      <div className="w-12 h-6 bg-purple-500 rounded-r flex items-center justify-center text-white text-xs">
                        BI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full" style={{ backgroundColor: '#fff0f0' }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white rounded-lg shadow-md p-4 w-64">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Cloud className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Cloud Services</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-blue-100 rounded flex items-center justify-center">
                        <div className="text-xs font-medium text-blue-800">API</div>
                      </div>
                      <div className="h-8 bg-green-100 rounded flex items-center justify-center">
                        <div className="text-xs font-medium text-green-800">DB</div>
                      </div>
                      <div className="h-8 bg-purple-100 rounded flex items-center justify-center">
                        <div className="text-xs font-medium text-purple-800">Auth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="common-use-cases" ref={useCasesRef} className="relative pb-16 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-andela-dark">Common use cases for Adaptive Hiring</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left side content - 6 columns wide */}
        <div className="lg:col-span-6">
          {useCases.map((useCase, index) => (
            <div 
              key={useCase.id}
              ref={el => tabsRef.current[index] = el}
              className={`mb-10 rounded-lg transition-all duration-300 ${activeIndex === index ? 'bg-white shadow-md' : 'bg-gray-50'}`}
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {useCase.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{useCase.title}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} />
                </div>
                
                {activeIndex === index && (
                  <div className="mt-4 pl-10">
                    <ul className="space-y-4">
                      {useCase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pl-1">
                      <Link href="#" className="text-blue-600 inline-flex items-center group">
                        Learn More 
                        <ArrowRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Right side image container - NEVER fixed for Common Use Cases section */}
        <div className="lg:col-span-6 relative">
          <div className="pt-8 pr-12">
            <div className="aspect-video relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
              {renderImage()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// How Adaptive Hiring Works Component
const AdaptiveHiringWorkflow = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);
  
  const sections = [
    {
      id: "identify-projects",
      icon: <Target className="w-5 h-5" />,
      label: "PROJECTS",
      title: "Identify deprioritized projects due to gaps on your teams",
      description: "Updating systems, modernizing legacy code, and refreshing outdated employee-facing apps can turn into enterprise backlog — and a loss of productivity. Niddik provides talent and teams so your top developers can focus on new business while we take care of backlog behind the scenes."
    },
    {
      id: "determine-skills",
      icon: <Users className="w-5 h-5" />,
      label: "SKILLS",
      title: "Determine what skills you need and for how long",
      description: "When critical and fast-moving technology initiatives require more talent than you have on board, Niddik can help identify the skills gaps and timelines. Then, we'll provide the technologists you need, for however long you need them."
    },
    {
      id: "match-talent",
      icon: <Briefcase className="w-5 h-5" />,
      label: "FIND TALENT",
      title: "Match needs to talent skill sets, costs, and duration",
      description: "Our AI-driven matching system identifies the perfect candidates based on technical skills, experience, domain knowledge, and team compatibility. We provide a curated selection of pre-vetted professionals ready to integrate seamlessly with your existing teams."
    },
    {
      id: "adapt-quickly",
      icon: <ArrowRightIcon className="w-5 h-5" />,
      label: "ADAPT QUICKLY",
      title: "Adjust easily, as your priorities change",
      description: "Rapidly changing business requires an agile approach to staffing. This variable cost model allows you to change as quickly as your priorities do. Niddik talent is available on demand, so you can fill critical skill or capacity gaps quickly while remaining cost-efficient."
    },
    {
      id: "change-quickly",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "CHANGE QUICKLY",
      title: "Scale your business with agile talent solutions",
      description: "As your business evolves, so do your talent needs. Our adaptive hiring model provides the flexibility to scale up or down based on project demands, helping you maintain optimal team efficiency while controlling costs. Keep your competitive edge with access to the right talent at the right time."
    }
  ];

  // Create refs for detecting when the workflow section is in view
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const sectionHeaderRef = useRef<HTMLHeadingElement>(null); // Reference to the section header
  
  // Track when component enters and exits viewport to control fixed positioning
  useEffect(() => {
    const handleScroll = () => {
      const sectionElement = componentRef.current;
      const bottomSentinel = bottomSentinelRef.current;
      if (!sectionElement || !bottomSentinel) return;
      
      const scrollPosition = window.scrollY;
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY - 100; // Buffer for top
      const sectionBottom = bottomSentinel.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      
      // Keep image fixed from section start until the bottom sentinel
      // Add a limit to avoid having the fixed image all the way to the footer
      const pastSectionTop = scrollPosition >= sectionTop;
      const beforeFooter = scrollPosition <= (sectionBottom + 300); // Add 300px buffer for last section
      
      setIsInViewport(pastSectionTop && beforeFooter);
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
        console.log("Active section changed to:", closestSection);
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
    console.log("Active section:", activeSection); // Debug active section
    
    switch(activeSection) {
      case 0: // PROJECTS
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full">
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
          </div>
        );
      case 1: // SKILLS
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full">
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
          </div>
        );
      case 2: // FIND TALENT
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full">
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
          </div>
        );
      case 3: // ADAPT QUICKLY
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full">
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
          </div>
        );
      case 4: // CHANGE QUICKLY
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-8 w-full">
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
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 rounded-lg overflow-hidden p-12 flex items-center justify-center w-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-5">
                <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
              </div>
              <h4 className="font-semibold text-2xl text-gray-700 mb-2">Adaptive Hiring</h4>
              <p className="text-lg text-gray-500 mt-3">Scroll to explore our workflow</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="how-adaptive-hiring-works" className="relative pb-16" ref={componentRef}>
      {/* Top sentinel element to detect when section enters viewport */}
      <div ref={topSentinelRef} className="absolute top-0 h-1 w-full" />
      
      <h2 ref={sectionHeaderRef} className="text-4xl font-bold mb-6 text-andela-dark">
        How Adaptive Hiring works: Bringing agile principles to tech hiring
      </h2>
      
      <div className="relative">
        {/* Background container with two-column layout */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block"></div> {/* Left column spacer */}
          <div className="hidden lg:block bg-blue-50/30"></div> {/* Right column background */}
        </div>
        
        {/* Content container */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column - Content */}
          <div className="py-8 pr-8"> {/* Don't use space-y, we'll add individual margins */}
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
                  ? 'fixed top-1/2 transform -translate-y-1/2 w-[calc(50%-2rem)] pr-8' // Fixed at 50% vertical with less padding
                  : 'relative w-full'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                  {getImageContent()}
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
      description: "Save up to 40% on recruitment costs while improving the quality of your technical hires.",
      stat: "40%",
      icon: <Briefcase className="h-8 w-8 text-white" />
    }
  ];
  
  const process = [
    {
      number: "01",
      title: "Needs Analysis",
      description: "We work with you to develop a comprehensive understanding of your technical requirements, team dynamics, and company culture."
    },
    {
      number: "02",
      title: "Talent Sourcing",
      description: "Our AI system identifies candidates from our pool of pre-vetted professionals who match your specific needs."
    },
    {
      number: "03",
      title: "Custom Assessment",
      description: "Candidates complete tailored technical challenges and interviews designed specifically for your position."
    },
    {
      number: "04",
      title: "Compatibility Matching",
      description: "We evaluate technical abilities alongside cultural fit to ensure the perfect match for your team."
    },
    {
      number: "05",
      title: "Seamless Integration",
      description: "Our onboarding specialists help new team members integrate smoothly into your company processes."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="pt-10">
      <AnnouncementBar 
        text="Try our new adaptive hiring model for your next technical role."
        linkText="Learn how"
        linkUrl="#"
        bgColor="bg-andela-blue"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-green-400/5 blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-32 right-1/4 w-8 h-8 border-2 border-blue-400/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-green-400/30 rounded-full"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 bg-blue-400/30 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-green-400/20 rounded-lg rotate-45"></div>
        
        <Container className="relative z-10">
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
              className="text-xl md:text-2xl text-andela-dark font-light mb-16 max-w-3xl mx-auto"
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

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Key Features</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Our adaptive hiring model incorporates cutting-edge technology and human expertise to deliver exceptional talent matches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 flex gap-6 items-start shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-andela-dark">{feature.title}</h3>
                  <p className="text-andela-gray">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">The Adaptive Process</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Our five-step methodology evolves based on your unique requirements to deliver optimal talent matches.
            </p>
          </motion.div>

          <div className="space-y-12 mt-16 max-w-4xl mx-auto">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-andela-dark">{step.title}</h3>
                  <p className="text-andela-gray">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="mt-8 ml-3 h-10 border-l-2 border-blue-200"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How Adaptive Hiring Works Section */}
      <section className="py-20 bg-white relative">
        <Container>
          <div className="relative py-10">
            <AdaptiveHiringWorkflow />
          </div>
        </Container>
      </section>
      
      {/* Comparison Section - Now right after the Adaptive Hiring Workflow */}
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
          
          {/* Tab Controls - Now with State Management */}
          {(() => {
            // Tabbed content setup with state
            const [activeTab, setActiveTab] = useState(0);
            
            // Tab content definitions
            const tabContents = [
              {
                id: 'global-talent',
                title: 'Quality, global talent',
                icon: <Users />,
                description: 'Unlock a vast pool of untapped global talent, with 60% from emerging tech hubs in Africa and LATAM. Niddik\'s borderless marketplace spans 135 countries, connecting you with the right skills to drive innovation, regardless of location.',
                benefits: [
                  'Access to over 150,000 vetted tech professionals globally',
                  'Rigorous assessment to ensure only top 1% of talent',
                  'Diversity of backgrounds and perspectives to drive innovation'
                ]
              },
              {
                id: 'cost-optimization',
                title: 'Cost Optimization',
                icon: <BarChart3 />,
                description: 'Reduce hiring costs by up to 40% with our streamlined matching process. Our transparent pricing model eliminates hidden fees while providing access to higher-quality talent at more competitive rates than traditional staffing models.',
                benefits: [
                  'No recruitment fees or placement commissions',
                  'Flexible contracts without long-term commitments',
                  'Reduced onboarding and training costs'
                ]
              },
              {
                id: 'agile-deployment',
                title: 'Agile Deployment',
                icon: <Briefcase />,
                description: 'Move from candidate selection to fully-integrated team members in days, not months. Our pre-vetted talent pool and streamlined onboarding process means you can quickly adapt to changing project needs.',
                benefits: [
                  'Deployment in as little as 48 hours',
                  'Seamless integration with your existing workflows',
                  'Comprehensive onboarding and support resources'
                ]
              },
              {
                id: 'rapid-scalability',
                title: 'Rapid Scalability',
                icon: <Target />,
                description: 'Scale your team up or down based on project demands without the typical constraints of traditional hiring. Our flexible engagement models adapt to your business cycles with minimal friction.',
                benefits: [
                  'Add specialized talent for specific project phases',
                  'Extend or reduce team size with simple contract adjustments',
                  'Build distributed teams across multiple time zones for 24/7 productivity'
                ]
              }
            ];
            
            return (
              <>
                {/* Tab Controls */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  {tabContents.map((tab, index) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(index)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                        activeTab === index 
                          ? 'bg-green-900 text-white' 
                          : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                      }`}
                    >
                      <div className={activeTab === index ? 'bg-white/20 p-1.5 rounded-full' : 'bg-green-100 p-1.5 rounded-full'}>
                        <div className={`h-4 w-4 ${activeTab === index ? 'text-white' : 'text-green-800'}`}>
                          {tab.icon}
                        </div>
                      </div>
                      <span className="font-medium">{tab.title}</span>
                    </button>
                  ))}
                </div>
                
                {/* Content Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Interactive Map */}
                  <div className="relative">
                    <div className="rounded-lg overflow-hidden bg-green-100">
                      <div className="relative pt-[75%]"> {/* 4:3 Aspect Ratio */}
                        <div className="absolute inset-0 bg-[url('/world-dots-map.svg')] bg-no-repeat bg-center bg-contain p-8">
                          
                          {/* Profile Cards */}
                          <div className="absolute top-[20%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden border-2 border-green-400">
                                <span className="font-semibold text-green-800">RM</span>
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">Rizwan M.</div>
                                <div className="text-xs text-gray-500">Senior Frontend Developer</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-[30%] right-[20%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden border-2 border-blue-400">
                                <span className="font-semibold text-blue-800">EO</span>
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">Ebiere O.</div>
                                <div className="text-xs text-gray-500">Cloud Developer</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mini Profile Icons */}
                          <div className="absolute top-[35%] right-[30%]">
                            <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                              <div className="w-full h-full rounded-full bg-purple-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-800">JL</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute top-[60%] left-[25%]">
                            <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                              <div className="w-full h-full rounded-full bg-yellow-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-yellow-800">AT</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute top-[25%] right-[40%]">
                            <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                              <div className="w-full h-full rounded-full bg-red-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-red-800">MS</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-[40%] left-[40%]">
                            <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                              <div className="w-full h-full rounded-full bg-green-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-green-800">KP</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Decorative Elements */}
                          <div className="absolute top-[15%] right-[25%] w-6 h-6 transform rotate-45 bg-green-900/10"></div>
                          <div className="absolute bottom-[25%] right-[45%] w-4 h-4 rounded-full bg-green-900/10"></div>
                          <div className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-green-900/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Description */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-andela-dark">{tabContents[activeTab].title}</h3>
                    <p className="text-lg text-andela-gray mb-6 leading-relaxed">
                      {tabContents[activeTab].description}
                    </p>
                    
                    <div className="space-y-4">
                      {tabContents[activeTab].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-andela-gray">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </Container>
      </section>
      
      {/* Use Cases Section with Sticky Image */}
      <section className="py-20 bg-gray-50 relative">
        <Container>
          <div className="relative py-10">
            <UsesCasesWithStickyImage />
          </div>
        </Container>
      </section>

      {/* Benefits Section with Stats */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-green-500 text-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Benefits</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our adaptive hiring approach delivers tangible improvements across key recruitment metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition-colors border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                </div>
                <p className="mb-6 text-white/70">{benefit.description}</p>
                <div className="text-6xl font-bold flex items-baseline">
                  {benefit.stat}
                  <span className="ml-2 text-xl">improvement</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-12 shadow-lg">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-andela-dark">
                Ready to Transform Your Hiring Approach?
              </h2>
              <p className="text-xl text-andela-gray mb-10 max-w-2xl mx-auto">
                Join leading companies who have embraced adaptive hiring to build exceptional technical teams faster and more effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/services" 
                  className="inline-flex items-center border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
                >
                  Explore Other Services
                </Link>
              </div>
            </motion.div>
            
            {/* Testimonial */}
            <motion.div
              className="mt-16 bg-white p-8 rounded-xl shadow-md relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl text-blue-200 absolute top-4 left-4">"</div>
              <p className="text-lg text-andela-gray italic mb-6 relative z-10">
                The adaptive hiring model completely transformed our engineering recruitment. We've reduced time-to-hire by 65% while significantly improving candidate quality and team fit. It's the future of technical hiring.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-andela-dark">Alex Rodriguez</p>
                  <p className="text-andela-gray">CTO, TechForward Inc.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default AdaptiveHiring;
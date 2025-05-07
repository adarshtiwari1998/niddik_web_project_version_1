import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  ArrowRight as ArrowRightIcon
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";

// Use Cases with Sticky Image Component
const UsesCasesWithStickyImage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  
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
    <div>
      <h2 className="text-4xl font-bold mb-6 text-andela-dark">Common use cases for Adaptive Hiring</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        {/* Left side content - 6 columns wide */}
        <div className="lg:col-span-6">
          {useCases.map((useCase, index) => (
            <div 
              key={useCase.id}
              ref={el => tabsRef.current[index] = el}
              className={`mb-4 rounded-lg transition-all duration-300 ${activeIndex === index ? 'bg-white shadow-md' : 'bg-gray-50'}`}
            >
              <div 
                className="p-4 cursor-pointer"
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
                    <ul className="space-y-2">
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
        
        {/* Right side sticky image - 6 columns wide */}
        <div className="lg:col-span-6 relative">
          <div className="lg:sticky lg:top-40">
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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
    }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-5% 0px -30% 0px', // Adjusted for better observation
      threshold: 0.2
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.findIndex(section => section === entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div>
      <h2 className="text-4xl font-bold mb-3 text-andela-dark">
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
          <div className="py-8 pr-8 space-y-32"> {/* Increased vertical spacing between sections */}
            {sections.map((section, index) => (
              <div 
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                className="scroll-mt-40" 
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
          
          {/* Right Column - Sticky Visualization */}
          <div className="relative">
            <div className="lg:sticky lg:top-28 pt-6 lg:pt-8 h-full lg:pl-6">
              {/* Skills Assessment Card for Section 1 */}
              {activeSection === 1 && (
                <div className="bg-blue-50 rounded-lg overflow-hidden pt-10 pb-10 px-8">
                  <div className="mb-3">
                    <h4 className="font-semibold text-sm text-blue-600">SKILLS ASSESSMENT</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 h-6 bg-blue-200/50 rounded-full relative">
                        <div className="absolute inset-y-0 left-0 bg-blue-200 w-[80%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">React</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 h-6 bg-green-200/50 rounded-full relative">
                        <div className="absolute inset-y-0 left-0 bg-green-200 w-[65%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">Node.js</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 h-6 bg-yellow-200/50 rounded-full relative">
                        <div className="absolute inset-y-0 left-0 bg-yellow-200 w-[70%] rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">UX/UI</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Visualization for Section 0 */}
              {activeSection === 0 && (
                <div className="bg-blue-50 rounded-lg overflow-hidden pt-10 pb-10 px-8">
                  <div className="flex justify-center mb-4">
                    <h4 className="font-semibold text-lg text-gray-700">Development team</h4>
                  </div>
                  <div className="flex justify-center mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-400"></div>
                      <div className="w-8 h-8 rounded-full bg-green-400"></div>
                      <div className="w-8 h-8 rounded-full bg-indigo-400"></div>
                      <div className="w-8 h-8 rounded-full bg-yellow-400"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-5 mx-auto max-w-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Project Lead</div>
                          <div className="text-sm font-medium">Alex M.</div>
                        </div>
                      </div>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Talent Matching for Section 2 */}
              {activeSection === 2 && (
                <div className="bg-blue-50 rounded-lg overflow-hidden pt-10 pb-10 px-8">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="font-semibold text-sm text-blue-600">TALENT MATCHING</h4>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">4 matches found</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        JS
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Jason S.</div>
                        <div className="text-xs text-gray-500">React Expert</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-9 h-9 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        AT
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Amy T.</div>
                        <div className="text-xs text-gray-500">Full Stack</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-9 h-9 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        RK
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Raj K.</div>
                        <div className="text-xs text-gray-500">Node.js Dev</div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm flex items-center gap-2">
                      <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        ML
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Maria L.</div>
                        <div className="text-xs text-gray-500">UI Designer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Team Scaling for Section 3 */}
              {activeSection === 3 && (
                <div className="bg-blue-50 rounded-lg overflow-hidden pt-10 pb-10 px-8">
                  <h4 className="font-semibold text-sm text-blue-600 mb-5">TEAM SCALING</h4>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Team Size</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">+2</span>
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white z-30"></div>
                          <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white z-20"></div>
                          <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white z-10"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full">
                      <div className="h-2 bg-blue-500 rounded-full w-2/3"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Current: 3</span>
                      <span>Target: 5</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium">Duration</span>
                      <span className="text-sm font-semibold">3 months</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full w-full">
                      <div className="h-2 bg-green-500 rounded-full w-1/4"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Flexible</span>
                      <span>Extendable</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

      {/* Use Cases Section with Sticky Image */}
      <section className="py-20 bg-white relative">
        <Container>
          <div className="relative py-10">
            <UsesCasesWithStickyImage />
          </div>
        </Container>
      </section>

      {/* How Adaptive Hiring Works Section */}
      <section className="py-20 bg-gray-50 relative">
        <Container>
          <div className="relative py-10">
            <AdaptiveHiringWorkflow />
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
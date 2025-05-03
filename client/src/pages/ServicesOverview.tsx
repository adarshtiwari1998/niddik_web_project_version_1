import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ChevronRight, Users, Calendar, PieChart, Briefcase,
  CheckCircle, ArrowRight, Zap, Award, BarChart
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

// Define types
interface ServiceTab {
  id: string;
  label: string;
  heading: string;
  content: string;
  image: string;
  color: string;
}

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  url: string;
}

const ServicesOverview = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("global-talent");

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  // Define services cards
  const services: ServiceCard[] = [
    {
      id: 1,
      title: "Full RPO",
      description: "End-to-end recruitment process outsourcing for comprehensive talent acquisition needs.",
      icon: <Users className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      url: "/services/full-rpo"
    },
    {
      id: 2,
      title: "On-Demand",
      description: "Flexible recruitment solutions that scale with your immediate business requirements.",
      icon: <Calendar className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      url: "/services/on-demand"
    },
    {
      id: 3,
      title: "Hybrid RPO",
      description: "Customized combination of in-house and outsourced recruitment processes for optimal results.",
      icon: <PieChart className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      url: "/services/hybrid-rpo"
    },
    {
      id: 4,
      title: "Contingent",
      description: "Specialized talent acquisition for contract, temporary, and project-based positions.",
      icon: <Briefcase className="h-8 w-8" />,
      color: "from-amber-500 to-amber-600",
      url: "/services/contingent"
    }
  ];

  // Define tabs content
  const serviceTabs: ServiceTab[] = [
    {
      id: "global-talent",
      label: "Global Talent Access",
      heading: "Unlock Worldwide Talent Pools",
      content: "Gain instant access to our expansive global network of pre-vetted tech professionals across 100+ countries. Our platform allows you to tap into specialized skills that might be scarce or expensive in your local market, enabling you to build diverse and high-performing teams regardless of geographic boundaries.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      color: "bg-gradient-to-br from-purple-50 to-indigo-50"
    },
    {
      id: "ai-matching",
      label: "AI-Powered Matching",
      heading: "Intelligent Candidate Selection",
      content: "Our proprietary AI algorithms evaluate not just technical skills, but also cultural alignment, communication abilities, and career aspirations to identify the ideal candidates for your unique needs. This intelligent matching process dramatically reduces time-to-hire while ensuring better long-term retention and productivity.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      color: "bg-gradient-to-br from-blue-50 to-sky-50"
    },
    {
      id: "cost-efficiency",
      label: "Cost Efficiency",
      heading: "Optimize Your Recruitment Budget",
      content: "Our innovative talent solutions offer significant cost advantages compared to traditional recruitment, reducing hiring costs by up to 50%. With transparent pricing models and flexible engagement options, you only pay for the services you need, eliminating overhead costs associated with maintaining large in-house recruitment teams.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      color: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      id: "expertise",
      label: "Industry Expertise",
      heading: "Specialized Recruitment Knowledge",
      content: "Our team brings deep industry-specific expertise to your talent acquisition efforts, understanding the unique demands and skillsets required in your sector. From fintech to healthcare, e-commerce to manufacturing, we leverage our specialized knowledge to identify candidates with the precise experience and qualifications you need.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      color: "bg-gradient-to-br from-amber-50 to-yellow-50"
    }
  ];

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const activeTabContent = serviceTabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Fixed header components */}
      <div className="fixed-header-group w-full z-50">
        <AnnouncementBar 
          text="Join our upcoming webinar on scaling tech teams effectively."
          linkText="Register now"
          linkUrl="#"
          bgColor="bg-indigo-600"
          textColor="text-white"
          onVisibilityChange={handleAnnouncementVisibilityChange}
        />
      </div>
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Add padding to account for fixed elements */}
      <div className={`${isAnnouncementVisible ? 'pt-28' : 'pt-20'} transition-all duration-300`}>
        <main>
          {/* Hero Section with image background */}
          <section className="relative py-24 bg-cover bg-center" style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')` 
            }}>
            <Container>
              <div className="max-w-3xl">
                <h1 className="text-5xl font-bold text-white mb-6">
                  Transformative Talent Solutions for Modern Businesses
                </h1>
                <p className="text-xl text-gray-200 mb-8">
                  Our innovative suite of recruitment services is designed to meet the diverse talent acquisition needs of today's dynamic organizations.
                </p>
                <Link href="#services-overview" className="inline-flex items-center bg-white text-andela-dark px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Explore our services <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </Container>
          </section>

          {/* Services Overview - Enhanced Modern Design */}
          <section id="services-overview" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute -top-20 left-0 w-full h-40 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
            <div className="absolute top-40 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
              <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="400" r="400" stroke="url(#paint4_linear)" strokeWidth="0.5" strokeDasharray="4 4"/>
                <defs>
                  <linearGradient id="paint4_linear" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3ECF8E"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <Container className="relative z-10">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <span className="inline-block bg-gradient-to-r from-andela-green/10 to-blue-500/10 text-andela-green px-4 py-1 rounded-full font-medium mb-4">Talent Solutions</span>
                  <h2 className="text-5xl font-bold text-andela-dark mb-6">Our Comprehensive Services</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    From full-scale recruitment process outsourcing to specialized contingent staffing, 
                    we have a solution tailored to your specific needs.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      {/* Subtle geometric pattern for each service card - LIGHTER AND SMALLER */}
                      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden opacity-15 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none">
                        {index === 0 && (
                          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 0L100 86.6025L50 173.205L-50 173.205L-100 86.6025L-50 0L50 0Z" stroke="url(#service-grad-1)" strokeWidth="1.5" transform="translate(200 50)"/>
                            <path d="M150 0L200 86.6025L150 173.205L50 173.205L0 86.6025L50 0L150 0Z" stroke="url(#service-grad-1)" strokeWidth="1.5" transform="translate(200 50)"/>
                            <path d="M50 173.205L100 259.808L50 346.41L-50 346.41L-100 259.808L-50 173.205L50 173.205Z" stroke="url(#service-grad-1)" strokeWidth="1.5" transform="translate(200 50)"/>
                            <path d="M150 173.205L200 259.808L150 346.41L50 346.41L0 259.808L50 173.205L150 173.205Z" stroke="url(#service-grad-1)" strokeWidth="1.5" transform="translate(200 50)"/>
                            <defs>
                              <linearGradient id="service-grad-1" x1="0" y1="0" x2="200" y2="400" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#818CF8"/>
                                <stop offset="1" stopColor="#4F46E5"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 1 && (
                          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="50" y="50" width="100" height="100" rx="20" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <rect x="250" y="50" width="100" height="100" rx="20" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <rect x="50" y="250" width="100" height="100" rx="20" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <rect x="250" y="250" width="100" height="100" rx="20" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <path d="M150 150L250 150" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <path d="M150 250L150 150" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <path d="M250 250L250 150" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <path d="M150 250L250 250" stroke="url(#service-grad-2)" strokeWidth="1.5"/>
                            <defs>
                              <linearGradient id="service-grad-2" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#60A5FA"/>
                                <stop offset="1" stopColor="#2563EB"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 2 && (
                          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="200" cy="200" r="150" stroke="url(#service-grad-3)" strokeWidth="1.5"/>
                            <path d="M200 50L200 350" stroke="url(#service-grad-3)" strokeWidth="1.5"/>
                            <path d="M50 200L350 200" stroke="url(#service-grad-3)" strokeWidth="1.5"/>
                            <path d="M84.3146 84.3146L315.685 315.685" stroke="url(#service-grad-3)" strokeWidth="1.5"/>
                            <path d="M315.685 84.3146L84.3146 315.685" stroke="url(#service-grad-3)" strokeWidth="1.5"/>
                            <defs>
                              <linearGradient id="service-grad-3" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34D399"/>
                                <stop offset="1" stopColor="#059669"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 3 && (
                          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50L300 50L350 200L300 350L100 350L50 200L100 50Z" stroke="url(#service-grad-4)" strokeWidth="1.5"/>
                            <path d="M150 100L250 100L300 200L250 300L150 300L100 200L150 100Z" stroke="url(#service-grad-4)" strokeWidth="1.5"/>
                            <path d="M200 150L200 250" stroke="url(#service-grad-4)" strokeWidth="1.5"/>
                            <path d="M150 200L250 200" stroke="url(#service-grad-4)" strokeWidth="1.5"/>
                            <defs>
                              <linearGradient id="service-grad-4" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FBBF24"/>
                                <stop offset="1" stopColor="#D97706"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                      </div>
                      
                      {/* Service content with integrated light background icon */}
                      <div className="p-8">
                        <div className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-md group-hover:shadow-lg transition-all duration-300 border border-gray-100`}>
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-r ${service.color}`}>
                            {React.cloneElement(service.icon as React.ReactElement, { className: 'h-5 w-5 text-white' })}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-andela-dark mb-3">{service.title}</h3>
                        <p className="text-andela-gray mb-6">{service.description}</p>
                        <Link 
                          href={service.url} 
                          className="relative inline-flex items-center font-medium text-andela-green hover:text-andela-green/80 transition-all group"
                        >
                          <span className="mr-1">Learn more</span>
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-andela-green/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Container>
          </section>

          {/* Tabs Section with Image and Content - Modern Horizontal Design */}
          <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
              <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="300" r="300" stroke="url(#paint0_linear)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3ECF8E"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0L200 100L100 200L0 100L100 0Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                <path d="M300 0L400 100L300 200L200 100L300 0Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                <path d="M100 200L200 300L100 400L0 300L100 200Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                <path d="M300 200L400 300L300 400L200 300L300 200Z" stroke="url(#paint1_linear)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="paint1_linear" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B"/>
                    <stop offset="1" stopColor="#EC4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10"
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-andela-dark mb-4">Why Choose Our Services</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    Discover the unique advantages that make our talent solutions stand out from traditional recruitment approaches.
                  </p>
                </motion.div>

                {/* Horizontal Tabs Navigation */}
                <div className="mb-10">
                  <div className="relative bg-white rounded-xl shadow-lg p-2 flex flex-wrap md:flex-nowrap justify-center">
                    {/* Animated bottom highlight line */}
                    <motion.div 
                      className="absolute bottom-0 h-1 bg-gradient-to-r from-andela-green to-blue-500 rounded-full"
                      initial={{ left: '0%', width: '25%' }}
                      animate={{ 
                        left: `${serviceTabs.findIndex(tab => tab.id === activeTab) * 25}%`,
                        width: '25%' 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ 
                        left: `${serviceTabs.findIndex(tab => tab.id === activeTab) * 25}%`,
                        width: '25%' 
                      }}
                    />

                    {/* Tab buttons in a horizontal layout */}
                    {serviceTabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 py-4 px-6 text-center overflow-hidden transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'text-andela-green font-semibold' 
                            : 'text-andela-gray hover:text-andela-dark'
                        }`}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      >
                        <span className="block text-lg">{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab content area */}
                <div className="mt-8">
                  {activeTabContent && (
                    <motion.div 
                      className="bg-white p-8 rounded-xl shadow-xl overflow-hidden"
                      key={activeTabContent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left: Content with modern styling */}
                        <div className="flex flex-col justify-center">
                          <div className="inline-block mb-4 bg-gradient-to-r from-andela-green/10 to-blue-500/10 px-4 py-1 rounded-full">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-andela-green to-blue-500 font-medium">
                              Feature {serviceTabs.findIndex(tab => tab.id === activeTabContent.id) + 1} of {serviceTabs.length}
                            </span>
                          </div>
                          
                          <h3 className="text-3xl font-bold text-andela-dark mb-4">
                            {activeTabContent.heading}
                          </h3>
                          <div className="h-1 w-20 bg-gradient-to-r from-andela-green to-blue-500 rounded-full mb-6"></div>
                          <p className="text-andela-gray text-lg mb-6">
                            {activeTabContent.content}
                          </p>
                          
                          <div className="mt-4">
                            <Link 
                              href="/contact" 
                              className="inline-flex items-center text-andela-green font-medium hover:text-andela-green/80 transition-all group"
                            >
                              Learn more about this feature
                              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                <ChevronRight className="ml-1 h-5 w-5" />
                              </span>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Right: Enhanced image card with guaranteed visibility */}
                        <div className="rounded-xl overflow-hidden shadow-lg group relative h-80 border border-gray-100">
                          {/* Ensure the image shows by setting explicit dimensions and fit */}
                          <img 
                            src={activeTabContent.image} 
                            alt={activeTabContent.heading}
                            className="w-full h-full object-cover object-center"
                            onLoad={() => console.log(`Tab image loaded: ${activeTabContent.heading}`)}
                            onError={() => console.error(`Error loading image for: ${activeTabContent.heading}`)}
                          />
                          
                          {/* Gradient overlay for better visibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80"></div>
                          
                          {/* Caption at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                            <h4 className="font-semibold text-xl">{activeTabContent.heading}</h4>
                            <div className="h-1 w-12 bg-white rounded-full mt-2"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Container>
          </section>

          {/* NIDDIK Difference Section - Enhanced geometric patterns */}
          <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Background geometric decorations */}
            <div className="absolute top-0 left-0 opacity-20 pointer-events-none">
              <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="150" r="150" stroke="url(#paint2_linear)" strokeWidth="1.5"/>
                <circle cx="150" cy="150" r="100" stroke="url(#paint2_linear)" strokeWidth="1.5"/>
                <circle cx="150" cy="150" r="50" stroke="url(#paint2_linear)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="paint2_linear" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34D399"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M200 0L400 200L200 400L0 200L200 0Z" stroke="url(#paint3_linear)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="paint3_linear" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F97316"/>
                    <stop offset="1" stopColor="#EC4899"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10"
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <span className="inline-block bg-gradient-to-r from-andela-green/20 to-amber-500/20 text-andela-green px-4 py-1 rounded-full font-medium mb-4">Our Expertise</span>
                  <h2 className="text-5xl font-bold text-andela-dark mb-4">The NIDDIK Difference</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    What makes our approach to talent acquisition truly revolutionary
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Card 1 - Hexagon Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-xl p-8 relative group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-100"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - LIGHTER AND SMALLER */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0L60 34.641L40 69.282L0 69.282L-20 34.641L0 0L40 0Z" stroke="url(#hex-grad-1)" strokeWidth="1.5" transform="translate(90 40)"/>
                        <path d="M120 0L140 34.641L120 69.282L80 69.282L60 34.641L80 0L120 0Z" stroke="url(#hex-grad-1)" strokeWidth="1.5" transform="translate(30 40)"/>
                        <path d="M40 69.282L60 103.923L40 138.564L0 138.564L-20 103.923L0 69.282L40 69.282Z" stroke="url(#hex-grad-1)" strokeWidth="1.5" transform="translate(90 20)"/>
                        <defs>
                          <linearGradient id="hex-grad-1" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3B82F6"/>
                            <stop offset="1" stopColor="#60A5FA"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Content with consistently aligned icon */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-md border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Speed to Market</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 mb-4"></div>
                      <p className="text-andela-gray">
                        Our streamlined processes and global talent network reduce time-to-hire by up to 65% compared to industry averages.
                      </p>
                    </div>
                    
                    {/* Hover accent border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                  </motion.div>

                  {/* Card 2 - Connected Squares Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-xl p-8 relative group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-green-100"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - LIGHTER AND SMALLER */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L50 10L50 30L30 30L30 10Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M60 10L80 10L80 30L60 30L60 10Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M90 10L110 10L110 30L90 30L90 10Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M30 40L50 40L50 60L30 60L30 40Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M60 40L80 40L80 60L60 60L60 40Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M90 40L110 40L110 60L90 60L90 40Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M30 70L50 70L50 90L30 90L30 70Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M60 70L80 70L80 90L60 90L60 70Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <path d="M90 70L110 70L110 90L90 90L90 70Z" stroke="url(#square-grad-1)" strokeWidth="1.5"/>
                        <defs>
                          <linearGradient id="square-grad-1" x1="10" y1="10" x2="130" y2="130" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#10B981"/>
                            <stop offset="1" stopColor="#34D399"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Content with consistently aligned icon */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-md border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Quality-Assured Talent</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-green-400 to-green-600 mb-4"></div>
                      <p className="text-andela-gray">
                        Our rigorous vetting process ensures that only the top 3% of talent makes it into our exclusive network.
                      </p>
                    </div>
                    
                    {/* Hover accent border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                  </motion.div>

                  {/* Card 3 - Triangular Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-xl p-8 relative group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - LIGHTER AND SMALLER */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 20L60 50.981L20 50.981L40 20Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <path d="M80 20L100 50.981L60 50.981L80 20Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <path d="M120 20L140 50.981L100 50.981L120 20Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <path d="M40 60L60 90.981L20 90.981L40 60Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <path d="M80 60L100 90.981L60 90.981L80 60Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <path d="M120 60L140 90.981L100 90.981L120 60Z" stroke="url(#tri-grad-1)" strokeWidth="1.5"/>
                        <defs>
                          <linearGradient id="tri-grad-1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#8B5CF6"/>
                            <stop offset="1" stopColor="#A78BFA"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Content with consistently aligned icon */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-md border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                          <BarChart className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Data-Driven Insights</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-purple-600 mb-4"></div>
                      <p className="text-andela-gray">
                        Our analytics platform provides real-time visibility into your talent acquisition performance and market trends.
                      </p>
                    </div>
                    
                    {/* Hover accent border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                  </motion.div>

                  {/* Card 4 - Circular Orbits Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-xl p-8 relative group hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - LIGHTER AND SMALLER */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="80" cy="80" rx="60" ry="20" stroke="url(#circle-grad-1)" strokeWidth="1.5" transform="rotate(0 80 80)"/>
                        <ellipse cx="80" cy="80" rx="60" ry="20" stroke="url(#circle-grad-1)" strokeWidth="1.5" transform="rotate(60 80 80)"/>
                        <ellipse cx="80" cy="80" rx="60" ry="20" stroke="url(#circle-grad-1)" strokeWidth="1.5" transform="rotate(120 80 80)"/>
                        <circle cx="80" cy="80" r="10" stroke="url(#circle-grad-1)" strokeWidth="1.5"/>
                        <defs>
                          <linearGradient id="circle-grad-1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F59E0B"/>
                            <stop offset="1" stopColor="#FBBF24"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Content with consistently aligned icon */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-md border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-md flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Scalable Solutions</h3>
                      <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-600 mb-4"></div>
                      <p className="text-andela-gray">
                        Our flexible models adapt seamlessly to your changing talent needs, whether you're hiring one specialist or building an entire team.
                      </p>
                    </div>
                    
                    {/* Hover accent border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/20 rounded-xl transition-colors duration-300 pointer-events-none"></div>
                  </motion.div>
                </div>
              </motion.div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-andela-dark text-white">
            <Container>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your talent acquisition strategy?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Let's discuss how our innovative services can help you build the teams you need to succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/contact"
                    className="py-3 px-8 rounded-md bg-andela-green text-white font-medium hover:bg-andela-green/90 transition-colors"
                  >
                    Schedule a Consultation
                  </Link>
                  <Link 
                    href="/case-studies"
                    className="py-3 px-8 rounded-md bg-transparent text-white font-medium border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    View Success Stories
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ServicesOverview;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  ChevronRight, Users, Calendar, PieChart, Briefcase,
  CheckCircle, ArrowRight, Zap, Award, BarChart,
  ChevronLeft
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
    },
    {
      id: 5,
      title: "Web App Solutions",
      description: "Custom, scalable, and secure web applications that solve complex business challenges and deliver exceptional user experiences.",
      icon: <Zap className="h-8 w-8" />,
      color: "from-teal-500 to-teal-600",
      url: "/web-app-solutions"
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

  // No carousel functionality needed anymore - show all services in a grid

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
                
                {/* Services Grid Section */}
                <div className="mb-20">
                  {/* Service Cards Grid - Two Rows */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index: number) => (
                      <motion.div
                        key={service.id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-md p-0 relative group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
                        style={{ 
                          transformStyle: 'preserve-3d',
                          perspective: '1000px'
                        }}
                      >
                        {/* Card Background Pattern */}
                        <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id={`service-grad-${index + 1}`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#3ECF8E"/>
                                <stop offset="1" stopColor="#3ECF8E"/>
                              </linearGradient>
                            </defs>
                            <circle cx="160" cy="40" r="20" stroke={`url(#service-grad-${index + 1})`} strokeWidth="0.5" strokeDasharray="2 2"/>
                            <circle cx="40" cy="160" r="30" stroke={`url(#service-grad-${index + 1})`} strokeWidth="0.5" strokeDasharray="2 2"/>
                            <circle cx="100" cy="100" r="50" stroke={`url(#service-grad-${index + 1})`} strokeWidth="0.5" strokeDasharray="2 2"/>
                          </svg>
                        </div>
                        
                        {/* Service content with integrated light background icon */}
                        <div className="p-8">
                          <div className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100`}>
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
                    <stop offset="1" stopColor="#3ECF8E"/>
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
                  <span className="inline-block bg-gradient-to-r from-andela-green/10 to-gray-200 text-andela-dark px-4 py-1 rounded-full font-medium mb-4">Why Choose Us</span>
                  <h2 className="text-5xl font-bold text-andela-dark mb-6">Our Competitive Advantage</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    We combine industry expertise with cutting-edge technology to deliver exceptional recruitment solutions that outperform traditional approaches.
                  </p>
                </motion.div>
                
                {/* Tabs navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {serviceTabs.map(tab => (
                    <motion.div 
                      key={tab.id}
                      variants={itemVariants}
                      className="mb-2"
                    >
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-andela-green text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    </motion.div>
                  ))}
                </div>
                
                {/* Tab content with image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl overflow-hidden shadow-xl ${activeTabContent?.color}`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Image column */}
                      <div className="relative h-full min-h-[300px] lg:min-h-[500px]">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${activeTabContent?.image}')` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                      
                      {/* Content column */}
                      <div className="p-12 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-andela-dark mb-6">{activeTabContent?.heading}</h3>
                        <p className="text-andela-gray mb-8 text-lg leading-relaxed">{activeTabContent?.content}</p>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-6 w-6 text-andela-green mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-andela-dark">Faster hiring cycles with our AI-powered matching technology</p>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-6 w-6 text-andela-green mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-andela-dark">Access to a diverse pool of pre-vetted talent across industries</p>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-6 w-6 text-andela-green mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-andela-dark">Flexible engagement models tailored to your unique needs</p>
                          </div>
                        </div>
                        <div className="mt-10">
                          <Link href="#contact" className="inline-flex items-center bg-andela-green text-white px-6 py-3 rounded-md font-medium hover:bg-andela-green/90 transition-all">
                            Get started today <ArrowRight className="h-5 w-5 ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </Container>
          </section>

          {/* Outcomes and Success Stories Section */}
          <section className="py-24 relative overflow-hidden">
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <span className="inline-block bg-gradient-to-r from-andela-green/10 to-gray-200 text-andela-dark px-4 py-1 rounded-full font-medium mb-4">Success Metrics</span>
                  <h2 className="text-5xl font-bold text-andela-dark mb-6">Real Business Outcomes</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    Our clients have experienced significant improvements in their recruitment effectiveness and overall business performance.
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Award className="h-8 w-8 text-andela-green" />
                    </div>
                    <h3 className="text-4xl font-bold text-andela-dark mb-2">93%</h3>
                    <p className="text-andela-gray">Client retention rate</p>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <BarChart className="h-8 w-8 text-andela-green" />
                    </div>
                    <h3 className="text-4xl font-bold text-andela-dark mb-2">45%</h3>
                    <p className="text-andela-gray">Reduction in time-to-hire</p>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-andela-green" />
                    </div>
                    <h3 className="text-4xl font-bold text-andela-dark mb-2">98%</h3>
                    <p className="text-andela-gray">Placement success rate</p>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-andela-green" />
                    </div>
                    <h3 className="text-4xl font-bold text-andela-dark mb-2">32%</h3>
                    <p className="text-andela-gray">Average cost savings</p>
                  </motion.div>
                </div>
              </motion.div>
            </Container>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ServicesOverview;
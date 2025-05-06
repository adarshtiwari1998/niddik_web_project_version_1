import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md p-0 relative group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                      }}
                    >
                      {/* Subtle geometric pattern for each service card - TINY GROUPED SHAPES */}
                      <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        {index === 0 && (
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Group 1 - Small clustered hexagons */}
                            <g transform="translate(140, 130) scale(0.3)">
                              <path d="M0 10L8.7 5L8.7 -5L0 -10L-8.7 -5L-8.7 5L0 10Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M0 25L8.7 20L8.7 10L0 5L-8.7 10L-8.7 20L0 25Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M17.3 17.5L26 12.5L26 2.5L17.3 -2.5L8.6 2.5L8.6 12.5L17.3 17.5Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <line x1="3" y1="4" x2="14" y2="17" stroke="url(#service-grad-1)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 2 - Scattered tiny hexes */}
                            <g transform="translate(40, 150) scale(0.2)">
                              <path d="M0 10L8.7 5L8.7 -5L0 -10L-8.7 -5L-8.7 5L0 10Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M25 10L33.7 5L33.7 -5L25 -10L16.3 -5L16.3 5L25 10Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M50 10L58.7 5L58.7 -5L50 -10L41.3 -5L41.3 5L50 10Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M12.5 30L21.2 25L21.2 15L12.5 10L3.8 15L3.8 25L12.5 30Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                              <path d="M37.5 30L46.2 25L46.2 15L37.5 10L28.8 15L28.8 25L37.5 30Z" stroke="url(#service-grad-1)" strokeWidth="0.8" />
                            </g>
                            
                            {/* Group 3 - Dotted outline */}
                            <g transform="translate(170, 30) scale(0.2)">
                              <circle cx="0" cy="0" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="20" cy="0" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="40" cy="0" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="0" cy="20" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="20" cy="20" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="40" cy="20" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="0" cy="40" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="20" cy="40" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                              <circle cx="40" cy="40" r="3" fill="url(#service-grad-1)" fillOpacity="0.4" />
                            </g>
                            
                            <defs>
                              <linearGradient id="service-grad-1" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#818CF8"/>
                                <stop offset="1" stopColor="#4F46E5"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 1 && (
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Group 1 - Connected small squares */}
                            <g transform="translate(150, 120) scale(0.3)">
                              <rect x="0" y="0" width="15" height="15" rx="2" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="20" y="0" width="15" height="15" rx="2" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="0" y="20" width="15" height="15" rx="2" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="20" y="20" width="15" height="15" rx="2" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <line x1="15" y1="7.5" x2="20" y2="7.5" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <line x1="7.5" y1="15" x2="7.5" y2="20" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <line x1="27.5" y1="15" x2="27.5" y2="20" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 2 - Grid of mini squares */}
                            <g transform="translate(50, 150) scale(0.2)">
                              <rect x="0" y="0" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="15" y="0" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="30" y="0" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="45" y="0" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="0" y="15" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="15" y="15" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="30" y="15" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="45" y="15" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="0" y="30" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="15" y="30" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="30" y="30" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                              <rect x="45" y="30" width="10" height="10" rx="1" stroke="url(#service-grad-2)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 3 - Small scattered squares */}
                            <g transform="translate(30, 40) scale(0.2)">
                              <rect x="0" y="0" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                              <rect x="20" y="5" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                              <rect x="40" y="10" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                              <rect x="5" y="20" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                              <rect x="25" y="25" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                              <rect x="45" y="30" width="8" height="8" fill="url(#service-grad-2)" fillOpacity="0.4"/>
                            </g>
                            
                            <defs>
                              <linearGradient id="service-grad-2" x1="10" y1="10" x2="130" y2="130" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#60A5FA"/>
                                <stop offset="1" stopColor="#2563EB"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 2 && (
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Group 1 - Connected circles */}
                            <g transform="translate(150, 130) scale(0.3)">
                              <circle cx="0" cy="0" r="10" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <circle cx="30" cy="0" r="10" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <circle cx="15" cy="26" r="10" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <line x1="8.5" y1="5" x2="21.5" y2="5" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <line x1="28.5" y1="8" x2="22.5" y2="18" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <line x1="7.5" y1="8" x2="10.5" y2="18" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 2 - Scattered mini circles */}
                            <g transform="translate(40, 150) scale(0.25)">
                              <circle cx="0" cy="0" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="20" cy="5" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="40" cy="0" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="10" cy="25" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="30" cy="30" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="50" cy="25" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="20" cy="50" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="40" cy="55" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                              <circle cx="60" cy="50" r="6" fill="url(#service-grad-3)" fillOpacity="0.4"/>
                            </g>
                            
                            {/* Group 3 - Mini orbit pattern */}
                            <g transform="translate(40, 50) scale(0.2)">
                              <circle cx="25" cy="25" r="5" stroke="url(#service-grad-3)" strokeWidth="0.8"/>
                              <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#service-grad-3)" strokeWidth="0.8" transform="rotate(0 25 25)"/>
                              <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#service-grad-3)" strokeWidth="0.8" transform="rotate(60 25 25)"/>
                              <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#service-grad-3)" strokeWidth="0.8" transform="rotate(120 25 25)"/>
                            </g>
                            
                            <defs>
                              <linearGradient id="service-grad-3" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34D399"/>
                                <stop offset="1" stopColor="#059669"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 3 && (
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Group 1 - Clustered mini triangles */}
                            <g transform="translate(140, 140) scale(0.3)">
                              <path d="M0 0L15 26L-15 26L0 0Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M30 0L45 26L15 26L30 0Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M15 30L30 56L0 56L15 30Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M45 30L60 56L30 56L45 30Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <circle cx="22.5" cy="28" r="2" fill="url(#service-grad-4)" fillOpacity="0.5"/>
                            </g>
                            
                            {/* Group 2 - Scattered small triangles */}
                            <g transform="translate(30, 150) scale(0.2)">
                              <path d="M0 0L10 17.3L-10 17.3L0 0Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                              <path d="M30 10L40 27.3L20 27.3L30 10Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                              <path d="M60 0L70 17.3L50 17.3L60 0Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                              <path d="M15 30L25 47.3L5 47.3L15 30Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                              <path d="M45 40L55 57.3L35 57.3L45 40Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                              <path d="M75 30L85 47.3L65 47.3L75 30Z" fill="url(#service-grad-4)" fillOpacity="0.4"/>
                            </g>
                            
                            {/* Group 3 - Connected triangles */}
                            <g transform="translate(40, 50) scale(0.2)">
                              <path d="M0 0L12 20.8L-12 20.8L0 0Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M24 0L36 20.8L12 20.8L24 0Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M12 24L24 44.8L0 44.8L12 24Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <path d="M36 24L48 44.8L24 44.8L36 24Z" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <line x1="12" y1="20.8" x2="24" y2="20.8" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <line x1="12" y1="20.8" x2="12" y2="24" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                              <line x1="24" y1="20.8" x2="24" y2="24" stroke="url(#service-grad-4)" strokeWidth="0.8"/>
                            </g>
                            
                            <defs>
                              <linearGradient id="service-grad-4" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FBBF24"/>
                                <stop offset="1" stopColor="#D97706"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        {index === 4 && (
                          <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Group 1 - Code brackets and symbols */}
                            <g transform="translate(140, 140) scale(0.3)">
                              <path d="M0 0L10 20L-10 20L0 0Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <path d="M-15 5L-5 25L-25 25L-15 5Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <path d="M15 5L25 25L5 25L15 5Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <rect x="-40" y="0" width="20" height="20" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <rect x="20" y="0" width="20" height="20" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 2 - Code symbols */}
                            <g transform="translate(40, 150) scale(0.25)">
                              <path d="M0 0L-10 10L0 20L10 10L0 0Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <path d="M25 0L15 10L25 20L35 10L25 0Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <path d="M50 0L40 10L50 20L60 10L50 0Z" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <rect x="0" y="30" width="15" height="15" rx="2" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <rect x="25" y="30" width="15" height="15" rx="2" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                              <rect x="50" y="30" width="15" height="15" rx="2" stroke="url(#service-grad-5)" strokeWidth="0.8"/>
                            </g>
                            
                            {/* Group 3 - Code lines */}
                            <g transform="translate(30, 50) scale(0.15)">
                              <line x1="0" y1="0" x2="40" y2="0" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="10" x2="60" y2="10" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="20" x2="50" y2="20" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="30" x2="70" y2="30" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="40" x2="45" y2="40" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="50" x2="55" y2="50" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="60" x2="35" y2="60" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="70" x2="65" y2="70" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                              <line x1="0" y1="80" x2="40" y2="80" stroke="url(#service-grad-5)" strokeWidth="1.5"/>
                            </g>
                            
                            <defs>
                              <linearGradient id="service-grad-5" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2DD4BF"/>
                                <stop offset="1" stopColor="#0D9488"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
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
                    className="bg-white rounded-xl shadow-md p-8 relative group hover:shadow-xl transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - TINY GROUPED SHAPES */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Group 1 - Small clustered hexagons */}
                        <g transform="translate(140, 130) scale(0.4)">
                          <path d="M0 10L8.7 5L8.7 -5L0 -10L-8.7 -5L-8.7 5L0 10Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M0 25L8.7 20L8.7 10L0 5L-8.7 10L-8.7 20L0 25Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M17.3 17.5L26 12.5L26 2.5L17.3 -2.5L8.6 2.5L8.6 12.5L17.3 17.5Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <line x1="3" y1="4" x2="14" y2="17" stroke="url(#hex-grad-1)" strokeWidth="0.8"/>
                        </g>
                        
                        {/* Group 2 - Scattered tiny hexes */}
                        <g transform="translate(40, 150) scale(0.3)">
                          <path d="M0 10L8.7 5L8.7 -5L0 -10L-8.7 -5L-8.7 5L0 10Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M25 10L33.7 5L33.7 -5L25 -10L16.3 -5L16.3 5L25 10Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M50 10L58.7 5L58.7 -5L50 -10L41.3 -5L41.3 5L50 10Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M12.5 30L21.2 25L21.2 15L12.5 10L3.8 15L3.8 25L12.5 30Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                          <path d="M37.5 30L46.2 25L46.2 15L37.5 10L28.8 15L28.8 25L37.5 30Z" stroke="url(#hex-grad-1)" strokeWidth="0.8" />
                        </g>
                        
                        {/* Group 3 - Dotted outline */}
                        <g transform="translate(170, 30) scale(0.2)">
                          <circle cx="0" cy="0" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="20" cy="0" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="40" cy="0" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="0" cy="20" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="20" cy="20" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="40" cy="20" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="0" cy="40" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="20" cy="40" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                          <circle cx="40" cy="40" r="3" fill="url(#hex-grad-1)" fillOpacity="0.4" />
                        </g>
                        
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
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
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
                  </motion.div>

                  {/* Card 2 - Connected Squares Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 relative group hover:shadow-xl transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - TINY GROUPED SHAPES */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Group 1 - Connected small squares */}
                        <g transform="translate(150, 120) scale(0.35)">
                          <rect x="0" y="0" width="15" height="15" rx="2" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="20" y="0" width="15" height="15" rx="2" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="0" y="20" width="15" height="15" rx="2" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="20" y="20" width="15" height="15" rx="2" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <line x1="15" y1="7.5" x2="20" y2="7.5" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <line x1="7.5" y1="15" x2="7.5" y2="20" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <line x1="27.5" y1="15" x2="27.5" y2="20" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                        </g>
                        
                        {/* Group 2 - Grid of mini squares */}
                        <g transform="translate(50, 150) scale(0.25)">
                          <rect x="0" y="0" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="15" y="0" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="30" y="0" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="45" y="0" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="0" y="15" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="15" y="15" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="30" y="15" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="45" y="15" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="0" y="30" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="15" y="30" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="30" y="30" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                          <rect x="45" y="30" width="10" height="10" rx="1" stroke="url(#square-grad-1)" strokeWidth="0.8"/>
                        </g>
                        
                        {/* Group 3 - Small scattered squares */}
                        <g transform="translate(30, 40) scale(0.2)">
                          <rect x="0" y="0" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                          <rect x="20" y="5" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                          <rect x="40" y="10" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                          <rect x="5" y="20" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                          <rect x="25" y="25" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                          <rect x="45" y="30" width="8" height="8" fill="url(#square-grad-1)" fillOpacity="0.4"/>
                        </g>
                        
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
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
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
                  </motion.div>

                  {/* Card 3 - Triangular Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 relative group hover:shadow-xl transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - TINY GROUPED SHAPES */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Group 1 - Clustered mini triangles */}
                        <g transform="translate(140, 140) scale(0.3)">
                          <path d="M0 0L15 26L-15 26L0 0Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M30 0L45 26L15 26L30 0Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M15 30L30 56L0 56L15 30Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M45 30L60 56L30 56L45 30Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <circle cx="22.5" cy="28" r="2" fill="url(#tri-grad-1)" fillOpacity="0.5"/>
                        </g>
                        
                        {/* Group 2 - Scattered small triangles */}
                        <g transform="translate(30, 150) scale(0.2)">
                          <path d="M0 0L10 17.3L-10 17.3L0 0Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                          <path d="M30 10L40 27.3L20 27.3L30 10Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                          <path d="M60 0L70 17.3L50 17.3L60 0Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                          <path d="M15 30L25 47.3L5 47.3L15 30Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                          <path d="M45 40L55 57.3L35 57.3L45 40Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                          <path d="M75 30L85 47.3L65 47.3L75 30Z" fill="url(#tri-grad-1)" fillOpacity="0.4"/>
                        </g>
                        
                        {/* Group 3 - Connected triangles */}
                        <g transform="translate(40, 50) scale(0.2)">
                          <path d="M0 0L12 20.8L-12 20.8L0 0Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M24 0L36 20.8L12 20.8L24 0Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M12 24L24 44.8L0 44.8L12 24Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <path d="M36 24L48 44.8L24 44.8L36 24Z" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <line x1="12" y1="20.8" x2="24" y2="20.8" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <line x1="12" y1="20.8" x2="12" y2="24" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                          <line x1="24" y1="20.8" x2="24" y2="24" stroke="url(#tri-grad-1)" strokeWidth="0.8"/>
                        </g>
                        
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
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
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
                  </motion.div>

                  {/* Card 4 - Circular Orbits Pattern */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-md p-8 relative group hover:shadow-xl transition-all duration-500 overflow-hidden"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    {/* Background geometric pattern - TINY GROUPED SHAPES */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Group 1 - Connected circles */}
                        <g transform="translate(150, 130) scale(0.3)">
                          <circle cx="0" cy="0" r="10" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <circle cx="30" cy="0" r="10" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <circle cx="15" cy="26" r="10" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <line x1="8.5" y1="5" x2="21.5" y2="5" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <line x1="28.5" y1="8" x2="22.5" y2="18" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <line x1="7.5" y1="8" x2="10.5" y2="18" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                        </g>
                        
                        {/* Group 2 - Scattered mini circles */}
                        <g transform="translate(40, 150) scale(0.25)">
                          <circle cx="0" cy="0" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="20" cy="5" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="40" cy="0" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="10" cy="25" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="30" cy="30" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="50" cy="25" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="20" cy="50" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="40" cy="55" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                          <circle cx="60" cy="50" r="6" fill="url(#circle-grad-1)" fillOpacity="0.4"/>
                        </g>
                        
                        {/* Group 3 - Mini orbit pattern */}
                        <g transform="translate(40, 50) scale(0.2)">
                          <circle cx="25" cy="25" r="5" stroke="url(#circle-grad-1)" strokeWidth="0.8"/>
                          <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#circle-grad-1)" strokeWidth="0.8" transform="rotate(0 25 25)"/>
                          <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#circle-grad-1)" strokeWidth="0.8" transform="rotate(60 25 25)"/>
                          <ellipse cx="25" cy="25" rx="15" ry="8" stroke="url(#circle-grad-1)" strokeWidth="0.8" transform="rotate(120 25 25)"/>
                        </g>
                        
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
                      <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
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
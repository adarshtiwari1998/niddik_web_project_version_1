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

          {/* Services Overview - Different presentation from home page */}
          <section id="services-overview" className="py-20 bg-gray-50">
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-andela-dark mb-4">Our Comprehensive Service Offerings</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    From full-scale recruitment process outsourcing to specialized contingent staffing, we have a solution tailored to your specific needs.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      className="relative bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
                    >
                      {/* Background decorative elements */}
                      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M60 0L95.3109 30L95.3109 90L60 120L24.6891 90L24.6891 30L60 0Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="absolute top-4 right-8 opacity-5 pointer-events-none">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M30 0L60 30L30 60L0 30L30 0Z" fill="currentColor"/>
                        </svg>
                      </div>
                      
                      {/* Service content */}
                      <div className="p-8">
                        <div className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-r ${service.color} text-white`}>
                          {service.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-andela-dark mb-3">{service.title}</h3>
                        <p className="text-andela-gray mb-6">{service.description}</p>
                        <Link 
                          href={service.url} 
                          className="inline-flex items-center font-medium text-andela-green hover:text-andela-green/80 transition-colors"
                        >
                          Learn more <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                        </Link>
                      </div>
                      
                      {/* Bottom color bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${service.color}`}></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Container>
          </section>

          {/* Tabs Section with Image and Content */}
          <section className="py-20 bg-white">
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-andela-dark mb-4">Why Choose Our Services</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    Discover the unique advantages that make our talent solutions stand out from traditional recruitment approaches.
                  </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Tabs navigation */}
                  <div className="lg:w-1/3">
                    <div className="relative">
                      {/* Animated highlight line */}
                      <motion.div 
                        className="absolute left-0 w-1 bg-andela-green rounded-full"
                        initial={{ top: 0, height: '0%' }}
                        animate={{ 
                          top: serviceTabs.findIndex(tab => tab.id === activeTab) * 25 + '%',
                          height: '25%' 
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      
                      {/* Tab buttons */}
                      <div className="space-y-6">
                        {serviceTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pl-6 py-3 w-full text-left relative ${
                              activeTab === tab.id 
                                ? 'text-andela-green font-semibold' 
                                : 'text-andela-gray hover:text-andela-dark'
                            } transition-colors duration-200`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tab content with image */}
                  <div className="lg:w-2/3">
                    {activeTabContent && (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        key={activeTabContent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Left: Content */}
                        <div className="flex flex-col justify-center">
                          <h3 className="text-2xl font-bold text-andela-dark mb-4">
                            {activeTabContent.heading}
                          </h3>
                          <p className="text-andela-gray">
                            {activeTabContent.content}
                          </p>
                        </div>
                        
                        {/* Right: Image */}
                        <div className={`rounded-lg overflow-hidden ${activeTabContent.color}`}>
                          <img 
                            src={activeTabContent.image} 
                            alt={activeTabContent.heading}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Container>
          </section>

          {/* NIIDIK Difference Section */}
          <section className="py-20 bg-gray-50">
            <Container>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-andela-dark mb-4">The NIDDIK Difference</h2>
                  <p className="text-xl text-andela-gray max-w-3xl mx-auto">
                    What makes our approach to talent acquisition truly revolutionary
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Card 1 */}
                  <motion.div
                    variants={itemVariants}
                    className="relative rounded-xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 z-0"></div>
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none z-0">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60 0L95.3109 30L95.3109 90L60 120L24.6891 90L24.6891 30L60 0Z" fill="currentColor"/>
                        <path d="M60 20L85.3109 40L85.3109 80L60 100L34.6891 80L34.6891 40L60 20Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                        <Zap className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Speed to Market</h3>
                      <p className="text-andela-gray">
                        Our streamlined processes and global talent network reduce time-to-hire by up to 65% compared to industry averages.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div
                    variants={itemVariants}
                    className="relative rounded-xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 z-0"></div>
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none z-0">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 0L60 30L30 60L0 30L30 0Z" fill="currentColor"/>
                        <path d="M90 0L120 30L90 60L60 30L90 0Z" fill="currentColor"/>
                        <path d="M30 60L60 90L30 120L0 90L30 60Z" fill="currentColor"/>
                        <path d="M90 60L120 90L90 120L60 90L90 60Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Quality-Assured Talent</h3>
                      <p className="text-andela-gray">
                        Our rigorous vetting process ensures that only the top 3% of talent makes it into our exclusive network.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div
                    variants={itemVariants}
                    className="relative rounded-xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 z-0"></div>
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none z-0">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60 0L120 60L60 120L0 60L60 0Z" fill="currentColor"/>
                        <path d="M60 30L90 60L60 90L30 60L60 30Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                        <BarChart className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Data-Driven Insights</h3>
                      <p className="text-andela-gray">
                        Our analytics platform provides real-time visibility into your talent acquisition performance and market trends.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 4 */}
                  <motion.div
                    variants={itemVariants}
                    className="relative rounded-xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 z-0"></div>
                    <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none z-0">
                      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="currentColor"/>
                        <path d="M60 0L80 20L60 40L40 20L60 0Z" fill="currentColor"/>
                        <path d="M100 0L120 20L100 40L80 20L100 0Z" fill="currentColor"/>
                        <path d="M20 40L40 60L20 80L0 60L20 40Z" fill="currentColor"/>
                        <path d="M60 40L80 60L60 80L40 60L60 40Z" fill="currentColor"/>
                        <path d="M100 40L120 60L100 80L80 60L100 40Z" fill="currentColor"/>
                        <path d="M20 80L40 100L20 120L0 100L20 80Z" fill="currentColor"/>
                        <path d="M60 80L80 100L60 120L40 100L60 80Z" fill="currentColor"/>
                        <path d="M100 80L120 100L100 120L80 100L100 80Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="p-8 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                        <CheckCircle className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-andela-dark mb-3">Scalable Solutions</h3>
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
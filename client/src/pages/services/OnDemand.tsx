
import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Calendar, CheckCircle, ArrowLeft
} from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Container from '@/components/ui/container';
import { useMobile } from '@/hooks/use-mobile';

const OnDemand = () => {
  const isMobile = useMobile();
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const service = {
    title: 'On-Demand',
    description: 'Flexible recruitment solutions that scale with your immediate business requirements.',
    extendedDescription: 'Our On-Demand recruitment service provides flexible talent acquisition support precisely when you need it. Perfect for project-based hiring, seasonal demands, or unexpected growth, this adaptable solution scales to meet your changing recruitment requirements without long-term commitments.',
    icon: <Calendar className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100',
    processSteps: [
      { title: 'Rapid Assessment', description: 'Quick evaluation of immediate hiring needs' },
      { title: 'Resource Allocation', description: 'Dedicated recruiters assigned to your project' },
      { title: 'Accelerated Sourcing', description: 'Fast-track candidate identification' },
      { title: 'Seamless Handoff', description: 'Smooth transition to your internal HR team' }
    ],
    benefits: [
      'Pay only for the services you need',
      'Rapid ramp-up during peak hiring periods',
      'No long-term contractual obligations',
      'Expert support without overhead costs',
      'Specialized skills for niche positions',
      'Flexible engagement models'
    ],
    useCases: [
      {
        title: 'Seasonal Hiring Surge',
        description: 'Retail, hospitality, and other seasonal businesses use our On-Demand service to manage periodic hiring spikes without maintaining unnecessary year-round recruitment capacity.'
      },
      {
        title: 'Unexpected Talent Gaps',
        description: 'When key positions suddenly become vacant, our On-Demand solution provides immediate support to fill critical roles quickly without disrupting operations.'
      },
      {
        title: 'Project-Based Talent Needs',
        description: 'For special initiatives requiring temporary specialized skills, our service sources specific expertise efficiently and cost-effectively.'
      }
    ]
  };

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
      <div className={`${isAnnouncementVisible ? 'pt-28' : 'pt-20'} pb-20 transition-all duration-300`}>
        {/* Hero Section */}
        <section className={`py-16 ${service.bgColor}`}>
          <Container>
            <div className="flex flex-col gap-4">
              <Link 
                href="/services" 
                className="inline-flex items-center text-gray-600 hover:text-andela-green transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}>
                    {React.cloneElement(service.icon as React.ReactElement, { className: 'h-8 w-8' })}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-andela-dark mb-4">{service.title}</h1>
                  <p className="text-xl text-andela-gray mb-6">{service.description}</p>
                  <p className="text-andela-gray">{service.extendedDescription}</p>
                </div>
                
                <div className="w-full md:w-2/5 p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-andela-dark mb-4">Why Choose Our {service.title} Solution?</h3>
                  <ul className="space-y-3">
                    {service.benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link
                      href="/contact" 
                      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-md text-white font-medium transition-all bg-gradient-to-r ${service.color} hover:shadow-lg`}
                    >
                      Request a Consultation
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>
        
        {/* Process Section */}
        <section className="py-16 bg-white">
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-andela-dark mb-4">Our {service.title} Process</h2>
                <p className="text-andela-gray">A proven methodology to deliver exceptional results</p>
              </motion.div>
              
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[1.625rem] top-0 bottom-0 w-[2px] -z-10">
                  <div className="h-full bg-blue-200"></div>
                </div>
                
                {/* Process steps */}
                {service.processSteps.map((step, index) => (
                  <motion.div 
                    key={`step-${index}`}
                    variants={itemVariants}
                    className="flex items-start mb-8 last:mb-0"
                  >
                    <div className="flex-none mr-8">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-andela-dark mb-1">{step.title}</h3>
                      <p className="text-andela-gray">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
        
        {/* Use Cases Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-andela-dark mb-4">Ideal Use Cases</h2>
                <p className="text-andela-gray">When our {service.title} service delivers the most value</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.useCases.map((useCase, index) => (
                  <motion.div
                    key={`use-case-${index}`}
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">{useCase.title}</h3>
                    <p className="text-andela-gray">{useCase.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <Container>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-andela-dark mb-4">Key Benefits</h2>
                <p className="text-andela-gray">How our {service.title} service transforms your talent acquisition</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {service.benefits.map((benefit, index) => (
                  <motion.div
                    key={`benefit-${index}`}
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 mr-3 mt-1 w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="text-andela-gray">{benefit}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
        
        {/* CTA Section */}
        <section className={`py-16 ${service.bgColor}`}>
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-andela-dark mb-4">Ready to transform your recruitment process?</h2>
              <p className="text-xl text-andela-gray mb-8">
                Let's discuss how our {service.title} service can help you achieve your talent acquisition goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className={`py-3 px-8 rounded-md text-white font-medium transition-colors bg-gradient-to-r ${service.color} hover:shadow-lg`}
                >
                  Schedule a Consultation
                </Link>
                <Link
                  href="/case-studies"
                  className="py-3 px-8 rounded-md bg-white text-andela-dark font-medium border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  View Success Stories
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default OnDemand;


import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle, ArrowLeft
} from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Container from '@/components/ui/container';
import { useMobile } from '@/hooks/use-mobile';

const FullRPO = () => {
  const isMobile = useMobile();
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const service = {
    title: 'Full RPO',
    description: 'End-to-end recruitment process outsourcing for comprehensive talent acquisition needs.',
    extendedDescription: 'Our Full RPO service delivers a complete recruitment solution, managing the entire hiring process from sourcing to onboarding. We integrate with your HR team to create a seamless talent pipeline that aligns with your organizational goals and company culture.',
    icon: <Users className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    processSteps: [
      { title: 'Needs Analysis', description: 'In-depth assessment of your hiring requirements' },
      { title: 'Strategy Development', description: 'Custom recruitment approach aligned with your goals' },
      { title: 'Talent Sourcing', description: 'Extensive candidate search and engagement' },
      { title: 'Selection & Hiring', description: 'Thorough screening and onboarding support' }
    ],
    benefits: [
      'Reduced time-to-hire by up to 40%',
      'Cost savings on recruitment operations',
      'Improved candidate quality and retention',
      'Enhanced employer branding',
      'Scalable recruitment capacity',
      'Access to specialized industry expertise'
    ],
    useCases: [
      {
        title: 'High-volume Recruitment Drive',
        description: 'When launching a new facility or expanding operations rapidly, our Full RPO solution provides the scale and efficiency needed to fill multiple positions simultaneously.'
      },
      {
        title: 'Recruitment Process Transformation',
        description: 'Organizations seeking to modernize and optimize their talent acquisition approach benefit from our comprehensive analysis and implementation of best practices.'
      },
      {
        title: 'Strategic Workforce Planning',
        description: 'For companies planning long-term growth, our Full RPO service aligns recruitment activities with business goals and future talent requirements.'
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
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-purple-500" />
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
                  <div className="h-full bg-purple-200"></div>
                </div>
                
                {/* Process steps */}
                {service.processSteps.map((step, index) => (
                  <motion.div 
                    key={`step-${index}`}
                    variants={itemVariants}
                    className="flex items-start mb-8 last:mb-0"
                  >
                    <div className="flex-none mr-8">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white font-bold text-xl">
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
                    <h3 className="text-xl font-semibold mb-3 text-purple-600">{useCase.title}</h3>
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
                    <div className="flex-shrink-0 mr-3 mt-1 w-6 h-6 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
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

export default FullRPO;

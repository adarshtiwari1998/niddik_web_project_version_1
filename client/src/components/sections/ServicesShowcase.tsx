import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, Calendar, Briefcase, PieChart } from 'lucide-react';
import Container from '@/components/ui/container';

// Define service item structure
interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ServicesShowcase = () => {
  const [activeService, setActiveService] = useState<number>(1);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Define services
  const services: ServiceItem[] = [
    {
      id: 1,
      title: 'Full RPO',
      description: 'End-to-end recruitment process outsourcing for comprehensive talent acquisition needs.',
      icon: <Users className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 2,
      title: 'On-Demand',
      description: 'Flexible recruitment solutions that scale with your immediate business requirements.',
      icon: <Calendar className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      title: 'Hybrid RPO',
      description: 'Customized combination of in-house and outsourced recruitment processes for optimal results.',
      icon: <PieChart className="h-6 w-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      title: 'Contingent',
      description: 'Specialized talent acquisition for contract, temporary, and project-based positions.',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600'
    }
  ];

  // Auto-rotate services every 4 seconds when not hovering
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRotate && !isHovering) {
      intervalId = setInterval(() => {
        setActiveService(prev => (prev % services.length) + 1);
      }, 4000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRotate, isHovering, services.length]);

  // Stop auto-rotation after a minute
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAutoRotate(false);
    }, 60000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const getServiceById = (id: number) => services.find(service => service.id === id);
  const activeServiceData = getServiceById(activeService);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="py-20 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Decorative blobs as background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-andela-green opacity-5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <Container>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-andela-green/10 text-andela-green px-4 py-1.5 rounded-full text-sm font-medium mb-3 inline-block">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-andela-dark mb-4">
            Tailored Recruitment Solutions
          </h2>
          <p className="text-andela-gray max-w-3xl mx-auto text-lg">
            Discover our specialized services designed to meet your unique talent acquisition needs and business goals.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative">
          {/* Central Image with Orbital Animation */}
          <motion.div 
            className="relative order-1 lg:order-2 lg:w-1/3 aspect-square flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Center circle with gradient */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-andela-green to-blue-600 flex items-center justify-center shadow-lg relative z-10">
              <div className="w-44 h-44 md:w-60 md:h-60 rounded-full bg-white flex items-center justify-center">
                <img 
                  src="/images/services-icon.svg" 
                  alt="NIIDIK Services" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
              </div>
            </div>

            {/* Orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-full animate-spin-slow"></div>
              <div className="absolute w-[110%] h-[110%] border-2 border-dashed border-gray-200 rounded-full animate-spin-slower"></div>
            </div>

            {/* Service dots in orbit */}
            {services.map((service, index) => {
              const angle = (index * (360 / services.length) * Math.PI) / 180;
              const radius = 140; // Adjust based on your design
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              
              return (
                <motion.div
                  key={service.id}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer z-20
                    ${service.id === activeService ? 'bg-gradient-to-r ' + service.color : 'bg-white'}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setActiveService(service.id)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  animate={{ 
                    scale: service.id === activeService ? [1, 1.1, 1] : 1,
                    boxShadow: service.id === activeService ? 
                      '0 0 25px rgba(0, 200, 83, 0.5)' : 
                      '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ 
                    scale: { 
                      repeat: service.id === activeService ? Infinity : 0, 
                      duration: 2 
                    } 
                  }}
                >
                  <div className={`${service.id === activeService ? 'text-white' : 'text-gray-700'}`}>
                    {service.icon}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Service details panel */}
          <motion.div 
            className="order-2 lg:order-1 lg:w-1/3 bg-white p-8 rounded-xl shadow-lg"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <motion.div variants={itemVariants} className="mb-2">
                  <div className={`inline-block p-3 rounded-full bg-gradient-to-r ${activeServiceData?.color}`}>
                    <div className="text-white">
                      {activeServiceData?.icon}
                    </div>
                  </div>
                </motion.div>
                <motion.h3 
                  variants={itemVariants}
                  className="text-2xl font-bold text-andela-dark mb-4"
                >
                  {activeServiceData?.title}
                </motion.h3>
                <motion.p 
                  variants={itemVariants}
                  className="text-andela-gray mb-6"
                >
                  {activeServiceData?.description}
                </motion.p>
                <motion.button 
                  variants={itemVariants}
                  className="flex items-center font-medium text-andela-green hover:text-andela-green/80 transition-colors"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Service selector (visible on mobile, hidden on desktop) */}
          <div className="order-3 lg:hidden flex gap-2 mt-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`w-3 h-3 rounded-full ${
                  service.id === activeService
                    ? 'bg-andela-green'
                    : 'bg-gray-300'
                }`}
                aria-label={`View ${service.title}`}
              />
            ))}
          </div>

          {/* Services list (visible on desktop, hidden on mobile) */}
          <motion.div 
            className="order-3 lg:order-3 lg:w-1/3 hidden lg:block"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    service.id === activeService
                      ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                      : 'bg-white shadow hover:shadow-md'
                  }`}
                  onClick={() => setActiveService(service.id)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 ${service.id === activeService ? 'text-white' : service.color.split(' ')[1]}`}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${service.id === activeService ? 'text-white' : 'text-andela-dark'}`}>
                        {service.title}
                      </h3>
                      {service.id === activeService && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm mt-2"
                        >
                          {service.description}
                        </motion.p>
                      )}
                    </div>
                    {service.id === activeService && (
                      <ChevronRight className="ml-auto h-5 w-5 text-white" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Animations are defined in index.css */}
    </section>
  );
};

export default ServicesShowcase;
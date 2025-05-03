import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, Calendar, Briefcase, PieChart, 
  Search, FileSpreadsheet, UserCheck, UserPlus, 
  ZoomIn, UsersRound, Zap, Hand, 
  BarChartBig, Database, Network, BarChart4,
  ClipboardList, Blocks, HeartHandshake, LineChart
} from 'lucide-react';
import Container from '@/components/ui/container';

// Define service item structure
interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const ServicesShowcase = () => {
  const [activeService, setActiveService] = useState<number>(1);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [forceRender, setForceRender] = useState<number>(0);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  // Define service process steps for each service
  interface ProcessStep {
    title: string;
    description: string;
  }

  // Define services with expanded descriptions and process steps
  interface ServiceItem {
    id: number;
    title: string;
    description: string;
    extendedDescription: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    processSteps: ProcessStep[];
  }

  const services: ServiceItem[] = [
    {
      id: 1,
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
      ]
    },
    {
      id: 2,
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
      ]
    },
    {
      id: 3,
      title: 'Hybrid RPO',
      description: 'Customized combination of in-house and outsourced recruitment processes for optimal results.',
      extendedDescription: 'Our Hybrid RPO solution combines the best aspects of internal recruitment with our specialized expertise. This collaborative approach allows you to maintain control over key hiring decisions while leveraging our resources and technology to enhance efficiency and improve candidate quality.',
      icon: <PieChart className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      processSteps: [
        { title: 'Process Mapping', description: 'Identifying optimal division of responsibilities' },
        { title: 'Integration Planning', description: 'Seamless connection with your HR systems' },
        { title: 'Collaborative Execution', description: 'Joint implementation of recruitment strategy' },
        { title: 'Continuous Optimization', description: 'Ongoing refinement of the hybrid approach' }
      ]
    },
    {
      id: 4,
      title: 'Contingent',
      description: 'Specialized talent acquisition for contract, temporary, and project-based positions.',
      extendedDescription: 'Our Contingent staffing service specializes in connecting you with qualified professionals for temporary, contract, and project-based roles. We handle the entire process from identifying specialized talent to managing contracts, ensuring you have the right expertise exactly when your business needs it.',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-100',
      processSteps: [
        { title: 'Requirement Definition', description: 'Precise specification of temporary talent needs' },
        { title: 'Specialized Sourcing', description: 'Targeting candidates with niche expertise' },
        { title: 'Compliance Management', description: 'Handling contracts and legal requirements' },
        { title: 'Performance Monitoring', description: 'Ensuring successful project completion' }
      ]
    }
  ];

  // Force a render to make sure the UI updates when service changes
  const handleServiceChange = useCallback((id: number) => {
    setActiveService(id);
    setForceRender(prev => prev + 1);
    
    // If we're on mobile, scroll to the left panel
    if (window.innerWidth < 1024 && leftPanelRef.current) {
      leftPanelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Auto-rotate services every 4 seconds when not hovering
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRotate && !isHovering) {
      intervalId = setInterval(() => {
        setActiveService(prev => {
          const newService = (prev % services.length) + 1;
          setForceRender(r => r + 1);
          return newService;
        });
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

  const getServiceById = (id: number) => services.find(service => service.id === id) || services[0];
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
      
      {/* Animated floating elements in background */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-12 h-12 bg-purple-500 opacity-20 rounded-lg"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/3 right-1/4 w-8 h-8 bg-blue-500 opacity-20 rounded-full"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -20, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-green-500 opacity-20 rounded-md rotate-45"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [45, 90, 45]
        }}
        transition={{ 
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-amber-500 opacity-20 rounded-lg"
        animate={{ 
          y: [0, 25, 0],
          x: [0, 15, 0],
          rotate: [0, -30, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
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
            {/* Center circle with gradient that changes color based on active service */}
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br ${activeServiceData.color} flex items-center justify-center shadow-lg relative z-10 transition-all duration-500`}>
              <div className="w-44 h-44 md:w-60 md:h-60 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                {/* Dynamic background texture based on service */}
                <div className="absolute inset-0 opacity-5">
                  {activeServiceData.id === 1 && (
                    <div className="service-texture-grid w-full h-full"></div>
                  )}
                  {activeServiceData.id === 2 && (
                    <div className="service-texture-dots w-full h-full"></div>
                  )}
                  {activeServiceData.id === 3 && (
                    <div className="service-texture-waves w-full h-full"></div>
                  )}
                  {activeServiceData.id === 4 && (
                    <div className="service-texture-lines w-full h-full"></div>
                  )}
                </div>
                
                {/* Central content with service icon and NIIDIK logo */}
                <motion.div 
                  key={`center-icon-${activeService}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center z-10"
                >
                  <div className={`p-4 rounded-full ${activeServiceData.bgColor} mb-3 flex items-center justify-center`}>
                    <div className={`h-12 w-12 ${activeServiceData.color.includes('purple') ? 'text-purple-600' : 
                      activeServiceData.color.includes('blue') ? 'text-blue-600' : 
                      activeServiceData.color.includes('green') ? 'text-green-600' : 
                      'text-amber-600'}`
                    }>
                      {activeServiceData.icon}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-andela-dark">
                    {activeServiceData.title}
                  </div>
                </motion.div>
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
                  onClick={() => handleServiceChange(service.id)}
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
            ref={leftPanelRef}
            className="order-2 lg:order-1 lg:w-1/3 bg-white p-8 rounded-xl shadow-lg"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            // This will ensure the panel stays visible regardless of scroll position
            key={`panel-${activeService}-${forceRender}`}
          >
            <div className="h-full">
              <div className="mb-2">
                <div className={`inline-block p-3 rounded-full bg-gradient-to-r ${activeServiceData.color}`}>
                  <div className="text-white">
                    {activeServiceData.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-andela-dark mb-4">
                {activeServiceData.title}
              </h3>
              <div className="text-andela-gray mb-6">
                <p>{activeServiceData.extendedDescription}</p>
              </div>
              
              {/* Process visualization */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-andela-dark mb-4">Our Process</h4>
                
                {/* Visual process flow with animated stages - HORIZONTAL DIRECTION */}
                <div className={`relative p-8 pt-6 pb-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-100`}>
                  {activeServiceData.processSteps.map((step, index) => {
                    // Determine icon based on service type and step index
                    let StepIcon;
                    if (activeServiceData.id === 1) { // Full RPO
                      StepIcon = index === 0 ? Search : 
                                index === 1 ? FileSpreadsheet : 
                                index === 2 ? UsersRound : UserCheck;
                    } else if (activeServiceData.id === 2) { // On-Demand
                      StepIcon = index === 0 ? ZoomIn : 
                                index === 1 ? Blocks : 
                                index === 2 ? Zap : HeartHandshake;
                    } else if (activeServiceData.id === 3) { // Hybrid RPO
                      StepIcon = index === 0 ? BarChart4 : 
                                index === 1 ? Database : 
                                index === 2 ? Network : LineChart;
                    } else {
                      StepIcon = index === 0 ? ClipboardList : 
                                index === 1 ? Search : 
                                index === 2 ? Briefcase : LineChart;
                    }
                    
                    // Calculate delay for sequential highlighting
                    const sequenceDelay = index * 2.5;
                    
                    return (
                      <div key={`process-row-${index}`} className={`flex items-center mb-6 ${index < activeServiceData.processSteps.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                        <div className="flex-none mr-4">
                          {/* Step number with large numbering */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activeServiceData.color.includes('purple') ? 'bg-purple-500' : 
                              activeServiceData.color.includes('blue') ? 'bg-blue-500' : 
                              activeServiceData.color.includes('green') ? 'bg-green-500' : 
                              'bg-amber-500'
                            } text-white font-bold text-xl`}>
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          {/* Step title */}
                          <h5 className="font-semibold text-andela-dark mb-1">{step.title}</h5>
                          <p className="text-sm text-andela-gray leading-relaxed pr-4">{step.description}</p>
                        </div>
                        
                        <div className="flex-none ml-6">
                          {/* Icon box */}
                          <motion.div 
                            className={`w-16 h-16 rounded-lg flex items-center justify-center bg-white
                              ${index === 0 ? 'rounded-tl-2xl' : 
                                index === 1 ? 'rounded-tr-2xl' : 
                                index === 2 ? 'rounded-bl-2xl' : 'rounded-br-2xl'} 
                              border-2 relative overflow-hidden
                              ${
                                activeServiceData.color.includes('purple') ? 'border-purple-400' : 
                                activeServiceData.color.includes('blue') ? 'border-blue-400' : 
                                activeServiceData.color.includes('green') ? 'border-green-400' : 
                                'border-amber-400'
                              }`}
                            // Sequential highlight animation
                            animate={{ 
                              scale: [1, 1.08, 1],
                              borderWidth: ['2px', '3px', '2px']
                            }}
                            transition={{ 
                              duration: 1.5,
                              delay: sequenceDelay, 
                              repeat: Infinity,
                              repeatDelay: 8.5
                            }}
                          >
                            {/* Background pulse effect */}
                            <motion.div 
                              className={`absolute inset-0 opacity-10 bg-gradient-to-br ${activeServiceData.color}`}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.3, 0.1]
                              }}
                              transition={{ 
                                duration: 1.5,
                                delay: sequenceDelay, 
                                repeat: Infinity,
                                repeatDelay: 8.5 
                              }}
                            />
                            
                            {/* Custom icon for each step */}
                            <div className={`relative z-10 ${
                              activeServiceData.color.includes('purple') ? 'text-purple-600' : 
                              activeServiceData.color.includes('blue') ? 'text-blue-600' : 
                              activeServiceData.color.includes('green') ? 'text-green-600' : 
                              'text-amber-600'
                            }`}>
                              <StepIcon className="h-8 w-8" />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Vertical timeline indicator - positioned behind the numbers */}
                  <div className="absolute left-[1.625rem] top-8 bottom-8 w-[2px] -z-10">
                    <div className={`h-full ${
                      activeServiceData.color.includes('purple') ? 'bg-purple-200' : 
                      activeServiceData.color.includes('blue') ? 'bg-blue-200' : 
                      activeServiceData.color.includes('green') ? 'bg-green-200' : 
                      'bg-amber-200'
                    }`}>
                      {/* Animated progress indicator */}
                      <motion.div 
                        className={`w-full ${
                          activeServiceData.color.includes('purple') ? 'bg-purple-500' : 
                          activeServiceData.color.includes('blue') ? 'bg-blue-500' : 
                          activeServiceData.color.includes('green') ? 'bg-green-500' : 
                          'bg-amber-500'
                        }`}
                        animate={{ 
                          height: ["0%", "33%", "33%", "66%", "66%", "100%", "100%", "0%"]
                        }}
                        transition={{ 
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.a
                href={`/services/${
                  activeService === 1 ? 'full-rpo' : 
                  activeService === 2 ? 'on-demand' : 
                  activeService === 3 ? 'hybrid-rpo' : 
                  'contingent'
                }`}
                className="flex items-center font-medium text-andela-green hover:text-andela-green/80 transition-colors cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </motion.a>
              
              <a href="/services" className="mt-2 text-sm text-gray-500 hover:text-andela-green transition-colors">
                View all services
              </a>
            </div>
          </motion.div>

          {/* Service selector (visible on mobile, hidden on desktop) */}
          <div className="order-3 lg:hidden flex gap-2 mt-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
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
                  onClick={() => handleServiceChange(service.id)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 mr-4 ${service.id === activeService ? 'text-white' : service.color.split(" ")[0].replace("from", "text")}`}>
                      {service.icon}
                    </div>
                    <div className="flex-grow min-w-0">
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
                      <a 
                        href={`/services/${
                          service.id === 1 ? 'full-rpo' : 
                          service.id === 2 ? 'on-demand' : 
                          service.id === 3 ? 'hybrid-rpo' : 
                          'contingent'
                        }`} 
                        className="ml-auto flex-shrink-0"
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </a>
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
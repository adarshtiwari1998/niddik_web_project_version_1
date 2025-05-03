import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, PieChart, Briefcase,
  ArrowLeft, CheckCircle, ChevronRight
} from 'lucide-react';
import Container from '@/components/ui/container';

// Import components as needed
import { Separator } from '@/components/ui/separator';
import { useMobile } from '@/hooks/use-mobile';

// Define service interfaces
interface ProcessStep {
  title: string;
  description: string;
}

interface ServiceData {
  id: number;
  title: string;
  description: string;
  extendedDescription: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  processSteps: ProcessStep[];
  benefits: string[];
  useCases: {title: string; description: string}[];
}

const services: ServiceData[] = [
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
    ],
    benefits: [
      'Maintain control over strategic hiring decisions',
      'Supplement internal capacity with expert resources',
      'Access advanced recruitment technologies',
      'Improve consistency and compliance',
      'Blend cultural knowledge with external objectivity',
      'Optimize recruitment budget allocation'
    ],
    useCases: [
      {
        title: 'Department-Specific Recruitment',
        description: 'Organizations that want to maintain internal recruiting for some divisions while outsourcing others benefit from our flexible hybrid approach.'
      },
      {
        title: 'Recruitment Function Transformation',
        description: 'Companies transitioning their talent acquisition strategy can use our Hybrid RPO to gradually shift responsibilities while maintaining business continuity.'
      },
      {
        title: 'Global Expansion Support',
        description: 'Businesses entering new markets leverage our local expertise while maintaining central control over key hiring decisions and employer branding.'
      }
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
    ],
    benefits: [
      'Access to specialized skills for limited durations',
      'Reduced administrative and compliance burden',
      'Flexibility to scale workforce with demand',
      'Lower long-term employment costs',
      'Rapid deployment of qualified professionals',
      'Risk mitigation through proper contractor management'
    ],
    useCases: [
      {
        title: 'Project-Based Initiatives',
        description: 'When implementing new systems or launching special projects, our Contingent service provides skilled professionals for the exact duration needed.'
      },
      {
        title: 'Interim Leadership',
        description: 'During transitions or unexpected departures, our service can quickly source experienced executives and managers to maintain operational continuity.'
      },
      {
        title: 'Specialized Technical Expertise',
        description: 'For organizations requiring niche technical skills for limited periods, our Contingent solution provides access to rare talent without permanent hiring commitments.'
      }
    ]
  }
];

const ServiceDetail = () => {
  const isMobile = useMobile();
  const [, params] = useRoute('/services/:serviceSlug');
  const [service, setService] = useState<ServiceData | null>(null);

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

  useEffect(() => {
    if (params?.serviceSlug) {
      // Parse the service slug to determine which service to show
      const serviceId = getServiceIdFromSlug(params.serviceSlug);
      const serviceData = services.find(s => s.id === serviceId);
      
      if (serviceData) {
        setService(serviceData);
        // Scroll to top when service changes
        window.scrollTo(0, 0);
      }
    }
  }, [params]);

  const getServiceIdFromSlug = (slug: string): number => {
    switch (slug) {
      case 'full-rpo':
        return 1;
      case 'on-demand':
        return 2;
      case 'hybrid-rpo':
        return 3;
      case 'contingent':
        return 4;
      default:
        return 1;
    }
  };

  if (!service) {
    return <div className="pt-40 text-center">Loading service details...</div>;
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className={`py-16 ${service.bgColor}`}>
        <Container>
          <div className="flex flex-col gap-4">
            <a 
              href="/#services" 
              className="inline-flex items-center text-gray-600 hover:text-andela-green transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </a>
            
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
                      <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${
                        service.color.includes('purple') ? 'text-purple-500' : 
                        service.color.includes('blue') ? 'text-blue-500' : 
                        service.color.includes('green') ? 'text-green-500' : 
                        'text-amber-500'
                      }`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <a 
                    href="/contact" 
                    className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-md text-white font-medium transition-all bg-gradient-to-r ${service.color} hover:shadow-lg`}
                  >
                    Request a Consultation
                  </a>
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
                <div className={`h-full ${
                  service.color.includes('purple') ? 'bg-purple-200' : 
                  service.color.includes('blue') ? 'bg-blue-200' : 
                  service.color.includes('green') ? 'bg-green-200' : 
                  'bg-amber-200'
                }`}></div>
              </div>
              
              {/* Process steps */}
              {service.processSteps.map((step, index) => (
                <motion.div 
                  key={`step-${index}`}
                  variants={itemVariants}
                  className="flex items-start mb-8 last:mb-0"
                >
                  <div className="flex-none mr-8">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        service.color.includes('purple') ? 'bg-purple-500' : 
                        service.color.includes('blue') ? 'bg-blue-500' : 
                        service.color.includes('green') ? 'bg-green-500' : 
                        'bg-amber-500'
                      } text-white font-bold text-xl`}>
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
                  <h3 className={`text-xl font-semibold mb-3 ${
                    service.color.includes('purple') ? 'text-purple-600' : 
                    service.color.includes('blue') ? 'text-blue-600' : 
                    service.color.includes('green') ? 'text-green-600' : 
                    'text-amber-600'
                  }`}>{useCase.title}</h3>
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
                  <div className={`flex-shrink-0 mr-3 mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    service.color.includes('purple') ? 'bg-purple-100 text-purple-600' : 
                    service.color.includes('blue') ? 'bg-blue-100 text-blue-600' : 
                    service.color.includes('green') ? 'bg-green-100 text-green-600' : 
                    'bg-amber-100 text-amber-600'
                  }`}>
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
              <a 
                href="/contact"
                className={`py-3 px-8 rounded-md text-white font-medium transition-colors bg-gradient-to-r ${service.color} hover:shadow-lg`}
              >
                Schedule a Consultation
              </a>
              <a 
                href="/case-studies"
                className="py-3 px-8 rounded-md bg-white text-andela-dark font-medium border border-gray-200 hover:border-gray-300 transition-colors"
              >
                View Success Stories
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ServiceDetail;
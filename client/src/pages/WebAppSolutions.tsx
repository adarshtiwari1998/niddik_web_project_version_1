import React from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Server, 
  Globe, 
  Users, 
  Zap, 
  Database, 
  LineChart, 
  PenTool, 
  ArrowRight,
  Monitor,
  ShoppingCart,
  Briefcase,
  Home,
  Newspaper,
  Layout,
  Share2,
  Shield,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Link } from "wouter";

const WebAppSolutions = () => {
  const webAppTypes = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-blue-500" />,
      title: "E-commerce Websites",
      description: "Fully-featured online stores with secure payments, inventory management, and customer analytics.",
      features: [
        "Product catalog and inventory management",
        "Secure payment processing",
        "Customer accounts and wish lists",
        "Order tracking and fulfillment",
        "Mobile-responsive design"
      ]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-indigo-500" />,
      title: "Business & Corporate Sites",
      description: "Professional websites that showcase your brand, services, and establish credibility with potential clients.",
      features: [
        "Brand-aligned design",
        "Service and product showcase",
        "Team and company profiles",
        "Testimonials and case studies",
        "Contact forms and lead generation"
      ]
    },
    {
      icon: <Monitor className="h-8 w-8 text-green-500" />,
      title: "Web Applications",
      description: "Interactive, data-driven applications that provide specific functionality and solve business problems.",
      features: [
        "User authentication and accounts",
        "Real-time data processing",
        "Custom dashboards and reporting",
        "API integrations",
        "Database-driven functionality"
      ]
    },
    {
      icon: <Home className="h-8 w-8 text-amber-500" />,
      title: "Real Estate Platforms",
      description: "Property listing websites with search functionality, maps integration, and client management tools.",
      features: [
        "Property listings with advanced search",
        "Interactive maps and location data",
        "Image galleries and virtual tours",
        "Agent profiles and contact forms",
        "Client management systems"
      ]
    },
    {
      icon: <Newspaper className="h-8 w-8 text-red-500" />,
      title: "Content Management Systems",
      description: "Easily manageable websites that allow non-technical users to update content independently.",
      features: [
        "User-friendly content editor",
        "Image and media management",
        "Content scheduling and publishing",
        "User role management",
        "SEO tools and optimization"
      ]
    },
    {
      icon: <Share2 className="h-8 w-8 text-purple-500" />,
      title: "Social Networks & Communities",
      description: "Interactive platforms that enable user connections, content sharing, and community building.",
      features: [
        "User profiles and connections",
        "Content creation and sharing",
        "Messaging and notifications",
        "Groups and forums",
        "Content moderation tools"
      ]
    }
  ];

  const technologies = [
    {
      category: "Frontend",
      items: [
        { name: "React.js", description: "A JavaScript library for building user interfaces" },
        { name: "Next.js", description: "React framework for production with server-side rendering" },
        { name: "Angular", description: "Platform for building mobile and desktop web applications" },
        { name: "Vue.js", description: "Progressive JavaScript framework for building UIs" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid UI development" }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", description: "JavaScript runtime built on Chrome's V8 engine" },
        { name: "Express", description: "Fast, unopinionated, minimalist web framework for Node.js" },
        { name: "Django", description: "High-level Python web framework" },
        { name: "Ruby on Rails", description: "Server-side web application framework written in Ruby" },
        { name: "Laravel", description: "PHP web application framework with elegant syntax" }
      ]
    },
    {
      category: "Databases",
      items: [
        { name: "MongoDB", description: "Cross-platform document-oriented NoSQL database" },
        { name: "PostgreSQL", description: "Powerful, open source object-relational database system" },
        { name: "MySQL", description: "Open-source relational database management system" },
        { name: "Redis", description: "In-memory data structure store used as database, cache, and message broker" },
        { name: "Firebase", description: "Google's platform for mobile and web applications development" }
      ]
    }
  ];

  const services = [
    {
      icon: <Layout className="h-10 w-10 text-blue-500" />,
      title: "Custom Web Design",
      description: "Bespoke designs tailored to your brand identity and business goals, creating a unique online presence that stands out from competitors."
    },
    {
      icon: <Code className="h-10 w-10 text-indigo-500" />,
      title: "Frontend Development",
      description: "Expert creation of responsive, intuitive, and engaging user interfaces using the latest frontend technologies and best practices."
    },
    {
      icon: <Server className="h-10 w-10 text-green-500" />,
      title: "Backend Development",
      description: "Robust server-side solutions with scalable architecture, efficient data processing, and secure API integrations."
    },
    {
      icon: <Database className="h-10 w-10 text-amber-500" />,
      title: "Database Design",
      description: "Optimized database architecture for efficient data storage, retrieval, and management, supporting your application's specific needs."
    },
    {
      icon: <PenTool className="h-10 w-10 text-red-500" />,
      title: "UX/UI Design",
      description: "User-centered design approach focusing on intuitive navigation, visual hierarchy, and seamless interactions across all devices."
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      title: "Security Implementation",
      description: "Comprehensive security measures including user authentication, data encryption, vulnerability testing, and compliance with regulations."
    },
    {
      icon: <Zap className="h-10 w-10 text-teal-500" />,
      title: "Performance Optimization",
      description: "Enhancing website speed and performance through code optimization, caching strategies, and efficient resource management."
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-pink-500" />,
      title: "Maintenance & Support",
      description: "Ongoing technical support, regular updates, security patches, and feature enhancements to keep your website running optimally."
    }
  ];

  const faq = [
    {
      question: "How long does it take to develop a web application?",
      answer: "Development timelines vary based on complexity, features, and scope. Simple websites can take 4-8 weeks, while complex web applications may require 3-6 months or more. During our initial consultation, we'll provide a more accurate timeline based on your specific requirements."
    },
    {
      question: "What is your web development process?",
      answer: "Our process includes: 1) Discovery and requirements gathering, 2) Planning and architecture, 3) UI/UX design, 4) Development, 5) Testing and quality assurance, 6) Deployment, and 7) Post-launch support and maintenance. We use agile methodologies to ensure regular communication and iterative improvements throughout the development lifecycle."
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes, we offer various maintenance and support packages to ensure your web application remains secure, up-to-date, and functioning optimally. Our support services include security updates, bug fixes, performance monitoring, content updates, and feature enhancements."
    },
    {
      question: "Will my website be mobile-friendly?",
      answer: "Absolutely! All our web applications are built with a mobile-first approach, ensuring they work perfectly across all devices and screen sizes. We use responsive design techniques and thoroughly test on multiple devices to guarantee a seamless experience for all users."
    },
    {
      question: "What technologies do you use for web development?",
      answer: "We specialize in modern web technologies including React, Angular, Node.js, Express, MongoDB, PostgreSQL, and more. We select the technology stack based on your specific requirements, ensuring the best fit for your project's needs, performance expectations, and long-term maintenance."
    }
  ];

  return (
    <div className="pt-10">
      <AnnouncementBar 
        text="Transform your digital presence with our custom web application development services."
        linkText="Get a free consultation"
        linkUrl="#"
        bgColor="bg-blue-600"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        {/* Background elements */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-50 opacity-50"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 rounded-full opacity-80"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                  Web Applications
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-andela-dark leading-tight">
                Custom <span className="text-blue-600">Web Application</span> Development
              </h1>
              <p className="text-lg text-andela-gray mb-8 max-w-lg">
                From concept to deployment, we build scalable, intuitive, and high-performance web applications that solve real business challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-lg"
                >
                  Discuss Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="#services"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Explore Our Services
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="w-full h-auto rounded-xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80" 
                  alt="Web application development" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-blue-100 rounded-lg transform rotate-6 z-0"></div>
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-blue-200 rounded-lg transform -rotate-6 z-0"></div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Web Application Types */}
      <section id="app-types" className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                Solutions
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Types of Web Applications We Build</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              We develop a wide range of web applications tailored to diverse business needs and industries.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webAppTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-andela-dark">{type.title}</h3>
                <p className="text-andela-gray mb-6">{type.description}</p>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Key Features:</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-andela-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Our Services */}
      <section id="services" className="py-20 bg-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-blue-200 rounded-full text-blue-700 text-sm font-medium">
                What We Offer
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Our Web Development Services</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              We provide end-to-end web application development services tailored to your business requirements.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-andela-dark">{service.title}</h3>
                <p className="text-andela-gray">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Technologies */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                Tech Stack
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Technologies We Use</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              We leverage modern technologies to build scalable, secure, and high-performance web applications.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-andela-dark">{tech.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tech.items.map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h4 className="text-lg font-bold text-blue-600 mb-1">{item.name}</h4>
                      <p className="text-andela-gray text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Process */}
      <section className="py-20 bg-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-blue-200 rounded-full text-blue-700 text-sm font-medium">
                Our Approach
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Development Process</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              Our systematic approach ensures we deliver high-quality web applications on time and within budget.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-blue-200 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                { number: 1, title: "Discovery", description: "We work closely with you to understand your business needs, user expectations, and project requirements." },
                { number: 2, title: "Planning", description: "We create a detailed project plan, define deliverables, and establish project milestones and timelines." },
                { number: 3, title: "Design", description: "Our designers create intuitive user interfaces and experiences that align with your brand and user needs." },
                { number: 4, title: "Development", description: "Our developers build your web application using the most appropriate technologies and best practices." },
                { number: 5, title: "Testing", description: "We conduct rigorous testing to ensure your application is bug-free, secure, and performs optimally." },
                { number: 6, title: "Deployment", description: "We deploy your application to production and ensure a smooth transition with minimal downtime." },
                { number: 7, title: "Support", description: "We provide ongoing maintenance and support to keep your application running smoothly." }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 relative`}
                >
                  <div className="md:w-1/2 flex md:block">
                    {/* Numbered circle on the timeline */}
                    <div className={`w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl z-10 flex-shrink-0 ${
                      index % 2 === 0 ? 'md:ml-auto md:mr-8' : 'md:ml-8'
                    }`}>
                      {step.number}
                    </div>
                    
                    <div className="block md:hidden ml-6 flex-grow">
                      <h3 className="text-xl font-bold mb-2 text-andela-dark pt-2">{step.title}</h3>
                      <p className="text-andela-gray">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-3 text-andela-dark">{step.title}</h3>
                    <p className="text-andela-gray">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      {/* FAQ */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-blue-100 rounded-full text-blue-600 text-sm font-medium">
                Common Questions
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Frequently Asked Questions</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              Get answers to common questions about our web application development services.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faq.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-3 text-andela-dark">{item.question}</h3>
                  <p className="text-andela-gray">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <Container>
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-andela-dark">Ready to Build Your Web Application?</h2>
                <p className="text-lg text-andela-gray mb-6">
                  Let's discuss how our web development expertise can help bring your digital vision to life. Schedule a free consultation today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-lg"
                  >
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a 
                    href="tel:+1234567890" 
                    className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Call Us
                  </a>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <Code className="h-32 w-32 text-blue-600 opacity-20" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebAppSolutions;
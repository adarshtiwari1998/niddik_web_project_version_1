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
  ShieldCheck, 
  ArrowRight, 
  BrainCircuit, 
  Bot, 
  GitMerge,
  BarChart3,
  PenTool,
  Monitor,
  ShoppingCart,
  Building2,
  GraduationCap,
  HeartPulse,
  Store,
  BadgePercent,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Link } from "wouter";

const WebAppSolutions = () => {
  const webAppServices = [
    {
      icon: <Code className="h-8 w-8 text-andela-green" />,
      title: "Frontend Development",
      description: "Responsive and intuitive UI/UX with modern frameworks like React, Vue, and Angular.",
      tech: ["React", "Vue.js", "Angular", "TypeScript", "HTML5/CSS3"]
    },
    {
      icon: <Server className="h-8 w-8 text-purple-500" />,
      title: "Backend Development",
      description: "Scalable and secure server-side solutions with robust APIs and microservices architecture.",
      tech: ["Node.js", "Python", "Java", "C#", "Ruby on Rails"]
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      title: "Database Solutions",
      description: "Efficient data storage and retrieval systems optimized for performance and scalability.",
      tech: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL"]
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-500" />,
      title: "Full-Stack Applications",
      description: "End-to-end web application development with seamless integration between all components.",
      tech: ["MERN Stack", "LAMP Stack", "JAMstack", "Serverless", "Cloud-native"]
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-red-500" />,
      title: "Security Implementation",
      description: "Comprehensive security measures to protect data and ensure compliance with regulations.",
      tech: ["OAuth", "JWT", "HTTPS", "Data Encryption", "Security Audits"]
    },
    {
      icon: <LineChart className="h-8 w-8 text-amber-500" />,
      title: "Analytics Integration",
      description: "Data-driven insights through powerful analytics integration and visualization tools.",
      tech: ["Google Analytics", "Mixpanel", "D3.js", "Chart.js", "Kibana"]
    }
  ];

  // Case studies removed as requested

  const developmentProcess = [
    {
      number: 1,
      title: "Requirements Analysis",
      description: "We work closely with you to understand your business needs, user expectations, and technical requirements to define the scope and objectives of your web application."
    },
    {
      number: 2,
      title: "Design & Architecture",
      description: "Our team creates intuitive UI/UX designs and establishes a robust technical architecture to ensure your application is both user-friendly and technically sound."
    },
    {
      number: 3,
      title: "Development",
      description: "Using agile methodologies, we develop your web application with clean, maintainable code and regular iterative improvements based on continuous feedback."
    },
    {
      number: 4,
      title: "Testing & QA",
      description: "Rigorous testing across multiple devices and scenarios ensures your application is bug-free, secure, and delivers an optimal user experience."
    },
    {
      number: 5,
      title: "Deployment",
      description: "We handle the deployment process with zero-downtime strategies and implement CI/CD pipelines for smooth transitions to production environments."
    },
    {
      number: 6,
      title: "Maintenance & Support",
      description: "Our relationship continues after launch with proactive monitoring, regular updates, and responsive technical support to keep your application running flawlessly."
    }
  ];

  return (
    <div className="pt-10">
      <AnnouncementBar 
        text="Discover how our web development solutions can transform your business."
        linkText="Book a consultation"
        linkUrl="#"
        bgColor="bg-andela-green"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="absolute right-0 top-20 w-96 h-96 bg-andela-green/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        {/* Code-like decorative elements */}
        <div className="absolute top-40 left-10 text-4xl text-andela-green/10 font-mono hidden md:block">
          &lt;div&gt;
        </div>
        <div className="absolute top-60 left-20 text-3xl text-andela-green/10 font-mono hidden md:block">
          &lt;code&gt;
        </div>
        <div className="absolute bottom-40 right-10 text-4xl text-andela-green/10 font-mono hidden md:block">
          &lt;/div&gt;
        </div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 bg-andela-green/10 rounded-full text-andela-green text-sm font-medium">
                  Web Application Development
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-andela-dark leading-tight">
                Transforming Ideas into <span className="text-andela-green">Powerful Web Applications</span>
              </h1>
              <p className="text-lg text-andela-gray mb-8 max-w-lg">
                We build custom, scalable, and secure web applications that solve complex business challenges and deliver exceptional user experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-andela-green hover:bg-andela-green/90 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-lg"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="#services"
                  className="inline-flex items-center justify-center border-2 border-andela-green text-andela-green hover:bg-andela-green/5 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Explore Services
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Decorative code editor window */}
              <div className="w-full rounded-xl bg-gray-900 shadow-2xl overflow-hidden">
                <div className="h-10 bg-gray-800 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-gray-700 text-gray-300 text-xs font-mono">
                    app.js
                  </div>
                </div>
                <div className="p-6 text-left">
                  <pre className="text-gray-300 font-mono text-sm">
                    <code>
                      <span className="text-purple-400">import</span> <span className="text-yellow-400">React</span> <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;<br/>
                      <br/>
                      <span className="text-purple-400">function</span> <span className="text-blue-400">App</span>() {'{'}<br/>
                      {'  '}<span className="text-purple-400">return</span> (<br/>
                      {'    '}&lt;<span className="text-blue-400">div</span> <span className="text-yellow-400">className</span>=<span className="text-green-400">"app"</span>&gt;<br/>
                      {'      '}&lt;<span className="text-blue-400">h1</span>&gt;Welcome to Niddik Solutions&lt;/<span className="text-blue-400">h1</span>&gt;<br/>
                      {'      '}&lt;<span className="text-blue-400">p</span>&gt;Building the future with code&lt;/<span className="text-blue-400">p</span>&gt;<br/>
                      {'    '}&lt;/<span className="text-blue-400">div</span>&gt;<br/>
                      {'  '});<br/>
                      {'}'}<br/>
                      <br/>
                      <span className="text-purple-400">export</span> <span className="text-purple-400">default</span> <span className="text-blue-400">App</span>;
                    </code>
                  </pre>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-80 h-20 bg-gradient-to-r from-purple-500/20 to-andela-green/20 blur-2xl rounded-full"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-andela-green/10 rounded-full"></div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-andela-green/10 rounded-full text-andela-green text-sm font-medium">
                Our Expertise
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Web Development Services</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              From frontend interfaces to complex backend systems, we deliver end-to-end web solutions tailored to your unique business needs.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webAppServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-andela-dark">{service.title}</h3>
                <p className="text-andela-gray mb-6">{service.description}</p>
                <div>
                  <p className="text-sm font-medium text-andela-green mb-2">Technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tech.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-gray-50 text-andela-gray text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Types of Web Applications Section */}
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
              <div className="px-4 py-1 bg-andela-green/10 rounded-full text-andela-green text-sm font-medium">
                Web App Solutions
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Types of Web Applications We Build</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              We develop a wide range of web applications tailored to specific industries and business needs.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingCart className="h-8 w-8 text-pink-500" />,
                title: "E-commerce Platforms",
                description: "Custom online stores with inventory management, secure payments, and customer analytics.",
                features: ["Product catalogs", "Secure checkout", "Inventory management", "Customer accounts", "Analytics dashboard"]
              },
              {
                icon: <Building2 className="h-8 w-8 text-blue-500" />,
                title: "Business Applications",
                description: "Streamline operations with custom CRM, ERP, and project management solutions.",
                features: ["Customer relationship management", "Resource planning", "Task tracking", "Team collaboration", "Process automation"]
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-green-500" />,
                title: "Educational Platforms",
                description: "Learning management systems and educational platforms for schools and online courses.",
                features: ["Course management", "Student progress tracking", "Assessment tools", "Discussion forums", "Certificate generation"]
              },
              {
                icon: <HeartPulse className="h-8 w-8 text-red-500" />,
                title: "Healthcare Applications",
                description: "Secure, HIPAA-compliant solutions for patient management and telehealth services.",
                features: ["Patient records", "Appointment scheduling", "Telemedicine integration", "Prescription management", "Billing systems"]
              },
              {
                icon: <Store className="h-8 w-8 text-orange-500" />,
                title: "Marketplace Platforms",
                description: "Multi-vendor marketplaces connecting buyers and sellers with robust management tools.",
                features: ["Vendor management", "Product listings", "Reviews & ratings", "Payment processing", "Communications systems"]
              },
              {
                icon: <BadgePercent className="h-8 w-8 text-purple-500" />,
                title: "Fintech Applications",
                description: "Secure financial applications for payments, budgeting, and financial management.",
                features: ["Payment processing", "User authentication", "Transaction history", "Financial reporting", "Notification systems"]
              }
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                  {app.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-andela-dark">{app.title}</h3>
                <p className="text-andela-gray mb-6">{app.description}</p>
                
                <div>
                  <p className="text-sm font-medium text-andela-green mb-3">Key Features:</p>
                  <ul className="space-y-2">
                    {app.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-andela-green flex-shrink-0 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
      

      
      {/* Case Studies section has been removed as requested */}
      
      {/* Why Choose Us - Exactly as in the reference image */}
      <section className="py-20 bg-gradient-to-r from-andela-dark to-andela-dark/90 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-andela-green/20 rounded-full text-andela-green text-sm font-medium">
                Our Expertise
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Niddik for Web Development</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We combine technical expertise with business acumen to deliver web applications that exceed expectations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Users className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dedicated Team</h3>
              <p className="text-gray-300">
                We assign a dedicated team of developers, designers, and project managers to ensure consistent communication and delivery. Our experts work seamlessly to bring your vision to life.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Zap className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Cutting-Edge Technology</h3>
              <p className="text-gray-300">
                We stay ahead of the curve with the latest web technologies and best practices to build future-proof applications. Our solutions are optimized for performance, security, and scalability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <PenTool className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Custom Solutions</h3>
              <p className="text-gray-300">
                Every project is unique, and we tailor our development approach to meet your specific business requirements and goals. We create solutions that perfectly align with your vision and objectives.
              </p>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Web App Development Process - Animated Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="px-4 py-1 bg-andela-green/10 rounded-full text-andela-green text-sm font-medium">
                Development Lifecycle
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Our Web Application Development Process</h2>
            <p className="text-lg text-andela-gray max-w-3xl mx-auto">
              Our proven development methodology ensures we deliver high-quality web applications that meet your business goals and exceed user expectations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {[
              {
                step: "1",
                title: "Discovery & Planning",
                description: "We work with you to understand your business objectives, target audience, and technical requirements to create a detailed project roadmap.",
                icon: <Database className="h-6 w-6 text-indigo-500" />,
                color: "bg-indigo-50",
                iconColor: "text-indigo-500",
                borderColor: "border-indigo-100"
              },
              {
                step: "2",
                title: "Design & Prototyping",
                description: "Our designers create intuitive UI/UX designs and interactive prototypes that focus on user experience and visual appeal.",
                icon: <PenTool className="h-6 w-6 text-blue-500" />,
                color: "bg-blue-50",
                iconColor: "text-blue-500",
                borderColor: "border-blue-100"
              },
              {
                step: "3",
                title: "Development",
                description: "Our engineers build your application using modern technologies and best practices for performance, security, and maintainability.",
                icon: <Code className="h-6 w-6 text-green-500" />,
                color: "bg-green-50",
                iconColor: "text-green-500",
                borderColor: "border-green-100"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-white rounded-xl shadow-sm p-8 border ${step.borderColor}`}
              >
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center font-bold text-lg text-andela-green">
                  {step.step}
                </div>
                <div className={`w-14 h-14 ${step.color} rounded-lg flex items-center justify-center mb-5`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-andela-dark">{step.title}</h3>
                <p className="text-andela-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "4",
                title: "Testing & QA",
                description: "We rigorously test across devices and browsers to ensure your application functions flawlessly under all conditions.",
                icon: <ShieldCheck className="h-6 w-6 text-yellow-500" />,
                color: "bg-yellow-50",
                iconColor: "text-yellow-500",
                borderColor: "border-yellow-100"
              },
              {
                step: "5",
                title: "Deployment",
                description: "We handle the launch process with zero-downtime strategies and implement CI/CD pipelines for smooth deployment.",
                icon: <Globe className="h-6 w-6 text-red-500" />,
                color: "bg-red-50",
                iconColor: "text-red-500",
                borderColor: "border-red-100"
              },
              {
                step: "6",
                title: "Maintenance & Support",
                description: "Our relationship continues after launch with ongoing support, monitoring, and regular updates to keep your application running smoothly.",
                icon: <Server className="h-6 w-6 text-purple-500" />,
                color: "bg-purple-50",
                iconColor: "text-purple-500",
                borderColor: "border-purple-100"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className={`relative bg-white rounded-xl shadow-sm p-8 border ${step.borderColor}`}
              >
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center font-bold text-lg text-andela-green">
                  {step.step}
                </div>
                <div className={`w-14 h-14 ${step.color} rounded-lg flex items-center justify-center mb-5`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-andela-dark">{step.title}</h3>
                <p className="text-andela-gray">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Ready to Start Your Web Project?</h2>
              <p className="text-xl text-andela-gray mb-8 max-w-3xl mx-auto">
                Let's discuss how our web development expertise can help you achieve your business goals.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center bg-andela-green hover:bg-andela-green/90 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-lg"
              >
                Contact Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default WebAppSolutions;
import React from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Server, 
  Globe, 
  Users, 
  Zap, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  PenTool,
  ShoppingCart,
  Building2,
  GraduationCap,
  HeartPulse,
  Store,
  BadgePercent
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Link } from "wouter";

const WebAppSolutions = () => {
  const hasAnnouncementBar = true;
  
  const developmentProcess = [
    {
      number: 1,
      title: "Discovery & Planning",
      description: "We work with you to understand your business objectives, target audience, and technical requirements to create a detailed project roadmap."
    },
    {
      number: 2,
      title: "Design & Prototyping",
      description: "Our designers create intuitive UI/UX designs and interactive prototypes that focus on user experience and visual appeal."
    },
    {
      number: 3,
      title: "Development",
      description: "Our engineers build your application using modern technologies and best practices for performance, security, and maintainability."
    },
    {
      number: 4,
      title: "Testing & QA",
      description: "We rigorously test across devices and browsers to ensure your application functions flawlessly under all conditions."
    },
    {
      number: 5,
      title: "Deployment",
      description: "We handle the launch process with zero-downtime strategies and implement CI/CD pipelines for smooth deployment."
    },
    {
      number: 6,
      title: "Maintenance & Support",
      description: "Our relationship continues after launch with ongoing support, monitoring, and regular updates to keep your application running smoothly."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar hasAnnouncementAbove={hasAnnouncementBar} />
      {hasAnnouncementBar && (
        <AnnouncementBar 
          text="Ready to transform your business with a custom web application?" 
          linkText="Contact us today"
          linkUrl="/contact"
          bgColor="bg-andela-green"
          textColor="text-white"
        />
      )}
      
      {/* Hero Section - Matching reference design */}
      <section className="bg-white py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4">
                <div className="text-andela-green font-medium">
                  Web Application Development
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-andela-dark leading-tight">
                Transforming Ideas into<br />
                <span className="text-andela-green">Powerful Web</span><br />
                <span className="text-andela-green">Applications</span>
              </h1>
              <p className="text-lg text-andela-gray mb-10">
                We build custom, scalable, and secure web applications 
                that solve complex business challenges and deliver 
                exceptional user experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-andela-green hover:bg-andela-green/90 text-white px-8 py-4 rounded-md font-medium transition-colors"
                >
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="#services" 
                  className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-andela-dark px-8 py-4 rounded-md font-medium transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative mx-auto max-w-lg">
                <div 
                  className="bg-andela-dark rounded-lg shadow-2xl overflow-hidden transform transition-transform hover:scale-101"
                  style={{ transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)' }}
                >
                  {/* Code editor header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-xs">app.component.tsx</div>
                  </div>
                  
                  {/* Code content */}
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="text-gray-400 text-xs font-mono">// Web App Component</div>
                      <div className="mt-2 text-xs font-mono">
                        <span className="text-blue-400">import</span>
                        <span className="text-white"> React from </span>
                        <span className="text-yellow-300">'react'</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="text-xs font-mono">
                        <span className="text-blue-400">function</span>
                        <span className="text-yellow-300"> WebApp</span>
                        <span className="text-white">() {`{`}</span>
                      </div>
                      <div className="text-xs font-mono text-green-400 ml-4">// Web application logic</div>
                      <div className="text-xs font-mono text-white ml-4">return (</div>
                      <div className="text-xs font-mono text-blue-300 ml-8">{`<div className="app">`}</div>
                      <div className="text-xs font-mono text-purple-400 ml-12">{`<Header />`}</div>
                      <div className="text-xs font-mono text-purple-400 ml-12">{`<MainContent />`}</div>
                      <div className="text-xs font-mono text-purple-400 ml-12">{`<Footer />`}</div>
                      <div className="text-xs font-mono text-blue-300 ml-8">{`</div>`}</div>
                      <div className="text-xs font-mono text-white ml-4">);</div>
                      <div className="text-xs font-mono text-white">{`}`}</div>
                    </div>

                    {/* Input section */}
                    <div className="mt-6">
                      <div className="text-gray-300 text-xs mb-2 font-semibold">Input</div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-4 w-10 bg-blue-500 rounded-sm"></div>
                        <div className="h-4 w-14 bg-yellow-500 rounded-sm"></div>
                        <div className="h-4 w-8 bg-green-500 rounded-sm"></div>
                        <div className="h-4 w-12 bg-purple-500 rounded-sm"></div>
                        
                        <div className="h-4 w-16 bg-blue-400 rounded-sm"></div>
                        <div className="h-4 w-10 bg-green-400 rounded-sm"></div>
                        <div className="h-4 w-12 bg-pink-400 rounded-sm"></div>
                        
                        <div className="h-4 w-8 bg-yellow-400 rounded-sm"></div>
                        <div className="h-4 w-14 bg-purple-400 rounded-sm"></div>
                        <div className="h-4 w-10 bg-blue-400 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Output section */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-300 text-xs font-semibold">Output</div>
                        <div className="px-3 py-1 bg-green-500 rounded text-xs text-white font-medium">Submit</div>
                      </div>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-red-500 mr-2 rounded-full flex items-center justify-center text-[10px] text-white">×</div>
                          <div className="h-4 w-full bg-red-400 rounded-sm"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-green-500 mr-2 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
                          <div className="h-4 w-full bg-green-400 rounded-sm"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-green-500 mr-2 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
                          <div className="h-4 w-full bg-green-400 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Shadow effect */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-andela-dark/20 to-andela-dark/5 rounded-lg -z-10 blur-md"></div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Types of Web Applications Section */}
      <section className="py-20 bg-white" id="services">
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
      
      {/* What Makes Our Approach Different - Centered section */}
      <section className="py-36 bg-white">
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
                Our Approach
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">
              What Makes Our <span className="text-andela-green">Development Process</span> Different
            </h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              We blend technical expertise with strategic thinking to deliver web applications that drive business growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 bg-andela-green/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-andela-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-andela-dark">Expert Development Team</h3>
                    <p className="text-andela-gray">
                      Our specialists combine deep technical knowledge with industry experience to deliver solutions that meet your exact business needs.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 bg-andela-green/10 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-andela-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-andela-dark">Modern Tech Stack</h3>
                    <p className="text-andela-gray">
                      We use cutting-edge technologies and frameworks to build scalable, high-performance web applications that can grow with your business.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 bg-andela-green/10 p-3 rounded-lg">
                    <PenTool className="h-6 w-6 text-andela-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-andela-dark">User-Centered Design</h3>
                    <p className="text-andela-gray">
                      We prioritize user experience in every project, creating intuitive interfaces that enhance engagement and drive conversion.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-andela-green/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full"></div>
                
                {/* Feature image with stats */}
                <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-6 bg-gradient-to-br from-andela-dark to-andela-dark/80 text-white">
                    <h3 className="text-xl font-bold mb-3">Our Impact in Numbers</h3>
                    <p className="text-gray-300 text-sm">Measurable results that speak for themselves</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-andela-green mb-1">95%</div>
                      <div className="text-sm text-andela-gray">Client Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-andela-green mb-1">100+</div>
                      <div className="text-sm text-andela-gray">Projects Completed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-andela-green mb-1">40%</div>
                      <div className="text-sm text-andela-gray">Avg. Performance Boost</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-andela-green mb-1">24/7</div>
                      <div className="text-sm text-andela-gray">Support & Monitoring</div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-andela-dark">Client Retention Rate</div>
                        <div className="text-sm font-medium text-andela-green">92%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-andela-green h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 mb-16">
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
                className={`relative bg-white rounded-xl shadow-sm p-6 lg:p-8 border ${step.borderColor}`}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
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
                className={`relative bg-white rounded-xl shadow-sm p-6 lg:p-8 border ${step.borderColor}`}
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
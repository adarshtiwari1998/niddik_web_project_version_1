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
  PenTool
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Link } from "wouter";

const Solutions = () => {
  const webAppServices = [
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Website Development",
      description: "Custom, responsive websites built with modern technologies to deliver exceptional user experiences.",
      tech: ["React", "Next.js", "WordPress", "Tailwind CSS", "Responsive Design"]
    },
    {
      icon: <GitMerge className="h-8 w-8 text-indigo-600" />,
      title: "MERN Stack Development",
      description: "Full-stack applications leveraging MongoDB, Express, React, and Node.js for scalable modern websites.",
      tech: ["MongoDB", "Express", "React", "Node.js", "Redux"]
    },
    {
      icon: <Database className="h-8 w-8 text-green-600" />,
      title: "MEAN Stack Development",
      description: "End-to-end solutions using MongoDB, Express, Angular and Node.js for enterprise-grade applications.",
      tech: ["MongoDB", "Express", "Angular", "Node.js", "TypeScript"]
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Solutions",
      description: "Intelligent applications leveraging AI to automate processes, provide insights, and enhance user experience.",
      tech: ["OpenAI", "Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"]
    },
    {
      icon: <Bot className="h-8 w-8 text-teal-600" />,
      title: "AI Agent Development",
      description: "Custom intelligent agents that can perform tasks, answer questions, and provide personalized assistance.",
      tech: ["LangChain", "Vector Databases", "Prompt Engineering", "GPT Models", "Knowledge Graphs"]
    },
    {
      icon: <PenTool className="h-8 w-8 text-red-500" />,
      title: "UI/UX Design",
      description: "Human-centered design approach that creates intuitive, engaging, and accessible digital experiences.",
      tech: ["Figma", "User Research", "Prototyping", "Wireframing", "Usability Testing"]
    }
  ];

  const caseStudies = [
    {
      title: "AI-Powered Customer Service Platform",
      client: "Global Retail Chain",
      description: "Developed an intelligent customer service platform with AI agents that handle inquiries, process returns, and provide personalized recommendations.",
      results: [
        "Reduced customer service costs by 47%",
        "Improved response time from hours to seconds",
        "Achieved 92% customer satisfaction rating"
      ],
      image: "https://images.unsplash.com/photo-1596742578443-7682ef7b7057?auto=format&fit=crop&w=800&q=80",
      tags: ["AI Agents", "NLP", "React", "Node.js", "MongoDB"]
    },
    {
      title: "Enterprise Resource Management System",
      client: "Manufacturing Corporation",
      description: "Built a comprehensive MERN stack application for resource planning, inventory management, and supply chain optimization.",
      results: [
        "Streamlined operations resulting in 28% cost reduction",
        "Reduced inventory waste by 35%",
        "Improved supplier coordination by 42%"
      ],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      tags: ["MERN Stack", "Enterprise", "MongoDB", "Express", "React", "Node.js"]
    },
    {
      title: "Financial Analytics Dashboard",
      client: "Investment Firm",
      description: "Designed a sophisticated MEAN stack application for real-time financial data visualization and predictive analytics.",
      results: [
        "Enabled data-driven decisions resulting in 19% portfolio growth",
        "Reduced analysis time by 75%",
        "Improved forecast accuracy by 32%"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      tags: ["MEAN Stack", "Angular", "Financial Services", "Data Visualization"]
    }
  ];

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
        <div className="absolute left-0 bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        
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
              <div className="absolute -bottom-4 -right-4 w-80 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl rounded-full"></div>
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
              <div className="px-4 py-1 bg-blue-500/10 rounded-full text-blue-500 text-sm font-medium">
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
      
      {/* Development Process */}
      <section className="py-20 bg-gray-50">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Development Process</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              Our systematic approach ensures we deliver high-quality web applications on time and within budget.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-andela-green/20"></div>
            
            <div className="space-y-12">
              {developmentProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 relative`}
                >
                  <div className="md:w-1/2"></div>
                  
                  {/* Numbered circle on the timeline */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-andela-green flex items-center justify-center text-white font-bold z-10">
                    {step.number}
                  </div>
                  
                  <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-3 text-andela-dark">{step.title}</h3>
                    <p className="text-andela-gray">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      {/* Case Studies Section */}
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
              <div className="px-4 py-1 bg-purple-500/10 rounded-full text-purple-500 text-sm font-medium">
                Success Stories
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Case Studies</h2>
            <p className="text-lg text-andela-gray max-w-2xl mx-auto">
              Real-world examples of how our web applications have helped businesses achieve their goals.
            </p>
          </motion.div>
          
          <div className="space-y-16">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={caseStudy.image} 
                      alt={caseStudy.title} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {caseStudy.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-gray-100 text-andela-gray text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-andela-dark">{caseStudy.title}</h3>
                    <p className="text-andela-green font-medium">Client: {caseStudy.client}</p>
                    <p className="text-andela-gray">{caseStudy.description}</p>
                    <div>
                      <p className="font-medium text-andela-dark mb-2">Results:</p>
                      <ul className="space-y-2">
                        {caseStudy.results.map((result, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-andela-green flex-shrink-0 mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-andela-gray">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-andela-dark to-andela-dark/90 text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Niddik for Web Development</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We combine technical expertise with business acumen to deliver web applications that exceed expectations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
            >
              <Users className="h-10 w-10 text-andela-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Dedicated Team</h3>
              <p className="text-gray-300">
                We assign a dedicated team of developers, designers, and project managers to ensure consistent communication and delivery.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
            >
              <Zap className="h-10 w-10 text-andela-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Cutting-Edge Technology</h3>
              <p className="text-gray-300">
                We stay ahead of the curve with the latest web technologies and best practices to build future-proof applications.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
            >
              <LineChart className="h-10 w-10 text-andela-green mb-4" />
              <h3 className="text-xl font-bold mb-3">Results-Driven Approach</h3>
              <p className="text-gray-300">
                We focus on delivering measurable results that directly impact your business growth and user satisfaction.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-andela-green/5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 text-andela-dark">Ready to Build Your Next Web Application?</h2>
                <p className="text-lg text-andela-gray mb-6">
                  Let's discuss how our web development expertise can help bring your vision to life. Schedule a free consultation today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center justify-center bg-andela-green hover:bg-andela-green/90 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-lg"
                  >
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a 
                    href="tel:+1234567890" 
                    className="inline-flex items-center justify-center border-2 border-andela-green text-andela-green hover:bg-andela-green/5 px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Call Us
                  </a>
                </div>
              </div>
              
              <div className="hidden lg:block w-80 h-80 bg-andela-green/10 rounded-full flex items-center justify-center">
                <Code className="h-32 w-32 text-andela-green" />
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default Solutions;
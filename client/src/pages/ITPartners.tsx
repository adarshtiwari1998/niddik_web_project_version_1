import { useState } from "react";
import  Container  from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Users, Code, Clock, Server, Database, Cloud, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function ITPartners() {
        const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
           const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
          setIsAnnouncementVisible(isVisible);
           };
  return (
    <div className="min-h-screen bg-white">
         {/* Fixed header components */}
                    <AnnouncementBar 
                                    text="Download our new whitepaper on scaling tech teams effectively."
                                    linkText="Get it now"
                                    linkUrl="/whitepaper"
                                    bgColor="bg-green-600" 
                                    textColor="text-white"
                                    onVisibilityChange={handleAnnouncementVisibilityChange}
                                  />
                                  <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      {/* Hero Section */}
      <section className="relative py-20 mt-24 bg-gradient-to-r from-[#2C5E2F] to-[#1a3b1c] text-white">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              IT Staffing & Solutions Partnership
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Partner with us to access top-tier IT talent and comprehensive technology solutions for your business needs.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Core Services Section */}
      {/* <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core IT Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive IT solutions tailored to meet your organization's unique technological needs and challenges.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <Server className="w-12 h-12 text-[#2C5E2F] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Infrastructure Solutions</h3>
              <p className="text-gray-600">Design and implementation of scalable IT infrastructure to support your business growth.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <Database className="w-12 h-12 text-[#2C5E2F] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Database Management</h3>
              <p className="text-gray-600">Expert database administration and optimization services for improved performance.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
            >
              <Cloud className="w-12 h-12 text-[#2C5E2F] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cloud Services</h3>
              <p className="text-gray-600">Cloud migration and management solutions for enhanced flexibility and scalability.</p>
            </motion.div>
          </div>
        </Container>
      </section> */}

      {/* Expertise Areas Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Areas of Expertise</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {['Cloud Computing', 'DevOps', 'Cybersecurity', 'Data Analytics', 'Network Infrastructure', 'System Integration'].map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm"
                >
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{area}</h3>
                    <p className="text-gray-600">Expert solutions and talent for your {area.toLowerCase()} needs.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Security & Compliance</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-[#2C5E2F]" />
                  <div>
                    <h3 className="font-semibold mb-2">Data Protection</h3>
                    <p className="text-gray-600">Comprehensive security measures to protect your sensitive information.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold mb-2">Compliance Standards</h3>
                    <p className="text-gray-600">Adherence to industry regulations and compliance requirements.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80" 
                alt="Security Operations Center" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* AI-Driven Recruitment Solutions */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI-Driven Recruitment Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Let us help you find and engage the best candidates using our cutting-edge recruitment technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Data Driven Recruitment", icon: "📊" },
              { title: "AI For Recruitment", icon: "🤖" },
              { title: "Social Media Recruiting", icon: "🌐" },
              { title: "Video Job Interview Technology", icon: "🎥" },
              { title: "Improved Candidate Experience", icon: "👥" },
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-[#2C5E2F]/20"
              >
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                <p className="text-gray-600">Leveraging advanced technology to optimize your recruitment process</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Recruitment Process */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Recruitment Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive end-to-end recruitment solution designed to transform your hiring process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                phase: "Preparing",
                color: "bg-[#2C5E2F]",
                items: ["Analyze job requirements", "Update job descriptions", "Identify ideal candidates"]
              },
              {
                phase: "Sourcing",
                color: "bg-[#2C5E2F]",
                items: ["Multi-channel sourcing", "Active/passive sourcing", "Leverage referral networks"]
              },
              {
                phase: "Screening",
                color: "bg-[#2C5E2F]",
                items: ["Resume review", "Preliminary interviews", "Qualification assessment"]
              },
              {
                phase: "Selecting",
                color: "bg-[#2C5E2F]",
                items: ["In-depth interviews", "Skills assessment", "Thorough evaluation"]
              },
              {
                phase: "Hiring",
                color: "bg-[#2C5E2F]",
                items: ["Extend offers", "Negotiate terms", "Manage acceptance"]
              },
              {
                phase: "Onboarding",
                color: "bg-[#2C5E2F]",
                items: ["Orientation", "HR paperwork", "Team integration"]
              }
            ].map((step, index) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className={`${step.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.phase}</h3>
                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-[#2C5E2F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Measurable improvements in recruitment efficiency and effectiveness
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "30%", label: "Optimize Recruiting Spend" },
              { value: "40%", label: "Improvement in Response" },
              { value: "50%", label: "Decrease in Time to Submit" },
              { value: "70%", label: "Increase in Talent Quality" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-[#2C5E2F]/20 text-center"
              >
                <p className="text-4xl font-bold text-[#2C5E2F] mb-2">{metric.value}</p>
                <p className="text-gray-600">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Partnership Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-gray-600">24/7 technical support and dedicated account management for your business.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Fast Implementation</h3>
              <p className="text-gray-600">Quick deployment of solutions and rapid response to technical challenges.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Code className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
              <p className="text-gray-600">Tailored IT solutions designed specifically for your business needs.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2C5E2F] text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your IT Infrastructure?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Partner with us to leverage cutting-edge technology solutions and expert IT talent for your business success.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Schedule a Consultation <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>
       <Footer />
    </div>
  );
}

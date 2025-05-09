import { useState } from "react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, ChartBar, Target, Handshake, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function NonITPartners() {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Download our new whitepaper on scaling non-tech teams effectively."
        linkText="Get it now"
        linkUrl="/whitepaper"
        bgColor="bg-[#2C5E2F]"
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />

      {/* Hero Section */}
      <section className="relative py-20 mt-24 bg-gradient-to-r from-[#2C5E2F] via-[#1a3b1c] to-[#0a1a0b] text-white">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Non-IT Talent Solutions & Staffing Excellence
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Partner with us to access premium non-technical talent and comprehensive staffing solutions tailored for diverse industry sectors.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Explore Solutions <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our expertise spans across multiple non-IT sectors, delivering specialized talent solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Manufacturing & Operations",
                icon: <Building className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Production managers, quality control specialists, and operations experts."
              },
              {
                title: "Sales & Marketing",
                icon: <ChartBar className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Sales executives, marketing strategists, and business development professionals."
              },
              {
                title: "Human Resources",
                icon: <Users className="w-12 h-12 text-[#2C5E2F]" />,
                description: "HR managers, talent acquisition specialists, and employee relations experts."
              }
            ].map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
              >
                {industry.icon}
                <h3 className="text-xl font-semibold my-4">{industry.title}</h3>
                <p className="text-gray-600">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our 6-Factor Recruiting Model</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach ensures we find the perfect match for your organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Skills Assessment</h3>
                  <p className="text-gray-600">Comprehensive evaluation of technical and soft skills through proven methodologies</p>
                </div>
              </div>

              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cultural Alignment</h3>
                  <p className="text-gray-600">Ensuring perfect fit with your organization's values and work culture</p>
                </div>
              </div>

              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Verification</h3>
                  <p className="text-gray-600">Rigorous background checks and reference validation process</p>
                </div>
              </div>

              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <ChartBar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Performance Analysis</h3>
                  <p className="text-gray-600">Data-driven assessment of candidate capabilities and potential</p>
                </div>
              </div>

              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Industry Expertise</h3>
                  <p className="text-gray-600">Specialized knowledge in non-IT sectors for precise matching</p>
                </div>
              </div>

              <div className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Long-term Success</h3>
                  <p className="text-gray-600">Focus on sustainable placements and career growth</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-white p-6 rounded-xl shadow-xl"
            >
              <div className="relative">
                <img
                  src="/images/talent-map.svg"
                  alt="Recruitment Process"
                  className="rounded-lg w-full"
                />

                {/* Add interactive elements */}
                <div className="absolute inset-0">
                  {[
                    { top: '20%', left: '25%', color: 'bg-blue-400' },
                    { top: '45%', left: '65%', color: 'bg-green-400' },
                    { top: '70%', left: '35%', color: 'bg-purple-400' },
                    { top: '30%', left: '75%', color: 'bg-orange-400' },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${point.color} w-4 h-4 rounded-full`}
                      style={{ top: point.top, left: point.left }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  ))}

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                      d="M100,100 C150,150 200,150 250,100"
                      stroke="#2C5E2F"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </svg>
                </div>

                {/* Additional Info Cards */}
                <div className="absolute -right-4 top-1/4 bg-white p-3 rounded-lg shadow-lg transform translate-x-1/2">
                  <div className="text-sm font-medium text-[#2C5E2F]">Global Reach</div>
                </div>
                <div className="absolute -left-4 bottom-1/4 bg-white p-3 rounded-lg shadow-lg transform -translate-x-1/2">
                  <div className="text-sm font-medium text-[#2C5E2F]">Local Expertise</div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Non-IT Recruitment Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We bring specialized expertise and proven methodologies to non-IT recruitment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Industry Expertise",
                description: "Deep understanding of non-IT sectors and their unique talent needs",
                icon: <Building className="w-12 h-12 text-[#2C5E2F]" />
              },
              {
                title: "Custom Solutions",
                description: "Tailored recruitment strategies for your specific requirements",
                icon: <Target className="w-12 h-12 text-[#2C5E2F]" />
              },
              {
                title: "Quality Focus",
                description: "Rigorous screening process to ensure top-tier talent",
                icon: <Shield className="w-12 h-12 text-[#2C5E2F]" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2C5E2F]">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Workforce?</h2>
            <p className="text-lg mb-8 opacity-90">
              Partner with us to access top-tier non-IT talent and comprehensive staffing solutions.
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
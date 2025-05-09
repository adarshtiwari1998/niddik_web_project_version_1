
import { useState } from "react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, HeartPulse, Microscope, Hospital, Brain, Activity, Pill, UserCog, Clipboard, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function HealthcarePartners() {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Download our healthcare recruitment insights report."
        linkText="Get it now"
        linkUrl="/healthcare-insights"
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
              Healthcare Talent Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Specialized staffing solutions for healthcare organizations, ensuring quality patient care through expert talent acquisition.
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              Connect With Us <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Healthcare Domains Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare Expertise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive staffing solutions across various healthcare specialties.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Clinical Staff",
                icon: <Stethoscope className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Nurses, physicians, and specialized medical practitioners."
              },
              {
                title: "Laboratory & Research",
                icon: <Microscope className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Lab technicians, researchers, and diagnostic specialists."
              },
              {
                title: "Healthcare Technology",
                icon: <UserCog className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Health IT specialists and medical technology experts."
              }
            ].map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
              >
                {domain.icon}
                <h3 className="text-xl font-semibold my-4">{domain.title}</h3>
                <p className="text-gray-600">{domain.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Compliance & Standards Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare Compliance & Standards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our rigorous screening process ensures all healthcare professionals meet industry standards.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                {
                  title: "Medical Licensure Verification",
                  icon: <Clipboard className="text-white" />,
                  description: "Thorough verification of medical licenses and certifications"
                },
                {
                  title: "Clinical Competency Assessment",
                  icon: <Brain className="text-white" />,
                  description: "Comprehensive evaluation of clinical skills and expertise"
                },
                {
                  title: "Healthcare Compliance",
                  icon: <Activity className="text-white" />,
                  description: "Ensuring adherence to healthcare regulations and standards"
                },
                {
                  title: "Specialization Validation",
                  icon: <Pill className="text-white" />,
                  description: "Verification of specialized medical qualifications"
                }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-[#F8F9FF] p-6 rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2C5E2F] flex items-center justify-center flex-shrink-0">
                    {process.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-white p-6 rounded-xl shadow-xl"
            >
              <img
                src="/images/talent-map.svg"
                alt="Healthcare Compliance Process"
                className="w-full rounded-lg"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Healthcare Innovation Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare Innovation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Supporting healthcare organizations in adopting cutting-edge technologies and practices.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Health",
                icon: <Hospital className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Specialists in telemedicine and digital health platforms"
              },
              {
                title: "AI in Healthcare",
                icon: <Brain className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Experts in AI-driven medical diagnosis and treatment"
              },
              {
                title: "Patient Care Tech",
                icon: <HeartPulse className="w-12 h-12 text-[#2C5E2F]" />,
                description: "Professionals in patient monitoring and care technologies"
              }
            ].map((innovation, index) => (
              <motion.div
                key={innovation.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                {innovation.icon}
                <h3 className="text-xl font-semibold my-4">{innovation.title}</h3>
                <p className="text-gray-600">{innovation.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2C5E2F]">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Elevate Your Healthcare Team</h2>
            <p className="text-lg mb-8 opacity-90">
              Partner with us to build a world-class healthcare workforce.
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

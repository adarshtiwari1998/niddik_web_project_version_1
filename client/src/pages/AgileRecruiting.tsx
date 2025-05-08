import { motion } from "framer-motion";
import { useState } from "react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { BrainCircuit, Circle, Handshake, Users, Target, Clock, Gauge, CheckCircle, LineChart, ClipboardList, Video, Globe, BarChart2, Shield } from "lucide-react";

const AgileRecruiting = () => {
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
            <section className="pt-32 pb-20 relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 opacity-10">
                {Array.from({ length: 200 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    className="aspect-square bg-gradient-to-br from-blue-500 to-green-500 rounded-sm"
                  />
                ))}
              </div>
              
              <Container>
                <div className="relative mt-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                      <h1 className="text-5xl font-bold mb-6">
              Agile Approach Based Recruiting
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how NiDDik follows Agile methodologies for innovative recruiting solutions through AI-driven sourcing.
            </p>
                  </motion.div>
                </div>
              </Container>
            </section>

      {/* AI Driven Sourcing Section */}
    {/* AI Driven Sourcing Section */}
<section className="py-20">
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Existing Card */}
      <div className="p-8 bg-gray-100 rounded-lg shadow">
  <h2 className="text-2xl font-bold mb-4">AI Driven Sourcing</h2>
  <div className="flex flex-col space-y-4">
    <div className="flex items-center">
      <Circle className="w-10 h-10 text-green-500 mr-4" />
      <span>Data Driven Recruitment</span>
    </div>
    <div className="flex items-center">
      <Handshake className="w-10 h-10 text-blue-500 mr-4" />
      <span>AI for Recruitment</span>
    </div>
    <div className="flex items-center">
      <Users className="w-10 h-10 text-purple-500 mr-4" />
      <span>Social Media Recruiting</span>
    </div>
    <div className="flex items-center">
      <Video className="w-10 h-10 text-red-500 mr-4" /> {/* Replace with the actual icon for Video */}
      <span>Video Job Interview Technology</span>
    </div>
    <div className="flex items-center">
      <Users className="w-10 h-10 text-orange-500 mr-4" /> {/* Replace with the actual icon for Improved Candidate Experience */}
      <span>Improved Candidate Experience</span>
    </div>
  </div>
</div>

      {/* New Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { title: "AI Talent Matching", icon: <BrainCircuit className="w-10 h-10 text-yellow-500" /> },
          { title: "Predictive Analytics", icon: <Gauge className="w-10 h-10 text-red-500" /> },
          { title: "Candidate Screening", icon: <CheckCircle className="w-10 h-10 text-teal-500" /> },
          { title: "Performance Metrics", icon: <LineChart className="w-10 h-10 text-blue-600" /> },
          { title: "Skill Assessment", icon: <ClipboardList className="w-10 h-10 text-orange-500" /> },
          { title: "Diversity Recruitment", icon: <Users className="w-10 h-10 text-green-500" /> },
        ].map((card, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              {card.icon}
              <h3 className="text-xl font-semibold ml-4">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  </Container>
</section>

      {/* Showcase Agile Methodologies */}
      <section className="py-20 bg-gray-100">
  <Container>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl font-bold mb-4">Agile Methodologies</h2>
      <p className="text-xl text-gray-600">
        Explore our agile methodologies that drive efficiency and candidate quality.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {[
        {
          icon: <Users className="w-10 h-10 text-blue-500" />,
          title: "PEOPLE / CULTURE",
          description: "Sr. Leadership | Superiors | Coworkers"
        },
        {
          icon: <Clock className="w-10 h-10 text-green-500" />,
          title: "COMPENSATION",
          description: "Pay | Benefits"
        },
        {
          icon: <BarChart2 className="w-10 h-10 text-purple-500" />,
          title: "POLICIES & PROCEDURE",
          description: "Policies | HR"
        },
        {
          icon: <Handshake className="w-10 h-10 text-yellow-500" />,
          title: "WORK",
          description: "Intrinsic Motivation | Influence | Work Tasks | Resources"
        },
        {
          icon: <Globe className="w-10 h-10 text-red-500" />,
          title: "OPPORTUNITIES",
          description: "Exclusivity | Recognition"
        },
        {
          icon: <Shield className="w-10 h-10 text-teal-500" />,
          title: "QUALITY OF LIFE",
          description: "Work Life Balance | Work Environment"
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.9, opacity: 0.7 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300"
        >
          <div className="mb-4 flex justify-center">{item.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </Container>
</section>

        {/* New Section: Agile Recruitment Insights */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold">Agile Recruitment Insights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest principles and methodologies in agile recruiting.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center"
            >
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Collaborative Hiring</h3>
              <p>Engage teams in the hiring process for better candidate fit.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center"
            >
              <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Time Management</h3>
              <p>Optimize the hiring timeline to enhance productivity.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center"
            >
              <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Focus on Skills</h3>
              <p>Prioritize skills over traditional qualifications for better hires.</p>
            </motion.div>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default AgileRecruiting;
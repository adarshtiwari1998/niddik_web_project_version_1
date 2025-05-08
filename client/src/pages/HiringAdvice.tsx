
import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, Brain, Users, Target, Zap, CheckCircle, BarChart2, ArrowRight, Globe, BrainCircuit, Award, Users2, Network, Cpu } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const HiringAdvice = () => {
    const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
        
    const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
            setIsAnnouncementVisible(isVisible);
    };

  const insightCards = [
    {
      title: "Strategic Talent Planning",
      description: "Learn how to build a forward-thinking talent acquisition strategy that aligns with your business goals",
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      stats: ["45% better retention", "30% faster scaling"]
    },
    {
      title: "Cultural Fit Assessment",
      description: "Effective techniques to evaluate cultural alignment without compromising on technical excellence",
      icon: <Users className="w-8 h-8 text-blue-400" />,
      stats: ["82% team satisfaction", "3x collaboration"]
    },
    {
      title: "Performance Metrics",
      description: "Key metrics and KPIs to track hiring success and team performance",
      icon: <BarChart2 className="w-8 h-8 text-purple-400" />,
      stats: ["90% accuracy", "2x productivity"]
    }
  ];

  const bestPractices = [
    {
      title: "Remote-First Hiring",
      description: "Build high-performing distributed teams with our proven remote hiring framework",
      icon: <Globe className="w-12 h-12 text-blue-500" />
    },
    {
      title: "Skills Assessment",
      description: "Modern approaches to technical evaluation beyond traditional coding tests",
      icon: <Target className="w-12 h-12 text-green-500" />
    },
    {
      title: "Agile Recruitment",
      description: "Implement agile methodologies in your hiring process for better outcomes",
      icon: <Zap className="w-12 h-12 text-yellow-500" />
    }
  ];

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
      <div className="pt-32 mt-9 pb-20 bg-gradient-to-br from-blue-50 via-emerald-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold pb-5 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Modern Hiring Insights
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Expert guidance on building and scaling high-performing technical teams in today's dynamic landscape
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Insight Cards */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insightCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="mb-6">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <div className="flex gap-4">
                  {card.stats.map((stat, idx) => (
                    <span key={idx} className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {stat}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Best Practices */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Best Practices for Modern Tech Hiring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Implement these proven strategies to transform your hiring process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {bestPractices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">{practice.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{practice.title}</h3>
                <p className="text-gray-600">{practice.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>


     {/* Interactive Timeline */}
     <section className="py-20 bg-gradient-to-br from-blue-50/30 to-emerald-50/30">
        <Container>
          <motion.div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Hiring Evolution Timeline</h2>
            <div className="relative">
              {/* Timeline center line */}
              <div className="absolute left-[2.5rem] top-0 bottom-0 w-0.5 bg-blue-100"></div>
              
              {['2020', '2021', '2022', '2023', '2024', '2025'].map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6 mb-12 relative"
                >
                  <motion.div 
                    className="w-24 flex-shrink-0 text-2xl font-bold text-blue-600 flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative">
                      <motion.div 
                        className="absolute -left-8 w-6 h-6 bg-blue-500 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {year}
                    </div>
                  </motion.div>
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="p-2 rounded-lg bg-blue-50"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {index === 0 && <Globe className="w-6 h-6 text-blue-500" />}
                        {index === 1 && <BrainCircuit className="w-6 h-6 text-purple-500" />}
                        {index === 2 && <Award className="w-6 h-6 text-green-500" />}
                        {index === 3 && <Users2 className="w-6 h-6 text-orange-500" />}
                        {index === 4 && <Network className="w-6 h-6 text-indigo-500" />}
                        {index === 5 && <Cpu className="w-6 h-6 text-rose-500" />}
                      </motion.div>
                      <h3 className="text-xl font-semibold">
                        {index === 0 && "Remote Work Revolution"}
                        {index === 1 && "AI-Powered Screening"}
                        {index === 2 && "Skills-Based Hiring"}
                        {index === 3 && "Hybrid Workforce"}
                        {index === 4 && "Adaptive Teams"}
                        {index === 5 && "Quantum Talent Matching"}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {index === 0 && "Global shift to remote-first hiring practices"}
                      {index === 1 && "Integration of AI in candidate assessment"}
                      {index === 2 && "Focus on practical skills over credentials"}
                      {index === 3 && "Balance of onsite and remote collaboration"}
                      {index === 4 && "Dynamic team composition based on project needs"}
                      {index === 5 && "Advanced AI algorithms for perfect talent-role alignment"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

        {/* Success Checklist */}
        <section className="py-20 bg-blue-600 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">
                Your Hiring Success Checklist
              </h2>
              <p className="text-xl opacity-90">
                Essential elements for building a world-class technical team
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "Clear role definition and success metrics",
                "Structured but flexible interview process",
                "Focus on practical skills assessment",
                "Emphasis on soft skills and culture fit",
                "Efficient feedback and decision loops",
                "Strong candidate experience focus"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-white/10 rounded-lg p-4"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default HiringAdvice;

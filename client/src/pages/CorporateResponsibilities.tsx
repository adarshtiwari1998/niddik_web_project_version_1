
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Globe, Leaf, School, Users, Sparkles, ArrowRight, Lightbulb, Award, Network, BrainCircuit } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const CorporateResponsibilities = () => {
        const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
            
        const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
                setIsAnnouncementVisible(isVisible);
        };
  const initiatives = [
    {
      title: "Global Tech Education",
      description: "Empowering underserved communities with digital literacy and coding skills",
      icon: <School className="w-8 h-8 text-emerald-500" />,
      impact: "150K+ community reached",
      color: "from-emerald-500/20 to-transparent"
    },
    {
      title: "Carbon Neutral Hiring",
      description: "Offsetting carbon footprint through green tech recruitment practices",
      icon: <Leaf className="w-8 h-8 text-green-500" />,
      impact: "1,000 tons CO₂ offset",
      color: "from-green-500/20 to-transparent"
    },
    {
      title: "Digital Inclusion",
      description: "Breaking barriers in tech through inclusive hiring practices",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      impact: "40% diversity increase",
      color: "from-blue-500/20 to-transparent"
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
      {/* Hero Section with Dynamic Background */}
       {/* Hero Section with Dynamic Background */}
       <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-emerald-50 to-white">
          {/* Animated particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight 
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ opacity: 0.2 }}
            />
          ))}
        </div>
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center mt-6"
          >
            <h1 className="text-6xl font-bold pb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Technology for Good
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving positive change through innovative tech initiatives and sustainable practices
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Impact Metrics with 3D Cards */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.4 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${initiative.color} opacity-20`} />
                <div className="relative">
                  <div className="mb-6">{initiative.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{initiative.title}</h3>
                  <p className="text-gray-600 mb-6">{initiative.description}</p>
                  <div className="text-lg font-semibold text-emerald-600">
                    {initiative.impact}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Timeline with 3D Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Floating particles in background */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 255, 0.2)`,
              filter: 'blur(1px)'
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        <Container>
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Our Journey to a Sustainable Future
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            {[2021, 2022, 2023, 2024, 2025].map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-6 mb-12"
              >
                <div className="w-24 flex-shrink-0 text-2xl font-bold text-emerald-600">{year}</div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-emerald-50"
                    >
                      <Award className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">
                      {index === 0 && "Launch of Digital Literacy Program"}
                      {index === 1 && "Green Tech Initiative"}
                      {index === 2 && "Global Inclusion Framework"}
                      {index === 3 && "Tech for All Campaign"}
                      {index === 4 && "Quantum Talent Evolution"}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {index === 0 && "Initiated our flagship program to bring tech education to underserved communities"}
                      {index === 1 && "Implemented sustainable practices in our recruitment processes"}
                      {index === 2 && "Launched comprehensive framework for inclusive tech hiring"}
                      {index === 3 && "Expanding our impact through global partnerships"}
                      {index === 4 && "Pioneering AI-driven adaptive hiring processes with quantum computing integration"}
                    </p>
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    <motion.div 
                      className="flex gap-2 mt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2 flex-1 rounded-full ${i <= index ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive 3D Cards Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50 relative overflow-hidden">
        <Container>
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Adaptive Hiring Process 2025
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Matching",
                description: "Quantum computing algorithms for perfect candidate-role alignment",
                icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
                color: "from-purple-500/20"
              },
              {
                title: "Virtual Reality Interviews",
                description: "Immersive assessment environments for real-world scenarios",
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                color: "from-blue-500/20"
              },
              {
                title: "Secure Trust Network",
                description: "Multi-source credential and experience validation",
                icon: <Network className="w-8 h-8 text-emerald-500" />,
                color: "from-emerald-500/20"
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="relative group perspective"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform-gpu group-hover:rotate-y-10 ${card.color}`}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"
                    style={{ backdropFilter: 'blur(8px)' }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="mb-6 p-3 rounded-lg inline-block"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {card.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl opacity-90 mb-12">
                Be part of the change. Partner with us to create a more inclusive and sustainable tech future.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Partner",
                    icon: <Heart className="w-8 h-8" />,
                    description: "Collaborate on initiatives"
                  },
                  {
                    title: "Volunteer",
                    icon: <Sparkles className="w-8 h-8" />,
                    description: "Share your expertise"
                  },
                  {
                    title: "Innovate",
                    icon: <Lightbulb className="w-8 h-8" />,
                    description: "Propose new solutions"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white/10 rounded-xl p-8 backdrop-blur-sm"
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="opacity-90">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>


      <Footer />
    </div>
  );
};

export default CorporateResponsibilities;

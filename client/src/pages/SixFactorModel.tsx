
import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Target, Users, Briefcase, ChevronRight, Network, Zap, Star } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const SixFactorModel = () => {
     const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
                    
                const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
                        setIsAnnouncementVisible(isVisible);
                };
  const factors = [
    {
      number: "01",
      title: "PEOPLE / CULTURE",
      description: "Sr. Leadership | Superiors | Coworkers",
      color: "from-red-500",
      icon: <Users className="w-8 h-8" />
    },
    {
      number: "02",
      title: "COMPENSATION",
      description: "Pay | Benefits",
      color: "from-orange-500",
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      number: "03",
      title: "POLICIES & PROCEDURE",
      description: "Policies | HR",
      color: "from-emerald-500",
      icon: <Target className="w-8 h-8" />
    },
    {
      number: "04",
      title: "WORK",
      description: "Intrinsic Motivation | Influence | Work Tasks | Resources",
      color: "from-cyan-500",
      icon: <Brain className="w-8 h-8" />
    },
    {
      number: "05",
      title: "OPPORTUNITIES",
      description: "Exclusivity | Recognition",
      color: "from-blue-500",
      icon: <Star className="w-8 h-8" />
    },
    {
      number: "06",
      title: "QUALITY OF LIFE",
      description: "Work Life Balance | Work Environment",
      color: "from-purple-500",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const capabilities = [
    {
      phase: "PREPARING",
      color: "bg-emerald-500",
      items: [
        "Analyse and define the job requirement",
        "Develop or update the job description",
        "Identify the ideal candidate profile"
      ]
    },
    {
      phase: "SOURCING",
      color: "bg-blue-500",
      items: [
        "Source candidates through various channels",
        "Engage in active and passive candidate sourcing",
        "Leverage employee referral and talent pools"
      ]
    },
    {
      phase: "SCREENING",
      color: "bg-emerald-500",
      items: [
        "Review resumes and cover letters",
        "Conduct preliminary interviews",
        "Assess candidates qualification and fit"
      ]
    },
    {
      phase: "SELECTING",
      color: "bg-blue-500",
      items: [
        "Conduct in-depth interviews",
        "Perform skills assessment",
        "Evaluate candidates thoroughly"
      ]
    },
    {
      phase: "HIRING",
      color: "bg-emerald-500",
      items: [
        "Extend job offers",
        "Negotiate terms",
        "Manage acceptance process"
      ]
    },
    {
      phase: "ONBOARDING",
      color: "bg-blue-500",
      items: [
        "Implement orientation",
        "Complete HR paperwork",
        "Integrate new hires"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
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
              <h1 className="text-6xl font-bold mb-6 text-white">
                6-Factors Model
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Our dynamic recruitment solutions seamlessly blend innovation and expertise to match exceptional talents with your unique organizational needs.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Factors Grid */}
      <section className="py-20 relative bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factors.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${factor.color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className={`text-4xl font-bold mb-4 bg-gradient-to-r ${factor.color} to-white bg-clip-text text-transparent`}>
                    {factor.number}
                  </div>
                  <div className="mb-4">{factor.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-600">{factor.title}</h3>
                  <p className="text-gray-400">{factor.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-600">Our Capabilities</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive approach to finding and nurturing the best talent
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 relative overflow-hidden"
              >
                <div className={`${cap.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-600">{cap.phase}</h3>
                <ul className="space-y-3">
                  {cap.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400">
                      <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default SixFactorModel;

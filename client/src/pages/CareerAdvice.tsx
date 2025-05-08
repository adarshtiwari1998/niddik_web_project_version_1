
import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, Target, Rocket, LineChart, Users, Sparkles, ArrowRight, Book, Trophy, BrainCircuit, Star, Lightbulb, Zap, Network, Cpu, Bot } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const CareerAdvice = () => {
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
      
      {/* Hero Section with AI Animation */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
          {/* Neural Network Animation */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0.2
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
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
            <h1 className="text-6xl font-bold pb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Career Guidance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate your tech career with data-driven insights and AI-powered recommendations
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Interactive Career Path Explorer */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Career Navigator",
                description: "Personalized career path recommendations based on your skills and interests",
                icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
                stats: ["93% accuracy", "10K+ paths analyzed"]
              },
              {
                title: "Skill Galaxy",
                description: "Interactive visualization of in-demand tech skills and their relationships",
                icon: <Star className="w-8 h-8 text-blue-500" />,
                stats: ["Real-time updates", "Global skill trends"]
              },
              {
                title: "Future Insights",
                description: "Predictive analysis of emerging tech roles and required competencies",
                icon: <Lightbulb className="w-8 h-8 text-indigo-500" />,
                stats: ["5-year projections", "Industry validated"]
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="mb-6">{card.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <div className="flex justify-between text-sm text-blue-600">
                  {card.stats.map((stat, i) => (
                    <span key={i} className="font-semibold">{stat}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* AI Learning Paths */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Personalized Learning Paths</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-curated learning journeys tailored to your career goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                role: "Full-Stack Developer",
                skills: ["React", "Node.js", "Python", "Cloud"],
                growth: "+45% demand",
                icon: <Zap className="w-6 h-6 text-yellow-500" />
              },
              {
                role: "AI Engineer",
                skills: ["Machine Learning", "Python", "Deep Learning"],
                growth: "+75% demand",
                icon: <Brain className="w-6 h-6 text-purple-500" />
              },
              {
                role: "DevOps Engineer",
                skills: ["Docker", "Kubernetes", "CI/CD"],
                growth: "+55% demand",
                icon: <Rocket className="w-6 h-6 text-blue-500" />
              },
              {
                role: "Data Scientist",
                skills: ["Statistics", "Python", "Big Data"],
                growth: "+65% demand",
                icon: <LineChart className="w-6 h-6 text-green-500" />
              }
            ].map((path, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-50">{path.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">{path.role}</h3>
                    <p className="text-green-600">{path.growth}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {path.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

   {/* Adaptive Recruitment Model */}
      <section className="py-20">
        <Container>
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            NiDDiK's Adaptive Recruitment Model
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                phase: "Discovery",
                icon: <Cpu className="w-12 h-12 text-blue-500" />,
                description: "AI-powered role analysis and market mapping",
                features: ["Real-time skill demand analysis", "Competitive intelligence", "Role optimization"]
              },
              {
                phase: "Match",
                icon: <Network className="w-12 h-12 text-purple-500" />,
                description: "Neural network-based candidate matching",
                features: ["Multi-dimensional skill mapping", "Cultural alignment", "Growth potential analysis"]
              },
              {
                phase: "Evaluate",
                icon: <Bot className="w-12 h-12 text-green-500" />,
                description: "AI-assisted assessment and validation",
                features: ["Automated technical assessment", "Behavioral analysis", "Predictive performance metrics"]
              },
              {
                phase: "Integrate",
                icon: <Zap className="w-12 h-12 text-yellow-500" />,
                description: "Smart onboarding and team integration",
                features: ["Personalized onboarding paths", "Team compatibility optimization", "Success tracking"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-gray-50">{item.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{item.phase}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

   {/* Interactive Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <h2 className="text-4xl font-bold text-center mb-16">Evolution of Recruitment</h2>
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
                      <Star className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">
                      {index === 0 && "Traditional Recruitment"}
                      {index === 1 && "Digital Transformation"}
                      {index === 2 && "AI Integration"}
                      {index === 3 && "Adaptive Hiring"}
                      {index === 4 && "Quantum Talent Matching"}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {index === 0 && "Manual screening and basic ATS systems"}
                    {index === 1 && "Digital-first approach with automated workflows"}
                    {index === 2 && "AI-powered candidate matching and assessment"}
                    {index === 3 && "Dynamic talent pools and flexible hiring models"}
                    {index === 4 && "Neural networks and predictive analytics for perfect matches"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Interactive Career Success Stories */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Success Stories
            </motion.h2>
            {[
              {
                name: "Sarah Chen",
                transition: "Marketing → AI Product Manager",
                duration: "9 months",
                quote: "The AI-powered guidance helped me pivot into tech seamlessly"
              },
              {
                name: "James Rodriguez",
                transition: "Teacher → Full-Stack Developer",
                duration: "12 months",
                quote: "The personalized learning path made all the difference"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="mb-8 bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <h3 className="text-xl font-bold">{story.name}</h3>
                    <p className="text-purple-600">{story.transition}</p>
                  </div>
                  <div className="ml-auto text-gray-600">
                    {story.duration}
                  </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default CareerAdvice;


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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Navigate your tech career with data-driven insights and AI-powered recommendations
            </p>
            
            {/* NIDDIK's Career Advice - Integrated into Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mt-12"
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-800">NIDDIK's Career Advice</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                At NIDDIK, we are on a mission to define what success is to each team member and the partners we work with. 
                Whether you are a developer, engineer, manager, leader, or a stakeholder, let these serve as your starting points on your career path.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      {/* Career Advice Cards Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* For Developers and Engineers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-blue-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-blue-50">
                  <BrainCircuit className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Developers and Engineers</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Stay Up-To-Date with Industry Trends",
                    description: "Constantly upskill to remain in demand in a rapidly changing industry."
                  },
                  {
                    title: "Focus on Problem-Solving Skills",
                    description: "Develop your problem-solving abilities to justify your proposals including intricate issues not considered 'core.'"
                  },
                  {
                    title: "Collaborate with Others",
                    description: "Develop your collaborative skills to facilitate work across multiple disciplines and technologies."
                  },
                  {
                    title: "Build a Strong Portfolio",
                    description: "A portfolio demonstrates your competencies and contributions, showing your mindset and approach to work."
                  }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Managers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-green-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-green-50">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Managers</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Work on Your Leadership Skills",
                    description: "Consider highlighting two or three leadership values for prioritizing your actions for your team."
                  },
                  {
                    title: "Develop Team Culture",
                    description: "Develop a team culture for how the team will collaborate and communicate, motivating them toward a common goal."
                  },
                  {
                    title: "Acknowledge Your Limitations",
                    description: "Develop and showcase your limitations to prove there is at least one element that could mitigate uncertainty."
                  },
                  {
                    title: "Empower Your Team",
                    description: "Commit to who will take the lead while developing human potential and simplifying processes."
                  }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Leaders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-purple-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-purple-50">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Leaders</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Develop a Vision",
                    description: "Create a vision for the organization and share it with your team."
                  },
                  {
                    title: "Build a Talented Team",
                    description: "Create a team that is diverse and talented and shares the vision and values."
                  },
                  {
                    title: "Foster Innovation",
                    description: "Inspire innovation and experimentation to allow growth and success to take place."
                  },
                  {
                    title: "Lead by Example",
                    description: "Model the ways and values you want from your team."
                  }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-purple-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Stakeholders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-orange-50">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">For Stakeholders</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Communicate Effectively",
                    description: "Communicate clearly and consistently with the development team to ensure successful project delivery."
                  },
                  {
                    title: "Provide Feedback",
                    description: "Provide feedback on a regular basis to improve and grow."
                  },
                  {
                    title: "Be Open-Minded",
                    description: "Be willing to hear other ideas and perspectives."
                  },
                  {
                    title: "Focus on Outcomes",
                    description: "Focus on outcomes and results, not just process and procedures."
                  }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Key Takeaways Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Key Takeaways</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              At NIDDIK we can offer help and assistance toward your career growth and development for successful outcomes. 
              Whether you're entering the field of development or you are an existing professional, we can help you to:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Be Curious",
                description: "Be curious and engage in ongoing learning to remain in front of your field.",
                icon: <Book className="w-8 h-8 text-blue-500" />,
                color: "from-blue-50 to-blue-100"
              },
              {
                title: "Be Adaptable",
                description: "Be adaptable and flexible to pivot when the need arises.",
                icon: <Rocket className="w-8 h-8 text-green-500" />,
                color: "from-green-50 to-green-100"
              },
              {
                title: "Be Collaborative",
                description: "Engaging others effectively to achieve specific goals.",
                icon: <Users className="w-8 h-8 text-purple-500" />,
                color: "from-purple-50 to-purple-100"
              },
              {
                title: "Focus on Outcomes",
                description: "Outcomes are much more important than process and procedures, for quality results.",
                icon: <Target className="w-8 h-8 text-orange-500" />,
                color: "from-orange-50 to-orange-100"
              }
            ].map((takeaway, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${takeaway.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200`}
              >
                <div className="mb-4 flex justify-center">{takeaway.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{takeaway.title}</h3>
                <p className="text-gray-600 text-center text-sm">{takeaway.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Ready to Start Your Journey?</h3>
              <p className="text-gray-600 mb-6">
                We hope these insights and advice are helpful in your career journey. If you have any questions or would like to learn more about NIDDIK, please don't hesitate to reach out!
              </p>
              <p className="text-sm font-semibold text-blue-600">
                NIDDIK (AN IT DIVISION OF NIDDIKKARE)
              </p>
            </div>
          </motion.div>
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

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  TrendingUp, Brain, Users, Target, Zap, CheckCircle, BarChart2, ArrowRight, 
  Globe, BrainCircuit, Award, Users2, Network, Cpu, BookOpen, Lightbulb,
  Code, Heart, Wrench, Building, MessageSquare, FileText, Star, Trophy
} from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Button } from "@/components/ui/button";

const HiringAdvice = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const hiringCategories = [
    {
      title: "For Techies",
      icon: <Code className="w-12 h-12 text-blue-600" />,
      advice: [
        {
          title: "Stay Current",
          description: "Show an interest or knowledge of recent technologies and trends in your field. For example, keep up with the latest in AI, machine learning, cloud computing, etc.",
          icon: <Lightbulb className="w-6 h-6 text-blue-500" />
        },
        {
          title: "Portfolio Development",
          description: "Create a portfolio that showcases your work to share with future employers. Appropriately highlight your projects and problem-solving skills that are relevant in software development, data analysis, etc.",
          icon: <FileText className="w-6 h-6 text-blue-500" />
        },
        {
          title: "Soft Skills",
          description: "Work on your communication, team work, and problem-solving skills. Be sure to present your experience working as a team player communicating complex ideas and solving technical issues.",
          icon: <MessageSquare className="w-6 h-6 text-blue-500" />
        },
        {
          title: "Comprehend our Business Needs",
          description: "Get to know NIDDIK's product(s) and services so you can offer and position your solutions and show our business objectives.",
          icon: <Building className="w-6 h-6 text-blue-500" />
        }
      ],
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "For Vendors",
      icon: <Wrench className="w-12 h-12 text-green-600" />,
      advice: [
        {
          title: "Quality Assurance",
          description: "Demonstrate your commitment to quality through certifications, case studies, and proven track records of successful project delivery.",
          icon: <Trophy className="w-6 h-6 text-green-500" />
        },
        {
          title: "Scalability Focus",
          description: "Show how your solutions can scale with our growing business needs and adapt to changing market demands.",
          icon: <TrendingUp className="w-6 h-6 text-green-500" />
        },
        {
          title: "Partnership Mindset",
          description: "Approach our relationship as a long-term partnership rather than a transactional engagement. Show commitment to our mutual success.",
          icon: <Heart className="w-6 h-6 text-green-500" />
        },
        {
          title: "Innovation Alignment",
          description: "Align your offerings with our innovation goals and demonstrate how you can contribute to our technological advancement.",
          icon: <BrainCircuit className="w-6 h-6 text-green-500" />
        }
      ],
      color: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "For Channel Partners",
      icon: <Network className="w-12 h-12 text-purple-600" />,
      advice: [
        {
          title: "Market Understanding",
          description: "Demonstrate deep understanding of your target markets and how NIDDIK's solutions can address specific customer pain points.",
          icon: <Globe className="w-6 h-6 text-purple-500" />
        },
        {
          title: "Sales Excellence",
          description: "Show proven sales track record and ability to effectively communicate value propositions to diverse customer bases.",
          icon: <Target className="w-6 h-6 text-purple-500" />
        },
        {
          title: "Relationship Building",
          description: "Emphasize your ability to build and maintain long-term customer relationships that drive repeat business and referrals.",
          icon: <Users className="w-6 h-6 text-purple-500" />
        },
        {
          title: "Growth Potential",
          description: "Present clear plans for market expansion and revenue growth that align with NIDDIK's strategic objectives.",
          icon: <BarChart2 className="w-6 h-6 text-purple-500" />
        }
      ],
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    }
  ];

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
            className="text-center max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-blue-600 mr-4" />
              <span className="text-xl font-semibold text-blue-600 tracking-wider">NIDDIK'S HIRING ADVICE</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold pb-5 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
              Building Diverse &
              <br />
              Talented Teams
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              At NIDDIK, we are passionate about building a diverse and talented team of techies, vendors, 
              and channel partners who love innovation and customer satisfaction as much as we do! 
              If you're looking to join an exciting organization that is moving technology forward, 
              here are some ways to increase your chances of getting hired.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-lg px-8 py-4 h-auto text-white"
              >
                <span className="flex items-center">
                  <Star className="mr-2 w-5 h-5" />
                  View Open Positions
                </span>
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
              >
                <span className="flex items-center">
                  Contact Our Team
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* NIDDIK's Hiring Advice Categories */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Tailored Advice for Every Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specific guidance to help you excel in your desired position at NIDDIK
            </p>
          </motion.div>

          <div className="space-y-12">
            {hiringCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.2 }}
                className={`bg-gradient-to-r ${category.color} rounded-3xl p-8 ${category.borderColor} border-2`}
              >
                <div className="flex items-center mb-8">
                  <div className="mr-6">{category.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-800">{category.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.advice.map((advice, adviceIndex) => (
                    <motion.div
                      key={adviceIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (categoryIndex * 0.2) + (adviceIndex * 0.1) }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start mb-4">
                        <div className="mr-4 mt-1">{advice.icon}</div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-3">{advice.title}</h4>
                          <p className="text-gray-600 leading-relaxed">{advice.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Insight Cards - Existing Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Modern Hiring Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert guidance on building and scaling high-performing technical teams in today's dynamic landscape
            </p>
          </motion.div>

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

      {/* Interactive Best Practices - Existing Section */}
      <section className="py-20 bg-white">
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

      {/* Interactive Timeline - Existing Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/30 to-emerald-50/30">
        <Container>
          <motion.div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Hiring Evolution Timeline</h2>
            <div className="relative">
              {/* Timeline center line */}
              <div className="absolute left-[2.5rem] top-0 bottom-0 w-0.5 bg-blue-200"></div>

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
                      <h3 className="text-xl font-semibold text-gray-800">
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

      {/* What We're Looking For Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <Users className="w-8 h-8 mr-3" />
              <span className="text-xl font-semibold tracking-wider">WHAT WE'RE LOOKING FOR</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Join Our Vision for
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Innovation & Excellence
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              At NIDDIK we are looking for individuals and partners to share in our enthusiasm for innovation 
              and customer satisfaction. We need great Techies, Vendors, and Channel Partners that are:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Innovative",
                description: "We want people with imagination to think outside the box to find creative ways to solve problems.",
                icon: <Lightbulb className="w-12 h-12" />,
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                title: "Collaborative",
                description: "We simply would like individuals and partners to be able to work together with our team.",
                icon: <Users2 className="w-12 h-12" />,
                gradient: "from-blue-400 to-cyan-500"
              },
              {
                title: "Customer-Centric",
                description: "We tremendous effort and commitment takes place behind the scenes to deliver exceptional customer experiences.",
                icon: <Heart className="w-12 h-12" />,
                gradient: "from-pink-400 to-red-500"
              }
            ].map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-full border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${quality.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                    {quality.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{quality.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{quality.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How to Apply Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full opacity-30 -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-100 to-pink-100 rounded-full opacity-30 translate-x-48 translate-y-48"></div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center mb-8">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-xl font-semibold text-blue-600 tracking-wider uppercase">How to Apply</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-gray-800 leading-tight">
              Ready to Make an
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Impact?
              </span>
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-3xl p-12 mb-12 border-2 border-blue-100"
            >
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                If you are interested in becoming part of our team or you are interested in partnering with us, 
                please make your application or proposal via our website. And remember to make it specific to your 
                needs and requirements - identify your skills, experience and achievements.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-lg px-10 py-4 h-auto shadow-xl text-white"
                  >
                    <span className="flex items-center">
                      <Trophy className="mr-3 w-6 h-6" />
                      Apply for a Position
                    </span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-10 py-4 h-auto shadow-lg"
                  >
                    <span className="flex items-center">
                      <Network className="mr-3 w-6 h-6" />
                      Partner With Us
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200"
            >
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <h3 className="text-3xl font-bold text-gray-800">WE LOOK FORWARD TO HEARING WHAT YOU CAN OFFER!</h3>
              </div>
              <p className="text-lg text-gray-600">
                Your unique skills and perspective could be exactly what we need to drive innovation forward.
              </p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Success Checklist - Existing Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
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
                  className="flex items-center gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm"
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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Container from "@/components/ui/container";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Zap, 
  Eye, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Network,
  Bot,
  Shield,
  Lightbulb,
  Gauge
} from "lucide-react";

const Insights = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [activeInsight, setActiveInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const keyInsights = [
    {
      title: "AI-Based Candidate Sourcing",
      icon: <Brain className="w-8 h-8" />,
      description: "Machine learning algorithms analyze data from social media, job boards, and professional networks to identify top candidates.",
      color: "from-blue-500 to-purple-600",
      stats: { efficiency: "85%", sources: "50+", accuracy: "92%" }
    },
    {
      title: "Predictive Analytics",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "Advanced analytics predict current and future talent needs, enabling proactive acquisition strategies.",
      color: "from-green-500 to-teal-600",
      stats: { prediction: "94%", timeframe: "12M", accuracy: "89%" }
    },
    {
      title: "Automated Screening",
      icon: <Target className="w-8 h-8" />,
      description: "AI-powered tools filter unqualified candidates, reducing time-to-hire while improving candidate quality.",
      color: "from-orange-500 to-red-600",
      stats: { timeReduction: "70%", quality: "95%", automation: "80%" }
    },
    {
      title: "Personalized Experience",
      icon: <Users className="w-8 h-8" />,
      description: "AI-driven chatbots and virtual assistants create personalized candidate experiences and improve engagement.",
      color: "from-purple-500 to-pink-600",
      stats: { engagement: "88%", satisfaction: "91%", response: "24/7" }
    },
    {
      title: "Bias Mitigation",
      icon: <Shield className="w-8 h-8" />,
      description: "AI tools address unconscious biases in hiring to promote diversity, inclusion, and fairness.",
      color: "from-indigo-500 to-blue-600",
      stats: { diversity: "45%", fairness: "96%", inclusion: "82%" }
    },
    {
      title: "Data-Driven Decisions",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Comprehensive data analysis improves hiring decisions and predicts candidate performance.",
      color: "from-teal-500 to-green-600",
      stats: { accuracy: "93%", performance: "87%", dataPoints: "100+" }
    }
  ];

  const benefits = [
    { title: "Enhanced Efficiency", value: "70%", description: "Reduction in time-to-hire" },
    { title: "Improved Experience", value: "91%", description: "Candidate satisfaction rate" },
    { title: "Data-Driven Results", value: "93%", description: "Decision accuracy" },
    { title: "Diversity Boost", value: "45%", description: "Increase in diverse hires" },
    { title: "Competitive Edge", value: "2.5x", description: "Faster than traditional methods" }
  ];

  const recommendations = [
    {
      title: "AI-Infused Platforms",
      description: "Employ platforms with AI tools for sourcing, screening, and candidate management",
      icon: <Network className="w-6 h-6" />
    },
    {
      title: "Data-Driven Model",
      description: "Implement hiring models based on comprehensive talent data analysis",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Assessment Tools",
      description: "Use AI-powered tools to assess skills, personality, and role fit",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Enhanced Experience",
      description: "Deploy chatbots and virtual assistants for personalized candidate journeys",
      icon: <Bot className="w-6 h-6" />
    },
    {
      title: "Continuous Monitoring",
      description: "Monitor and refine AI processes for fairness, efficiency, and effectiveness",
      icon: <Gauge className="w-6 h-6" />
    },
    {
      title: "Training & Tools",
      description: "Provide comprehensive training on AI-powered recruitment technologies",
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AnnouncementBar onVisibilityChange={handleAnnouncementVisibilityChange} />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section with Animated Background */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Floating AI Nodes */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          
          {/* Neural Network Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={i}
                x1={Math.random() * 100 + "%"}
                y1={Math.random() * 100 + "%"}
                x2={Math.random() * 100 + "%"}
                y2={Math.random() * 100 + "%"}
                stroke="url(#gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
              <span className="text-lg font-semibold text-blue-600 tracking-wide">AI INSIGHTS</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              The Future of
              <br />
              Intelligent Hiring
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Discover how NIDDIK's AI-powered recruitment platform is revolutionizing 
              talent acquisition through advanced machine learning, predictive analytics, 
              and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                <Link href="/request-demo" className="flex items-center text-white">
                  Explore AI Solutions
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              >
                <Link href="/whitepaper" className="flex items-center">
                  Download Whitepaper
                  <Eye className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Interactive Key Insights Grid */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              Key AI Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore how our advanced AI technologies are transforming every aspect of recruitment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="group relative"
              >
                <div className={`relative h-full bg-gradient-to-br ${insight.color} p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-white overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-8 -translate-y-8">
                      <div className="w-full h-full bg-white/20 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 p-3 bg-white/20 rounded-lg w-fit">
                      {insight.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{insight.title}</h3>
                    <p className="text-white/90 mb-6 leading-relaxed">{insight.description}</p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(insight.stats).map(([key, value], idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-white">{value}</div>
                          <div className="text-xs text-white/80 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Visualization */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/circuit-board-pattern.svg')] opacity-5"></div>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Measurable Benefits
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Real impact delivered through AI-powered recruitment solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:shadow-xl transition-shadow">
                    <span className="text-3xl font-bold">{benefit.value}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 scale-110 animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-blue-200 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Actionable Recommendations */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              Actionable Recommendations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic steps to implement AI-powered recruitment in your organization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white mr-4">
                    {rec.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{rec.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{rec.description}</p>
                <div className="mt-6">
                  <ChevronRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-64 h-64 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-10 w-48 h-48 border border-white/10 rounded-full"
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-xl mb-12 text-blue-100">
              Join leading companies using NIDDIK's AI-powered recruitment platform 
              to build exceptional teams faster and smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                <Link href="/request-demo" className="flex items-center">
                  Start Your AI Journey
                  <Zap className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-3"
              >
                <Link href="/contact" className="flex items-center">
                  Contact Our Experts
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Insights;

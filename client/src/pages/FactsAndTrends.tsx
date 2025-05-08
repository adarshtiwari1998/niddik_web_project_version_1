
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, BarChart2, TrendingUp, Users, Globe, BrainCircuit, Building, Clock, Layers, Users2, Network, ChartBar, GitBranch, Gauge, LineChart, Shield } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const FactsAndTrends = () => {
    const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
    
      const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
        setIsAnnouncementVisible(isVisible);
      };
    
  const trends = [
    {
      title: "AI-Driven Recruitment",
      stat: "73%",
      description: "Increase in hiring efficiency through AI-powered candidate matching",
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Remote Work Evolution",
      stat: "85%",
      description: "Of tech companies now offer permanent remote work options",
      icon: <Globe className="w-8 h-8 text-green-400" />
    },
    {
      title: "Skill-Based Hiring",
      stat: "64%",
      description: "Companies prioritizing skills over traditional qualifications",
      icon: <Users className="w-8 h-8 text-purple-400" />
    }
  ];

  const rpoServices = [
    {
      title: "Full RPO",
      stats: [
        { value: "40%", label: "Cost Reduction" },
        { value: "60%", label: "Time-to-Hire Improvement" }
      ],
      features: ["End-to-end recruitment", "Dedicated team", "Complete process ownership"],
      icon: <Building className="w-12 h-12 text-blue-400" />
    },
    {
      title: "On-Demand RPO",
      stats: [
        { value: "48h", label: "Average Response Time" },
        { value: "95%", label: "Client Satisfaction" }
      ],
      features: ["Flexible scaling", "Pay-per-hire", "Immediate support"],
      icon: <Clock className="w-12 h-12 text-green-400" />
    },
    {
      title: "Hybrid RPO",
      stats: [
        { value: "35%", label: "Resource Optimization" },
        { value: "50%", label: "Process Efficiency" }
      ],
      features: ["Customized solution", "Balanced approach", "Strategic support"],
      icon: <Layers className="w-12 h-12 text-purple-400" />
    },
    {
      title: "Contingent",
      stats: [
        { value: "24h", label: "Talent Access" },
        { value: "80%", label: "Success Rate" }
      ],
      features: ["Quick deployment", "Quality assurance", "Risk management"],
      icon: <Users2 className="w-12 h-12 text-orange-400" />
    }
  ];

  const adaptiveHiringMetrics = [
    {
      title: "AI-Powered Matching",
      value: "93%",
      description: "Candidate-role fit accuracy",
      icon: <BrainCircuit className="w-10 h-10 text-blue-400" />
    },
    {
      title: "Process Optimization",
      value: "45%",
      description: "Reduction in time-to-hire",
      icon: <Gauge className="w-10 h-10 text-green-400" />
    },
    {
      title: "Quality of Hire",
      value: "87%",
      description: "Long-term retention rate",
      icon: <Shield className="w-10 h-10 text-purple-400" />
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
      <div className="relative overflow-hidden mt-6 pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl pb-6 font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Facts & Trends
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest insights and trends shaping the future of tech recruitment and workforce evolution
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Trends Grid */}
      <section className="py-20 bg-blue-50/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl p-8 border border-gray-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
              >
                <div className="mb-4">{trend.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{trend.title}</h3>
                <p className="text-4xl font-bold text-blue-400 mb-4">{trend.stat}</p>
                <p className="text-gray-600">{trend.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* RPO Services Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              RPO Services Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the impact and efficiency of our various RPO service models
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rpoServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gradient-to-b from-white to-blue-50/30 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                
                <div className="space-y-4 mb-6">
                  {service.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-500">{stat.value}</span>
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <ArrowRight className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Adaptive Hiring Impact */}
      <section className="py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Adaptive Hiring Impact
              </h2>
              <p className="text-xl text-gray-600">
                Revolutionary recruitment approach powered by AI and data analytics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adaptiveHiringMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="flex justify-center mb-4">{metric.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{metric.title}</h3>
                  <p className="text-4xl font-bold text-blue-500 mb-2">{metric.value}</p>
                  <p className="text-gray-600">{metric.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Interactive Graph Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 bg-white rounded-xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Performance Metrics</h3>
                <div className="flex gap-4">
                  <LineChart className="w-6 h-6 text-blue-400" />
                  <ChartBar className="w-6 h-6 text-green-400" />
                  <GitBranch className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              
              <div className="h-64 w-full bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-lg flex items-end justify-around p-4">
                {[65, 80, 45, 90, 70].map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-12 bg-gradient-to-t from-blue-400 to-green-400 rounded-t-lg"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default FactsAndTrends;

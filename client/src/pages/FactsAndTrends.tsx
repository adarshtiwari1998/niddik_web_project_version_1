
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { TrendingUp, Globe, Building, Users, ChevronRight, Play, Pause, BarChart3, DollarSign, MapPin, Briefcase, ArrowUpRight, Zap, Target, Brain, Heart, Wrench } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Button } from "@/components/ui/button";

const FactsAndTrends = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const marketData = {
    current: { value: 757, year: 2024, label: "Current Market Size" },
    projected: { value: 2292.24, year: 2033, label: "Projected Market Size" },
    growth: { value: 13.1, label: "CAGR %" }
  };

  const keyPlayers = [
    {
      name: "Randstad",
      revenue: 29.5,
      growth: 4.1,
      country: "Netherlands",
      description: "Global leader in workforce solutions",
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Adecco Group",
      revenue: 19.7,
      growth: 4.5,
      country: "Switzerland",
      description: "World's largest staffing firm",
      color: "from-purple-500 to-purple-700"
    },
    {
      name: "ManpowerGroup",
      revenue: 20.4,
      growth: 3.2,
      country: "USA",
      description: "Pioneering workforce solutions",
      color: "from-green-500 to-green-700"
    }
  ];

  const keyTrends = [
    {
      title: "Digital Transformation",
      description: "AI and automation revolutionizing recruitment efficiency and candidate matching",
      icon: <Brain className="w-8 h-8" />,
      growth: "85%",
      metric: "Efficiency Increase",
      color: "from-cyan-400 to-blue-600"
    },
    {
      title: "Temporary Staffing",
      description: "Companies embracing flexible workforce models for changing business needs",
      icon: <Users className="w-8 h-8" />,
      growth: "65%",
      metric: "Market Growth",
      color: "from-purple-400 to-pink-600"
    },
    {
      title: "Remote Work Revolution",
      description: "Global talent pools accessible through remote work transformation",
      icon: <Globe className="w-8 h-8" />,
      growth: "120%",
      metric: "Remote Positions",
      color: "from-green-400 to-teal-600"
    }
  ];

  const soughtAfterPositions = [
    {
      category: "Technology",
      positions: ["Software Engineers", "Data Scientists", "IT Support Specialists"],
      icon: <Brain className="w-12 h-12" />,
      demand: "Very High",
      growth: "+35%",
      color: "from-blue-500 to-indigo-600"
    },
    {
      category: "Sales & Marketing",
      positions: ["Sales Representatives", "Digital Marketing Specialists", "Growth Hackers"],
      icon: <Target className="w-12 h-12" />,
      demand: "High",
      growth: "+28%",
      color: "from-purple-500 to-pink-600"
    },
    {
      category: "Healthcare",
      positions: ["Nurses", "Healthcare Assistants", "Medical Technicians"],
      icon: <Heart className="w-12 h-12" />,
      demand: "Critical",
      growth: "+42%",
      color: "from-red-500 to-orange-600"
    },
    {
      category: "Engineering",
      positions: ["Site Managers", "Project Engineers", "Infrastructure Specialists"],
      icon: <Wrench className="w-12 h-12" />,
      demand: "High",
      growth: "+31%",
      color: "from-green-500 to-teal-600"
    }
  ];

  const geographicalData = [
    {
      region: "North America",
      description: "Largest market driven by technology and healthcare sectors",
      growth: "+15.2%",
      focus: "Tech & Healthcare",
      color: "bg-blue-500"
    },
    {
      region: "Europe",
      description: "Strong growth in manufacturing and financial services",
      growth: "+11.8%",
      focus: "Manufacturing & Finance",
      color: "bg-purple-500"
    },
    {
      region: "Asia-Pacific",
      description: "Rapid expansion through digital platform adoption",
      growth: "+18.7%",
      focus: "Digital Transformation",
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <AnnouncementBar 
        text="Download our comprehensive market insights report"
        linkText="Get Report"
        linkUrl="/whitepaper"
        bgColor="bg-gradient-to-r from-blue-600 to-purple-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/circuit-board-pattern.svg')] opacity-5"></div>
        {Array.from({ length: 100 }).map((_, i) => (
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
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <BarChart3 className="w-10 h-10 text-blue-400 mr-4" />
              <span className="text-xl font-semibold text-blue-300 tracking-wider">MARKET INTELLIGENCE</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Global Recruitment
              <br />
              Market Insights
            </h1>
            
            <p className="text-2xl text-blue-200 mb-12 leading-relaxed max-w-4xl mx-auto">
              Discover the explosive growth trends, key players, and emerging opportunities 
              shaping the future of talent acquisition worldwide
            </p>

            {/* Market Size Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20">
                  <div className="text-5xl font-bold text-blue-400 mb-2">${marketData.current.value}B</div>
                  <div className="text-blue-200">{marketData.current.label}</div>
                  <div className="text-sm text-blue-300 mt-1">{marketData.current.year}</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20">
                  <div className="text-5xl font-bold text-purple-400 mb-2">${marketData.projected.value}B</div>
                  <div className="text-purple-200">{marketData.projected.label}</div>
                  <div className="text-sm text-purple-300 mt-1">{marketData.projected.year}</div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20">
                  <div className="text-5xl font-bold text-green-400 mb-2">{marketData.growth.value}%</div>
                  <div className="text-green-200">{marketData.growth.label}</div>
                  <div className="text-sm text-green-300 mt-1">Annual Growth</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Key Players Section */}
      <section className="relative z-10 py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Market Leaders
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              The global giants driving innovation in workforce solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {keyPlayers.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${player.color} p-8 rounded-2xl shadow-2xl relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-8 -translate-y-8">
                      <div className="w-full h-full bg-white/20 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <Building className="w-10 h-10 text-white/80" />
                      <span className="text-sm text-white/70">{player.country}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{player.name}</h3>
                    <p className="text-white/80 mb-6">{player.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Revenue</span>
                        <span className="text-2xl font-bold text-white">${player.revenue}B</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Growth</span>
                        <span className="text-xl font-bold text-green-300">+{player.growth}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${player.growth * 20}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Trends Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transformative Trends
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Revolutionary forces reshaping the recruitment landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyTrends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className={`bg-gradient-to-br ${trend.color} p-8 rounded-2xl shadow-2xl relative overflow-hidden h-full`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 p-4 bg-white/20 rounded-xl w-fit">
                      {trend.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{trend.title}</h3>
                    <p className="text-white/90 mb-6 leading-relaxed">{trend.description}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                      <div>
                        <div className="text-3xl font-bold text-white">{trend.growth}</div>
                        <div className="text-white/80 text-sm">{trend.metric}</div>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Most Sought-After Positions */}
      <section className="relative z-10 py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              In-Demand Positions
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              The most coveted roles driving market growth across industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {soughtAfterPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${position.color} p-6 rounded-xl shadow-xl relative overflow-hidden h-full`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/80">{position.icon}</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{position.growth}</div>
                        <div className="text-white/80 text-sm">Growth</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{position.category}</h3>
                    <div className="text-white/90 text-sm mb-4">Demand: {position.demand}</div>
                    
                    <ul className="space-y-2">
                      {position.positions.map((pos, idx) => (
                        <li key={idx} className="text-white/80 text-sm flex items-center">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></div>
                          {pos}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Geographical Trends */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Global Expansion
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Regional growth patterns driving worldwide recruitment evolution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {geographicalData.map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <MapPin className="w-8 h-8 text-blue-400" />
                    <div className={`px-3 py-1 ${region.color} text-white rounded-full text-sm font-semibold`}>
                      {region.growth}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{region.region}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{region.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white/70">Focus Area</span>
                    <span className="text-white font-semibold">{region.focus}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Lead the Market?
            </h2>
            <p className="text-xl text-blue-200 mb-12">
              Join the global leaders leveraging these insights to transform their recruitment strategies 
              and capture tomorrow's opportunities today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
              >
                <span className="flex items-center text-white">
                  <Zap className="mr-2 w-5 h-5" />
                  Get Market Intelligence Report
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-andela-green hover:bg-white/10  hover:text-white text-lg px-8 py-4 h-auto backdrop-blur-sm"
              >
                <span className="flex items-center">
                  Schedule Strategy Call
                  <ChevronRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default FactsAndTrends;

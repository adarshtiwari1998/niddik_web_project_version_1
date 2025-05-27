
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Globe, Leaf, School, Users, Sparkles, ArrowRight, Lightbulb, Award, Network, BrainCircuit, TreePine, Building2, Monitor, Zap, Target, Shield } from "lucide-react";
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
       <div className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-emerald-50/30 to-purple-50/30">
          {/* Animated particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              }}
              transition={{
                duration: 15 + Math.random() * 25,
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
            <h1 className="text-6xl font-bold pb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Technology for Good
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Driving positive change through innovative tech initiatives and sustainable practices
            </p>
          </motion.div>
        </Container>
      </div>

      

      {/* Revolutionary CSR Initiatives - Unique Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #3b82f6 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Corporate Social Responsibility in Recruitment
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Addressing Global Tech Education, Carbon Neutral Hiring, and Digital Inclusion through innovative practices
            </p>
          </motion.div>

          {/* Three Main Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Global Tech Education",
                icon: <School className="w-10 h-10 text-emerald-500" />,
                gradient: "from-emerald-500/10 to-emerald-600/20",
                borderColor: "border-emerald-200",
                content: [
                  "Companies like Acre lead sustainability recruitment, connecting talent with organizations driving positive environmental and social impact",
                  "Collaboration with educational institutions for training programs in emerging technologies",
                  "Offering sabbaticals for employees to work with non-profits and social enterprises"
                ]
              },
              {
                title: "Carbon Neutral Hiring",
                icon: <TreePine className="w-10 h-10 text-green-500" />,
                gradient: "from-green-500/10 to-green-600/20",
                borderColor: "border-green-200",
                content: [
                  "Active stance on carbon offsetting to establish reduced environmental footprint",
                  "Partnership with clients to create sustainable business practices reducing carbon emissions",
                  "Environmentally-friendly recruitment through virtual interviews and digital documentation"
                ]
              },
              {
                title: "Digital Inclusion",
                icon: <Monitor className="w-10 h-10 text-blue-500" />,
                gradient: "from-blue-500/10 to-blue-600/20",
                borderColor: "border-blue-200",
                content: [
                  "Supporting digital inclusion by providing technology access to underrepresented groups",
                  "Working with non-profits to fill the digital gap for marginalized communities",
                  "Creating inclusive and accessible digital products and services"
                ]
              }
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 ${pillar.borderColor} hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-2xl bg-gray-50 mr-4 group-hover:scale-110 transition-transform duration-300">
                      {pillar.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{pillar.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {pillar.content.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-start"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3 mt-2 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Benefits of CSR Initiatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Employee Engagement",
                  description: "Increased motivation and retention through meaningful work",
                  icon: <Users className="w-8 h-8 text-purple-500" />,
                  color: "purple"
                },
                {
                  title: "Brand Reputation",
                  description: "Enhanced reputation attracts top talent and clients",
                  icon: <Award className="w-8 h-8 text-blue-500" />,
                  color: "blue"
                },
                {
                  title: "Diverse Talent",
                  description: "Access to candidates from varied backgrounds",
                  icon: <Globe className="w-8 h-8 text-emerald-500" />,
                  color: "emerald"
                },
                {
                  title: "Innovation",
                  description: "CSR initiatives drive workplace creativity",
                  icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
                  color: "amber"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-2xl bg-${benefit.color}-50 mb-4`}>
                      {benefit.icon}
                    </div>
                    <h4 className="text-lg font-bold mb-3 text-gray-900">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leading Companies Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Companies Leading CSR Initiatives</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Acre",
                  description: "A recruiting agency leading on sustainability and environment, connecting professionals with organizations having positive environmental and social impact",
                  icon: <Leaf className="w-8 h-8 text-green-500" />,
                  gradient: "from-green-500/10 to-emerald-500/10"
                },
                {
                  name: "EnableGreen",
                  description: "Sustainability recruitment agency working with companies like Masdar Renewable Energy and RWE for cutting-edge ESG talent",
                  icon: <Zap className="w-8 h-8 text-blue-500" />,
                  gradient: "from-blue-500/10 to-cyan-500/10"
                },
                {
                  name: "Deloitte",
                  description: "CSR initiatives focusing on social entrepreneurship, leveraging market viability for talent generation and business development",
                  icon: <Building2 className="w-8 h-8 text-purple-500" />,
                  gradient: "from-purple-500/10 to-indigo-500/10"
                }
              ].map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative rounded-2xl p-8 bg-gradient-to-br ${company.gradient} border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-xl bg-white/50 mr-4">
                        {company.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">{company.name}</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{company.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      

      {/* Interactive 3D Cards Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 relative overflow-hidden">
        <Container>
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 text-gray-900"
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
                color: "from-purple-500/10"
              },
              {
                title: "Virtual Reality Interviews",
                description: "Immersive assessment environments for real-world scenarios",
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                color: "from-blue-500/10"
              },
              {
                title: "Secure Trust Network",
                description: "Multi-source credential and experience validation",
                icon: <Network className="w-8 h-8 text-emerald-500" />,
                color: "from-emerald-500/10"
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
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform-gpu group-hover:rotate-y-10 border border-gray-100 ${card.color}`}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"
                    style={{ backdropFilter: 'blur(4px)' }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="mb-6 p-3 rounded-lg inline-block bg-gray-50"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {card.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{card.title}</h3>
                    <p className="text-gray-700">{card.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      


      <Footer />
    </div>
  );
};

export default CorporateResponsibilities;

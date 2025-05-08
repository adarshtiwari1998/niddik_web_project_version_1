import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Award, Globe, Clock, BarChart2, Target, BarChart3, Briefcase, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const CommunityInvolvement = () => {
      const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
                            
                        const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
                                setIsAnnouncementVisible(isVisible);
                        };
  return (
    <div className="min-h-screen bg-gray-100">
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
      <Container>
        {/* Header Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center my-16"
        >
          <h1 className="text-4xl font-bold">Community Involvement</h1>
          <p className="text-lg text-gray-600 mt-4">
            Let us help you find and engage the best candidates, so you can focus on making strategic hiring decisions.
          </p>
        </motion.div> */}
        
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
                         <h1 className="text-4xl font-bold">Community Involvement</h1>
          <p className="text-lg text-gray-600 mt-4">
            Let us help you find and engage the best candidates, so you can focus on making strategic hiring decisions.
          </p>
                          </motion.div>
                        </div>
                      </Container>
                    </section>

        {/* Statistics Section */}
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 mb-10">
          <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">12+</h2>
            <p className="text-gray-600">Panelled Customers</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">4</h2>
            <p className="text-gray-600">Placements in India</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Globe className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">500K+</h2>
            <p className="text-gray-600">Talent Pools</p>
          </motion.div>
          <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">10K+</h2>
            <p className="text-gray-600">Communities Engaged</p>
          </motion.div>
          {/* New Interactive Cards */}
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <BarChart2 className="w-12 h-12 text-teal-500 mx-auto mb-4" /> {/* Use BarChart2 */}
            <h2 className="text-3xl font-semibold">50%</h2>
            <p className="text-gray-600">Decrease in Time to Submit</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <Clock className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">40%</h2>
            <p className="text-gray-600">Improvement in Response Rate</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <Users className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">3</h2>
            <p className="text-gray-600">Success Stories</p>
          </motion.div>
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <Users className="w-12 h-12 text-lime-500 mx-auto mb-4" />
            <h2 className="text-3xl font-semibold">200+</h2>
            <p className="text-gray-600">Candidates Engaged</p>
          </motion.div>
        </div>
      </Container>
   {/* Niddik Makes Adaptive Hiring Easier Section */}
   <section className="py-20 bg-white relative">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">
              Niddik makes Adaptive Hiring easier
            </h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              We provide the tools, technology, and talent network to make adaptive hiring work for your organization.
            </p>
          </motion.div>
          
          {/* Tab Controls - Now with State Management */}
          {(() => {
            // Tabbed content setup with state
            const [activeTab, setActiveTab] = useState(0);
            
            // Tab content definitions
            const tabContents = [
              {
                id: 'global-talent',
                title: 'Quality, global talent',
                icon: <Users />,
                description: 'Unlock a vast pool of untapped global talent, with 60% from emerging tech hubs in Africa and LATAM. Niddik\'s borderless marketplace spans 135 countries, connecting you with the right skills to drive innovation, regardless of location.',
                benefits: [
                  'Access to over 150,000 vetted tech professionals globally',
                  'Rigorous assessment to ensure only top 1% of talent',
                  'Diversity of backgrounds and perspectives to drive innovation'
                ]
              },
              {
                id: 'cost-optimization',
                title: 'Cost Optimization',
                icon: <BarChart3 />,
                description: 'Reduce hiring costs by up to 40% with our streamlined matching process. Our transparent pricing model eliminates hidden fees while providing access to higher-quality talent at more competitive rates than traditional staffing models.',
                benefits: [
                  'No recruitment fees or placement commissions',
                  'Flexible contracts without long-term commitments',
                  'Reduced onboarding and training costs'
                ]
              },
              {
                id: 'agile-deployment',
                title: 'Agile Deployment',
                icon: <Briefcase />,
                description: 'Move from candidate selection to fully-integrated team members in days, not months. Our pre-vetted talent pool and streamlined onboarding process means you can quickly adapt to changing project needs.',
                benefits: [
                  'Deployment in as little as 48 hours',
                  'Seamless integration with your existing workflows',
                  'Comprehensive onboarding and support resources'
                ]
              },
              {
                id: 'rapid-scalability',
                title: 'Rapid Scalability',
                icon: <Target />,
                description: 'Scale your team up or down based on project demands without the typical constraints of traditional hiring. Our flexible engagement models adapt to your business cycles with minimal friction.',
                benefits: [
                  'Add specialized talent for specific project phases',
                  'Extend or reduce team size with simple contract adjustments',
                  'Build distributed teams across multiple time zones for 24/7 productivity'
                ]
              }
            ];
            
            return (
              <>
                {/* Tab Controls */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  {tabContents.map((tab, index) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(index)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                        activeTab === index 
                          ? 'bg-[#2C5F2C] text-white' 
                          : 'bg-white text-[#2C5F2C] border border-[#2C5F2C]/20 hover:bg-[#2C5F2C]/5'
                      }`}
                    >
                      <div className={activeTab === index ? 'bg-white/20 p-1.5 rounded-full' : 'bg-[#2C5F2C]/10 p-1.5 rounded-full'}>
                        <div className={`h-4 w-4 ${activeTab === index ? 'text-white' : 'text-[#2C5F2C]'}`}>
                          {tab.icon}
                        </div>
                      </div>
                      <span className="font-medium">{tab.title}</span>
                    </button>
                  ))}
                </div>
                
                {/* Content Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Interactive Map */}
                  <div className="relative">
                    <div className="rounded-lg overflow-hidden bg-[#2C5F2C]/5">
                      <div className="relative pt-[75%]"> {/* 4:3 Aspect Ratio */}
                        <div className="absolute inset-0 bg-[url('/world-dots-map.svg')] bg-no-repeat bg-center bg-contain p-8">
                          
                          {/* Tab-specific content */}
                          {activeTab === 0 && (
                            <>
                              {/* Profile Cards - Global Talent */}
                              <div className="absolute top-[20%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden border-2 border-green-400">
                                    <span className="font-semibold text-green-800">RM</span>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-semibold">Rizwan M.</div>
                                    <div className="text-xs text-gray-500">Senior Frontend Developer</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="absolute bottom-[30%] right-[20%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-md">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden border-2 border-blue-400">
                                    <span className="font-semibold text-blue-800">EO</span>
                                  </div>
                                  <div className="text-left">
                                    <div className="font-semibold">Ebiere O.</div>
                                    <div className="text-xs text-gray-500">Cloud Developer</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Mini Profile Icons */}
                              <div className="absolute top-[35%] right-[30%]">
                                <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                                  <div className="w-full h-full rounded-full bg-purple-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-purple-800">JL</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="absolute top-[60%] left-[25%]">
                                <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                                  <div className="w-full h-full rounded-full bg-yellow-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-yellow-800">AT</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="absolute top-[25%] right-[40%]">
                                <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                                  <div className="w-full h-full rounded-full bg-red-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-red-800">MS</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="absolute bottom-[40%] left-[40%]">
                                <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
                                  <div className="w-full h-full rounded-full bg-green-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-green-800">KP</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-[15%] right-[25%] w-6 h-6 transform rotate-45 bg-[#2C5F2C]/10"></div>
                              <div className="absolute bottom-[25%] right-[45%] w-4 h-4 rounded-full bg-[#2C5F2C]/10"></div>
                              <div className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-[#2C5F2C]/10"></div>
                            </>
                          )}
                          
                          {activeTab === 1 && (
                            <>
                              {/* Cost Optimization Tab Content */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%]">
                                <div className="bg-white p-5 rounded-lg shadow-md">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-[#2C5F2C]/10">
                                      <BarChart3 className="h-5 w-5 text-[#2C5F2C]" />
                                    </div>
                                    <h4 className="font-bold text-lg text-[#2C5F2C]">Cost Breakdown</h4>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between items-center mb-1 text-sm">
                                        <span>Traditional Hiring</span>
                                        <span className="font-semibold">$120,000</span>
                                      </div>
                                      <div className="h-2 bg-red-100 rounded-full w-full relative">
                                        <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full w-full"></div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="flex justify-between items-center mb-1 text-sm">
                                        <span>Niddik Solution</span>
                                        <span className="font-semibold">$72,000</span>
                                      </div>
                                      <div className="h-2 bg-[#2C5F2C]/10 rounded-full w-full relative">
                                        <div className="absolute inset-y-0 left-0 bg-[#2C5F2C] rounded-full w-[60%]"></div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-center mt-4 pt-4 border-t">
                                      <div className="text-2xl font-bold text-[#2C5F2C]">40% Savings</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-[15%] right-[25%] w-6 h-6 transform rotate-45 bg-[#2C5F2C]/10"></div>
                              <div className="absolute bottom-[25%] left-[20%] w-6 h-6 rounded-full bg-[#2C5F2C]/10"></div>
                              <div className="absolute top-[35%] left-[15%] w-3 h-3 rounded-full bg-[#2C5F2C]/10"></div>
                            </>
                          )}
                          
                          {activeTab === 2 && (
                            <>
                              {/* Agile Deployment Tab Content */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%]">
                                <div className="bg-white p-5 rounded-lg shadow-md">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-[#2C5F2C]/10">
                                      <Briefcase className="h-5 w-5 text-[#2C5F2C]" />
                                    </div>
                                    <h4 className="font-bold text-lg text-[#2C5F2C]">Deployment Timeline</h4>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                      <div className="w-24 shrink-0 text-right text-sm text-gray-500">Traditional</div>
                                      <div className="h-8 rounded-md bg-red-100 flex-1 flex items-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                          4-8 weeks
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                      <div className="w-24 shrink-0 text-right text-sm text-gray-500">Niddik</div>
                                      <div className="h-8 rounded-md bg-[#2C5F2C]/10 w-[25%] flex items-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium whitespace-nowrap">
                                          48-72 hours
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="pt-4 mt-4 border-t text-center">
                                      <div className="text-base font-semibold text-[#2C5F2C]">Up to 95% faster deployment</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Decorative Connection Lines */}
                              <div className="absolute top-[30%] left-[30%] w-[40%] h-[1px] bg-[#2C5F2C]/20 rotate-45"></div>
                              <div className="absolute bottom-[30%] right-[30%] w-[40%] h-[1px] bg-[#2C5F2C]/20 -rotate-45"></div>
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-[15%] right-[15%] w-5 h-5 transform rotate-45 bg-[#2C5F2C]/10"></div>
                              <div className="absolute bottom-[15%] left-[15%] w-4 h-4 rounded-full bg-[#2C5F2C]/10"></div>
                            </>
                          )}
                          
                          {activeTab === 3 && (
                            <>
                              {/* Rapid Scalability Tab Content */}
                              <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                                  <div className="w-5 h-5 bg-[#2C5F2C]/20 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-[#2C5F2C]">1</span>
                                  </div>
                                  <span className="text-sm font-medium">Project Start</span>
                                </div>
                                <div className="w-[1px] h-12 bg-[#2C5F2C]/30 mx-auto my-1"></div>
                              </div>
                              
                              <div className="absolute top-[50%] left-[70%] transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                                  <div className="w-5 h-5 bg-[#2C5F2C]/20 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-[#2C5F2C]">2</span>
                                  </div>
                                  <span className="text-sm font-medium">Scale Up (+5 devs)</span>
                                </div>
                                <div className="w-[1px] h-12 bg-[#2C5F2C]/30 mx-auto my-1"></div>
                              </div>
                              
                              <div className="absolute top-[70%] left-[30%] transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                                  <div className="w-5 h-5 bg-[#2C5F2C]/20 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-semibold text-[#2C5F2C]">3</span>
                                  </div>
                                  <span className="text-sm font-medium">Scale Down (-2 devs)</span>
                                </div>
                              </div>
                              
                              {/* Growth Graph */}
                              <div className="absolute bottom-[15%] right-[15%] w-[30%]">
                                <div className="bg-white p-3 rounded-lg shadow-md">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                      <Target className="h-4 w-4 text-[#2C5F2C]" />
                                      <span className="text-xs font-medium">Team Size</span>
                                    </div>
                                    <span className="text-xs font-medium text-[#2C5F2C]">Flexible</span>
                                  </div>
                                  <div className="h-[50px] w-full bg-[#2C5F2C]/5 rounded relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-full h-[20px] bg-[#2C5F2C]/20"></div>
                                    <div className="absolute bottom-0 left-[20%] w-[30%] h-[35px] bg-[#2C5F2C]/40"></div>
                                    <div className="absolute bottom-0 left-[60%] w-[30%] h-[25px] bg-[#2C5F2C]/30"></div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-[20%] right-[20%] w-4 h-4 transform rotate-45 bg-[#2C5F2C]/10"></div>
                              <div className="absolute bottom-[40%] right-[40%] w-3 h-3 rounded-full bg-[#2C5F2C]/10"></div>
                            </>
                          )}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Description */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-andela-dark">{tabContents[activeTab].title}</h3>
                    <p className="text-lg text-andela-gray mb-6 leading-relaxed">
                      {tabContents[activeTab].description}
                    </p>
                    
                    <div className="space-y-4">
                      {tabContents[activeTab].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="h-6 w-6 bg-[#2C5F2C]/10 rounded-full flex items-center justify-center mt-1">
                            <CheckCircle2 className="h-4 w-4 text-[#2C5F2C]" />
                          </div>
                          <p className="text-andela-gray">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default CommunityInvolvement;
import { useState } from "react";
import { 
  Download,
  FileText,
  CheckCircle2,
  BarChart3,
  Users,
  Zap, 
  ChevronRight,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WhitepaperPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the data to the server
    toast({
      title: "Success!",
      description: "Your whitepaper has been sent to your email.",
      variant: "default"
    });

    // Reset form
    setEmail("");
    setName("");
    setCompany("");
  };

  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  return (
    <div className="min-h-screen overflow-x-hidden pt-0">
      <AnnouncementBar 
        text="Download our new whitepaper on scaling tech teams effectively."
        linkText="Get it now"
        linkUrl="/whitepaper"
        bgColor="bg-green-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#FFFFFF" d="M42.8,-65.7C54.9,-56.5,63.7,-43.3,69.8,-28.9C76,-14.4,79.5,1.3,76.7,16.3C73.9,31.3,64.8,45.5,52.4,56.5C40,67.5,24.4,75.3,7.3,78.1C-9.8,80.9,-28.4,78.9,-42.8,69.8C-57.3,60.8,-67.7,44.9,-74.5,27.5C-81.3,10.1,-84.5,-8.8,-80.1,-25.8C-75.7,-42.8,-63.7,-57.9,-48.7,-66.1C-33.7,-74.3,-16.8,-75.6,-0.5,-74.9C15.9,-74.2,30.7,-74.8,42.8,-65.7Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 z-10 relative">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              {/* Left column: Content */}
              <div className="lg:w-1/2 z-10">
                <div className="inline-block mb-3">
                  <div className="px-4 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-medium tracking-wider">
                    NEW WHITEPAPER
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
                  Drive Organizational Transformation Through Adaptive Hiring
                </h1>
                
                <p className="text-lg text-blue-100 mb-8 max-w-xl">
                  Our comprehensive whitepaper reveals how scalable and flexible recruiting services 
                  shaped by deep market knowledge can transform your organization.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400"/>
                    <span>Data-driven insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400"/>
                    <span>AI-powered recruitment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400"/>
                    <span>Industry best practices</span>
                  </div>
                </div>
                
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  <Download className="h-5 w-5" />
                  Download Whitepaper
                </Button>
              </div>
              
              {/* Right column: Form */}
              <div className="lg:w-1/2 bg-white text-gray-800 p-8 rounded-xl shadow-xl z-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Get Your Free Copy</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company Inc."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Download Now
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    By submitting this form, you agree to our privacy policy and to receive updates about 
                    Niddik products, services, and events.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Insights Section - with animated AI background */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
          {/* Animated AI background elements */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-10">
            <motion.div 
              className="absolute top-[10%] left-[10%] w-64 h-64 bg-blue-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, 30, 0], 
                y: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute top-[40%] right-[20%] w-48 h-48 bg-indigo-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, -20, 0], 
                y: [0, 20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute bottom-[20%] left-[30%] w-56 h-56 bg-green-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, 20, 0], 
                y: [0, -30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            {/* AI connections */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.line 
                x1="20%" y1="20%" x2="70%" y2="30%" 
                stroke="rgba(99, 102, 241, 0.2)" 
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
              <motion.line 
                x1="80%" y1="40%" x2="30%" y2="60%" 
                stroke="rgba(99, 102, 241, 0.2)" 
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
              />
              <motion.line 
                x1="20%" y1="80%" x2="70%" y2="60%" 
                stroke="rgba(99, 102, 241, 0.2)" 
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
              />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-900">Key Insights From The Whitepaper</h2>
              <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                Discover how our AI-driven talent sourcing approach is transforming traditional recruitment
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Data-Driven Recruitment",
                  description: "Learn how data analytics can reduce hiring time by 60% while increasing quality of hires.",
                  icon: <BarChart3 className="h-10 w-10 text-pink-500" />,
                  color: "bg-pink-100",
                  iconColor: "text-pink-500"
                },
                {
                  title: "AI for Recruitment",
                  description: "Discover how AI-powered matching improves response rates by 40% compared to traditional methods.",
                  icon: <Zap className="h-10 w-10 text-amber-500" />,
                  color: "bg-amber-100",
                  iconColor: "text-amber-500"
                },
                {
                  title: "Social Media Recruiting",
                  description: "Explore strategies that decrease time-to-submit by 50% through optimized social channels.",
                  icon: <Users className="h-10 w-10 text-green-500" />,
                  color: "bg-green-100",
                  iconColor: "text-green-500"
                },
                {
                  title: "Video Interview Technology",
                  description: "See how video interviews reduce screening time while maintaining comprehensive evaluation.",
                  icon: <Zap className="h-10 w-10 text-sky-500" />,
                  color: "bg-sky-100",
                  iconColor: "text-sky-500"
                },
                {
                  title: "Improved Candidate Experience",
                  description: "Understand how a better recruitment experience increases talent quality by up to 70%.",
                  icon: <Users className="h-10 w-10 text-violet-500" />,
                  color: "bg-violet-100",
                  iconColor: "text-violet-500"
                },
                {
                  title: "Recruitment Technology Solutions",
                  description: "Learn about integrated tools that optimize recruiting spend by 30% while improving outcomes.",
                  icon: <PieChart className="h-10 w-10 text-indigo-500" />,
                  color: "bg-indigo-100",
                  iconColor: "text-indigo-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-50"
                >
                  <motion.div 
                    className={`${item.color} p-4 rounded-lg inline-block mb-4`}
                    whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-blue-900">{item.title}</h3>
                  <p className="text-blue-700">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Business Impact Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-pink-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-indigo-900">Business Impact</h2>
              <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
                Real metrics that demonstrate the effectiveness of our adaptive hiring approach
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Empaneled Customers", value: "4", color: "bg-gradient-to-br from-blue-400 to-blue-500 text-white" },
                { label: "Placements", value: "12+", color: "bg-gradient-to-br from-indigo-400 to-indigo-500 text-white" },
                { label: "Communities", value: "10K+", color: "bg-gradient-to-br from-violet-400 to-violet-500 text-white" },
                { label: "Talent Pools", value: "500K+", color: "bg-gradient-to-br from-purple-400 to-purple-500 text-white" }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className={`${stat.color} rounded-lg p-8 text-center shadow-lg`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <motion.p 
                    className="text-4xl lg:text-5xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xl opacity-90">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {[
                { value: "30%", label: "Optimize Recruiting Spend", color: "from-red-400 to-pink-400" },
                { value: "40%", label: "Improvement in Response %", color: "from-yellow-400 to-amber-400" },
                { value: "50%", label: "Decrease in Time to Submit", color: "from-green-400 to-emerald-400" },
                { value: "70%", label: "Increase in Talent Quality", color: "from-sky-400 to-cyan-400" }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white border border-blue-100 rounded-lg p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <p className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-700">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Capabilities Section */}
        <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50 text-emerald-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-teal-900">Our Capabilities</h2>
              <p className="text-xl text-teal-700 max-w-3xl mx-auto">
                A complete end-to-end recruitment solution designed to transform your hiring process
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Preparing",
                  color: "bg-green-400",
                  borderColor: "border-green-300",
                  textColor: "text-green-900",
                  iconBg: "bg-green-100",
                  number: "1",
                  items: [
                    "Analyze and define job requirements",
                    "Develop or update job descriptions",
                    "Identify ideal candidate profiles"
                  ]
                },
                {
                  title: "Sourcing",
                  color: "bg-rose-400",
                  borderColor: "border-rose-300",
                  textColor: "text-rose-900",
                  iconBg: "bg-rose-100",
                  number: "2",
                  items: [
                    "Source candidates through various channels",
                    "Engage active and passive candidates",
                    "Leverage employee referrals and talent pools"
                  ]
                },
                {
                  title: "Screening",
                  color: "bg-amber-400",
                  borderColor: "border-amber-300",
                  textColor: "text-amber-900",
                  iconBg: "bg-amber-100",
                  number: "3",
                  items: [
                    "Review resumes and cover letters",
                    "Conduct preliminary interviews",
                    "Assess candidates' qualifications and fit"
                  ]
                },
                {
                  title: "Selecting",
                  color: "bg-violet-400",
                  borderColor: "border-violet-300",
                  textColor: "text-violet-900",
                  iconBg: "bg-violet-100",
                  number: "4",
                  items: [
                    "Conduct in-depth interviews",
                    "Perform skills assessment tests",
                    "Evaluate candidates thoroughly for final selection"
                  ]
                },
                {
                  title: "Hiring",
                  color: "bg-cyan-400",
                  borderColor: "border-cyan-300",
                  textColor: "text-cyan-900",
                  iconBg: "bg-cyan-100",
                  number: "5",
                  items: [
                    "Extend job offers to selected candidates",
                    "Negotiate terms and benefits",
                    "Manage acceptance and contract signing"
                  ]
                },
                {
                  title: "Onboarding",
                  color: "bg-blue-400",
                  borderColor: "border-blue-300",
                  textColor: "text-blue-900",
                  iconBg: "bg-blue-100",
                  number: "6",
                  items: [
                    "Implement orientation sessions",
                    "Complete necessary HR paperwork",
                    "Integrate new hires into company culture"
                  ]
                }
              ].map((step, index) => (
                <motion.div 
                  key={index} 
                  className={`bg-white rounded-lg p-6 relative shadow-md border ${step.borderColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <motion.div 
                    className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center font-bold text-white absolute -top-4 -left-4 text-xl shadow-md`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-4 mt-2 ${step.textColor}`}>{step.title}</h3>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                      >
                        <motion.div
                          className={`${step.iconBg} h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ChevronRight className={`h-3 w-3 ${step.textColor}`} />
                        </motion.div>
                        <span className="text-gray-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 6-Factors Model Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-fuchsia-50 relative overflow-hidden">
          {/* Animated AI elements */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-10">
            <motion.div 
              className="absolute top-[15%] left-[15%] w-72 h-72 bg-purple-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, 40, 0], 
                y: [0, 30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-fuchsia-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, -30, 0], 
                y: [0, -20, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-purple-900">6-Factors Model</h2>
              <p className="text-xl text-purple-700 max-w-3xl mx-auto">
                Our dynamic recruitment solutions blend innovation and expertise to match exceptional talents with your unique organizational needs
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "People / Culture",
                  description: "Senior Leadership, Superiors, Coworkers",
                  color: "from-red-400 to-red-500",
                  borderColor: "border-red-200",
                  bgColor: "bg-gradient-to-r from-red-50 to-rose-50"
                },
                {
                  number: "02",
                  title: "Compensation",
                  description: "Pay, Benefits",
                  color: "from-orange-400 to-amber-500",
                  borderColor: "border-orange-200",
                  bgColor: "bg-gradient-to-r from-orange-50 to-amber-50"
                },
                {
                  number: "03",
                  title: "Policies & Procedure",
                  description: "Policies, HR",
                  color: "from-teal-400 to-emerald-500",
                  borderColor: "border-teal-200",
                  bgColor: "bg-gradient-to-r from-teal-50 to-emerald-50"
                },
                {
                  number: "04",
                  title: "Work",
                  description: "Intrinsic Motivation, Influence, Work Tasks, Resources",
                  color: "from-cyan-400 to-sky-500",
                  borderColor: "border-cyan-200",
                  bgColor: "bg-gradient-to-r from-cyan-50 to-sky-50"
                },
                {
                  number: "05",
                  title: "Opportunities",
                  description: "Exclusivity, Recognition",
                  color: "from-violet-400 to-indigo-500",
                  borderColor: "border-violet-200",
                  bgColor: "bg-gradient-to-r from-violet-50 to-indigo-50"
                },
                {
                  number: "06",
                  title: "Quality of Life",
                  description: "Work Life Balance, Work Environment",
                  color: "from-pink-400 to-fuchsia-500",
                  borderColor: "border-pink-200",
                  bgColor: "bg-gradient-to-r from-pink-50 to-fuchsia-50"
                }
              ].map((factor, index) => (
                <motion.div 
                  key={index} 
                  className={`${factor.bgColor} backdrop-blur-sm rounded-lg p-6 border ${factor.borderColor} shadow-md`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <motion.div 
                    className={`bg-gradient-to-r ${factor.color} inline-block px-4 py-2 rounded-lg text-white font-bold mb-4 shadow-md`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {factor.number}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{factor.title}</h3>
                  <p className="text-gray-700">{factor.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* X-Factor Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50 relative overflow-hidden">
          {/* Animated elements */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-10">
            <motion.div 
              className="absolute top-[20%] right-[20%] w-64 h-64 bg-yellow-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, -30, 0], 
                y: [0, 25, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 9, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute bottom-[25%] left-[15%] w-56 h-56 bg-amber-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, 25, 0], 
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 11, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-amber-900">Our X-Factor</h2>
              <p className="text-xl text-amber-700 max-w-3xl mx-auto">
                What sets Niddik apart from traditional recruiting companies
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Scalable Solution",
                  description: "Whether you are a startup or an established organization, our tailormade recruiting solutions will help propel your organization by achieving your people goals on time.",
                  iconBg: "bg-gradient-to-r from-green-400 to-emerald-500",
                  icon: <Users className="h-8 w-8 text-white" />
                },
                {
                  title: "AI Driven Talent Sourcing",
                  description: "Our sourcing team is not just limited to Job Boards, but they use our AI integrated ATS that revolutionize the hiring process. Talent sourcing to engage, and hire top talent faster and more efficiently.",
                  iconBg: "bg-gradient-to-r from-blue-400 to-indigo-500",
                  icon: <Zap className="h-8 w-8 text-white" />
                },
                {
                  title: "Diversity & Inclusion",
                  description: "A diverse workforce brings a variety of talents, skills, and experience to help you achieve better ideas and reach full potential.",
                  iconBg: "bg-gradient-to-r from-violet-400 to-purple-500",
                  icon: <Users className="h-8 w-8 text-white" />
                },
                {
                  title: "Effective Delivery",
                  description: "We treat each interaction with our clients, candidates & communities as an opportunity to build lasting relationships resulting in a great experience for our stakeholders.",
                  iconBg: "bg-gradient-to-r from-amber-400 to-orange-500",
                  icon: <Zap className="h-8 w-8 text-white" />
                }
              ].map((factor, index) => (
                <motion.div 
                  key={index} 
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full ${factor.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {factor.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{factor.title}</h3>
                    <p className="text-gray-700">{factor.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <FileText className="h-16 w-16 mx-auto mb-8 text-white opacity-80" />
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 max-w-3xl mx-auto">
              Ready to transform your recruitment strategy?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Download the whitepaper today and take the first step toward a more efficient, 
              effective hiring process powered by data and AI.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <Download className="h-5 w-5" />
                Download Whitepaper
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WhitepaperPage;
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
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

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

  return (
    <div className="min-h-screen overflow-x-hidden pt-0">
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
      
      <div className={`${isAnnouncementVisible ? 'pt-[80px]' : 'pt-[40px]'} transition-all duration-300`}>
      <main>
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
        
        {/* Key Insights Section - Modern AI Animation */}
        <section className="py-20 relative overflow-hidden bg-[#0d2340]">
          {/* Technology AI Background with Animation */}
          <div className="absolute inset-0 z-0">
            {/* Background with tech circuit patterns */}
            <div className="absolute inset-0 bg-[url('/circuit-board-pattern.svg')] bg-repeat opacity-10"></div>
            
            {/* Binary code streams */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-[8px] font-mono text-cyan-500 opacity-20 whitespace-nowrap overflow-hidden"
                  style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    width: `${30 + Math.random() * 200}px`,
                  }}
                  initial={{ opacity: 0.1 }}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    x: [`${-300 - Math.random() * 200}px`, `${100 + Math.random() * 300}px`]
                  }}
                  transition={{ 
                    duration: 10 + Math.random() * 15, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  {"10101001010101010010101010110101001010101001010101101010".split('').map((char, idx) => (
                    <span key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>{char}</span>
                  ))}
                </motion.div>
              ))}
            </div>
            
            {/* Glowing orbs representing technology nodes */}
            <motion.div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></motion.div>
            <motion.div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl opacity-15 animate-pulse-slow animation-delay-2000"></motion.div>
            <motion.div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-emerald-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow animation-delay-1000"></motion.div>
            
            {/* Animated data flow lines */}
            <div className="absolute inset-0">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 500">
                <motion.g opacity="0.2">
                  {/* Horizontal tech grid lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.line
                      key={`h-${i}`}
                      x1="0"
                      y1={50 + i * 50}
                      x2="1000"
                      y2={50 + i * 50}
                      stroke="#4fd1c5"
                      strokeWidth="1"
                      strokeDasharray="5,10"
                      initial={{ strokeDashoffset: 1000 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear"
                      }}
                    />
                  ))}
                  
                  {/* Vertical tech grid lines */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.line
                      key={`v-${i}`}
                      x1={50 + i * 50}
                      y1="0"
                      x2={50 + i * 50}
                      y2="500"
                      stroke="#4fd1c5"
                      strokeWidth="1"
                      strokeDasharray="5,15"
                      initial={{ strokeDashoffset: 500 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 0.1
                      }}
                    />
                  ))}
                  
                  {/* Data flow connecting lines */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.path
                      key={`path-${i}`}
                      d={`M${100 + i * 120},50 C${150 + i * 120},${100 + i * 30} ${200 + i * 100},${200 - i * 20} ${250 + i * 90},${300 + i * 10}`}
                      stroke="#60a5fa"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{ 
                        duration: 4 + i, 
                        repeat: Infinity, 
                        repeatType: "loop",
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </motion.g>
              </svg>
            </div>
          </div>
          
          {/* Content with Overlay */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl lg:text-5xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Key Insights From The Whitepaper
              </motion.h2>
              <motion.p 
                className="text-xl text-blue-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Discover how our AI-driven talent sourcing approach is transforming traditional recruitment
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Data-Driven Recruitment",
                  description: "Learn how data analytics can reduce hiring time by 60% while increasing quality of hires.",
                  icon: <BarChart3 className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#e53e3e]",
                  borderColor: "border-[#f56565]",
                  iconBg: "bg-[#fc8181] bg-opacity-30"
                },
                {
                  title: "AI for Recruitment",
                  description: "Discover how AI-powered matching improves response rates by 40% compared to traditional methods.",
                  icon: <Zap className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#d69e2e]",
                  borderColor: "border-[#f6ad55]",
                  iconBg: "bg-[#fbd38d] bg-opacity-30"
                },
                {
                  title: "Social Media Recruiting",
                  description: "Explore strategies that decrease time-to-submit by 50% through optimized social channels.",
                  icon: <Users className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#38a169]",
                  borderColor: "border-[#68d391]",
                  iconBg: "bg-[#9ae6b4] bg-opacity-30"
                },
                {
                  title: "Video Interview Technology",
                  description: "See how video interviews reduce screening time while maintaining comprehensive evaluation.",
                  icon: <Zap className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#3182ce]",
                  borderColor: "border-[#63b3ed]",
                  iconBg: "bg-[#90cdf4] bg-opacity-30"
                },
                {
                  title: "Improved Candidate Experience",
                  description: "Understand how a better recruitment experience increases talent quality by up to 70%.",
                  icon: <Users className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#805ad5]",
                  borderColor: "border-[#b794f4]",
                  iconBg: "bg-[#d6bcfa] bg-opacity-30"
                },
                {
                  title: "Recruitment Technology Solutions",
                  description: "Learn about integrated tools that optimize recruiting spend by 30% while improving outcomes.",
                  icon: <PieChart className="h-10 w-10 text-white" />,
                  bgColor: "bg-[#4299e1]",
                  borderColor: "border-[#90cdf4]",
                  iconBg: "bg-[#bee3f8] bg-opacity-30"
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
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" 
                  }}
                  className={`rounded-xl p-6 ${item.bgColor} backdrop-blur-lg border ${item.borderColor} shadow-lg relative overflow-hidden group text-white`}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`p-3 rounded-full ${item.iconBg || 'bg-white bg-opacity-20'} inline-flex mb-4 shimmer overflow-hidden`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-blue-100">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Business Impact Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Business Impact</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real metrics that demonstrate the effectiveness of our adaptive hiring approach
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Empaneled Customers", value: "4", color: "bg-blue-900 text-white" },
                { label: "Placements", value: "12+", color: "bg-blue-800 text-white" },
                { label: "Communities", value: "10K+", color: "bg-blue-700 text-white" },
                { label: "Talent Pools", value: "500K+", color: "bg-blue-600 text-white" }
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} rounded-lg p-8 text-center`}>
                  <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xl opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {[
                { value: "30%", label: "Optimize Recruiting Spend" },
                { value: "40%", label: "Improvement in Response %" },
                { value: "50%", label: "Decrease in Time to Submit" },
                { value: "70%", label: "Increase in Talent Quality" }
              ].map((stat, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Capabilities Section */}
        <section className="py-20 bg-teal-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Capabilities</h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                A complete end-to-end recruitment solution designed to transform your hiring process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Preparing",
                  color: "bg-green-500",
                  number: "1",
                  items: [
                    "Analyze and define job requirements",
                    "Develop or update job descriptions",
                    "Identify ideal candidate profiles"
                  ]
                },
                {
                  title: "Sourcing",
                  color: "bg-red-600",
                  number: "2",
                  items: [
                    "Source candidates through various channels",
                    "Engage active and passive candidates",
                    "Leverage employee referrals and talent pools"
                  ]
                },
                {
                  title: "Screening",
                  color: "bg-yellow-500",
                  number: "3",
                  items: [
                    "Review resumes and cover letters",
                    "Conduct preliminary interviews",
                    "Assess candidates' qualifications and fit"
                  ]
                },
                {
                  title: "Selecting",
                  color: "bg-purple-600",
                  number: "4",
                  items: [
                    "Conduct in-depth interviews",
                    "Perform skills assessment tests",
                    "Evaluate candidates thoroughly for final selection"
                  ]
                },
                {
                  title: "Hiring",
                  color: "bg-cyan-500",
                  number: "5",
                  items: [
                    "Extend job offers to selected candidates",
                    "Negotiate terms and benefits",
                    "Manage acceptance and contract signing"
                  ]
                },
                {
                  title: "Onboarding",
                  color: "bg-blue-500",
                  number: "6",
                  items: [
                    "Implement orientation sessions",
                    "Complete necessary HR paperwork",
                    "Integrate new hires into company culture"
                  ]
                }
              ].map((step, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 relative">
                  <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center font-bold text-white absolute -top-4 -left-4 text-xl`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-4 mt-2 text-white">{step.title}</h3>
                  <ul className="space-y-2">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="opacity-90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 6-Factors Model Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">6-Factors Model</h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                Our dynamic recruitment solutions blend innovation and expertise to match exceptional talents with your unique organizational needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "People / Culture",
                  description: "Senior Leadership, Superiors, Coworkers",
                  color: "bg-red-500"
                },
                {
                  number: "02",
                  title: "Compensation",
                  description: "Pay, Benefits",
                  color: "bg-orange-500"
                },
                {
                  number: "03",
                  title: "Policies & Procedure",
                  description: "Policies, HR",
                  color: "bg-teal-500"
                },
                {
                  number: "04",
                  title: "Work",
                  description: "Intrinsic Motivation, Influence, Work Tasks, Resources",
                  color: "bg-cyan-500"
                },
                {
                  number: "05",
                  title: "Opportunities",
                  description: "Exclusivity, Recognition",
                  color: "bg-gray-500"
                },
                {
                  number: "06",
                  title: "Quality of Life",
                  description: "Work Life Balance, Work Environment",
                  color: "bg-pink-500"
                }
              ].map((factor, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className={`${factor.color} inline-block px-4 py-2 rounded-lg text-white font-bold mb-4`}>
                    {factor.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{factor.title}</h3>
                  <p className="opacity-80">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* X-Factor Section */}
        <section className="py-20 bg-teal-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our X-Factor</h2>
              <p className="text-xl opacity-80 max-w-3xl mx-auto">
                What sets Niddik apart from traditional recruiting companies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Scalable Solution",
                  description: "Whether you are a startup or an established organization, our tailormade recruiting solutions will help propel your organization by achieving your people goals on time."
                },
                {
                  title: "AI Driven Talent Sourcing",
                  description: "Our sourcing team is not just limited to Job Boards, but they use our AI integrated ATS that revolutionize the hiring process. Talent sourcing to engage, and hire top talent faster and more efficiently."
                },
                {
                  title: "Diversity & Inclusion",
                  description: "A diverse workforce brings a variety of talents, skills, and experience to help you achieve better ideas and reach full potential."
                },
                {
                  title: "Effective Delivery",
                  description: "We treat each interaction with our clients, candidates & communities as an opportunity to build lasting relationships resulting in a great experience for our stakeholders."
                }
              ].map((factor, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    {index % 2 === 0 ? (
                      <Users className="h-8 w-8 text-teal-800" />
                    ) : (
                      <Zap className="h-8 w-8 text-teal-800" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{factor.title}</h3>
                    <p className="opacity-80">{factor.description}</p>
                  </div>
                </div>
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
    </div>
  );
};

const Whitepaper = WhitepaperPage;
export default Whitepaper;
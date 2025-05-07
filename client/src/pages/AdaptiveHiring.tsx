import { motion } from "framer-motion";
import { 
  Award, 
  Briefcase, 
  Users, 
  Target, 
  BarChart3, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Container from "@/components/ui/container";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";

const AdaptiveHiring = () => {
  const features = [
    {
      icon: <Target className="h-12 w-12 text-blue-500" />,
      title: "Precision Matching",
      description: "Our AI-powered platform analyzes over 100 data points to find the perfect match between company needs and candidate capabilities."
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-green-500" />,
      title: "Dynamic Skill Assessment",
      description: "Evaluate candidates through customized technical and soft skills assessments designed for your specific requirements."
    },
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Team Compatibility Analysis",
      description: "Beyond skills, we assess how candidates will integrate with your existing team culture and dynamics."
    },
    {
      icon: <Briefcase className="h-12 w-12 text-green-500" />,
      title: "Flexible Engagement Models",
      description: "Choose from project-based, full-time, or hybrid work arrangements that adapt to your business needs."
    }
  ];

  const benefits = [
    {
      title: "Reduced Time-to-Hire",
      description: "Our adaptive process shortens hiring cycles by 60% compared to traditional methods.",
      stat: "60%",
      icon: <Award className="h-8 w-8 text-white" />
    },
    {
      title: "Improved Retention",
      description: "92% of professionals matched through our platform remain with companies for at least one year.",
      stat: "92%",
      icon: <Users className="h-8 w-8 text-white" />
    },
    {
      title: "Cost Efficiency",
      description: "Save up to 40% on recruitment costs while improving the quality of your technical hires.",
      stat: "40%",
      icon: <Briefcase className="h-8 w-8 text-white" />
    }
  ];
  
  const process = [
    {
      number: "01",
      title: "Needs Analysis",
      description: "We work with you to develop a comprehensive understanding of your technical requirements, team dynamics, and company culture."
    },
    {
      number: "02",
      title: "Talent Sourcing",
      description: "Our AI system identifies candidates from our pool of pre-vetted professionals who match your specific needs."
    },
    {
      number: "03",
      title: "Custom Assessment",
      description: "Candidates complete tailored technical challenges and interviews designed specifically for your position."
    },
    {
      number: "04",
      title: "Compatibility Matching",
      description: "We evaluate technical abilities alongside cultural fit to ensure the perfect match for your team."
    },
    {
      number: "05",
      title: "Seamless Integration",
      description: "Our onboarding specialists help new team members integrate smoothly into your company processes."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="pt-10">
      <AnnouncementBar 
        text="Try our new adaptive hiring model for your next technical role."
        linkText="Learn how"
        linkUrl="#"
        bgColor="bg-andela-blue"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-green-400/5 blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-32 right-1/4 w-8 h-8 border-2 border-blue-400/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-green-400/30 rounded-full"></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 bg-blue-400/30 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-green-400/20 rounded-lg rotate-45"></div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="inline-block mb-3">
                <div className="px-4 py-1 bg-blue-500/10 rounded-full text-blue-500 text-sm font-medium tracking-wider uppercase">
                  Next-Generation Recruitment
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Adaptive Hiring
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl md:text-2xl text-andela-dark font-light mb-16 max-w-3xl mx-auto"
            >
              A dynamic, data-driven approach that evolves with your needs to find the perfect technical talent match for your team.
            </motion.p>
            
            {/* Call to action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium rounded-md hover:shadow-lg transition-shadow"
              >
                Start Adaptive Hiring
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Learn The Process
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Key Features</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Our adaptive hiring model incorporates cutting-edge technology and human expertise to deliver exceptional talent matches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 flex gap-6 items-start shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-andela-dark">{feature.title}</h3>
                  <p className="text-andela-gray">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">The Adaptive Process</h2>
            <p className="text-xl text-andela-gray max-w-3xl mx-auto">
              Our five-step methodology evolves based on your unique requirements to deliver optimal talent matches.
            </p>
          </motion.div>

          <div className="space-y-12 mt-16 max-w-4xl mx-auto">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-andela-dark">{step.title}</h3>
                  <p className="text-andela-gray">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="mt-8 ml-3 h-10 border-l-2 border-blue-200"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section with Stats */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-green-500 text-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Benefits</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our adaptive hiring approach delivers tangible improvements across key recruitment metrics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition-colors border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                </div>
                <p className="mb-6 text-white/70">{benefit.description}</p>
                <div className="text-6xl font-bold flex items-baseline">
                  {benefit.stat}
                  <span className="ml-2 text-xl">improvement</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-12 shadow-lg">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-andela-dark">
                Ready to Transform Your Hiring Approach?
              </h2>
              <p className="text-xl text-andela-gray mb-10 max-w-2xl mx-auto">
                Join leading companies who have embraced adaptive hiring to build exceptional technical teams faster and more effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/services" 
                  className="inline-flex items-center border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
                >
                  Explore Other Services
                </Link>
              </div>
            </motion.div>
            
            {/* Testimonial */}
            <motion.div
              className="mt-16 bg-white p-8 rounded-xl shadow-md relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl text-blue-200 absolute top-4 left-4">"</div>
              <p className="text-lg text-andela-gray italic mb-6 relative z-10">
                The adaptive hiring model completely transformed our engineering recruitment. We've reduced time-to-hire by 65% while significantly improving candidate quality and team fit. It's the future of technical hiring.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-andela-dark">Alex Rodriguez</p>
                  <p className="text-andela-gray">CTO, TechForward Inc.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default AdaptiveHiring;
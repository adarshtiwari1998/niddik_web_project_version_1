import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Users, Globe, Award, Heart, Leaf, Zap, X, ExternalLink, Sparkles } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const AboutUs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(null);
  
  const teamMembers = [
    {
      name: "Mr. Abhishek Anchal",
      role: "CEO / Partner",
       company: "NIDDIKKARE",
      image: "https://res.cloudinary.com/dw4glwrrn/image/upload/v1750407771/niddik-leader-ship-team-mr-abhishek_vlrt6l.png",
      bio: "With over 20 years of experience in talent acquisition, Abhishek has established himself as a renowned expert in the field of recruitment.",
      linkedinUrl: "https://www.linkedin.com/in/aanchal/",
      twitterUrl: "#",
       mailUrl: "mailto:aanchal@niddik.com",
      fullBio: `Abhishek is a seasoned Talent Acquisition Professional with over 20 years of extensive experience in talent acquisition, he has established himself as a renowned expert in the field of recruitment. His impressive career trajectory, marked by progressive leadership roles and a strong academic foundation, is a testament to his dedication, passion, and commitment to excellence.

Born with a natural aptitude for mathematics and computer science, Abhishek pursued his Bachelor's Degree in Applied Mathematics from the University of South Carolina (Conway) between 2000-2004. During his undergraduate studies, he also minored in Computer Science and Statistics, laying a solid foundation for his future career.

Upon graduating, he embarked on his professional journey in the talent acquisition space. His early experiences as a recruiter and lead recruiter helped him develop a keen eye for talent and a deep understanding of the recruitment process.

As Abhishek's career progressed, he took on increasingly senior leadership roles, including Talent Acquisition Manager and Delivery Head – Recruitment. His expertise and leadership skills caught the attention of prominent global organizations, leading to opportunities to work with esteemed companies such as Lehman Brothers (NJ-USA), Thomson Reuters (NY-USA), and Calance (India).`
    },
    {
      name: "Dr. Samar Husain Naqvi",
      role: "Managing Director / CO-Founder",
       company: "NIDDIKKARE",
      image: "https://res.cloudinary.com/dw4glwrrn/image/upload/v1750407773/niddik-leader-ship-team-samar-husain_bkdyrz.png",
      bio: "A trailblazing expert in biotechnology and life sciences, renowned for his groundbreaking work in genomics, molecular biology, and microbiology with over 25 years of experience.",
      linkedinUrl: " https://www.linkedin.com/in/dr-samar-husain-naqvi-1b73a013/",
       mailUrl: "mailto:samar@niddikkare.com",
      twitterUrl: "#",
      fullBio: `Dr. Samar Husain Naqvi is a trailblazing expert in biotechnology and life sciences, renowned for his groundbreaking work in genomics, molecular biology, and microbiology. With a career spanning over 25 years, he has established himself as a leading authority in the development of innovative diagnostic solutions, leveraging cutting-edge technologies to drive medical advancements.

As a visionary leader, he has held pivotal roles in esteemed corporate organizations, where he has successfully spearheaded the design, development, and manufacturing of in vitro diagnostic medical devices. His expertise in navigating complex regulatory landscapes has ensured the seamless translation of research findings into clinically validated diagnostic tools, ultimately enhancing patient care and outcomes.

His research has been instrumental in elucidating the molecular mechanisms underlying various diseases, shedding light on novel biomarkers, and informing the development of targeted therapeutic strategies. Through his mentorship and leadership, he has fostered a new generation of scientists and researchers, imbuing them with a passion for discovery and a commitment to excellence.

As a testament to his dedication and expertise, Dr. Naqvi has garnered numerous accolades and recognition within the scientific community, solidifying his position as a luminary in the field of biotechnology and life sciences.`
    },
    {
      name: "Dr. Abhishek Chanchal",
      role: "Director & Co-Founder",
      company: "NIDDIKKARE",
      image: "https://res.cloudinary.com/dw4glwrrn/image/upload/v1750407770/niddik-leader-ship-team-dr-abhishek_sy7jlk.png",
      bio: "A highly accomplished researcher and scientist with over 25 years' strong foundation in the fields of nanomedicine and biotechnology, holding a Ph.D. in Bio-Science (Nanomedicine).",
      linkedinUrl: "https://www.linkedin.com/in/dr-abhishek-chanchal-42007457/",
      mailUrl: "mailto:abhishek@niddikkare.com",
      twitterUrl: "#",
      fullBio: `Dr. Abhishek Chanchal is a highly accomplished researcher and scientist with over 15+ years' strong foundation in the fields of nanomedicine and biotechnology. Holding a Ph.D. in Bio-Science (Nanomedicine) from the esteemed Jamia Millia Islamia, Delhi, he has developed a profound expertise in the design, formulation, and characterization of nanoparticles for targeted drug delivery.

His research focuses on harnessing the potential of nanotechnology to create innovative solutions for complex medical challenges, with a particular emphasis on improving the efficacy and safety of therapeutic interventions. With a deep understanding of the intricate interactions between nanoparticles and biological systems, he has successfully developed novel nanoscale systems that can selectively target diseased cells, reducing side effects and enhancing treatment outcomes.

His work has significant implications for the development of personalized medicine and has the potential to revolutionize the field of drug delivery and treatment of various diseases, including cancer, neurological disorders, and infectious diseases. Through his groundbreaking research, Dr. Chanchal continues to contribute to the advancement of nanomedicine and biotechnology, pushing the boundaries of scientific knowledge and innovation, and inspiring future generations of researchers and scientists.`
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description: "Niddik was founded with a mission to connect global talent with opportunities regardless of location."
    },
    {
      year: "2019",
      title: "First 100 Matches",
      description: "Successfully matched the first 100 engineers with top companies across the globe."
    },
    {
      year: "2020",
      title: "Expanded Services",
      description: "Launched specialized talent services for enterprise clients and remote work solutions."
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded operations to 50+ countries, building a truly global talent network."
    },
    {
      year: "2022",
      title: "AI-Matching Technology",
      description: "Developed proprietary AI-driven matching technology to optimize talent placement."
    },
    {
      year: "2023",
      title: "Training Initiatives",
      description: "Launched skills development programs to further enhance our talent pool's capabilities."
    }
  ];

  const values = [
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Global Perspective",
      description: "We believe talent exists everywhere and opportunity should be equally accessible."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Community First",
      description: "Building genuine connections between talent and companies is at our core."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Excellence",
      description: "We're committed to quality, continually raising the bar for ourselves and our clients."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Empathy",
      description: "Understanding the unique needs of both talent and companies drives our approach."
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: "Sustainability",
      description: "We build long-term relationships and career paths, not just transactions."
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Innovation",
      description: "We constantly evolve our methods to stay ahead in the talent marketplace."
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
    <div className="flex flex-col min-h-screen pt-10"> {/* Added pt-10 for announcement bar space */}
      <AnnouncementBar 
        text="Join our upcoming webinar on scaling tech teams effectively."
        linkText="Register now"
        linkUrl="#"
        bgColor="bg-andela-green"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />
      {/* Hero Section - With Banner and Centered Content (Styled to Match Reference) */}
      <section className="relative text-andela-dark overflow-hidden pt-32 pb-16 bg-gray-50">
        {/* Banner Background */}
        <div className="absolute inset-0 z-0 opacity-50">
          <img 
            src="/images/about/green-banner.svg" 
            alt="Banner background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <Container className="relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-medium text-andela-green mb-2"
            >
              About Niddik
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-5 text-andela-green"
            >
              Exceptional Talent
            </motion.h1>
            
            {/* Additional Branded Text - Improved Styling */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-6"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
                <span className="bg-andela-green text-white px-2 py-1 rounded-md">A workforce partner</span> that understands every inch of <span className="text-andela-green font-bold">Your Ground</span>
              </h3>
              <h4 className="text-lg md:text-xl font-medium text-andela-green">
                Helping Our Clients Navigate the complexities Of Talent Sourcing
              </h4>
            </motion.div>
            
            {/* Subheading Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            >
              We're building the future of work by connecting brilliant minds with the 
              companies that need them most, regardless of location.
            </motion.p>
            
            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Team working together" 
                  className="w-full h-auto object-cover rounded-md shadow-lg"
                />
                <div className="absolute inset-0 rounded-md shadow-inner"></div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Partner with Us Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-andela-green/5 to-andela-green/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-andela-green/10 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-andela-green/10 blur-xl"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-andela-dark">
                Partner with <span className="text-andela-green">Industry Experts</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                Our team of seasoned recruitment professionals bring decades of combined experience across industries. 
                We understand the unique challenges faced by businesses and technologists in today's rapidly evolving landscape.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {/* Feature 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-andela-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-andela-dark mb-3 text-center">For Organizations</h3>
                  <p className="text-gray-600 text-center">
                    Custom talent solutions designed to meet your specific business goals and technical requirements.
                  </p>
                </motion.div>
                
                {/* Feature 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-andela-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 11L12.5 8M12.5 8L15.5 11M12.5 8V16M7 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-andela-dark mb-3 text-center">For Technologists</h3>
                  <p className="text-gray-600 text-center">
                    Access to exclusive opportunities with leading companies that value your unique skills and experience.
                  </p>
                </motion.div>
                
                {/* Feature 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-andela-green/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 5L17 12L11 19M17 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-andela-dark mb-3 text-center">Get Started</h3>
                  <p className="text-gray-600 text-center">
                    Schedule a consultation with our talent experts to discuss your specific needs and find the right solution.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Legacy Foundation Section - Unique Design */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Golden award particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
          
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#legacyGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 3, delay: i * 0.5 }}
              />
            ))}
            <defs>
              <linearGradient id="legacyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <Container className="relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur-xl"></div>
              <h2 className="relative text-5xl md:text-6xl font-bold mb-6 text-white">
                A Legacy of
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
            </motion.div>
            <motion.p variants={itemVariants} className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our foundation is built upon the extraordinary achievements of a true visionary
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Portrait Card */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Late Shri Satyendra Prasad Shrivastava</h3>
                    <p className="text-blue-200">Entrepreneur & Visionary</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-blue-100">
                  <p className="leading-relaxed">
                    Our journey is deeply rooted in a legacy passed down from my grandfather, <a href="https://www.washingtontechnology.com/1998/08/anstec-inc/332231/" target="_blank" className="text-yellow-400 underline decoration-yellow-400/50 hover:decoration-yellow-400" rel="no-follow">Late Shri Satyendra Prasad Shrivastava</a>, a man whose achievements were nothing short of extraordinary.
                  </p>
                </div>
              </div>

              {/* Awards Section */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 text-yellow-400 mr-3" />
                  Distinguished Recognition
                </h4>
                
                <div className="grid gap-4">
                  {[
                    { year: "1996", award: "Ernst & Young Entrepreneur of the Year Award", color: "from-yellow-400 to-orange-500" },
                    { year: "1994", award: "KPMG Peat Marwick High-Tech Entrepreneur Award", color: "from-blue-400 to-purple-500" },
                    { year: "1994", award: "Small Business Person of the Year - Washington Area", color: "from-green-400 to-teal-500" }
                  ].map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                          <span className="text-white font-bold text-sm">{achievement.year}</span>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold">{achievement.award}</h5>
                          <p className="text-blue-200 text-sm">A testament to innovative thinking and determination</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Image Side with Special Effects */}
            <motion.div variants={itemVariants} className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-2xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-2xl"></div>
              
              {/* Corner decorations */}
              <div className="absolute -top-6 -left-6 w-12 h-12 border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl"></div>
              <div className="absolute -top-6 -right-6 w-12 h-12 border-r-4 border-t-4 border-yellow-400 rounded-tr-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 border-l-4 border-b-4 border-orange-500 rounded-bl-2xl"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-r-4 border-b-4 border-orange-500 rounded-br-2xl"></div>
              
              {/* Main image container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <img
                  src="https://res.cloudinary.com/dw4glwrrn/image/upload/v1750407768/niddik_about-us_Shri_Satyendra_Prasad_Shrivastava_v2_iojino.png"
                  alt="Late Shri Satyendra Prasad Shrivastava"
                  className="w-full h-auto max-h-96 object-contain rounded-xl shadow-2xl"
                />
                
                {/* Overlay with inspirational quote */}
                <div className="absolute bottom-8 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white text-sm italic leading-relaxed">
                    "A true visionary whose innovative thinking and unwavering determination continues to inspire generations."
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-1/4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60"
                animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/4 -left-4 w-6 h-6 bg-orange-500 rounded-full opacity-60"
                animate={{ y: [0, 10, 0], scale: [1, 0.9, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Legacy Story Continuation */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <div className="max-w-4xl mx-auto space-y-6 text-blue-100">
              <h4 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-400 mr-3" />
                The Journey Forward
              </h4>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    His achievements were a constant source of inspiration, yet in the early days, we were held back. A lack of awareness and corporate experience meant that it took us over two decades to finally embark on my own entrepreneurial path.
                  </p>
                  <p className="leading-relaxed">
                    But his legacy was like a guiding light in the darkness. His stories continued to inspire me, and many others as we knew that we couldn't let these challenges defeat us.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    We spent those two decades learning, growing, and gaining the knowledge and skills we needed to succeed. Finally, after more than two decades, we felt ready to take the plunge.
                  </p>
                  <p className="leading-relaxed">
                    Every decision we make, every product we develop, and every service we offer is a reflection of his values and our commitment to carrying on his legacy.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-xl text-white font-semibold leading-relaxed">
                  We are not just building a business; we are building a legacy. A legacy that will inspire future generations, just as my grandfather inspired me.
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Story & Vision Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-24"
          >
            <motion.div variants={itemVariants} className="relative order-1 md:order-none">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/20 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
                alt="Vision forward"
                className="rounded-lg shadow-xl relative z-10"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-6 text-andela-dark">Our Vision & Mission</h2>
              <div className="space-y-4 text-andela-gray">
                <h3 className="text-xl font-semibold text-andela-dark">Connecting Top Notch Talent With Progressive Organizations</h3>
                <p>
                  At Niddik we strive to be the catalyst for career growth, seamlessly connecting top-notch talent with progressive organizations. Our mission is to create a dynamic ecosystem where innovation thrives, skills flourish, and professionals find opportunities that resonate with their aspirations.
                </p>
                <p>
                  Join us in building a future where success is a collective journey, where talent knows no geographical boundaries, and where professional growth is accessible to all who seek it.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-andela-dark mb-2">For Job Seekers: Unlocking The Right Opportunities</h4>
                  <p>
                    Navigating the job market can be perplexing, but we are here to assist you in identifying your qualifications and linking you with companies that align with our stringent standards for safety, diversity, equity, and inclusion. With Niddik, You can be sure of unlocking Job Opportunities that best fit into the career goals you aspire for.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* What Sets Us Apart - Uniquely Designed Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-green-50 blur-3xl opacity-70"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-[10%] w-1 h-20 bg-andela-green rotate-45"></div>
        <div className="absolute top-2/3 right-[10%] w-1 h-20 bg-andela-green -rotate-45"></div>
        <div className="absolute top-1/2 left-[5%] w-2 h-2 rounded-full bg-yellow-400"></div>
        <div className="absolute bottom-1/4 right-[15%] w-2 h-2 rounded-full bg-blue-400"></div>
        <div className="absolute top-1/4 right-[20%] w-4 h-4 rounded-full border-2 border-andela-green"></div>
        
        <Container>
          <div className="relative z-10">
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block relative"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-andela-dark relative z-10">
                  What Sets Us <span className="text-andela-green">Apart</span>
                </h2>
                <div className="absolute -bottom-3 left-0 right-0 h-1 bg-andela-green"></div>
                <div className="absolute -bottom-3 left-1/4 right-1/4 h-3 bg-andela-green"></div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-andela-gray max-w-3xl text-center mt-8"
              >
                Drive Organizational transformation through our full cycle Recruiting services that are scalable & flexible and shaped by deep market knowledge, thought leadership and our multi-industry expertise.
              </motion.p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative bg-white rounded-lg overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                <div className="p-8">
                  <div className="h-16 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.65 16.65M11 6L13 4M13 4L15 6M13 4V12M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="uppercase text-center text-sm font-bold tracking-wider text-andela-green mb-4">SCALABLE SOLUTIONS</h3>
                  <p className="text-andela-gray text-center text-sm">
                    Whether you are a startup or an established organization, our tailor made recruiting solutions will help propel your organization by achieving your people goals on time
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="text-sm border border-andela-green text-andela-green py-2 px-4 rounded-full hover:bg-andela-green hover:text-white transition-colors duration-300">
                      LET US BUILD YOUR TEAM
                    </button>
                  </div>
                </div>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative bg-white rounded-lg overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <div className="p-8">
                  <div className="h-16 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 9H9.01M15 15H15.01M16 8L8 16M9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9ZM15.5 15C15.5 15.2761 15.2761 15.5 15 15.5C14.7239 15.5 14.5 15.2761 14.5 15C14.5 14.7239 14.7239 14.5 15 14.5C15.2761 14.5 15.5 14.7239 15.5 15ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="uppercase text-center text-sm font-bold tracking-wider text-andela-green mb-4">VETTED RESUMES</h3>
                  <p className="text-andela-gray text-center text-sm">
                    Our Sourcing Team is not just limited to Job Boards, but is driven by our diverse sourcing network to include GitHub, LinkedIn, Facebook and other relevant social networking websites
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="text-sm border border-andela-green text-andela-green py-2 px-4 rounded-full hover:bg-andela-green hover:text-white transition-colors duration-300">
                      REQUEST SAMPLE RESUME
                    </button>
                  </div>
                </div>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative bg-white rounded-lg overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                <div className="p-8">
                  <div className="h-16 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M13 7.5C13 8.05228 12.5523 8.5 12 8.5C11.4477 8.5 11 8.05228 11 7.5C11 6.94772 11.4477 6.5 12 6.5C12.5523 6.5 13 6.94772 13 7.5Z" fill="currentColor"/>
                      <path d="M13 16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5C11 15.9477 11.4477 15.5 12 15.5C12.5523 15.5 13 15.9477 13 16.5Z" fill="currentColor"/>
                      <path d="M7.5 13C8.05228 13 8.5 12.5523 8.5 12C8.5 11.4477 8.05228 11 7.5 11C6.94772 11 6.5 11.4477 6.5 12C6.5 12.5523 6.94772 13 7.5 13Z" fill="currentColor"/>
                      <path d="M16.5 13C17.0523 13 17.5 12.5523 17.5 12C17.5 11.4477 17.0523 11 16.5 11C15.9477 11 15.5 11.4477 15.5 12C15.5 12.5523 15.9477 13 16.5 13Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="uppercase text-center text-sm font-bold tracking-wider text-andela-green mb-4">DIVERSITY & INCLUSION</h3>
                  <p className="text-andela-gray text-center text-sm">
                    A diverse workforce brings a variety of talents, skills, and experience to help you achieve better ideas and reach full potential.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="text-sm border border-andela-green text-andela-green py-2 px-4 rounded-full hover:bg-andela-green hover:text-white transition-colors duration-300">
                      LET US DISCUSS
                    </button>
                  </div>
                </div>
              </motion.div>
              
              {/* Feature 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative bg-white rounded-lg overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                <div className="p-8">
                  <div className="h-16 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-andela-green" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M12 3L13.4615 5.59634C13.735 6.13776 14.0961 6.62776 14.5325 7.03482C14.969 7.44188 15.4729 7.76121 16.0189 7.97886C16.565 8.19651 17.1445 8.30863 17.7308 8.30863C18.3172 8.30863 18.8967 8.19651 19.4427 7.97886L22 7L21.0192 9.55703C20.8016 10.1031 20.6894 10.6826 20.6894 11.269C20.6894 11.8554 20.8016 12.4349 21.0192 12.981C21.2369 13.527 21.5562 14.0309 21.9633 14.4674C22.3704 14.9039 22.8604 15.265 23.4018 15.5385L26 17L23.4018 18.4615C22.8604 18.735 22.3704 19.0961 21.9633 19.5325C21.5562 19.969 21.2369 20.4729 21.0192 21.019C20.8016 21.565 20.6894 22.1446 20.6894 22.731C20.6894 23.3174 20.8016 23.8969 21.0192 24.443L22 27L19.4427 26.0211C18.8967 25.8035 18.3172 25.6914 17.7308 25.6914C17.1445 25.6914 16.565 25.8035 16.0189 26.0211C15.4729 26.2388 14.969 26.5581 14.5325 26.9652C14.0961 27.3722 13.735 27.8622 13.4615 28.4037L12 31L10.5385 28.4037C10.265 27.8622 9.90393 27.3722 9.46746 26.9652C9.03099 26.5581 8.52712 26.2388 7.98109 26.0211C7.43506 25.8035 6.85554 25.6914 6.2692 25.6914C5.68287 25.6914 5.10335 25.8035 4.55731 26.0211L2 27L2.98077 24.443C3.19842 23.8969 3.31055 23.3174 3.31055 22.731C3.31055 22.1446 3.19842 21.565 2.98077 21.019C2.76313 20.4729 2.44379 19.969 2.03673 19.5325C1.62968 19.0961 1.13968 18.735 0.598249 18.4615L-2 17L0.598249 15.5385C1.13968 15.265 1.62968 14.9039 2.03673 14.4674C2.44379 14.0309 2.76313 13.527 2.98077 12.981C3.19842 12.4349 3.31055 11.8554 3.31055 11.269C3.31055 10.6826 3.19842 10.1031 2.98077 9.55703L2 7L4.55731 7.97886C5.10335 8.19651 5.68287 8.30863 6.2692 8.30863C6.85554 8.30863 7.43506 8.19651 7.98109 7.97886C8.52712 7.76121 9.03099 7.44188 9.46746 7.03482C9.90393 6.62776 10.265 6.13776 10.5385 5.59634L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="uppercase text-center text-sm font-bold tracking-wider text-andela-green mb-4">EFFECTIVE DELIVERY</h3>
                  <p className="text-andela-gray text-center text-sm">
                    We treat each interaction with our clients, candidates & communities as an opportunity to build lasting relationships resulting in a great experience for our stakeholders
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button className="text-sm border border-andela-green text-andela-green py-2 px-4 rounded-full hover:bg-andela-green hover:text-white transition-colors duration-300">
                      GET IN TOUCH
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Our Values Section */}
      <section className="py-20 bg-andela-light">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Our Values</h2>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              These core principles guide everything we do at Niddik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-andela-dark">{value.title}</h3>
                <p className="text-andela-gray">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Our Journey</h2>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              Key milestones that have shaped Niddik's growth
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

            <div className="space-y-20">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } md:gap-10`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Timeline marker */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-andela-green rounded-full flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>

                  {/* Year box */}
                  <div className={`w-32 md:w-40 flex ${
                    index % 2 === 0 ? "justify-end" : "justify-start"
                  } items-center`}>
                    <div className="bg-andela-dark text-white px-4 py-2 rounded-lg font-bold">
                      {milestone.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 md:max-w-md bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-2 text-andela-dark">{milestone.title}</h3>
                    <p className="text-andela-gray">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-r from-andela-green/5 to-gray-50">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-andela-dark">
              Our <span className="text-andela-green">Leadership</span>
            </h2>
            <div className="w-24 h-1 bg-andela-green mx-auto mb-6"></div>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              Meet the visionary leaders behind Niddik's mission
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-andela-green/10 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-andela-green/10 blur-xl"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-80 relative overflow-hidden flex items-center justify-center bg-gray-50">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-48 h-48 object-contain object-center rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Social links */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-andela-green hover:bg-andela-green hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a 
                        href={member.twitterUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-andela-green hover:bg-andela-green hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-center mb-4">
                      <div className="inline-block px-3 py-1 bg-andela-green/10 rounded-full text-andela-green text-xs font-medium mb-2">
                        {member.role}
                      </div>
                      {member.company && (
                        <div className="text-xs text-gray-600 mb-2">{member.company}</div>
                      )}
                      <h3 className="text-xl font-bold text-andela-dark">{member.name}</h3>
                      <div className="h-1 w-16 bg-andela-green mx-auto mt-2 mb-4"></div>
                    </div>
                    
                    <div className="flex-grow mb-6">
                      <p className="text-gray-600 text-sm leading-relaxed text-center line-clamp-4">
                        {member.bio}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-auto">
                      <button 
                        onClick={() => {
                          setSelectedTeamMember(index);
                          setModalOpen(true);
                        }}
                        className="w-full bg-andela-green hover:bg-andela-dark text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                      >
                        Read Full Bio <ExternalLink className="ml-2 h-4 w-4" />
                      </button>
                      <a 
                        href={member.mailUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full border-2 border-andela-green text-andela-green hover:bg-andela-green hover:text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm text-center"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Team Member Modal */}
          {modalOpen && selectedTeamMember !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-black/60" 
                onClick={() => setModalOpen(false)}
              ></div>
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 mx-4">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-andela-dark transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <img 
                      src={teamMembers[selectedTeamMember].image} 
                      alt={teamMembers[selectedTeamMember].name}
                      className="w-full md:w-64 h-64 object-contain object-center rounded-xl shadow-md" 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-andela-dark mb-1">{teamMembers[selectedTeamMember].name}</h3>
                    <p className="text-andela-green font-medium mb-6">{teamMembers[selectedTeamMember].role}</p>
                    
                    <div className="prose prose-lg max-w-none text-andela-gray">
                      {teamMembers[selectedTeamMember].fullBio?.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold text-andela-dark mb-4">Connect With {teamMembers[selectedTeamMember].name}</h4>
                      <div className="flex gap-4">
                        <a 
                          href={teamMembers[selectedTeamMember].linkedinUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a target="_blank"
                          rel="noopener noreferrer"
                          href={teamMembers[selectedTeamMember].mailUrl} 
                          className="inline-flex items-center bg-andela-green hover:bg-andela-dark text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Ready to Transform Your Talent Strategy - CTA */}
      <section className="py-20 bg-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-andela-green/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-andela-green/5 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-andela-green rounded-full"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-andela-green rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 border border-andela-green/30 rounded-full"></div>
        
        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              {/* Left side - Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6 bg-white p-8 rounded-lg shadow-xl relative z-20"
              >
                <div className="bg-andela-green text-white inline-block px-4 py-1 rounded-full text-sm font-medium mb-2">
                  REACH YOUR BUSINESS GOALS
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold leading-tight text-andela-dark">
                  A workforce partner that <span className="bg-andela-green text-white px-1 py-0 rounded">understands</span> every inch of Your<span className="bg-andela-green text-white px-1 py-0 rounded">Ground</span>
                </h2>
                
                <div className="h-2 w-28 bg-andela-green"></div>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  Helping Our Clients Navigate the complexities Of Talent Sourcing with specialized expertise and a human-centered approach.
                </p>
                
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-andela-green flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Specialized recruitment for technical and leadership roles</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-andela-green flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Custom talent solutions tailored to your company's needs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-andela-green flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Human-first approach with cutting-edge technology</span>
                  </li>
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link 
                    href="/request-demo" 
                    className="bg-andela-green hover:bg-andela-dark text-white px-8 py-4 rounded-md font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <span className="uppercase tracking-wide">Looking To Hire</span>
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link 
                    href="/careers" 
                    className="bg-transparent border-2 border-andela-green text-andela-green hover:bg-andela-green hover:text-white px-8 py-4 rounded-md font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <span className="uppercase tracking-wide">I Am A Job Seeker</span>
                  </Link>
                </div>
              </motion.div>
              
              {/* Right side - Image with decorative elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative hidden lg:block"
              >
                <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-andela-green/20 rounded-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-andela-green/20 rounded-lg"></div>
                
                <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl transform rotate-1">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
                    alt="Business professionals discussing strategy"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                    <p className="text-gray-700 text-lg font-medium leading-snug">
                      "Niddik transformed our hiring process by connecting us with exceptional talent that aligned perfectly with our company culture."
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="h-10 w-10 rounded-full bg-andela-green flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div className="ml-3">
                        <p className="text-andela-dark font-medium">Alex Johnson</p>
                        <p className="text-gray-500 text-sm">CTO, TechVision Inc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
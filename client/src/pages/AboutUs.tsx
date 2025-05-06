import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Globe, Award, Heart, Leaf, Zap, X, ExternalLink } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const AboutUs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(null);
  
  const teamMembers = [
    {
      name: "Abhishek Anchal",
      role: "CEO & Co-Founder",
      image: "https://niddik.com/wp-content/uploads/2025/02/abhishk-anhal.jpg",
      bio: "With over 20 years of experience in talent acquisition, Abhishek has established himself as a renowned expert in the field of recruitment.",
      fullBio: `Abhishek is a seasoned Talent Acquisition Professional with over 20 years of extensive experience in talent acquisition, he has established himself as a renowned expert in the field of recruitment. His impressive career trajectory, marked by progressive leadership roles and a strong academic foundation, is a testament to his dedication, passion, and commitment to excellence.

Born with a natural aptitude for mathematics and computer science, Abhishek pursued his Bachelor's Degree in Applied Mathematics from the University of South Carolina (Conway) between 2000-2004. During his undergraduate studies, he also minored in Computer Science and Statistics, laying a solid foundation for his future career.

Upon graduating, he embarked on his professional journey in the talent acquisition space. His early experiences as a recruiter and lead recruiter helped him develop a keen eye for talent and a deep understanding of the recruitment process.

As Abhishek's career progressed, he took on increasingly senior leadership roles, including Talent Acquisition Manager and Delivery Head – Recruitment. His expertise and leadership skills caught the attention of prominent global organizations, leading to opportunities to work with esteemed companies such as Lehman Brothers (NJ-USA), Thomson Reuters (NY-USA), and Calance (India).`
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
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 tracking-tight">
                A workforce partner that understands every inch of Your Ground
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

      {/* Story & Vision Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-6 text-andela-dark">Our Story</h2>
              <div className="space-y-4 text-andela-gray">
                <h3 className="text-xl font-semibold text-andela-dark">Using Technology & People Skills To Create Productive Teams</h3>
                <p>
                  People & Companies across the world are unique to be defined in words or skillsets, hence good recruiting is a complex task which only specialised teams can successfully navigate.
                </p>
                <p>
                  In a world that is becoming more virtual, where interactions can feel impersonal, we remain mindful that there is always a person on the other side. Our belief is that making a difference stems from individuals collaborating to assist others. It's the human connection, even in an increasingly digital landscape, that defines our approach and drives positive change.
                </p>
                <p>
                  We bring together talent and technology to enable limitless possibilities for our clients, colleagues, and communities. Our conviction rests in the idea that tools and technologies reach their pinnacle when they enhance the ingenuity, expertise, insight, and creativity of the individuals utilizing them.
                </p>
                <p>
                  People are the heartbeat of our approach, while modern technologies serve as the driving force propelling us forward.
                </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-andela-green/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-andela-green/10 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=600&q=80"
                alt="Team collaboration"
                className="rounded-lg shadow-xl relative z-10"
              />
            </motion.div>
          </motion.div>

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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-andela-dark">Our Leadership</h2>
            <p className="text-xl text-andela-gray max-w-2xl mx-auto">
              Meet the visionary behind Niddik's mission
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex flex-col lg:flex-row gap-10 p-6 bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <div className="relative rounded-xl overflow-hidden shadow-lg h-full max-h-[400px]">
                  <img 
                    src={teamMembers[0].image} 
                    alt={teamMembers[0].name} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-40"></div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-andela-green/10 rounded-full text-andela-green text-sm font-medium mb-4">
                    Leadership
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-andela-dark">{teamMembers[0].name}</h3>
                  <p className="text-andela-green text-xl font-medium mb-6">{teamMembers[0].role}</p>
                  
                  <div className="space-y-4 text-andela-gray">
                    <p className="text-lg">{teamMembers[0].bio}</p>
                    <p className="text-lg">
                      Under his guidance, Niddik has grown into a premier talent matching platform, connecting talented professionals with innovative companies worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setSelectedTeamMember(0);
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center bg-andela-green hover:bg-andela-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Read Full Bio <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
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
                      className="w-full md:w-64 h-64 object-cover object-center rounded-xl shadow-md" 
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
                          href="#" 
                          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="#" 
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

      {/* Modern Workforce Partner CTA */}
      <section className="py-16 bg-no-repeat bg-cover bg-center relative text-white overflow-hidden">
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-andela-dark to-blue-800/80"></div>
        
        {/* Light circle accent */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-300/20 blur-2xl"></div>
        
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              {/* Left side - Text content */}
              <div className="space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl font-bold leading-tight"
                >
                  A workforce partner that understands every inch of Your Ground
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl text-blue-50"
                >
                  Helping Our Clients Navigate the complexities Of Talent Sourcing
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <a 
                    href="#" 
                    className="bg-andela-green hover:bg-opacity-90 text-white px-8 py-3 rounded-full font-medium transition-colors inline-flex justify-center uppercase tracking-wide"
                  >
                    Looking To Hire
                  </a>
                  <a 
                    href="#" 
                    className="bg-white hover:bg-gray-100 text-andela-dark px-8 py-3 rounded-full font-medium transition-colors inline-flex justify-center uppercase tracking-wide"
                  >
                    I Am A Job Seeker
                  </a>
                </motion.div>
              </div>
              
              {/* Right side - Image */}
              <div className="hidden md:block">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80"
                  alt="Professional team meeting"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
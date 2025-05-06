import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Globe, Award, Heart, Leaf, Zap, X, ExternalLink } from "lucide-react";
import Container from "@/components/ui/container";

const AboutUs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(null);
  
  const teamMembers = [
    {
      name: "Abhishek Anchal",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "With over 20 years of experience in talent acquisition, Abhishek has established himself as a renowned expert in the field of recruitment.",
      fullBio: `Abhishek is a seasoned Talent Acquisition Professional with over 20 years of extensive experience in talent acquisition, he has established himself as a renowned expert in the field of recruitment. His impressive career trajectory, marked by progressive leadership roles and a strong academic foundation, is a testament to his dedication, passion, and commitment to excellence.

Born with a natural aptitude for mathematics and computer science, Abhishek pursued his Bachelor's Degree in Applied Mathematics from the University of South Carolina (Conway) between 2000-2004. During his undergraduate studies, he also minored in Computer Science and Statistics, laying a solid foundation for his future career.

Upon graduating, he embarked on his professional journey in the talent acquisition space. His early experiences as a recruiter and lead recruiter helped him develop a keen eye for talent and a deep understanding of the recruitment process.

As Abhishek's career progressed, he took on increasingly senior leadership roles, including Talent Acquisition Manager and Delivery Head – Recruitment. His expertise and leadership skills caught the attention of prominent global organizations, leading to opportunities to work with esteemed companies such as Lehman Brothers (NJ-USA), Thomson Reuters (NY-USA), and Calance (India).`
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "A software engineer turned talent advocate, Michael leads Niddik's platform development and technical strategy."
    },
    {
      name: "Sarah Chen",
      role: "COO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Sarah brings operational excellence and a human-centered approach to scaling Niddik's global talent services."
    },
    {
      name: "David Okafor",
      role: "Head of Talent",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "David's expertise in talent assessment and career development has shaped Niddik's unique talent matching approach."
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
    <div>
      {/* Hero Section - Modern redesign */}
      <section className="relative bg-white text-andela-dark overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-andela-green/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-andela-green/5 blur-3xl pointer-events-none"></div>
        
        <Container>
          <div className="py-32 flex flex-col items-center justify-center relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-block mb-4 px-4 py-1 bg-andela-green/10 rounded-full text-andela-green font-medium">
                About Niddik
              </div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-andela-green">Exceptional Talent</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl text-andela-gray mb-8 max-w-3xl mx-auto"
              >
                We're building the future of work by connecting brilliant minds with the companies that need them most, regardless of location.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-5xl relative"
            >
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400/20 rounded-full"></div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-blue-500/10 rounded-full"></div>
              
              <img 
                src="/attached_assets/image_1746533828699.png" 
                alt="Exceptional Talent" 
                className="w-full rounded-2xl shadow-xl relative z-10 border border-gray-100"
              />
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
              Meet the team behind Niddik's mission and vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-light">{member.bio}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-andela-dark">{member.name}</h3>
                  <p className="text-andela-green mb-4">{member.role}</p>
                  {index === 0 && (
                    <button 
                      onClick={() => {
                        setSelectedTeamMember(index);
                        setModalOpen(true);
                      }}
                      className="inline-flex items-center text-andela-green hover:text-andela-dark font-medium transition-colors"
                    >
                      Learn More <ExternalLink className="ml-1 h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
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

      {/* Call to Action */}
      <section className="py-16 bg-andela-dark text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Join Us in Shaping the Future of Work
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 mb-8"
            >
              Whether you're a company looking to build your dream team or a technologist seeking your next opportunity, Niddik is here to connect you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a 
                href="#" 
                className="bg-andela-green hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Hire Talent
              </a>
              <a 
                href="#" 
                className="bg-white hover:bg-gray-100 text-andela-dark px-8 py-3 rounded-md font-medium transition-colors"
              >
                Join as Talent
              </a>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
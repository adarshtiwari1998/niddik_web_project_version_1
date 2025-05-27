
import { motion } from "framer-motion";
import { useState } from "react";
import { Award, BookOpen, Microscope, Users, Globe, ChevronRight, Mail, Linkedin, Phone } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { Button } from "@/components/ui/button";

const LeadershipTeam = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [hoveredLeader, setHoveredLeader] = useState<number | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const leaders = [
    {
      name: "Dr. Abhishek Chanchal",
      title: "CEO / Co-Founder",
      company: "NIDDIKKARE LLP",
      image: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748341074/niddik-leader-ship-team-dr-abhishek_jwetmz.png",
      expertise: ["Nanomedicine", "Biotechnology", "Drug Delivery", "Research"],
      experience: "25+ Years",
      description: "A highly accomplished researcher and scientist with over 25 years' strong foundation in the fields of nanomedicine and biotechnology. Holding a Ph.D. in Bio-Science (Nanomedicine) from the esteemed Jamia Millia Islamia, Delhi, he has developed a profound expertise in the design, formulation, and characterization of nanoparticles for targeted drug delivery.",
      fullBio: "His research focuses on harnessing the potential of nanotechnology to create innovative solutions for complex medical challenges, with a particular emphasis on improving the efficacy and safety of therapeutic interventions. With a deep understanding of the intricate interactions between nanoparticles and biological systems, he has successfully developed novel nanoscale systems that can selectively target diseased cells, reducing side effects and enhancing treatment outcomes. His work has significant implications for the development of personalized medicine and has the potential to revolutionize the field of drug delivery and treatment of various diseases, including cancer, neurological disorders, and infectious diseases. Through his groundbreaking research, Dr. Chanchal continues to contribute to the advancement of nanomedicine and biotechnology, pushing the boundaries of scientific knowledge and innovation, and inspiring future generations of researchers and scientists.",
      icon: <Award className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      name: "Dr. Samar Husain Naqvi",
      title: "CEO / Co-Founder",
      company: "NIDDIKKARE LLP",
      image: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748340984/niddik-leader-ship-team-samar-husain_gczwmu.png",
      expertise: ["Biotechnology", "Life Sciences", "Genomics", "Molecular Biology"],
      experience: "25+ Years",
      description: "A trailblazing expert in biotechnology and life sciences, renowned for his groundbreaking work in genomics, molecular biology, and microbiology. With a career spanning over 25 years, he has established himself as a leading authority in the development of innovative diagnostic solutions, leveraging cutting-edge technologies to drive medical advancements.",
      fullBio: "As a visionary leader, he has held pivotal roles in esteemed corporate organizations, where he has successfully spearheaded the design, development, and manufacturing of in vitro diagnostic medical devices. His expertise in navigating complex regulatory landscapes has ensured the seamless translation of research findings into clinically validated diagnostic tools, ultimately enhancing patient care and outcomes. His research has been instrumental in elucidating the molecular mechanisms underlying various diseases, shedding light on novel biomarkers, and informing the development of targeted therapeutic strategies. Through his mentorship and leadership, he has fostered a new generation of scientists and researchers, imbuing them with a passion for discovery and a commitment to excellence. As a testament to his dedication and expertise, Dr. Naqvi has garnered numerous accolades and recognition within the scientific community, solidifying his position as a luminary in the field of biotechnology and life sciences.",
      icon: <Microscope className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      name: "Mr. Abhishek Anchal",
      title: "CEO / Partner",
      company: "NIDDIK (An IT Division of NIDDIKKARE LLP)",
      image: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748340984/niddik-leader-ship-team-mr-abhishek_dm2jal.png",
      expertise: ["HR Management", "Talent Acquisition", "Strategic Leadership", "Organizational Development"],
      experience: "20+ Years",
      description: "A visionary Human Resources leader with a distinguished career spanning over 20 years, marked by a relentless pursuit of excellence in strategic HR management, talent acquisition, and organizational development. With an MBA degree in Human Resource Management from Corllins University - USA, complemented by a strong foundation in Applied Mathematics from University of South Carolina - USA.",
      fullBio: "Mr. Anchal brings a unique fusion of analytical acumen, business savvy, and interpersonal expertise to his work. Throughout his illustrious career, he has successfully navigated diverse business landscapes in the USA and India, developing a profound understanding of cultural nuances, HR best practices, and regulatory requirements. As a strategic HR thought leader, he has consistently demonstrated his ability to drive organizational growth, foster talent development, and craft innovative recruitment strategies that meet business objectives. With a proven track record of building and managing high-performing teams, designing and implementing cutting-edge HR programs, and providing strategic HR guidance to senior leadership, he has made a lasting impact on his organizations. His expertise in talent management, succession planning, and performance management has enabled companies to optimize their workforce, drive business success, and achieve their goals. As a trusted advisor to senior leaders, Mr. Anchal continues to leverage his expertise to drive HR innovation, promote diversity and inclusion, and build strong, agile organizations that thrive in an ever-changing business landscape.",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Meet the visionary leaders driving innovation at NIDDIK"
        linkText="Join Our Team"
        linkUrl="/careers"
        bgColor="bg-gradient-to-r from-blue-600 to-purple-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
              Leadership Team
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Meet the visionary leaders who drive innovation, excellence, and transformative growth 
              across biotechnology, nanomedicine, and strategic human resources at NIDDIK.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">70+</div>
                <div className="text-gray-600">Years Combined Experience</div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-gray-600">Industry Experts</div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-emerald-600 mb-2">∞</div>
                <div className="text-gray-600">Innovation Potential</div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Leadership Cards Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="space-y-16">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onHoverStart={() => setHoveredLeader(index)}
                onHoverEnd={() => setHoveredLeader(null)}
                className={`relative overflow-hidden rounded-3xl ${leader.bgPattern} p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 transform translate-x-32 -translate-y-32"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-green-200 to-blue-200 transform -translate-x-32 translate-y-32"></div>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-${index % 2 === 0 ? '5' : '5'} gap-12 items-center relative z-10`}>
                  {/* Image Section */}
                  <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <motion.div
                      animate={{
                        scale: hoveredLeader === index ? 1.05 : 1,
                        rotateY: hoveredLeader === index ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className={`w-80 h-80 mx-auto rounded-full bg-gradient-to-r ${leader.color} p-2 shadow-2xl`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img 
                            src={leader.image} 
                            alt={leader.name}
                            className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      
                      {/* Floating Icon */}
                      <motion.div
                        animate={{
                          rotate: hoveredLeader === index ? 360 : 0,
                          scale: hoveredLeader === index ? 1.2 : 1
                        }}
                        transition={{ duration: 0.5 }}
                        className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r ${leader.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {leader.icon}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:col-span-3 space-y-6">
                    <div>
                      <motion.h2
                        animate={{
                          x: hoveredLeader === index ? 10 : 0
                        }}
                        className="text-4xl font-bold text-gray-900 mb-2"
                      >
                        {leader.name}
                      </motion.h2>
                      
                      <div className={`text-xl font-semibold bg-gradient-to-r ${leader.color} bg-clip-text text-transparent mb-1`}>
                        {leader.title}
                      </div>
                      
                      <div className="text-gray-600 text-lg mb-4">{leader.company}</div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-600">{leader.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-3">
                      {leader.expertise.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: skillIndex * 0.1 }}
                          className={`px-4 py-2 rounded-full bg-gradient-to-r ${leader.color} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {leader.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        onClick={() => {
                          setSelectedLeader(index);
                          setModalOpen(true);
                        }}
                        className={`bg-gradient-to-r ${leader.color} hover:opacity-90 text-white px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all`}
                      >
                        <span className="flex items-center">
                          <BookOpen className="mr-2 w-5 h-5" />
                          Read Full Biography
                        </span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`border-2 hover:bg-gray-50 px-6 py-3 font-medium transition-all`}
                        style={{
                          borderImage: `linear-gradient(to right, ${leader.color.split(' ')[1]}, ${leader.color.split(' ')[3]}) 1`
                        }}
                      >
                        <span className="flex items-center">
                          <Mail className="mr-2 w-5 h-5" />
                          Connect
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredLeader === index ? 0.1 : 0 }}
                  className={`absolute inset-0 bg-gradient-to-r ${leader.color} rounded-3xl`}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Work with Visionary Leaders?
            </h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              Join our team and work alongside industry pioneers who are shaping the future 
              of biotechnology, nanomedicine, and strategic talent management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
              >
                <span className="flex items-center">
                  <Users className="mr-2 w-5 h-5" />
                  Join Our Team
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-andela-green hover:bg-white/10 text-lg px-8 py-4 h-auto font-semibold"
              >
                <span className="flex items-center">
                  Learn Our Story
                  <ChevronRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Biography Modal */}
      {modalOpen && selectedLeader !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="relative">
              {/* Header */}
              <div className={`bg-gradient-to-r ${leaders[selectedLeader].color} p-8 text-white`}>
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-white p-1">
                    <img 
                      src={leaders[selectedLeader].image} 
                      alt={leaders[selectedLeader].name}
                      className="w-full h-full rounded-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{leaders[selectedLeader].name}</h2>
                    <p className="text-xl opacity-90">{leaders[selectedLeader].title}</p>
                    <p className="text-lg opacity-75">{leaders[selectedLeader].company}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Experience & Expertise</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {leaders[selectedLeader].expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${leaders[selectedLeader].color} text-white text-sm font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">
                      <strong>{leaders[selectedLeader].experience}</strong> of industry experience
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Biography</h3>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>{leaders[selectedLeader].description}</p>
                      <p>{leaders[selectedLeader].fullBio}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">
                    {leaders[selectedLeader].icon}
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                      className="px-6 py-2"
                    >
                      Close
                    </Button>
                    <Button 
                      className={`bg-gradient-to-r ${leaders[selectedLeader].color} text-white px-6 py-2`}
                    >
                      <Mail className="mr-2 w-4 h-4" />
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LeadershipTeam;

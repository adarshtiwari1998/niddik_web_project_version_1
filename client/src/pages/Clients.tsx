
import { motion } from "framer-motion";
import { useState } from "react";
import { Building2, Users, Award, Globe } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Clients = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const clients = [
    {
      name: "KPMG",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_kpmg_hlzxx3.png",
      description: "Global professional services firm providing audit, tax and advisory services"
    },
    {
      name: "Wimmer",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_wimmer_dpw6yf.png",
      description: "Leading provider of innovative solutions and services"
    },
    {
      name: "Weyerhaeuser",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_weyerhaeuser_jwis4d.png",
      description: "One of the world's largest private owners of timberlands"
    },
    {
      name: "Microsoft",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_microsoft_fvd2g8.png",
      description: "Technology corporation developing computer software, consumer electronics, and related services"
    },
    {
      name: "Lifespace",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_lifespace_t4lcfd.png",
      description: "Provider of senior living communities and services"
    },
    {
      name: "Nordstrom",
      logo: "https://res.cloudinary.com/dhanz6zty/image/upload/v1748372070/niddik_client_nordstorm_oep8ef.png",
      description: "Luxury department store chain offering fashion, shoes, beauty and home goods"
    }
  ];

  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      number: "500+",
      label: "Global Clients",
      description: "Companies worldwide trust our services"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "10,000+",
      label: "Placements Made",
      description: "Successful talent connections"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "98%",
      label: "Client Satisfaction",
      description: "Rated by our partners"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "25+",
      label: "Countries",
      description: "Global presence and reach"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnnouncementBar 
        text="Discover how we've helped industry leaders transform their workforce"
        linkText="Get Started"
        linkUrl="/request-demo"
        bgColor="bg-gradient-to-r from-blue-600 to-purple-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-andela-green mr-3" />
              <span className="text-lg font-semibold text-andela-green tracking-wider">OUR CLIENTS</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-andela-dark leading-tight">
              Trusted by Industry
              <br />
              <span className="bg-gradient-to-r from-andela-green to-blue-600 bg-clip-text text-transparent">
                Leaders Worldwide
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              From Fortune 500 companies to innovative startups, we've partnered with 
              organizations across industries to build exceptional teams and drive growth.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-andela-green/10 to-blue-100 p-6 rounded-2xl mb-4 group-hover:from-andela-green/20 group-hover:to-blue-200 transition-all duration-300">
                  <div className="text-andela-green mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-andela-dark mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-andela-dark mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Client Logos Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-andela-dark">
              Our Valued Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud to work with some of the most innovative and successful companies 
              across various industries, helping them achieve their talent acquisition goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-andela-green/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-20 mb-6 flex items-center justify-center overflow-hidden">
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-andela-dark mb-3 group-hover:text-andela-green transition-colors">
                      {client.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {client.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-andela-green/10 via-blue-50 to-purple-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-andela-dark">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Partner with us to access top-tier talent and transform your organization's 
              hiring capabilities. Let's build your dream team together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="/request-demo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-andela-green hover:bg-andela-green/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
              >
                Request Demo
              </motion.a>
              
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-andela-green text-andela-green hover:bg-andela-green hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-flex items-center justify-center"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Clients;

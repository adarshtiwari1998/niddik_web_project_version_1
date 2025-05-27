
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Building2, Users, Award, Globe } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Testimonials = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const testimonials = [
    {
      name: "Michael Johnson",
      role: "CTO",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "Niddik helped us scale our engineering team quickly with top talent. The quality of developers and their integration into our team has been seamless.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Software Engineer",
      company: "",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "Joining Niddik was the best career decision I've made. I've worked with amazing teams on challenging projects, all while growing professionally.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "VP of Engineering",
      company: "InnovateX",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "The talent we've accessed through Niddik has been exceptional. Their team understood our needs and matched us with perfect candidates.",
      rating: 4.5
    },
    {
      name: "Alex Rodriguez",
      role: "CTO",
      company: "TechForward Inc.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "The adaptive hiring model completely transformed our engineering recruitment. We've reduced time-to-hire by 65% while significantly improving candidate quality and team fit.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Head of Talent",
      company: "CloudScale",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "Working with Niddik has been a game-changer for our hiring process. Their platform's AI-driven matching has helped us find candidates we never would have discovered otherwise.",
      rating: 5
    },
    {
      name: "James Thompson",
      role: "Engineering Manager",
      company: "DataFlow Systems",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
      quote: "The quality of talent and the speed of delivery exceeded our expectations. Niddik's team really understands the technical requirements and cultural fit we need.",
      rating: 4.5
    }
  ];

  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      number: "500+",
      label: "Happy Clients",
      description: "Companies worldwide trust our services"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "98%",
      label: "Client Satisfaction",
      description: "Rated by our partners"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "92%",
      label: "Retention Rate",
      description: "Long-term successful placements"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: "4.9",
      label: "Average Rating",
      description: "Based on client feedback"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnnouncementBar 
        text="Read what our clients say about their transformative experiences with Niddik"
        linkText="Contact Us"
        linkUrl="/contact"
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
              <Quote className="w-8 h-8 text-andela-green mr-3" />
              <span className="text-lg font-semibold text-andela-green tracking-wider">SUCCESS STORIES</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-andela-dark leading-tight">
              What Our Clients
              <br />
              <span className="bg-gradient-to-r from-andela-green to-blue-600 bg-clip-text text-transparent">
                Say About Us
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Hear from our clients and technologists about their experience with Niddik. 
              Discover how we've helped organizations transform their hiring and careers flourish.
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

      {/* Testimonials Section */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-andela-dark">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real clients who have experienced the Niddik difference. 
              From startups to Fortune 500 companies, see how we've helped them succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-andela-green/20 h-full flex flex-col">
                  {/* Rating */}
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < testimonial.rating ? "currentColor" : "none"} 
                        className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                        size={18} 
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6 flex-grow">
                    <Quote className="absolute top-0 left-0 w-8 h-8 text-andela-green/20 -translate-x-2 -translate-y-2" />
                    <p className="text-gray-700 leading-relaxed relative z-10 italic">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name} profile`} 
                      className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-andela-green/20"
                    />
                    <div>
                      <h4 className="font-bold text-andela-dark group-hover:text-andela-green transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
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
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join hundreds of companies who have transformed their hiring process with Niddik. 
              Let's discuss how we can help you achieve similar results.
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

export default Testimonials;

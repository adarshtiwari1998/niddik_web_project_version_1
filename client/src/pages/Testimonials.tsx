import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import Container from '@/components/ui/container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const testimonials = [
    {
      name: "Michael Johnson",
      position: "CTO, TechCorp",
      company: "TechCorp",
      testimonial: "Niddik helped us scale our engineering team quickly with top talent. The quality of developers and their integration into our team has been seamless.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      companyLogo: "https://via.placeholder.com/60x40/3B82F6/FFFFFF?text=TC"
    },
    {
      name: "Sarah Williams",
      position: "Software Engineer",
      company: "InnovateX",
      testimonial: "Joining Niddik was the best career decision I've made. I've worked with amazing teams on challenging projects, all while growing professionally.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3e0?auto=format&fit=crop&w=150&q=80",
      companyLogo: "https://via.placeholder.com/60x40/10B981/FFFFFF?text=IX"
    },
    {
      name: "David Chen",
      position: "VP of Engineering",
      company: "InnovateX",
      testimonial: "The talent we've accessed through Niddik has been exceptional. Their team understood our needs and matched us with perfect candidates.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      companyLogo: "https://via.placeholder.com/60x40/10B981/FFFFFF?text=IX"
    }
  ];

  const stats = [
    { value: "500+", label: "Successful Placements", icon: <Users className="w-8 h-8" /> },
    { value: "98%", label: "Client Satisfaction", icon: <Award className="w-8 h-8" /> },
    { value: "95%", label: "Retention Rate", icon: <TrendingUp className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AnnouncementBar 
        text="Read more success stories from our global community"
        linkText="View All"
        linkUrl="/testimonials"
        bgColor="bg-gradient-to-r from-blue-600 to-purple-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Quote className="w-12 h-12 text-blue-600 mr-4" />
              <span className="text-xl font-semibold text-blue-600 tracking-wider uppercase">Success Stories</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Transforming Careers
              <br />
              & Companies
            </h1>

            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              Hear from our clients and technologists about their experience with Niddik
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-blue-600 mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main Testimonials Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who have transformed their careers and businesses with Niddik
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <Quote className="w-full h-full text-blue-600" />
                </div>

                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                    "{testimonial.testimonial}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.position}</div>
                        <div className="text-blue-600 text-sm font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                    <img
                      src={testimonial.companyLogo}
                      alt={`${testimonial.company} logo`}
                      className="w-12 h-8 object-contain opacity-70"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of professionals and companies who have transformed their future with Niddik
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto font-semibold"
              >
                <span className="flex items-center">
                  <Users className="mr-2 w-5 h-5" />
                  Find Talent
                </span>
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto font-semibold"
              >
                <span className="flex items-center">
                  Join Our Community
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
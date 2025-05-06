import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="🚀 Now offering specialized talent matching in cybersecurity"
        linkText="Learn more"
        linkUrl="#"
        bgColor="bg-andela-green"
        textColor="text-white"
      />
      <Navbar hasAnnouncementAbove={true} />
      
      {/* Hero Section with Enhanced Split Layout */}
      <section className="min-h-[600px] relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9ff] to-[#f5f9ff] z-0"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-50 opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-green-50 opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-green-50 opacity-30"></div>
        
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-24 items-center">
            {/* Left Column - Enhanced Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-800 mb-6">
                Helping <span className="text-andela-green">businesses</span> find the right talent to progress in the digital world
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Connect with top-tier professionals who can drive innovation and growth for your organization.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <a 
                  href="#" 
                  className="bg-andela-green hover:bg-andela-green/90 text-white font-medium px-10 py-4 rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                  LOOKING TO HIRE
                </a>
                <a 
                  href="#" 
                  className="border-2 border-gray-700 text-gray-700 font-medium px-10 py-4 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                >
                  I AM A JOB SEEKER
                </a>
              </div>
            </motion.div>

            {/* Right Column - Enhanced Image with Shadow */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=90" 
                alt="Business professionals working together" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Call-to-Action Section with Split Layout */}
      <section className="py-20 bg-gradient-to-r from-white to-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text and Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-tight">
                Unlock your potential with the right <span className="text-andela-green">career opportunity</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-10">
                Whether you're looking to hire top talent or find your dream job, we can help you achieve your goals.
              </p>
              
              <div className="flex flex-wrap gap-6 mt-2">
                <a 
                  href="#" 
                  className="bg-andela-green hover:bg-andela-green/90 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg inline-flex items-center justify-center min-w-[180px]"
                >
                  LOOKING TO HIRE
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center min-w-[180px] text-gray-700 font-medium hover:text-andela-green transition-colors"
                >
                  I AM A JOB SEEKER
                </a>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="/attached_assets/image_1746544199102.png" 
                alt="Business professionals collaborating" 
                className="w-full h-auto rounded-xl shadow-xl"
              />
            </motion.div>
          </div>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
}
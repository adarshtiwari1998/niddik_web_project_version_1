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
      
      {/* Hero Section with Split Layout */}
      <section className="min-h-[500px] relative bg-[#f5f9ff] overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 lg:py-20 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
                Helping <span className="text-andela-green">businesses</span> find the right talent to progress in the digital world
              </h1>
              
              <div className="flex flex-wrap gap-4 mt-10">
                <a 
                  href="#" 
                  className="bg-andela-green hover:bg-andela-green/90 text-white font-medium px-8 py-3 rounded-full transition-colors"
                >
                  LOOKING TO HIRE
                </a>
                <a 
                  href="#" 
                  className="border border-gray-800 text-gray-800 font-medium px-8 py-3 rounded-full hover:bg-gray-800 hover:text-white transition-colors"
                >
                  I AM A JOB SEEKER
                </a>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" 
                alt="Business professionals working together" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Additional Sections would go here */}
      
      <Footer />
    </div>
  );
}
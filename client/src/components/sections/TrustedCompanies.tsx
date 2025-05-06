import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

// Simple component to exactly match the reference image
const TrustedCompanies = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <Container>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-start">
            {/* Left column with text */}
            <motion.div 
              className="md:w-1/3 mb-8 md:mb-0 pr-0 md:pr-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-andela-dark mb-4">
                Trusted by leading companies worldwide
              </h2>
              <p className="text-andela-gray">
                Join thousands of businesses using our platform to connect with top tech talent around the globe.
              </p>
            </motion.div>
            
            {/* Right column with company logos in grid */}
            <motion.div 
              className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Company logos as images */}
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" 
                     alt="Microsoft" className="h-8 max-w-full" />
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/KPMG_logo.svg" 
                     alt="KPMG" className="h-8 max-w-full" />
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Goldman_Sachs.svg" 
                     alt="Goldman Sachs" className="h-8 max-w-full" />
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a0/J.P._Morgan_logo.svg" 
                     alt="JP Morgan" className="h-8 max-w-full" />
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Viacom_CBS_logo.svg" 
                     alt="Viacom CBS" className="h-8 max-w-full" />
              </div>
              <div className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" 
                     alt="GitHub" className="h-8 max-w-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TrustedCompanies;

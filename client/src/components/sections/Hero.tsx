import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Container from "@/components/ui/container";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Hero = () => {
  return (
    <section className="pt-32 pb-16 bg-andela-light">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-andela-dark mb-6">
              Find tech experts for your projects in record time
            </h1>
            <p className="text-lg text-andela-gray mb-8 max-w-xl">
              We help you source, evaluate, and deliver world-class teams and technologists – fully vetted, compliant, and tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-8 py-3 rounded-md font-medium text-center">
                <a href="#" className="text-white">Hire Talent</a>
              </div>
              <div className="border border-andela-green text-andela-green hover:bg-andela-green hover:text-white transition-colors px-8 py-3 rounded-md font-medium text-center">
                <a href="#" className="text-andela-green hover:text-white">Apply as Talent</a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Diverse tech team collaborating" 
              className="rounded-xl shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-andela-green h-12 w-12 rounded-full flex items-center justify-center text-white">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">96%</p>
                  <p className="text-sm text-andela-gray">Placement Success Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

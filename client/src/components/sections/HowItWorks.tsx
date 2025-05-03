import { Link } from "wouter";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

interface StepProps {
  number: number;
  color: string;
  title: string;
  description: string;
}

const Step = ({ number, color, title, description }: StepProps) => {
  return (
    <div className="text-center">
      <div className="bg-white h-20 w-20 rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
        <span className={`${color} text-3xl font-bold`}>{number}</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-andela-gray">
        {description}
      </p>
    </div>
  );
};

const steps: StepProps[] = [
  {
    number: 1,
    color: "text-andela-green",
    title: "Define Your Needs",
    description: "Tell us about your technical requirements and team structure"
  },
  {
    number: 2,
    color: "text-andela-blue",
    title: "Meet Candidates",
    description: "We'll match you with pre-vetted talent aligned with your needs"
  },
  {
    number: 3,
    color: "text-purple-600",
    title: "Interview & Select",
    description: "Choose the best fit for your team from our quality candidates"
  },
  {
    number: 4,
    color: "text-red-500",
    title: "Onboard & Scale",
    description: "We handle contracts, payments, and support for a seamless experience"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-andela-light">
      <Container>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-andela-gray max-w-2xl mx-auto">
            Our streamlined process connects you with the right talent quickly
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Step {...step} />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="#">
            <a className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-8 py-3 rounded-md font-medium inline-block">
              Get Started
            </a>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorks;

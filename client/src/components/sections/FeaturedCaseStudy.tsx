import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, GitBranch } from "lucide-react";
import Container from "@/components/ui/container";

interface BenefitProps {
  text: string;
}

const Benefit = ({ text }: BenefitProps) => {
  return (
    <li className="flex items-center">
      <CheckCircle className="w-5 h-5 mr-3 text-andela-green" />
      {text}
    </li>
  );
};

const benefits = [
  "Reduced time-to-hire by 70%",
  "Assembled a team of 15 engineers in 3 weeks",
  "95% retention rate after 1 year"
];

const FeaturedCaseStudy = () => {
  return (
    <section className="py-20 bg-andela-dark">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-andela-green/20 text-andela-green px-4 py-1 rounded-full text-sm font-medium">
              Featured Case Study
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6">
              How GitHub Scaled Their Engineering Team
            </h2>
            <p className="text-gray-300 mb-8">
              GitHub needed to quickly expand their engineering capacity to meet growing demands. Learn how Andela helped them build a distributed team of top engineers.
            </p>
            <ul className="space-y-4 mb-8 text-gray-300">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                >
                  <Benefit text={benefit} />
                </motion.div>
              ))}
            </ul>
            <Link href="#" className="bg-andela-green hover:bg-opacity-90 transition-colors text-white px-6 py-3 rounded-md font-medium inline-flex items-center">
              Read Full Case Study
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" 
              alt="Modern tech office" 
              className="rounded-xl shadow-xl w-full"
            />
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-andela-dark h-12 w-12 rounded-full flex items-center justify-center text-white">
                  <GitBranch className="text-lg" />
                </div>
                <div>
                  <p className="font-semibold">3 weeks</p>
                  <p className="text-sm text-andela-gray">To build full team</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCaseStudy;

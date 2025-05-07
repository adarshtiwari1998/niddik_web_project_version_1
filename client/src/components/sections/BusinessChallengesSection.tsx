import React from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Award, 
  Users, 
  Zap,
  BrainCog
} from "lucide-react";
import Container from "@/components/ui/container";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Challenge card component
const ChallengeCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <motion.div
    variants={itemVariants}
    className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full"
  >
    <div className="bg-green-50 p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const BusinessChallengesSection = () => {
  const challenges = [
    {
      icon: <GraduationCap className="w-8 h-8 text-green-600" />,
      title: "Skill Gaps",
      description: "Teams lack highly skilled experts for high-impact AI-driven product initiatives, hindering innovation."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Limited Capacity",
      description: "Important tech initiatives move to the back-burner because of resource constraints limiting AI adoption."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "High FTE Costs",
      description: "Costs associated with full-time AI specialists are high: recruiting, benefits, equity, PTO, etc."
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Long Hiring Periods",
      description: "It can take months to identify, hire, and onboard new technical AI team members."
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: "Slow Deployment",
      description: "Failure to meet demand for growth, new product features, and market expansion with AI capabilities."
    },
    {
      icon: <Award className="w-8 h-8 text-green-600" />,
      title: "High Turnover",
      description: "Attrition negatively impacts productivity and business delivery, especially in complex AI projects."
    },
  ];

  return (
    <section className="py-20 bg-[#f8fafe] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 border-2 border-green-200 rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 border-2 border-blue-200 rounded-full"></div>
        <div className="absolute top-60 right-1/3 w-6 h-6 bg-green-400 rounded-full"></div>
        
        {/* Network-like pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-5">
          <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="#36b37e" />
            <circle cx="0" cy="0" r="1" fill="#36b37e" />
            <circle cx="0" cy="100" r="1" fill="#36b37e" />
            <circle cx="100" cy="0" r="1" fill="#36b37e" />
            <circle cx="100" cy="100" r="1" fill="#36b37e" />
            <line x1="50" y1="50" x2="0" y2="0" stroke="#36b37e" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="0" y2="100" stroke="#36b37e" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="100" y2="0" stroke="#36b37e" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="100" y2="100" stroke="#36b37e" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>
      
      <Container>
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <BrainCog className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-green-600 font-medium">AI-Powered Solutions</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Simply put,<br />
              important work isn't getting done
            </h2>
            <p className="text-lg text-gray-600">
              Organizations need an innovation partner like <span className="font-semibold text-green-700">Niddik</span> that offers cost-effective 
              access to a global pool of skilled AI professionals. The ideal partner must 
              possess the agility to scale teams, drive innovation, and integrate seamlessly 
              into existing workflows with cutting-edge AI technologies.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              icon={challenge.icon}
              title={challenge.title}
              description={challenge.description}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-green-600 font-medium mb-3">
            <span className="text-lg font-semibold">Niddik's AI-Powered Talent Solution</span> addresses these challenges
          </p>
          <a 
            href="/solutions" 
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            Discover How
          </a>
        </motion.div>
      </Container>
    </section>
  );
};

export default BusinessChallengesSection;
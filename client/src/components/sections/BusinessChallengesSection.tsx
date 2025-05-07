import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  UserX,
  Maximize2
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

// Challenge card component with square teal icon
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
    className="pl-0 relative border-l border-gray-200"
  >
    <div className="flex flex-col pl-6">
      <div className="w-14 h-14 rounded-md flex items-center justify-center mb-3" style={{ backgroundColor: "#00A651" }}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-base font-medium mb-1">{title}</h3>
      <p className="text-gray-600 text-sm max-w-[90%]">{description}</p>
    </div>
  </motion.div>
);

const BusinessChallengesSection = () => {
  const challenges = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Skill Gaps",
      description: "Teams lack highly skilled experts for high-impact product initiatives."
    },
    {
      icon: <Maximize2 className="w-6 h-6" />,
      title: "Limited Capacity",
      description: "Important initiatives move to the back-burner because of resourcing."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "High FTE Costs",
      description: "Costs associated with FTE are high: recruiting, benefits, equity, PTO, etc."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Long Hiring Periods",
      description: "It can take months to identify, hire, and onboard new team members."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Slow Deployment",
      description: "Failure to meet demand for growth, new product, and market expansion."
    },
    {
      icon: <UserX className="w-6 h-6" />,
      title: "High Turnover",
      description: "Attrition negatively impacts productivity and business delivery."
    },
  ];

  return (
    <section className="py-20 bg-[#f0f7f7] relative overflow-hidden">
      {/* Background patterns - very subtle network pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <pattern id="network" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="60" r="1" fill="#00A651" />
            <circle cx="0" cy="0" r="1" fill="#00A651" />
            <circle cx="0" cy="120" r="1" fill="#00A651" />
            <circle cx="120" cy="0" r="1" fill="#00A651" />
            <circle cx="120" cy="120" r="1" fill="#00A651" />
            <line x1="60" y1="60" x2="0" y2="0" stroke="#00A651" strokeWidth="0.2" />
            <line x1="60" y1="60" x2="0" y2="120" stroke="#00A651" strokeWidth="0.2" />
            <line x1="60" y1="60" x2="120" y2="0" stroke="#00A651" strokeWidth="0.2" />
            <line x1="60" y1="60" x2="120" y2="120" stroke="#00A651" strokeWidth="0.2" />
          </pattern>
          {/* Removed rect element to fix text selection issue */}
        </svg>
      </div>
      
      <Container className="px-6 md:px-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left column with heading and description - exact width and layout as in image */}
          <div className="w-full lg:w-1/3 mb-12 lg:mb-0 pr-0 lg:pr-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-5">
                Simply put,<br />
                important work<br /> 
                isn't getting done
              </h2>
              <p className="text-gray-600 text-base">
                Organizations need an innovation partner that offers cost-effective 
                access to a global pool of skilled professionals. The ideal partner must 
                possess the agility to scale teams, drive innovation, and integrate seamlessly 
                into existing workflows.
              </p>
            </motion.div>
          </div>
          
          {/* Right column with challenge cards - showing only 2 in a row */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12"
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
          </div>
        </div>
        
        {/* No bottom CTA in the original design, so removing it */}
      </Container>
    </section>
  );
};

export default BusinessChallengesSection;
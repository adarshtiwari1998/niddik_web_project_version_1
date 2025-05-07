import React from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Zap, 
  UserX 
} from 'lucide-react';
import Container from '@/components/ui/container';
import { motion } from 'framer-motion';

const ChallengesItem = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-teal-600/10 flex items-center justify-center text-teal-600">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ChallengesSection = () => {
  const challenges = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Skill Gaps",
      description: "Teams lack highly skilled experts for high-impact product initiatives."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Limited Capacity",
      description: "Important initiatives move to the back-burner because of resourcing challenges."
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
    }
  ];

  return (
    <section className="py-20 bg-[#f0f7f7]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Simply put, <br />
                important work <br />
                isn't getting done
              </h2>
              <p className="text-gray-600 mb-8">
                Organizations need an innovation partner that offers cost-effective 
                access to a global pool of skilled professionals. <span className="font-semibold">Niddik</span> is the 
                ideal partner with <span className="font-semibold">AI-powered</span> agility to scale teams, drive 
                innovation, and integrate seamlessly into existing workflows.
              </p>
            </motion.div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ChallengesItem 
                    icon={item.icon} 
                    title={item.title} 
                    description={item.description} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ChallengesSection;
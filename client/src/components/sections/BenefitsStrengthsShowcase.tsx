import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, ShieldCheck, Zap, Users, Layers, BarChart, Target } from 'lucide-react';
import Container from '@/components/ui/container';

interface BenefitOrStrengthItem {
  icon: React.ReactNode;
  title: string;
  color: string;
  bgColor: string;
}

const BenefitsStrengthsShowcase = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'strengths'>('benefits');

  const benefits: BenefitOrStrengthItem[] = [
    { 
      icon: <TrendingUp className="h-5 w-5" />, 
      title: 'Improve hiring success', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100' 
    },
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: 'Reduce time to fill', 
      color: 'text-sky-600',
      bgColor: 'bg-sky-100' 
    },
    { 
      icon: <BarChart className="h-5 w-5" />, 
      title: 'Lower recruitment costs', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-100' 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      title: 'Enhance candidate experience', 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100' 
    },
    { 
      icon: <ShieldCheck className="h-5 w-5" />, 
      title: 'Ensure compliance', 
      color: 'text-red-600',
      bgColor: 'bg-red-100' 
    },
    { 
      icon: <Target className="h-5 w-5" />, 
      title: 'Access top talent', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100' 
    },
    { 
      icon: <Layers className="h-5 w-5" />, 
      title: 'Streamline processes', 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100' 
    },
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: 'Increase efficiency', 
      color: 'text-lime-600',
      bgColor: 'bg-lime-100' 
    },
  ];

  const strengths: BenefitOrStrengthItem[] = [
    { 
      icon: <Target className="h-5 w-5" />, 
      title: 'Strategic talent sourcing', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100' 
    },
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: 'Advanced tech', 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100' 
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      title: 'Dedicated support', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-100' 
    },
    { 
      icon: <Layers className="h-5 w-5" />, 
      title: 'Customized solutions', 
      color: 'text-sky-600',
      bgColor: 'bg-sky-100' 
    },
    { 
      icon: <BarChart className="h-5 w-5" />, 
      title: 'Data-driven insights', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100' 
    },
    { 
      icon: <TrendingUp className="h-5 w-5" />, 
      title: 'Scalable resources', 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100' 
    },
    { 
      icon: <CheckCircle className="h-5 w-5" />, 
      title: 'Improved quality', 
      color: 'text-lime-600',
      bgColor: 'bg-lime-100' 
    },
    { 
      icon: <ShieldCheck className="h-5 w-5" />, 
      title: 'Risk mitigation', 
      color: 'text-red-600',
      bgColor: 'bg-red-100' 
    },
  ];

  const activeItems = activeTab === 'benefits' ? benefits : strengths;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Container>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-andela-green/10 text-andela-green px-4 py-1.5 rounded-full text-sm font-medium mb-3 inline-block">
              Why Choose NIDDIK
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-andela-dark mb-4">
              Transforming Talent Acquisition
            </h2>
            <p className="text-andela-gray max-w-3xl mx-auto text-lg">
              Discover how our innovative approach revolutionizes recruitment and delivers exceptional results for businesses worldwide.
            </p>
          </motion.div>

          {/* Tab Toggle */}
          <div className="flex justify-center mt-12 mb-10">
            <motion.div 
              className="bg-white p-1.5 rounded-full shadow-md flex gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'benefits'
                    ? 'bg-andela-green text-white shadow-sm'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('strengths')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'strengths'
                    ? 'bg-andela-green text-white shadow-sm'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Our Strengths
              </button>
            </motion.div>
          </div>
        </div>

        {/* Hexagon Grid Layout */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeItems.map((item, index) => (
            <motion.div
              key={`${activeTab}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[200px] aspect-square">
                {/* Hexagon Shape with Hover Animation */}
                <div className="hexagon-container group cursor-pointer">
                  <div className={`hexagon ${item.bgColor} group-hover:scale-105 group-hover:shadow-lg transition-all duration-300`}>
                    <div className="hexagon-content flex flex-col items-center justify-center text-center px-4">
                      <div className={`${item.color} p-2 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-sm md:text-base text-andela-dark group-hover:text-andela-green transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button className="inline-flex items-center gap-2 bg-andela-green hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-medium transition transform hover:scale-105">
            Learn More <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </Container>

      {/* CSS for Hexagon Shape is in index.css */}
    </section>
  );
};

export default BenefitsStrengthsShowcase;
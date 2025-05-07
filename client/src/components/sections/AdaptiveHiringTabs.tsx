import React, { useState } from 'react';
import { Users, DollarSign, Rocket, BarChart4 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabData {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  metrics: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
    progress1: number;
    progress2: number;
  };
}

const AdaptiveHiringTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quality');

  // Tab data with metrics that will display in a dashboard-style visual
  const tabs: TabData[] = [
    {
      id: 'quality',
      title: 'Quality Global Talent',
      icon: <Users className="w-5 h-5" />,
      description: 'Unlock a vast pool of untapped global talent, with 60% from emerging tech hubs in Africa and LATAM. Our borderless marketplace spans 135 countries, connecting you with the right skills to drive innovation.',
      metrics: {
        label1: 'Countries',
        value1: '135+',
        label2: 'Candidates',
        value2: '250K+',
        progress1: 75,
        progress2: 60
      }
    },
    {
      id: 'cost',
      title: 'Cost Optimization',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Reduce hiring costs by up to 50% compared to traditional recruitment methods. Our AI-powered matching eliminates expensive agency fees and reduces the time-to-hire from months to days.',
      metrics: {
        label1: 'Cost Savings',
        value1: '50%',
        label2: 'Time Saved',
        value2: '70%',
        progress1: 50,
        progress2: 70
      }
    },
    {
      id: 'agile',
      title: 'Agile Deployment',
      icon: <Rocket className="w-5 h-5" />,
      description: 'Deploy talent in as little as 48 hours with our streamlined matching and onboarding processes. Our platform handles all compliance, contracts, and payments globally.',
      metrics: {
        label1: 'Deployment',
        value1: '48hrs',
        label2: 'Onboarding',
        value2: '24hrs',
        progress1: 80,
        progress2: 90
      }
    },
    {
      id: 'scale',
      title: 'Rapid Scalability',
      icon: <BarChart4 className="w-5 h-5" />,
      description: 'Scale your team up or down based on project demands with flexible engagement models. Access a network of over 500,000 pre-vetted professionals to quickly address changing business needs.',
      metrics: {
        label1: 'Team Size',
        value1: '+2',
        label2: 'Duration',
        value2: '3 months',
        progress1: 40,
        progress2: 30
      }
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  // Define primary teal color based on the reference
  const primaryColor = '#0E8A7B'; // Teal color from the provided image

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-full flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            style={{ 
              backgroundColor: activeTab === tab.id ? primaryColor : '',
              borderColor: activeTab !== tab.id ? '#e5e7eb' : ''
            }}
          >
            <div style={{ color: activeTab === tab.id ? 'white' : primaryColor }}>
              {tab.icon}
            </div>
            <span className="font-medium">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Content area with dashboard graphics and text */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-4">
        {/* Left column with text */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeTabData.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">{activeTabData.description}</p>
          <div className="mt-4">
            <a 
              href="#" 
              className="text-[#0E8A7B] font-medium flex items-center hover:underline"
              style={{ color: primaryColor }}
            >
              Learn more about {activeTabData.title.toLowerCase()}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right column with dashboard-style graphics */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#f8faff] rounded-lg p-8 shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-[#0E8A7B] text-xl font-bold uppercase" style={{ color: primaryColor }}>
                {activeTabData.title.toUpperCase()}
              </h3>
            </div>
            
            {/* Metric 1 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{activeTabData.metrics.label1}</span>
                <span className="font-bold text-xl">
                  {activeTabData.metrics.value1}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full" 
                  style={{ 
                    width: `${activeTabData.metrics.progress1}%`,
                    backgroundColor: primaryColor
                  }}
                ></div>
              </div>
            </div>
            
            {/* Metric 2 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{activeTabData.metrics.label2}</span>
                <span className="font-bold text-xl">
                  {activeTabData.metrics.value2}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full" 
                  style={{ 
                    width: `${activeTabData.metrics.progress2}%`,
                    backgroundColor: '#36B37E' // Secondary color (green)
                  }}
                ></div>
              </div>
            </div>
            
            {/* Visual elements - colored circles */}
            <div className="flex items-center gap-2 mt-6">
              {activeTab === 'scale' && (
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-[#4794FF]"></div>
                  <div className="w-12 h-12 rounded-full bg-[#36B37E] -ml-2"></div>
                  <div className="w-12 h-12 rounded-full bg-[#FFAB00] -ml-2"></div>
                  <div className="flex items-center justify-center ml-2 font-bold">
                    +2
                  </div>
                </div>
              )}
              
              {activeTab === 'quality' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4794FF]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#36B37E]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#FFAB00]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#0E8A7B]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#6554C0]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#FF5630]"></div>
                </div>
              )}
              
              {activeTab === 'cost' && (
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#f0f7ff] rounded-full text-[#0E8A7B] font-bold text-xl" style={{ color: primaryColor }}>
                    50%
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center bg-[#f0fff7] rounded-full text-[#36B37E] font-bold text-lg ml-4">
                    -$
                  </div>
                </div>
              )}
              
              {activeTab === 'agile' && (
                <div className="flex items-center">
                  <div className="h-10 px-4 flex items-center justify-center bg-[#f0f7ff] rounded-full text-[#4794FF] font-bold">
                    48hrs
                  </div>
                  <div className="h-10 px-4 flex items-center justify-center bg-[#f0fff7] rounded-full text-[#36B37E] font-bold ml-4">
                    24hrs
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdaptiveHiringTabs;
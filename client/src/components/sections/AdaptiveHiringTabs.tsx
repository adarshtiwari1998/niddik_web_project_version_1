import React, { useState } from 'react';
import { Users, DollarSign, Rocket, BarChart4 } from 'lucide-react';

interface TabData {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  imageSrc: string;
}

const AdaptiveHiringTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quality');

  // Tab data with images
  const tabs: TabData[] = [
    {
      id: 'quality',
      title: 'Quality Global Talent',
      icon: <Users className="w-5 h-5" />,
      description: 'Unlock a vast pool of untapped global talent, with 60% from emerging tech hubs in Africa and LATAM. Our borderless marketplace spans 135 countries, connecting you with the right skills to drive innovation, regardless of location.',
      imageSrc: '/images/talent-map.svg'
    },
    {
      id: 'cost',
      title: 'Cost Optimization',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Reduce hiring costs by up to 50% compared to traditional recruitment methods. Our AI-powered matching eliminates expensive agency fees and reduces the time-to-hire from months to days, delivering significant ROI.',
      imageSrc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop'
    },
    {
      id: 'agile',
      title: 'Agile Deployment',
      icon: <Rocket className="w-5 h-5" />,
      description: 'Deploy talent in as little as 48 hours with our streamlined matching and onboarding processes. Our platform handles all compliance, contracts, and payments globally, so you can focus on building your team and delivering results.',
      imageSrc: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'scale',
      title: 'Rapid Scalability',
      icon: <BarChart4 className="w-5 h-5" />,
      description: 'Scale your team up or down based on project demands with flexible engagement models. Access a network of over 500,000 pre-vetted professionals to quickly address changing business needs without long-term commitments.',
      imageSrc: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-3 justify-center">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-full flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-teal-700 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className={`${activeTab === tab.id ? 'text-white' : 'text-teal-600'}`}>
              {tab.icon}
            </div>
            <span className="font-medium">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Content area with image and text */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-4">
        {/* Left column with image */}
        <div className="order-2 lg:order-1">
          <div className="bg-teal-50 rounded-lg p-4 shadow-sm">
            <img 
              src={activeTabData.imageSrc} 
              alt={activeTabData.title}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        </div>

        {/* Right column with text */}
        <div className="order-1 lg:order-2">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{activeTabData.title}</h3>
          <p className="text-gray-600 leading-relaxed">{activeTabData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveHiringTabs;
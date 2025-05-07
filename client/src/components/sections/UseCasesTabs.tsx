import React, { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface TabData {
  id: string;
  title: string;
  items: string[];
  imageSrc: string;
}

const UseCasesTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('app-dev');

  // Tab data with images
  const tabs: TabData[] = [
    {
      id: 'app-dev',
      title: 'Application Development',
      items: [
        'Scale development with qualified talent, on demand',
        'Reduce complexity and enhance user experience',
        'Get your critical projects done faster'
      ],
      imageSrc: 'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 'data-science',
      title: 'Data Science and Artificial Intelligence',
      items: [
        'Build AI/ML models with specialized expertise',
        'Deploy specialized data science teams on demand',
        'Accelerate AI initiatives with top-tier talent'
      ],
      imageSrc: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'data-eng',
      title: 'Data Engineering and Analytics',
      items: [
        'Build resilient data pipelines with specialized engineers',
        'Transform raw data into actionable business insights',
        'Implement modern data architecture with expert guidance'
      ],
      imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'cloud-devops',
      title: 'Cloud and DevOps',
      items: [
        'Accelerate cloud migration with specialized teams',
        'Implement CI/CD pipelines with expert DevOps engineers',
        'Optimize infrastructure costs with cloud-native architecture'
      ],
      imageSrc: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=2069&auto=format&fit=crop'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left column with tabs */}
      <div className="w-full lg:w-[45%]">
        {/* Tab buttons */}
        <div className="space-y-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left rounded-md px-5 py-5 border transition-all ${
                activeTab === tab.id
                  ? 'border-teal-500 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{tab.title}</span>
                {activeTab === tab.id && (
                  <ChevronRight className="h-5 w-5 text-teal-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Content of active tab */}
        <div className="mt-6">
          <ul className="space-y-4">
            {activeTabData.items.map((item, index) => (
              <li key={index} className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button 
              className="text-teal-600 font-medium flex items-center hover:underline cursor-pointer group"
              onClick={() => alert(`Learn more about ${activeTabData.title}`)}
            >
              Learn More 
              <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Right column with image */}
      <div className="w-full lg:w-[55%]">
        <div className="rounded-lg overflow-hidden h-full">
          <img 
            src={activeTabData.imageSrc} 
            alt={activeTabData.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default UseCasesTabs;
import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

// Simple accordion for use cases
const BasicAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Tab data
  const tabs = [
    {
      title: 'Application Development',
      items: [
        'Scale development with qualified talent, on demand',
        'Reduce complexity and enhance user experience',
        'Get your critical projects done faster'
      ]
    },
    {
      title: 'Data Science and Artificial Intelligence',
      items: [
        'Build AI/ML models with specialized expertise',
        'Deploy specialized data science teams on demand',
        'Accelerate AI initiatives with top-tier talent'
      ]
    },
    {
      title: 'Data Engineering and Analytics',
      items: [
        'Build resilient data pipelines with specialized engineers',
        'Transform raw data into actionable business insights',
        'Implement modern data architecture with expert guidance'
      ]
    },
    {
      title: 'Cloud and DevOps',
      items: [
        'Accelerate cloud migration with specialized teams',
        'Implement CI/CD pipelines with expert DevOps engineers',
        'Optimize infrastructure costs with cloud-native architecture'
      ]
    }
  ];

  // Toggle active tab
  const toggleTab = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(-1); // Close if already open
    } else {
      setActiveIndex(index); // Open the clicked tab
    }
  };

  return (
    <div className="space-y-3">
      {tabs.map((tab, index) => (
        <div key={index} className="border border-gray-200 rounded-md">
          <div 
            onClick={() => toggleTab(index)}
            className="flex justify-between items-center p-5 bg-white cursor-pointer"
          >
            <h3 className="font-semibold text-lg">{tab.title}</h3>
            <div className="text-gray-500">
              {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
          
          {activeIndex === index && (
            <div className="p-5 pt-0 bg-white">
              <ul className="space-y-3 mt-3">
                {tab.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button 
                  className="text-teal-600 font-medium flex items-center hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Learn More clicked');
                  }}
                >
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BasicAccordion;
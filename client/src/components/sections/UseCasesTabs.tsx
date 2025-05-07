import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

// Define the tab structure for reuse
type TabItem = {
  title: string;
  content: React.ReactNode;
};

// Main component for the use cases tabs
const UseCasesTabs: React.FC = () => {
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState<number>(0);

  // Toggle function to open/close tabs
  const toggleTab = (index: number) => {
    setActiveTab(index === activeTab ? -1 : index);
  };

  // Define all our tab content
  const tabs: TabItem[] = [
    {
      title: "Application Development",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Scale development with qualified talent, on demand
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Reduce complexity and enhance user experience
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Get your critical projects done faster
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <a href="#" className="inline-flex items-center text-teal-600 font-medium">
              Learn More <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </>
      )
    },
    {
      title: "Data Science and Artificial Intelligence",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Build AI/ML models with specialized expertise
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Deploy specialized data science teams on demand
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Accelerate AI initiatives with top-tier talent
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <a href="#" className="inline-flex items-center text-teal-600 font-medium">
              Learn More <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </>
      )
    },
    {
      title: "Data Engineering and Analytics",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Build resilient data pipelines with specialized engineers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Transform raw data into actionable business insights
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Implement modern data architecture with expert guidance
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <a href="#" className="inline-flex items-center text-teal-600 font-medium">
              Learn More <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </>
      )
    },
    {
      title: "Cloud and DevOps",
      content: (
        <>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Accelerate cloud migration with specialized teams
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Implement CI/CD pipelines with expert DevOps engineers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 select-text cursor-text">
                Optimize infrastructure costs with cloud-native architecture
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <a href="#" className="inline-flex items-center text-teal-600 font-medium">
              Learn More <ArrowRight className="ml-1 w-4 h-4" />
            </a>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="w-full space-y-3">
      {tabs.map((tab, index) => (
        <div 
          key={index} 
          className={`rounded-md border border-gray-200 overflow-hidden ${
            activeTab === index ? 'bg-white shadow-md' : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div 
            className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer select-text"
            onClick={() => toggleTab(index)}
          >
            <span className="font-semibold text-lg">{tab.title}</span>
            <span className="flex-shrink-0 ml-2">
              {activeTab === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </span>
          </div>

          {activeTab === index && (
            <div className="px-5 pb-5 pt-1">
              {tab.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UseCasesTabs;
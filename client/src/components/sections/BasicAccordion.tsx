import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp, BarChart3, PieChart, LineChart, ServerIcon } from 'lucide-react';

// Simple accordion for use cases that shows different graphics when different tabs are selected
const BasicAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Tab data with specific graphics for each tab
  const tabs = [
    {
      title: 'Application Development',
      items: [
        'Scale development with qualified talent, on demand',
        'Reduce complexity and enhance user experience',
        'Get your critical projects done faster'
      ],
      graphic: () => (
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-green-500 mr-3"></div>
              <h3 className="text-lg font-medium">Current Sprint</h3>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: "75%" }}></div>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Week 2 of 3</span>
            <span>75% Complete</span>
          </div>
        </div>
      )
    },
    {
      title: 'Data Science and Artificial Intelligence',
      items: [
        'Build AI/ML models with specialized expertise',
        'Deploy specialized data science teams on demand',
        'Accelerate AI initiatives with top-tier talent'
      ],
      graphic: () => (
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <PieChart size={16} />
            </div>
            <h3 className="ml-3 text-lg font-medium">AI Model Performance</h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Model Accuracy</span>
              <span className="font-medium">92.3%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: "92%" }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Training Time</span>
              <span className="font-medium">-34%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: "66%" }}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Data Engineering and Analytics',
      items: [
        'Build resilient data pipelines with specialized engineers',
        'Transform raw data into actionable business insights',
        'Implement modern data architecture with expert guidance'
      ],
      graphic: () => (
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center mb-5">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <BarChart3 size={16} />
            </div>
            <h3 className="ml-3 text-lg font-medium">Data Pipeline Health</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Processed Today</div>
              <div className="text-xl font-bold">1.4M</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <ArrowRight className="w-3 h-3 rotate-45" /> +12.5%
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Avg Latency</div>
              <div className="text-xl font-bold">45ms</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <ArrowRight className="w-3 h-3 rotate-315" /> -8.3%
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Cloud and DevOps',
      items: [
        'Accelerate cloud migration with specialized teams',
        'Implement CI/CD pipelines with expert DevOps engineers',
        'Optimize infrastructure costs with cloud-native architecture'
      ],
      graphic: () => (
        <div className="bg-slate-50 rounded-lg p-6">
          <div className="flex items-center mb-5">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white">
              <ServerIcon size={16} />
            </div>
            <h3 className="ml-3 text-lg font-medium">Infrastructure Status</h3>
          </div>
          
          <div className="mt-2 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Production</span>
              </div>
              <span className="text-sm text-gray-500">99.99% uptime</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Staging</span>
              </div>
              <span className="text-sm text-gray-500">12 deployments today</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-600">CI/CD Pipeline</span>
              </div>
              <span className="text-sm text-gray-500">Build time: 4m 12s</span>
            </div>
          </div>
        </div>
      )
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
        <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
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
              <div className="mt-4 mb-5">
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
              
              {/* Graphics specific to each tab */}
              <div className="mt-3">
                {tab.graphic()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BasicAccordion;
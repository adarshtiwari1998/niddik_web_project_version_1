import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Code,
  Database,
  BarChart2,
  Cloud
} from "lucide-react";
import Container from "@/components/ui/container";

interface UseCase {
  id: string;
  title: string;
  icon: React.ReactNode;
  points: string[];
  isOpen?: boolean;
}

const UseCasesSection = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([
    {
      id: "app-dev",
      title: "Application Development",
      icon: <Code className="w-5 h-5 text-teal-600" />,
      points: [
        "Scale development with qualified talent, on demand",
        "Reduce complexity and enhance user experience",
        "Get your critical projects done faster"
      ],
      isOpen: true
    },
    {
      id: "data-science",
      title: "Data Science and Artificial Intelligence",
      icon: <Database className="w-5 h-5 text-teal-600" />,
      points: [
        "Leverage AI expertise to drive innovation",
        "Build and deploy ML models that deliver results",
        "Transform your data into actionable insights"
      ],
      isOpen: false
    },
    {
      id: "data-engineering",
      title: "Data Engineering and Analytics",
      icon: <BarChart2 className="w-5 h-5 text-teal-600" />,
      points: [
        "Design scalable data pipelines and architectures",
        "Implement robust ETL processes for reliable data",
        "Create insights through advanced analytics"
      ],
      isOpen: false
    },
    {
      id: "cloud-devops",
      title: "Cloud and DevOps",
      icon: <Cloud className="w-5 h-5 text-teal-600" />,
      points: [
        "Migrate and modernize your infrastructure",
        "Implement CI/CD pipelines for faster delivery",
        "Optimize cloud costs and performance"
      ],
      isOpen: false
    }
  ]);

  const toggleUseCase = (id: string) => {
    setUseCases(
      useCases.map(useCase => 
        useCase.id === id 
          ? { ...useCase, isOpen: !useCase.isOpen } 
          : { ...useCase, isOpen: false }
      )
    );
  };

  return (
    <section className="py-20 bg-[#f9fafa] relative overflow-hidden">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0">
          <pattern id="circles" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            <circle cx="90" cy="90" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="90" cy="90" r="40" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="180" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="180" r="40" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="180" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="180" r="40" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="0" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="0" r="40" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="#36b37e" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>

      <Container className="px-6 md:px-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Common use cases for Adaptive Hiring
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column with accordion */}
          <div className="w-full lg:w-1/2 space-y-4">
            {useCases.map((useCase) => (
              <div 
                key={useCase.id} 
                className={`rounded-md border border-gray-200 overflow-hidden transition-all duration-300 ${
                  useCase.isOpen ? "bg-white shadow-sm" : "bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  onClick={() => toggleUseCase(useCase.id)}
                  className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-teal-600">{useCase.icon}</span>
                    <span className="font-medium">{useCase.title}</span>
                  </div>
                  <span>
                    {useCase.isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </button>

                {useCase.isOpen && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {useCase.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <a href="#" className="inline-flex items-center text-sm text-teal-600 font-medium">
                        Learn More <ArrowRight className="ml-1 w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right column with dashboard-style UI elements */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 h-full rounded-lg">
              <div className="space-y-8">
                {/* Sprint Progress Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-green-500"></div>
                      </div>
                      <h3 className="text-lg font-medium">Current Sprint</h3>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  
                  <div className="flex justify-between text-gray-500">
                    <span>Week 2 of 3</span>
                    <span>75% Complete</span>
                  </div>
                </div>
                
                {/* Team Velocity Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                    </div>
                    <h3 className="text-lg font-medium">Team Velocity</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full border-8 border-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-500">92%</span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium">Efficiency</h4>
                      <p className="text-gray-500">Above target</p>
                    </div>
                  </div>
                </div>
                
                {/* Task Completion Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-purple-500"></div>
                      </div>
                      <h3 className="text-lg font-medium">Delivery Rate</h3>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      Excellent
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-medium">
                    <span>Completed tasks:</span>
                    <span className="text-purple-600">24/25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UseCasesSection;
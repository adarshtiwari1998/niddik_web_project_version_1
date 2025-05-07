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

          {/* Right column with illustration */}
          <div className="w-full lg:w-1/2 rounded-lg overflow-hidden shadow-md">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 h-full flex items-center justify-center">
              <svg 
                width="400" 
                height="300" 
                viewBox="0 0 400 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                {/* Developer illustration - SVG graphic instead of photo */}
                <rect x="40" y="40" width="320" height="220" rx="10" fill="#F9FAFB" stroke="#E5E7EB" />
                
                {/* Monitor screen */}
                <rect x="60" y="60" width="180" height="120" rx="4" fill="#1F2937" />
                <rect x="70" y="70" width="160" height="10" rx="2" fill="#4B5563" />
                <rect x="70" y="90" width="60" height="6" rx="1" fill="#9CA3AF" />
                <rect x="70" y="110" width="80" height="6" rx="1" fill="#9CA3AF" />
                <rect x="70" y="130" width="40" height="6" rx="1" fill="#9CA3AF" />
                <rect x="70" y="150" width="70" height="6" rx="1" fill="#9CA3AF" />
                
                {/* Person silhouette */}
                <rect x="280" y="80" width="40" height="40" rx="20" fill="#4B5563" />
                <rect x="280" y="130" width="40" height="60" rx="4" fill="#6B7280" />
                
                {/* Table surface */}
                <rect x="40" y="200" width="320" height="10" rx="2" fill="#E5E7EB" />
                
                {/* Headphones */}
                <path d="M280 80 C280 60, 320 60, 320 80" stroke="#4B5563" strokeWidth="4" fill="none" />
                <rect x="270" y="80" width="10" height="20" rx="4" fill="#4B5563" />
                <rect x="320" y="80" width="10" height="20" rx="4" fill="#4B5563" />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UseCasesSection;
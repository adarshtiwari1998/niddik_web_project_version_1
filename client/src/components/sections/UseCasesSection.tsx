import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  CheckCircle,
  Code,
  Database,
  BarChart2,
  Cloud,
  Blocks,
  Users,
  Clock,
  ArrowRight as ArrowRightIcon
} from "lucide-react";
import Container from "@/components/ui/container";

interface UseCase {
  id: string;
  title: string;
  icon: React.ReactNode;
  points: string[];
  isOpen?: boolean;
}

// Sprint Card - exactly matches reference image
const SprintCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
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
);

// Team Velocity Card - exactly matches reference image
const TeamVelocityCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center mb-5">
      <div className="w-6 h-6 rounded-full bg-blue-500 mr-3"></div>
      <h3 className="text-lg font-medium">Team Velocity</h3>
    </div>
    
    <div className="flex items-center">
      <div className="w-32 h-32 rounded-full border-[15px] border-blue-100 flex items-center justify-center">
        <span className="text-3xl font-bold text-blue-500">92%</span>
      </div>
      <div className="ml-6">
        <h4 className="text-lg font-medium">Efficiency</h4>
        <p className="text-gray-500">Above target</p>
      </div>
    </div>
  </div>
);

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
    setUseCases(prevUseCases => 
      prevUseCases.map(useCase => ({
        ...useCase,
        isOpen: useCase.id === id ? !useCase.isOpen : false
      }))
    );
  };

  // Find active use case
  const activeUseCase = useCases.find(useCase => useCase.isOpen);
  const activeId = activeUseCase?.id || "app-dev";

  return (
    <section className="py-20 bg-[#f0f7fb] relative overflow-hidden">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-0">
          <pattern id="circles" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            <circle cx="90" cy="90" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="180" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="180" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="180" cy="0" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#36b37e" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circles)" />
        </svg>
      </div>

      <Container className="px-6 md:px-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Common use cases for Adaptive Hiring
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column with accordion */}
          <div className="w-full lg:w-[45%] space-y-3">
            {useCases.map((useCase) => (
              <div 
                key={useCase.id} 
                onClick={() => toggleUseCase(useCase.id)}
                className={`rounded-md border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer 
                  ${useCase.isOpen ? "bg-white shadow-sm" : "bg-white hover:bg-gray-50"}`}
              >
                <div 
                  className="w-full flex items-center justify-between px-5 py-4 text-left select-text"
                >
                  <span className="font-semibold text-lg">{useCase.title}</span>
                  <span className="flex-shrink-0 ml-2">
                    {useCase.isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>

                {useCase.isOpen && (
                  <div className="px-5 pb-5 pt-1" onClick={(e) => e.stopPropagation()}>
                    <ul className="space-y-3">
                      {useCase.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 select-text cursor-text">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <a href="#" className="inline-flex items-center text-teal-600 font-medium">
                        Learn More <ArrowRight className="ml-1 w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right column with dashboard-style cards - change based on active tab */}
          <div className="w-full lg:w-[55%]">
            <div className="h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {/* Show the exact same cards for all tabs, just like in the reference image */}
                <motion.div 
                  key={`${activeId}-cards`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SprintCard />
                  <TeamVelocityCard />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UseCasesSection;
import React, { useState } from "react";
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  isOpen,
  onClick,
  children,
}) => {
  return (
    <div className="border rounded-md mb-3 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-5 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer"
        type="button"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="px-5 pb-5 pt-1 bg-white">{children}</div>}
    </div>
  );
};

const SimpleAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderChecklist = (items: string[]) => (
    <>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <a href="#" className="inline-flex items-center text-teal-600 font-medium cursor-pointer hover:underline">
          Learn More <ArrowRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </>
  );

  return (
    <div>
      <AccordionItem
        title="Application Development"
        isOpen={openIndex === 0}
        onClick={() => handleItemClick(0)}
      >
        {renderChecklist([
          "Scale development with qualified talent, on demand",
          "Reduce complexity and enhance user experience",
          "Get your critical projects done faster"
        ])}
      </AccordionItem>
      
      <AccordionItem
        title="Data Science and Artificial Intelligence"
        isOpen={openIndex === 1}
        onClick={() => handleItemClick(1)}
      >
        {renderChecklist([
          "Build AI/ML models with specialized expertise",
          "Deploy specialized data science teams on demand",
          "Accelerate AI initiatives with top-tier talent"
        ])}
      </AccordionItem>
      
      <AccordionItem
        title="Data Engineering and Analytics"
        isOpen={openIndex === 2}
        onClick={() => handleItemClick(2)}
      >
        {renderChecklist([
          "Build resilient data pipelines with specialized engineers",
          "Transform raw data into actionable business insights",
          "Implement modern data architecture with expert guidance"
        ])}
      </AccordionItem>
      
      <AccordionItem
        title="Cloud and DevOps"
        isOpen={openIndex === 3}
        onClick={() => handleItemClick(3)}
      >
        {renderChecklist([
          "Accelerate cloud migration with specialized teams",
          "Implement CI/CD pipelines with expert DevOps engineers",
          "Optimize infrastructure costs with cloud-native architecture"
        ])}
      </AccordionItem>
    </div>
  );
};

export default SimpleAccordion;
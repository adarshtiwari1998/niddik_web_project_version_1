import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";
import "./focus-scroll.css";

interface FocusBlock {
  id: number;
  title: string;
  description: string;
  image: string;
}

const focusBlocks: FocusBlock[] = [
  {
    id: 1,
    title: "Discover Top Tech Talent",
    description: "Access a global network of pre-vetted software engineers, data scientists, and product managers ready to join your team. Our platform connects you with talent across 100+ countries, all carefully assessed through technical evaluations and professional background checks. We verify both technical skills and soft skills like communication and teamwork to ensure you get well-rounded professionals who can contribute effectively from day one.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Streamlined Matching Process",
    description: "Our AI-powered platform matches your requirements with the perfect candidates, saving weeks of recruitment time. Rather than sifting through hundreds of applications, our intelligent algorithms identify the most suitable matches based on technical skills, experience level, domain expertise, and cultural fit. We analyze over 30 different parameters to ensure compatibility, reducing the hiring process from months to days while maintaining exceptionally high quality standards.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Flexible Team Scaling",
    description: "Scale your engineering team up or down based on project needs with flexible engagement models that adapt to your business. Whether you need to quickly expand your team for a major product launch or adjust capacity during different development phases, our platform makes it seamless. Choose from full-time, part-time, or project-based engagements, with options to convert contractors to permanent employees as your needs evolve. This flexibility helps you optimize costs while maintaining development velocity.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Seamless Collaboration",
    description: "Our collaboration tools and talent success managers ensure smooth integration with your existing teams and workflows. We provide onboarding support, communication frameworks, and project management integration to minimize transition time. Each engagement includes access to our proprietary collaboration platform designed specifically for distributed teams, with features for time zone management, asynchronous updates, and knowledge sharing. Your dedicated talent success manager provides ongoing support to optimize team performance.",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Global Diversity Advantage",
    description: "Leverage diverse perspectives and experiences from tech professionals across 100+ countries to drive innovation. Research consistently shows that diverse teams produce more creative solutions and deliver better business outcomes. Our global talent pool brings together professionals with unique educational backgrounds, industry experiences, and cultural perspectives. This diversity fosters more robust problem-solving approaches and helps companies develop products with broader appeal. Access talent beyond geographical constraints to gain competitive advantage.",
    image: "https://images.unsplash.com/photo-1484712401471-05c7215830eb?auto=format&fit=crop&w=1200&q=80"
  }
];

const FocusScrollSection: React.FC = () => {
  const [activeBlockId, setActiveBlockId] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set up intersection observer to track which block is most visible and centered
  useEffect(() => {
    // This is the preferred method to detect when a block is centered in the viewport
    const handleScroll = () => {
      // We use requestAnimationFrame to limit updates for performance
      requestAnimationFrame(() => {
        // Get the viewport dimensions
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        
        // Track which block is closest to center
        let closestToCenter = { blockId: activeBlockId, distance: Infinity };
        
        // Check each block's position relative to viewport center
        blockRefs.current.forEach((block, index) => {
          if (!block) return;
          
          const rect = block.getBoundingClientRect();
          // Calculate the center point of the block
          const blockCenter = rect.top + (rect.height / 2);
          // Calculate distance from block center to viewport center
          const distanceFromCenter = Math.abs(blockCenter - viewportCenter);
          
          // If this block is closer to center than our current closest
          if (distanceFromCenter < closestToCenter.distance) {
            closestToCenter = {
              blockId: index + 1, // +1 because our IDs start at 1, not 0
              distance: distanceFromCenter
            };
          }
        });
        
        // Only update if there's a change
        if (closestToCenter.blockId !== activeBlockId) {
          setActiveBlockId(closestToCenter.blockId);
        }
      });
    };
    
    // Initialize by running once
    handleScroll();
    
    // Set up the scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeBlockId]);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50" id="focus-scroll-section">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-andela-dark mb-4">
            How We Transform Teams
          </h2>
          <p className="text-xl text-andela-gray max-w-3xl mx-auto">
            Discover how our platform helps businesses build world-class engineering teams with top global talent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Left column - Scrollable blocks */}
          <div className="flex flex-col space-y-48 pb-32 focus-blocks-container">
            {focusBlocks.map((block, index) => (
              <div 
                key={block.id}
                ref={el => blockRefs.current[index] = el}
                data-block-id={block.id}
                className={`focus-block p-6 md:p-8 rounded-xl ${
                  block.id === activeBlockId ? "active" : ""
                }`}
              >
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-andela-dark mb-4">
                    {block.title}
                  </h3>
                  <p className="text-andela-gray leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column - Sticky image */}
          <div className="hidden lg:block relative h-full">
            <div className="focus-image-container">
              {focusBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className={`focus-image absolute inset-0 rounded-xl overflow-hidden ${
                    block.id === activeBlockId ? "opacity-100" : "opacity-0"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: block.id === activeBlockId ? 1 : 0,
                    scale: block.id === activeBlockId ? 1 : 0.95,
                    translateY: block.id === activeBlockId ? 0 : 20
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <img 
                    src={block.image}
                    alt={block.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-6 left-6 max-w-xs">
                    <span className="inline-block bg-andela-green text-white px-4 py-1 rounded-full text-sm font-medium mb-2">
                      Feature {block.id}
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      {block.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile image - only shown on small screens */}
          <div className="lg:hidden rounded-xl overflow-hidden">
            {focusBlocks.map((block) => (
              block.id === activeBlockId && (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="relative"
                >
                  <img 
                    src={block.image}
                    alt={block.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block bg-andela-green text-white px-3 py-1 rounded-full text-xs font-medium mb-1">
                      Feature {block.id}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {block.title}
                    </h4>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FocusScrollSection;
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
    description: "Access a global network of pre-vetted software engineers, data scientists, and product managers ready to join your team.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Streamlined Matching Process",
    description: "Our AI-powered platform matches your requirements with the perfect candidates, saving weeks of recruitment time.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Flexible Team Scaling",
    description: "Scale your engineering team up or down based on project needs with flexible engagement models that adapt to your business.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Seamless Collaboration",
    description: "Our collaboration tools and talent success managers ensure smooth integration with your existing teams and workflows.",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Global Diversity Advantage",
    description: "Leverage diverse perspectives and experiences from tech professionals across 100+ countries to drive innovation.",
    image: "https://images.unsplash.com/photo-1484712401471-05c7215830eb?auto=format&fit=crop&w=1200&q=80"
  }
];

const FocusScrollSection: React.FC = () => {
  const [activeBlockId, setActiveBlockId] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Set up intersection observer to track which block is most visible
  useEffect(() => {
    // Keep track of intersection ratios to determine the most visible block
    const intersectionRatios = new Map<number, number>();
    
    const options = {
      root: null, // viewport
      rootMargin: "-30% 0px -30% 0px", // slightly reduce the root's bounding box for better trigger points
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // more thresholds for smoother transitions
    };

    const observer = new IntersectionObserver((entries) => {
      // Update the intersection ratios for each block
      entries.forEach((entry) => {
        const blockId = Number(entry.target.getAttribute("data-block-id"));
        if (blockId) {
          intersectionRatios.set(blockId, entry.intersectionRatio);
        }
      });
      
      // Find the block with the highest visibility
      let maxRatio = 0;
      let mostVisibleBlockId = activeBlockId;
      
      intersectionRatios.forEach((ratio, blockId) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleBlockId = blockId;
        }
      });
      
      // Only update if there's a change and the max ratio is significant
      if (mostVisibleBlockId !== activeBlockId && maxRatio > 0.1) {
        setActiveBlockId(mostVisibleBlockId);
      }
    }, options);

    // Observe all block elements
    blockRefs.current.forEach((block) => {
      if (block) observer.observe(block);
    });

    // Add scroll event listener for extra responsiveness
    const handleScroll = () => {
      // We use requestAnimationFrame to limit updates for performance
      requestAnimationFrame(() => {
        // Get the visible height of the viewport
        const viewportHeight = window.innerHeight;
        let maxVisibility = 0;
        let mostVisibleBlockId = activeBlockId;
        
        // Check each block
        blockRefs.current.forEach((block, index) => {
          if (!block) return;
          
          const rect = block.getBoundingClientRect();
          // Calculate how much of the block is in the viewport
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const visibilityRatio = visibleHeight / rect.height;
          
          if (visibilityRatio > maxVisibility) {
            maxVisibility = visibilityRatio;
            mostVisibleBlockId = index + 1; // +1 because our IDs start at 1, not 0
          }
        });
        
        if (mostVisibleBlockId !== activeBlockId && maxVisibility > 0.2) {
          setActiveBlockId(mostVisibleBlockId);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      blockRefs.current.forEach((block) => {
        if (block) observer.unobserve(block);
      });
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
          <div className="flex flex-col space-y-32 pb-32 focus-blocks-container">
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
                  <p className="text-andela-gray">
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
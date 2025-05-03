import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import './focus-scroll.css';

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
    description: "Access a global network of pre-vetted software engineers, data scientists, and product managers ready to join your team. Our platform connects you with talent across 100+ countries, all carefully assessed through technical evaluations and professional background checks.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Streamlined Matching Process",
    description: "Our AI-powered platform matches your requirements with the perfect candidates, saving weeks of recruitment time. Rather than sifting through hundreds of applications, our intelligent algorithms identify the most suitable matches based on technical skills, experience level, domain expertise, and cultural fit.",
    image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Flexible Team Scaling",
    description: "Scale your engineering team up or down based on project needs with flexible engagement models that adapt to your business. Whether you need to quickly expand your team for a major product launch or adjust capacity during different development phases, our platform makes it seamless.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Seamless Collaboration",
    description: "Our collaboration tools and talent success managers ensure smooth integration with your existing teams and workflows. We provide onboarding support, communication frameworks, and project management integration to minimize transition time and maximize productivity.",
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Global Diversity Advantage",
    description: "Leverage diverse perspectives and experiences from tech professionals across 100+ countries to drive innovation. Research consistently shows that diverse teams produce more creative solutions and deliver better business outcomes.",
    image: "https://images.unsplash.com/photo-1484712401471-05c7215830eb?auto=format&fit=crop&w=1200&q=80"
  }
];

const FocusScrollSection: React.FC = () => {
  const [activeBlockId, setActiveBlockId] = useState<number>(1);
  const [isLastBlockVisible, setIsLastBlockVisible] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [isFirstBlockAtTop, setIsFirstBlockAtTop] = useState(false);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const firstBlockRef = useRef<HTMLDivElement>(null);
  
  // Use effect to initialize active block to 1
  useEffect(() => {
    // Always start with the first block active
    setActiveBlockId(1);
  }, []);
  
  // Set up intersection observers to track section and blocks
  useEffect(() => {
    // Observer for individual blocks
    const blockObserver = new IntersectionObserver(
      (entries) => {
        // Sort entries by their position from top to bottom
        const sortedEntries = [...entries].sort((a, b) => {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        
        sortedEntries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = Number(entry.target.getAttribute("data-block-id"));
            if (blockId) {
              // Set the active block ID to match the scroll position
              setActiveBlockId(blockId);
              
              // Log for debugging
              console.log(`Block ${blockId} is now active at position ${entry.boundingClientRect.top}`);
              
              // Check if this is the last block
              if (blockId === focusBlocks.length) {
                setIsLastBlockVisible(true);
              } else {
                setIsLastBlockVisible(false);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -20% 0px", // Adjust these values to control when blocks become active
        threshold: [0.1, 0.2, 0.3], // Multiple thresholds for better accuracy
      }
    );

    // Observer for the entire section
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only apply stickiness when section is in view
          setIsSectionInView(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: "-10% 0px", // Start a bit before the section is fully in view
        threshold: 0.1,
      }
    );
    
    // Observer specifically for the first block reaching top of viewport
    const firstBlockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if first block has reached top of viewport
          const { top, height } = entry.boundingClientRect;
          const topThreshold = window.innerHeight * 0.15; // Top 15% of screen
          
          // First block is at/near top of viewport when:
          // Either it's intersecting and near the top OR 
          // it's already scrolled past (not intersecting and above viewport)
          const isAtTop = (entry.isIntersecting && top <= topThreshold) || 
                          (!entry.isIntersecting && top <= topThreshold);
          
          setIsFirstBlockAtTop(isAtTop);
          
          // For debugging
          console.log(`First block - top: ${top}, intersecting: ${entry.isIntersecting}, isAtTop: ${isAtTop}`);
        });
      },
      {
        root: null,
        rootMargin: "-10% 0px 0px 0px", // Target top of viewport 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    // Observe the section
    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }
    
    // Observe first block specifically
    if (blockRefs.current[0]) {
      firstBlockObserver.observe(blockRefs.current[0]);
    }

    // Observe all block elements
    blockRefs.current.forEach((block) => {
      if (block) {
        blockObserver.observe(block);
      }
    });

    return () => {
      // Clean up observers
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
      
      // Clean up first block observer
      if (blockRefs.current[0]) {
        firstBlockObserver.unobserve(blockRefs.current[0]);
      }
      
      // Clean up block observers
      blockRefs.current.forEach((block) => {
        if (block) {
          blockObserver.unobserve(block);
        }
      });
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-16 bg-gray-50" id="focus-scroll-section">
      <Container>
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-andela-dark mb-4">
            How We Transform Teams
          </h2>
          <p className="text-xl text-andela-gray max-w-3xl mx-auto">
            Discover how our platform helps businesses build world-class engineering teams with top global talent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
          {/* Left column - Content blocks (scrollable) */}
          <div className="scrollable-blocks-column">
            {focusBlocks.map((block, index) => (
              <div 
                key={block.id}
                ref={(el) => (blockRefs.current[index] = el)}
                data-block-id={block.id}
                className={`scrollable-block mb-12 ${
                  block.id === activeBlockId ? "active" : ""
                }`}
              >
                <h3 className="text-2xl font-bold text-andela-dark mb-4">
                  {block.title}
                </h3>
                <p className="text-andela-gray leading-relaxed">
                  {block.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right column - fixed image only when first block reaches top and section is in view */}
          <div className="fixed-image-column hidden lg:block">
            <div 
              className={`fixed-image-container ${
                // Not fixed when either section is not in view or the first block hasn't reached top
                (!isSectionInView || !isFirstBlockAtTop) ? "not-fixed" : ""
              } ${
                // Release fixed position when the last block is visible
                isLastBlockVisible ? "release-fixed" : ""
              }`}
              // Add a debug comment to show current state
              data-debug={`section-in-view:${isSectionInView}, first-block-at-top:${isFirstBlockAtTop}, active-block:${activeBlockId}`}
            >
              {focusBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className={`fixed-image ${
                    block.id === activeBlockId ? "opacity-100" : "opacity-0"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: block.id === activeBlockId ? 1 : 0,
                    scale: block.id === activeBlockId ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <img 
                    src={block.image}
                    alt={block.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
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
          <div className="lg:hidden rounded-xl overflow-hidden mb-8">
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
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
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
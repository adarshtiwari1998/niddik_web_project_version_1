import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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
  const [isFixedMode, setIsFixedMode] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Last block ID to determine when we've reached the end
  const LAST_BLOCK_ID = focusBlocks.length;
  
  // Update active state of blocks and images
  const updateActiveState = (blockId: number) => {
    if (blockId === activeBlockId) return;
    
    console.log(`Setting active block: ${blockId}`);
    setActiveBlockId(blockId);
    
    // Update active classes directly for immediate visual feedback
    blockRefs.current.forEach(block => {
      if (!block) return;
      const id = Number(block.getAttribute('data-block-id'));
      
      if (id === blockId) {
        block.classList.add('active');
        block.setAttribute('data-active', 'true');
      } else {
        block.classList.remove('active');
        block.setAttribute('data-active', 'false');
      }
    });
  };
  
  // Initialize and set first block active on mount
  useLayoutEffect(() => {
    // Set initial active state for block 1
    updateActiveState(1);
    
    // Force all images to be loaded and present in the DOM
    const forceImagesVisibility = () => {
      focusBlocks.forEach(block => {
        const img = new Image();
        img.src = block.image;
        img.onload = () => {
          console.log(`Image for block ${block.id} loaded`);
        };
      });
    };
    
    forceImagesVisibility();
  }, []);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Section is visible when it's in the viewport
      const isSectionVisible = sectionTop < windowHeight && sectionBottom > 0;
      
      // First determine if the image should be in fixed mode
      // Only enable fixed mode when section is in view and we're not at the end
      const shouldBeFixedMode = 
        isSectionVisible && 
        sectionTop < 0 && // Section has scrolled up partially
        sectionBottom > windowHeight * 0.5; // Not near the end yet
        
      setIsFixedMode(shouldBeFixedMode);
      
      // Use a much smaller threshold to make blocks active when fully visible
      // This is the percentage from the top of the viewport
      const threshold = windowHeight * 0.15; // Only 15% from the top
      
      // First, check if we're at the end of the section to show last block
      if (sectionBottom <= windowHeight + 100) {
        updateActiveState(LAST_BLOCK_ID);
        return;
      }
      
      // Process ALL blocks to find the one that should be active
      // We'll track blocks in view and prioritize by ID to ensure sequential activation
      const visibleBlocks: {id: number, top: number}[] = [];
      
      blockRefs.current.forEach(block => {
        if (!block) return;
        
        const rect = block.getBoundingClientRect();
        const blockId = Number(block.getAttribute('data-block-id'));
        
        // A block is considered "fully visible" when:
        // 1. Its top is visible or just scrolled past by a bit (not too far)
        // 2. Most of its content is still in the viewport
        const isBlockFullyVisible = 
          // Top edge is near the viewport's top (whether just above or below)
          (rect.top <= threshold && rect.top >= -rect.height * 0.3) && 
          // And most of the block is still visible in the viewport
          (rect.bottom > rect.height * 0.3);
        
        // Special handling for blocks 3+ to ensure they get activated properly
        // Make block detection more sensitive for blocks 3 and 4
        const specialThreshold = blockId === 4 ? windowHeight * 0.4 : windowHeight * 0.2;
        
        if (isBlockFullyVisible || 
            // Expanded detection for block 4 specifically
            (blockId === 4 && rect.top <= specialThreshold && rect.bottom > 0) ||
            // General detection for other blocks
            (blockId >= 3 && rect.top <= windowHeight * 0.2 && rect.top >= -rect.height * 0.5)) {
          
          // Debug output for block 4
          if (blockId === 4) {
            console.log("Block 4 rect:", { 
              top: rect.top, 
              bottom: rect.bottom,
              height: rect.height,
              isVisible: rect.top <= specialThreshold && rect.bottom > 0
            });
          }
          
          visibleBlocks.push({
            id: blockId,
            top: rect.top
          });
        }
      });
      
      // Sort blocks by ID to ensure sequential activation (3 before 4 before 5)
      // This prevents skipping blocks in the sequence
      visibleBlocks.sort((a, b) => a.id - b.id);
      
      // Force sequential activation
      // If we are on block 3 and block 5 is visible but 4 is not
      if (activeBlockId === 3) {
        const hasBlock4 = visibleBlocks.some(block => block.id === 4);
        const hasBlock5 = visibleBlocks.some(block => block.id === 5);
        
        if (!hasBlock4 && hasBlock5) {
          // Force activation of block 4 next
          console.log("Forcing block 4 activation");
          updateActiveState(4);
          return; // Skip the rest of the logic
        }
      }
      
      // Use the highest ID from visible blocks to ensure we don't skip any
      if (visibleBlocks.length > 0) {
        // Get the highest (last) block ID from sorted array
        const highestBlockId = visibleBlocks[visibleBlocks.length - 1].id;
        
        // Additional guard for block 4
        if (activeBlockId === 3 && highestBlockId >= 4) {
          // Always ensure block 4 is activated after block 3
          updateActiveState(4);
        } else if (highestBlockId !== activeBlockId) {
          // Only update if different from current to avoid unnecessary renders
          updateActiveState(highestBlockId);
        }
      }
    };
    
    // Run once on mount to set initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeBlockId]);
  
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
                data-active={block.id === activeBlockId ? "true" : "false"}
                onClick={() => updateActiveState(block.id)}
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

          {/* Right column - Image container that becomes fixed or relative based on scroll position */}
          <div className="fixed-image-column hidden lg:block">
            <div 
              ref={imageContainerRef}
              className={`fixed-image-container ${isFixedMode ? "" : "not-fixed"}`}
              style={{ 
                position: isFixedMode ? "fixed" : "relative",
                top: isFixedMode ? "50%" : "auto",
                transform: isFixedMode ? "translateY(-50%)" : "none",
                width: isFixedMode ? "calc(50% - 3rem)" : "100%",
                display: "block" // Always display the container
              }}
              data-fixed={isFixedMode ? "true" : "false"}
              data-active-block={activeBlockId}
            >
              {focusBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className="fixed-image"
                  data-block-id={block.id}
                  // Set inline styles AND toggle a class for better browser support
                  style={{ 
                    opacity: block.id === activeBlockId ? 1 : 0,
                    visibility: block.id === activeBlockId ? "visible" : "hidden",
                    zIndex: block.id === activeBlockId ? 5 : 1
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: block.id === activeBlockId ? 1 : 0,
                    scale: block.id === activeBlockId ? 1 : 0.95,
                    // Force all images to stay in DOM with display: block
                    display: "block" 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  data-active={block.id === activeBlockId ? "true" : "false"}
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
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: block.id === activeBlockId ? 1 : 0,
                  y: block.id === activeBlockId ? 0 : 20,
                  scale: block.id === activeBlockId ? 1 : 0.95
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`relative ${block.id === activeBlockId ? 'block' : 'hidden'}`}
                data-active={block.id === activeBlockId ? "true" : "false"}
              >
                <img 
                  src={block.image}
                  alt={block.title}
                  className="w-full h-64 object-cover rounded-lg transition-all duration-700"
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
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FocusScrollSection;
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
  // State for managing active block and UI modes
  const [activeBlockId, setActiveBlockId] = useState<number>(1);
  const [isFixedMode, setIsFixedMode] = useState(false);
  
  // References to DOM elements
  const sectionRef = useRef<HTMLElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Timing control
  const lastChangeTime = useRef<number>(Date.now());
  const minimumDuration = 1500; // Fixed time each block should remain active (ms)
  const LAST_BLOCK_ID = focusBlocks.length;
  
  // Sequential block tracking to ensure no block is skipped
  const [blockSequence, setBlockSequence] = useState<number[]>([1]);
  
  /**
   * Add a block to the sequence to ensure proper ordering
   */
  const addToSequence = (blockId: number) => {
    if (blockSequence[blockSequence.length - 1] === blockId) return;
    
    setBlockSequence(prev => {
      // Logic to ensure we never skip block 4
      if (prev[prev.length - 1] === 3 && blockId === 5) {
        // Must go through block 4 when going from 3 to 5
        return [...prev, 4, 5];
      }
      return [...prev, blockId];
    });
  };
  
  /**
   * The main function to update active state of blocks
   * This only updates UI elements, not the sequence
   */
  const updateActiveStateUI = (blockId: number) => {
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
    
    // Update the timing reference
    lastChangeTime.current = Date.now();
  };
  
  // Initialize and set first block active on mount
  useLayoutEffect(() => {
    // Pre-load all images
    const preloadImages = () => {
      focusBlocks.forEach(block => {
        const img = new Image();
        img.src = block.image;
        img.onload = () => console.log(`Image for block ${block.id} loaded`);
      });
    };
    
    preloadImages();
    
    // Set initial block
    updateActiveStateUI(1);
  }, []);
  
  // Effect to process the block sequence with proper timing
  useEffect(() => {
    if (blockSequence.length <= 1) return;
    
    let currentIndex = 0;
    
    // Initial activation of the first block
    updateActiveStateUI(blockSequence[0]);
    
    // Function to activate blocks sequentially with consistent timing
    const processBlockSequence = () => {
      if (currentIndex >= blockSequence.length - 1) {
        // We've processed all blocks in sequence
        return;
      }
      
      // Advance to next block
      currentIndex++;
      const nextBlockId = blockSequence[currentIndex];
      
      // Update the UI for this block
      updateActiveStateUI(nextBlockId);
      
      // Schedule the next block after the fixed duration
      // This ensures every block gets the same display time
      setTimeout(processBlockSequence, minimumDuration);
    };
    
    // Start the sequence timing
    // Important: This fixes block 4 timing by ensuring it gets the same time duration as all blocks
    const sequenceTimeout = setTimeout(processBlockSequence, minimumDuration);
    
    return () => clearTimeout(sequenceTimeout);
  }, [blockSequence]);
  
  /**
   * Handle scroll logic only for block detection, not timing/activation
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionBottom = sectionRect.bottom;
      const windowHeight = window.innerHeight;
      
      // Section is visible when it's in the viewport
      const isSectionVisible = sectionTop < windowHeight && sectionBottom > 0;
      
      // Determine if the image container should be in fixed mode
      const shouldBeFixedMode = 
        isSectionVisible && 
        sectionTop < 0 && 
        sectionBottom > windowHeight * 0.5;
        
      setIsFixedMode(shouldBeFixedMode);
      
      // Handle end of section case - show last block
      if (sectionBottom <= windowHeight + 100) {
        addToSequence(LAST_BLOCK_ID);
        return;
      }
      
      // Detect visible blocks
      const visibleBlocks: number[] = [];
      const blockActiveThreshold = windowHeight * 0.3;
      
      // Check each block's position relative to viewport
      blockRefs.current.forEach(block => {
        if (!block) return;
        
        const rect = block.getBoundingClientRect();
        const blockId = Number(block.getAttribute('data-block-id'));
        
        // Determine if block should be active based on position
        if (rect.top <= blockActiveThreshold && 
            rect.top >= -rect.height * 0.4 && 
            rect.bottom > rect.height * 0.6) {
          visibleBlocks.push(blockId);
        }
      });
      
      // Don't proceed if no blocks are visible
      if (visibleBlocks.length === 0) return;
      
      // Find the highest visible block ID and add to sequence
      const highestVisibleId = Math.max(...visibleBlocks);
      
      if (highestVisibleId !== blockSequence[blockSequence.length - 1]) {
        addToSequence(highestVisibleId);
      }
    };
    
    // Run once to establish initial state
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blockSequence]);
  
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
                onClick={() => {
                  // Handle click by adding to sequence
                  if (block.id > activeBlockId) {
                    addToSequence(block.id);
                  } else {
                    // For backwards jumps, just set directly
                    updateActiveStateUI(block.id);
                  }
                }}
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
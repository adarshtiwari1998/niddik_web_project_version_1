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
  const isJustChanged = useRef<boolean>(false); // Track recent changes
  const lastTransitionTime = useRef<number>(0); // Track when last transition happened
  const activateBlock4AfterDelay = useRef<boolean>(false); // Flag to force block 4 activation
  
  // Last block ID to determine when we've reached the end
  const LAST_BLOCK_ID = focusBlocks.length;
  
  // Update active state of blocks and images with forced sequencing
  const updateActiveState = (blockId: number) => {
    if (blockId === activeBlockId) return;
    
    // CRITICAL FIX: Never allow skipping block 4
    // If we're at block 3 and trying to jump to 5+, force block 4 first
    if (activeBlockId === 3 && blockId > 4) {
      console.log(`Preventing skip of block 4, activating it first`);
      
      // Instead of jumping directly to 5, we'll activate block 4
      // and schedule block 5 to activate after a delay
      
      // Store the timestamp of this transition
      lastTransitionTime.current = Date.now();
      
      // Mark block 4 as active
      activateBlock4First();
      
      // Schedule block 5 to activate later
      setTimeout(() => {
        console.log("Scheduled activation of block 5 after block 4");
        setActiveBlockId(blockId);
        
        // Update DOM directly also for immediate visual feedback
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
      }, 1000); // Force block 4 to stay visible for 1 second before showing block 5
      
      return;
    }
    
    // Normal case - update active state
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
    
    // Store the timestamp of this transition
    lastTransitionTime.current = Date.now();
  };
  
  // Special function just to activate block 4
  const activateBlock4First = () => {
    setActiveBlockId(4);
    
    // Update DOM directly also for immediate visual feedback
    blockRefs.current.forEach(block => {
      if (!block) return;
      const id = Number(block.getAttribute('data-block-id'));
      
      if (id === 4) {
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
    // Define local state for timing control
    let lastTransitionTimestamp = 0;
    const minTimeInBlock = 800; // Minimum time to stay in a block (in ms)
    
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
      
      // Check if we've reached the end of the section
      if (sectionBottom <= windowHeight + 100) {
        updateActiveState(LAST_BLOCK_ID);
        return;
      }
      
      // Collect all blocks that are currently visible
      const visibleBlocks: number[] = [];
      
      // Threshold for detecting when a block should be active (as % of viewport height)
      const blockActiveThreshold = windowHeight * 0.3;
      
      // Check which blocks are currently visible in the viewport
      blockRefs.current.forEach(block => {
        if (!block) return;
        
        const rect = block.getBoundingClientRect();
        const blockId = Number(block.getAttribute('data-block-id'));
        
        // Block is active when:
        // 1. Top part is in the upper portion of the viewport
        // 2. Most of the block is still visible
        if (rect.top <= blockActiveThreshold && 
            rect.top >= -rect.height * 0.4 && 
            rect.bottom > rect.height * 0.6) {
          visibleBlocks.push(blockId);
        }
      });
      
      // If no blocks are visible, keep current state
      if (visibleBlocks.length === 0) {
        return;
      }
      
      // Skip transitions if we just changed blocks (for timing consistency)
      const now = Date.now();
      if (now - lastTransitionTimestamp < minTimeInBlock) {
        return;
      }
      
      // Common case - a normal block is active
      if (visibleBlocks.includes(activeBlockId)) {
        // Current block is still visible, no need to change
        return;
      }
      
      // Special case for block 4 - always ensure it shows up
      if (activeBlockId === 3 && visibleBlocks.includes(5) && !visibleBlocks.includes(4)) {
        console.log("Detected block 3 active with block 5 visible but block 4 skipped");
        
        // Never allow block 3 -> block 5 transition directly
        // Use our specialized function to force block 4 to show first
        activateBlock4First();
        
        // Schedule block 5 to activate later
        setTimeout(() => {
          console.log("Scheduled activation of block 5 after showing block 4");
          if (visibleBlocks.includes(5)) {
            updateActiveState(5);
          }
        }, 1000); // Force block 4 to stay visible for 1 full second
        
        // Update timestamp to prevent too-quick transitions
        lastTransitionTimestamp = now;
        return;
      }
      
      // Prevent too-quick transitions away from block 4
      if (activeBlockId === 4 && isJustChanged.current) {
        return; // Keep block 4 active until minimum time has passed
      }
      
      // Get the highest visible block ID
      const maxVisibleBlockId = Math.max(...visibleBlocks);
      
      // Only update if there's a change needed
      if (maxVisibleBlockId !== activeBlockId) {
        // If moving from block 3 to block 4, add extra dwell time
        if (activeBlockId === 3 && maxVisibleBlockId === 4) {
          updateActiveState(4);
          isJustChanged.current = true;
          setTimeout(() => {
            isJustChanged.current = false;
          }, minTimeInBlock);
        } else {
          // Normal transition to any other block
          updateActiveState(maxVisibleBlockId);
        }
        
        // Remember when we made this transition
        lastTransitionTimestamp = now;
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
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
  const lastTransitionTime = useRef<number>(Date.now());
  const lastScrollY = useRef<number>(0); // Track last scroll position for detecting fast scrolls
  
  // Flag to enforce minimum display time for blocks
  const isEnforcingMinDisplayTime = useRef<boolean>(false);
  
  // Need to track which blocks have been shown to ensure proper sequence
  const previousBlock = useRef<number>(1);
  
  // Minimum time (in ms) each block should be displayed
  const MIN_DISPLAY_TIME = 500;
  
  // Last block ID to determine when we've reached the end
  const LAST_BLOCK_ID = focusBlocks.length;
  
  // Update active state of blocks and images
  const updateActiveState = (blockId: number) => {
    // Don't update if we're already on this block
    if (blockId === activeBlockId) return;
    
    // Enhanced handling to ensure block 4 is never skipped in either direction
    if ((activeBlockId === 3 && blockId === 5) || (activeBlockId === 5 && blockId === 3)) {
      // If going from 3 to 5 OR from 5 to 3, force showing block 4 first and stay there
      console.log(`Block ${activeBlockId}->${blockId} transition intercepted: showing block 4 instead`);
      
      // Activate block 4 and STAY THERE
      setActiveBlockId(4);
      previousBlock.current = activeBlockId; // Remember where we came from
      
      // Set a longer minimum display time for block 4 since it's problematic
      lastTransitionTime.current = Date.now();
      isEnforcingMinDisplayTime.current = true;
      
      // Update DOM for immediate visual feedback 
      blockRefs.current.forEach(block => {
        if (!block) return;
        const id = Number(block.getAttribute('data-block-id'));
        
        if (id === 4) {
          block.classList.add('active');
          block.setAttribute('data-active', 'true');
          
          // Make block 4 extra visible
          block.style.zIndex = '100';
          block.style.position = 'relative';
          block.style.transform = 'translateX(8px)';
          
          // Force a reflow to ensure CSS changes apply immediately
          void block.offsetHeight;
        } else {
          block.classList.remove('active');
          block.setAttribute('data-active', 'false');
        }
      });
      
      // Ensure the image for block 4 is visible
      if (imageContainerRef.current) {
        const block4Image = imageContainerRef.current.querySelector('[data-block-id="4"]');
        if (block4Image) {
          // Force the image to be visible with inline styles
          block4Image.setAttribute('style', 'opacity: 1 !important; visibility: visible !important; z-index: 100 !important;');
        }
      }
      
      // Update timestamp and enforcing flag
      lastTransitionTime.current = Date.now();
      isEnforcingMinDisplayTime.current = true;
      
      // Reset the enforcing flag after minimum display time
      // but DON'T automatically move to next block
      setTimeout(() => {
        isEnforcingMinDisplayTime.current = false;
      }, MIN_DISPLAY_TIME);
      
      return;
    }
    
    // General case for other block transitions
    console.log(`Setting active block: ${blockId}`);
    setActiveBlockId(blockId);
    
    // Update DOM for immediate visual feedback
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
    
    // Update the transition timestamp
    lastTransitionTime.current = Date.now();
    previousBlock.current = activeBlockId;
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
      const sectionHeight = sectionRect.height; // Add section height for calculations
      const windowHeight = window.innerHeight;
      
      // Section is visible when it's in the viewport
      const isSectionVisible = sectionTop < windowHeight && sectionBottom > 0;
      
      // Check if the last block is visible (block 5)
      let isLastBlockVisible = false;
      blockRefs.current.forEach(block => {
        if (!block) return;
        const id = Number(block.getAttribute('data-block-id'));
        if (id === LAST_BLOCK_ID) {
          const rect = block.getBoundingClientRect();
          isLastBlockVisible = rect.top <= windowHeight * 0.5;
        }
      });
      
      // For last block handling
      if (activeBlockId === LAST_BLOCK_ID) {
        // Always make sure image is visible for the last block and not in fixed mode
        setIsFixedMode(false);
        console.log("Last block active, fixed mode disabled");
        
        // We'll handle positioning with CSS in our last-block-position class
        if (imageContainerRef.current) {
          imageContainerRef.current.classList.add('last-block-position');
        }
      } 
      // For all other blocks (1-4)
      else {
        // Normal fixed mode determination for blocks 1-4
        const shouldBeFixedMode = 
          isSectionVisible && 
          sectionTop < 0 && // Section has scrolled up partially
          sectionBottom > windowHeight * 0.5; // Not at the end
          
        setIsFixedMode(shouldBeFixedMode);
        
        // Make sure we remove special positioning when not at the last block
        if (imageContainerRef.current) {
          imageContainerRef.current.classList.remove('last-block-position');
        }
      }
      
      // Enforce minimum display time before allowing new transitions
      const now = Date.now();
      const timeSinceLastTransition = now - lastTransitionTime.current;
      
      if (timeSinceLastTransition < MIN_DISPLAY_TIME || isEnforcingMinDisplayTime.current) {
        // Don't process any transitions if we're still in minimum display time
        return;
      }
      
      // Detection for when we're at the very bottom of the page
      const isAtAbsoluteBottom = (
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 200 || // Near page bottom
        sectionBottom <= windowHeight + 100 // Section end is very close
      );
      
      // Track fast scrolling but don't use it to skip blocks
      const userScrolledFast = Math.abs(window.scrollY - lastScrollY.current) > 200;
      lastScrollY.current = window.scrollY;
      
      // Only activate last block when truly at the bottom to prevent skipping block 4
      if (isAtAbsoluteBottom) {
        // Only if we're not already on block 4
        if (activeBlockId !== 4) {
          console.log("Near bottom of page, showing last block");
          // Force last block activation
          setActiveBlockId(LAST_BLOCK_ID);
          
          // Direct DOM manipulation for immediate visual update
          blockRefs.current.forEach(block => {
            if (!block) return;
            const id = Number(block.getAttribute('data-block-id'));
            
            if (id === LAST_BLOCK_ID) {
              block.classList.add('active');
              block.setAttribute('data-active', 'true');
            } else {
              block.classList.remove('active');
              block.setAttribute('data-active', 'false');
            }
          });
          
          // Also apply the image container class immediately
          if (imageContainerRef.current) {
            imageContainerRef.current.classList.add('last-block-position');
            
            // Force the image to be visible
            const lastImage = imageContainerRef.current.querySelector(`[data-block-id="${LAST_BLOCK_ID}"]`);
            if (lastImage) {
              lastImage.setAttribute('style', 'opacity: 1; visibility: visible; z-index: 10;');
            }
          }
          
          // Skip other checks - we've hit the bottom
          return;
        }
      }
      
      // Process visible blocks to find which one should be active
      const visibleBlocks: {id: number, top: number}[] = [];
      
      // Use threshold to determine when a block becomes active
      const threshold = windowHeight * 0.2;
      
      blockRefs.current.forEach(block => {
        if (!block) return;
        
        const rect = block.getBoundingClientRect();
        const blockId = Number(block.getAttribute('data-block-id'));
        
        // Detect when a block is in the active area of the viewport
        if (rect.top <= threshold && rect.bottom > rect.height * 0.3) {
          visibleBlocks.push({
            id: blockId,
            top: rect.top
          });
        }
      });
      
      // Enhanced handling for block 4 in all directions
      // Don't skip block 4 when scrolling in either direction
      
      // When scrolling down from 3
      if (activeBlockId === 3) {
        const block4Ref = blockRefs.current.find(ref => ref?.getAttribute('data-block-id') === '4');
        const block4Position = block4Ref?.getBoundingClientRect();
        
        // If block 4 is ANYWHERE near the viewport, make it active
        if (block4Position && block4Position.bottom > 0 && block4Position.top < window.innerHeight) {
          console.log("Block 4 is nearby, activating it");
          updateActiveState(4);
          return;
        }
      }
      
      // When scrolling up from 5
      if (activeBlockId === 5) {
        const block4Ref = blockRefs.current.find(ref => ref?.getAttribute('data-block-id') === '4');
        const block4Position = block4Ref?.getBoundingClientRect();
        
        // If block 4 is ANYWHERE near the viewport, make it active
        if (block4Position && block4Position.bottom > 0 && block4Position.top < window.innerHeight) {
          console.log("Block 4 is nearby when scrolling up, activating it");
          updateActiveState(4);
          return;
        }
      }
      
      // Extra safety check - explicitly look for block 4 when transitioning
      if ((activeBlockId === 3 || activeBlockId === 5)) {
        // Check if we're close to section 4 in the viewport
        const block4Ref = blockRefs.current.find(ref => ref?.getAttribute('data-block-id') === '4');
        if (block4Ref) {
          const rect = block4Ref.getBoundingClientRect();
          // Very generous condition - if block 4 is even partially in view, activate it
          if (rect.top < windowHeight && rect.bottom > 0) {
            // This is a safety check to make sure we don't skip block 4
            console.log("Special protection for block 4 activated");
            updateActiveState(4);
            return;
          }
        }
      }
      
      // Find the block that should be active
      if (visibleBlocks.length > 0) {
        // Get the highest (last) visible block ID
        // Sort by ID to ensure sequential activation
        visibleBlocks.sort((a, b) => a.id - b.id);
        const highestBlockId = visibleBlocks[visibleBlocks.length - 1].id;
        
        // Only update if there's a change needed
        if (highestBlockId !== activeBlockId) {
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
              className={`fixed-image-wrapper ${activeBlockId === LAST_BLOCK_ID ? "h-full flex flex-col justify-end" : ""}`}
            >
              <div 
                ref={imageContainerRef}
                className={`fixed-image-container ${isFixedMode ? "" : "not-fixed"} ${activeBlockId === LAST_BLOCK_ID ? "last-block-position" : ""}`}
                style={
                  activeBlockId === LAST_BLOCK_ID 
                  ? // Special styles only for block 5
                    { 
                      position: "relative",
                      top: "auto", 
                      bottom: "0",
                      transform: "none",
                      width: "100%",
                      transition: "all 0.2s ease-out",
                      marginTop: "auto" // Push to bottom when at last block
                    }
                  : // Original styles for blocks 1-4 
                    {
                      position: isFixedMode ? "fixed" : "relative",
                      top: isFixedMode ? "50%" : "auto", 
                      transform: isFixedMode ? "translateY(-50%)" : "none",
                      width: isFixedMode ? "calc(50% - 3rem)" : "100%",
                      transition: "all 0.2s ease-out"
                    } 
                }
                data-fixed={isFixedMode ? "true" : "false"}
                data-active-block={activeBlockId}
              >
                {focusBlocks.map((block) => (
                  <motion.div
                    key={block.id}
                    className="fixed-image"
                    data-block-id={block.id}
                    style={{ 
                      opacity: block.id === activeBlockId ? 1 : 0,
                      visibility: block.id === activeBlockId ? "visible" : "hidden",
                      zIndex: block.id === activeBlockId ? 5 : 1,
                      transform: `translateZ(0)` // Force hardware acceleration for stability
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: block.id === activeBlockId ? 1 : 0,
                      scale: block.id === activeBlockId ? 1 : 0.95
                    }}
                    transition={{ 
                      duration: 0.3, // Consistent duration for all blocks 
                      ease: "easeOut" 
                    }}
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
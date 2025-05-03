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
  
  // Define the actual last block ID - important to track when we've reached the end
  const LAST_BLOCK_ID = 5; // Match this with the actual ID of the last block
  
  // Function to update active block CSS classes and attributes
  const updateActiveBlockStyles = (activeId: number) => {
    // Update data-active attributes for all blocks
    blockRefs.current.forEach(block => {
      if (block) {
        const blockId = Number(block.getAttribute("data-block-id"));
        const isActive = blockId === activeId;
        block.setAttribute("data-active", isActive ? "true" : "false");
        
        // Manually toggle the 'active' class for more reliable styling
        if (isActive) {
          block.classList.add("active");
        } else {
          block.classList.remove("active");
        }
      }
    });
  };
  
  // Use effect to initialize active block to 1 and add extra section detector
  useEffect(() => {
    // Always start with the first block active and set its styles
    setActiveBlockId(1);
    // Set initial active block styles after the DOM is ready
    setTimeout(() => {
      updateActiveBlockStyles(1);
    }, 100);
    
    // Add enhanced scroll listener to handle section boundaries - crucial for smooth transition at edges
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      // Get all blocks to check their positions
      const allBlocks = blockRefs.current.filter(block => block !== null);
      
      // Get section boundaries
      const sectionRect = sectionRef.current.getBoundingClientRect();
      
      // Section end detection - release fixed positioning when section bottom is in view
      // This prevents overlap with content below
      const isSectionEnded = sectionRect.bottom <= window.innerHeight + 100; // Add small buffer
      
      // Section beginning detection - only enable fixed positioning after section has entered viewport
      const isTopInView = sectionRect.top <= 0.3 * window.innerHeight;
      
      // Find the last block (block 5) if available
      const lastBlock = allBlocks.find(
        block => Number(block?.getAttribute("data-block-id")) === LAST_BLOCK_ID
      );
      
      // Check which blocks are in view to maintain sequential ordering
      const blocksInView = allBlocks
        .filter(block => {
          if (!block) return false;
          const rect = block.getBoundingClientRect();
          // Consider a block "in view" when it's in the upper half of the viewport
          return rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0;
        })
        .map(block => Number(block?.getAttribute("data-block-id") || 0))
        .sort((a, b) => a - b); // Sort by block ID to maintain sequence
        
      // Get current position based on blocks in view (top-most visible block)
      const visibleBlocks = blocksInView.length > 0 ? blocksInView : [activeBlockId];
      const currentPosition = Math.min(...visibleBlocks);
      
      // Debug info
      console.log(`Blocks in view: ${JSON.stringify(blocksInView)}, current: ${currentPosition}`);
        
      // Update states based on scroll position
      if (isSectionEnded || (lastBlock && lastBlock.getBoundingClientRect().top <= window.innerHeight * 0.4)) {
        // Section is ending OR last block is near top, force release fixed position
        setIsLastBlockVisible(true);
        
        // Always ensure the current image is visible when in release mode
        // Always set to the LAST block to ensure image 5 is showing
        setActiveBlockId(LAST_BLOCK_ID);
        updateActiveBlockStyles(LAST_BLOCK_ID);
        console.log(`Fifth block is visible - setting active block to ${LAST_BLOCK_ID}`);
      } else if (!isTopInView) {
        // We're at the top of the section, don't enable fixed positioning yet
        setIsFirstBlockAtTop(false);
      } else {
        // Section is in normal scrolling range - make sure last block release is disabled
        // This ensures blocks 1-4 all maintain the fixed position
        setIsLastBlockVisible(false);
        
        // Update active block ID only if we have blocks in view
        if (blocksInView.length > 0) {
          // Get the top-most visible block that's furthest in the sequence
          // This ensures we only go forward, never backward in the sequence
          const nextBlock = blocksInView[0];  // First block in view (sorted by position)
          
          // Only update if moving forward or at the beginning
          if (nextBlock !== activeBlockId && (nextBlock > activeBlockId || nextBlock === 1)) {
            console.log(`Updating active block from ${activeBlockId} to ${nextBlock}`);
            setActiveBlockId(nextBlock);
            updateActiveBlockStyles(nextBlock);
          }
        }
      }
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeBlockId]);
  
  // Set up intersection observers to track section and blocks
  useEffect(() => {
    // Observer for individual blocks
    const blockObserver = new IntersectionObserver(
      (entries) => {
        // To track which blocks are currently in view
        const visibleBlocks = new Set<number>();
        
        // First, collect all visible blocks from entries
        entries.forEach((entry) => {
          const blockId = Number(entry.target.getAttribute("data-block-id"));
          if (!blockId) return;
          
          if (entry.isIntersecting) {
            visibleBlocks.add(blockId);
          }
        });
        
        // When no blocks are visible, keep the previous active block
        if (visibleBlocks.size === 0) return;
        
        // Always get all visible blocks and sort them by their position from top to bottom
        // This ensures we always get the correct block in view order
        const visibleBlocksArray = Array.from(blockRefs.current)
          .filter(block => block && visibleBlocks.has(Number(block.getAttribute("data-block-id"))))
          .sort((a, b) => {
            if (!a || !b) return 0;
            return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
          });
          
        // Get the ID of the top-most visible block
        const topBlock = visibleBlocksArray[0];
        const topVisibleBlock = topBlock ? Number(topBlock.getAttribute("data-block-id")) : 1;
        
        // Special handling for last block - only apply release logic when actually at the LAST block
        if (visibleBlocks.has(LAST_BLOCK_ID)) {
          const lastBlockEntry = entries.find(
            entry => Number(entry.target.getAttribute("data-block-id")) === LAST_BLOCK_ID
          );
          
          if (lastBlockEntry) {
            // If last block is in the top portion of viewport, release fixed positioning
            const lastBlockThreshold = window.innerHeight * 0.4; // Increase threshold a bit
            const isLastBlockNearTop = lastBlockEntry.boundingClientRect.top <= lastBlockThreshold;
            
            if (isLastBlockNearTop) {
              console.log(`Last block ${LAST_BLOCK_ID} visible near top - releasing fixed position`);
              setIsLastBlockVisible(true);
              setActiveBlockId(LAST_BLOCK_ID); // Show last block image
              
              // Force each block to update its active state
              blockRefs.current.forEach(block => {
                if (block) {
                  const blockId = Number(block.getAttribute("data-block-id"));
                  if (blockId === LAST_BLOCK_ID) {
                    block.setAttribute("data-active", "true");
                  } else {
                    block.setAttribute("data-active", "false");
                  }
                }
              });
            }
          }
        } else {
          // Not on last block, ensure image stays fixed
          setIsLastBlockVisible(false);
          
          // Only update active block ID if the new block is sequential
          // This prevents going backward (e.g., 3→1) which causes image jumping
          if (topVisibleBlock > activeBlockId || topVisibleBlock === 1) {
            setActiveBlockId(topVisibleBlock);
            
            // Update both the activeBlockId state and DOM attributes/classes
            blockRefs.current.forEach(block => {
              if (block) {
                const blockId = Number(block.getAttribute("data-block-id"));
                const isActive = blockId === topVisibleBlock;
                block.setAttribute("data-active", isActive ? "true" : "false");
                
                // Manually toggle the 'active' class for more reliable styling
                if (isActive) {
                  block.classList.add("active");
                } else {
                  block.classList.remove("active");
                }
              }
            });
            
            console.log(`Block ${topVisibleBlock} is now active (top-most visible)`);
          } else {
            console.log(`Skipping non-sequential block ${topVisibleBlock} (current: ${activeBlockId})`);
          }
          
          // Always ensure the correct block is highlighted, not just the first one
          // This fixes the issue where block 1 remains highlighted when it shouldn't
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -40% 0px", // More visible area at top to ensure proper ordering
        threshold: [0.05, 0.1, 0.15, 0.2, 0.25], // Focus on top portion of blocks for more accurate detection
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
    
    // More sensitive observer just for determining section entry/exit
    const sectionEntryExitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When section is entering or exiting viewport
          // This helps with quick transition on scroll up/down
          if (!entry.isIntersecting) {
            // Immediately remove fixed positioning when outside view
            setIsSectionInView(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "-5px 0px", // Near exact edge detection
        threshold: 0,
      }
    );
    
    // Observer specifically for the first block
    const firstBlockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if first block has reached top of viewport
          const { top, height } = entry.boundingClientRect;
          
          // We want to make the image fixed when the first block is in the viewport
          // and near the top (within the first 30% of the viewport height)
          const topThreshold = window.innerHeight * 0.3;
          
          // First block in view criteria:
          // 1. When the block is within the viewport AND near the top of viewport OR
          // 2. When the block has scrolled past (not intersecting, above viewport)
          const isFirstBlockInView = 
            (entry.isIntersecting && top <= topThreshold) || 
            (!entry.isIntersecting && top <= 0);
          
          setIsFirstBlockAtTop(isFirstBlockInView);
          
          // For debugging
          console.log(`First block - top: ${top}, intersecting: ${entry.isIntersecting}, isAtTop: ${isFirstBlockInView}`);
        });
      },
      {
        root: null,
        rootMargin: "-5% 0px -70% 0px", // Trigger when block enters top portion of viewport
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for smoother detection
      }
    );

    // Observe the section with both observers
    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
      sectionEntryExitObserver.observe(sectionRef.current);
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
      // Clean up all section observers
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
        sectionEntryExitObserver.unobserve(sectionRef.current);
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
              block.id === activeBlockId && (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="relative"
                  data-active="true"
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
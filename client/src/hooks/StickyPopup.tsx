import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';

/* StickyPopup.css */

const styles = `
.arrow-container {
    position: fixed;
    z-index: 49; /* Below popup but above other content */
    pointer-events: none; /* Avoid interfering with clicks */
}
.arrow-line {
    background: linear-gradient(90deg, #4DD0E1 0%, #4DD0E1 70%, transparent 70%, transparent 80%, #4DD0E1 80%);
    background-size: 10px 2px;
    background-repeat: repeat-x;
    width: 100%;
    height: 2px;
}
@keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}
.arrow-flash {
    animation: flash 2s ease-in-out infinite;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const StickyIcon = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <div
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer"
        onClick={onClick}
    >
        {isOpen ? <X size={24} /> : '?'}
    </div>
);

interface StickyPopupProps {}

const StickyPopup: React.FC<StickyPopupProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [choice, setChoice] = useState<string | null>(localStorage.getItem('niddikChoice') || null);
    const [isBouncing, setIsBouncing] = useState(false);
    const iconRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0, endTop: 0, endLeft: 0 });
    const [showArrow, setShowArrow] = useState(false);
    const [confirmationContent, setConfirmationContent] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (!choice) {
            // Trigger bouncing and THEN open the popup
            setIsBouncing(true);
            setTimeout(() => {
                setIsBouncing(false); // Stop bouncing after 2 seconds
                setIsOpen(true);       // Open the popup
            }, 2000);
        }
    }, [choice]);

    useEffect(() => {
        if (choice) {
            setConfirmationContent(getConfirmationContent(choice));
        }
    }, [choice]);

    useEffect(() => {
        updatePopupPosition();
        
        // Update position on window resize
        const handleResize = () => {
            updatePopupPosition();
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure popup is rendered and positioned
            setTimeout(() => {
                updateArrowPosition();
                setShowArrow(true);
            }, 100);
            const timer = setTimeout(() => setShowArrow(false), 5000);
            return () => clearTimeout(timer);
        }
        setShowArrow(false);
    }, [isOpen]);

    const updatePopupPosition = () => {
        if (!iconRef.current) return;

        const iconRect = iconRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = viewportWidth < 768; // Mobile breakpoint
        
        if (isMobile) {
            // On mobile, center the popup horizontally and position it above the icon
            const popupWidth = Math.min(280, viewportWidth - 32); // Max width with 16px margin on each side
            const leftPosition = (viewportWidth - popupWidth) / 2;
            const topPosition = Math.max(16, iconRect.top - 320); // Position above icon with minimum top margin
            
            setPopupPosition({ 
                top: topPosition, 
                left: leftPosition 
            });
        } else {
            // Desktop positioning (original logic)
            const spaceAbove = iconRect.top;
            const popupHeight = 300;
            const topPosition = spaceAbove > popupHeight ? iconRect.top - popupHeight - 10 : iconRect.bottom + 10;
            const leftOffset = iconRect.right + 10;

            setPopupPosition({ top: topPosition, left: leftOffset });
        }
    };

    const updateArrowPosition = () => {
        if (iconRef.current && popupRef.current) {
            const iconRect = iconRef.current.getBoundingClientRect();
            const popupRect = popupRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const isMobile = viewportWidth < 768;
            
            if (isMobile) {
                // Mobile: arrow points from popup bottom to icon center
                const iconCenterX = iconRect.left + iconRect.width / 2;
                const iconCenterY = iconRect.top + iconRect.height / 2;
                const popupBottomCenterX = popupRect.left + popupRect.width / 2;
                const popupBottom = popupRect.bottom;
                
                setArrowPosition({
                    top: popupBottom,
                    left: popupBottomCenterX,
                    endTop: iconCenterY,
                    endLeft: iconCenterX,
                });
            } else {
                // Desktop: arrow points from popup left edge to icon center
                const iconCenterX = iconRect.left + iconRect.width / 2;
                const iconCenterY = iconRect.top + iconRect.height / 2;
                const popupLeftX = popupRect.left;
                const popupCenterY = popupRect.top + popupRect.height / 2;

                setArrowPosition({
                    top: popupCenterY,
                    left: popupLeftX,
                    endTop: iconCenterY,
                    endLeft: iconCenterX,
                });
            }
        }
    };

    const handleChoice = (selectedChoice: string) => {
        localStorage.setItem('niddikChoice', selectedChoice);
        setChoice(selectedChoice);
        setConfirmationContent(getConfirmationContent(selectedChoice));
        setIsOpen(true);
    };

    const resetChoice = () => {
        localStorage.removeItem('niddikChoice');
        setChoice(null);
        setIsOpen(true);
        setConfirmationContent(null);
    };

    const getConfirmationContent = (choice: string): JSX.Element => {
        const handleNavigation = () => setIsOpen(false);

        switch (choice) {
            case 'hire':
                return (
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-lg md:text-xl font-semibold pr-2">Let's get in touch!</p>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-4 text-sm md:text-base text-gray-600">Get ready to hire talent 66% faster with NiDDik.</p>
                        <Link href="/request-demo" onClick={handleNavigation} className="inline-block w-full text-center bg-green-500 text-white py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base">
                            Request A Demo
                        </Link>
                    </div>
                );
            case 'role':
                return (
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-lg md:text-xl font-semibold pr-2">You're in the right place!</p>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-4 text-sm md:text-base text-gray-600">Learn more about how to join NiDDik as a certified technologist.</p>
                        <Link href="/careers" onClick={handleNavigation} className="inline-block w-full text-center bg-green-500 text-white py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base">
                            Learn More
                        </Link>
                    </div>
                );
            case 'looking':
                return (
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-lg md:text-xl font-semibold pr-2">Great, thanks for being here.</p>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-4 text-sm md:text-base text-gray-600">We recommend you start with Why NiDDik. You'll find everything you need to know.</p>
                        <Link href="/why-us" onClick={handleNavigation} className="inline-block w-full text-center bg-green-500 text-white py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base">
                            Learn More
                        </Link>
                    </div>
                );
            default:
                return <div className="p-4">Error: No content available.</div>;
        }
    };

    const renderContent = () => {
        if (confirmationContent) return confirmationContent;

        return (
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg md:text-xl font-semibold pr-2">What brings you to NiDDik?</h3>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="mb-4 text-sm md:text-base text-gray-600">We'd like to personalize your experience so you find what you're looking for!</p>
                <div className="space-y-2">
                    <button onClick={() => handleChoice('hire')} className="block w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
                        I want to hire talent
                    </button>
                    <button onClick={() => handleChoice('role')} className="block w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
                        I am looking for my next role
                    </button>
                    <button onClick={() => handleChoice('looking')} className="block w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
                        I am looking around
                    </button>
                </div>
            </div>
        );
    };

    const calculateArrowStyle = () => {
        const { top, left, endTop, endLeft } = arrowPosition;
        const distance = Math.sqrt(Math.pow(endLeft - left, 2) + Math.pow(endTop - top, 2));
        const angle = (Math.atan2(endTop - top, endLeft - left) * 180) / Math.PI;

        return {
            top: top,
            left: left,
            width: distance,
            height: '2px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'left center',
        };
    };

    return (
        <div>
            <div
                className={`fixed left-4 bottom-4 z-50 ${isBouncing ? 'animate-bounce' : ''}`}
                ref={iconRef}
            >
                <StickyIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>

            {isOpen && (
                <div
                    className="fixed bg-white rounded-lg shadow-xl z-50 w-72 md:w-80 max-w-[calc(100vw-2rem)]"
                    style={{
                        top: popupPosition.top,
                        left: popupPosition.left,
                        maxHeight: 'calc(100vh - 120px)',
                        overflow: 'auto'
                    }}
                    ref={popupRef}
                >
                    {renderContent()}
                </div>
            )}

            {showArrow && isOpen && (
                <div className="arrow-container arrow-flash" style={calculateArrowStyle()}>
                    <div className="arrow-line"></div>
                </div>
            )}

            {choice && (
                <button
                    onClick={resetChoice}
                    className="fixed bottom-4 right-4 bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded z-50"
                >
                    Change Choice
                </button>
            )}
        </div>
    );
};

export default StickyPopup;
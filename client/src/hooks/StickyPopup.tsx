import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { X } from 'lucide-react';

/* StickyPopup.css */

const styles = `
.popup-with-shadow {
    box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.5);
}
.floating-icon::before {
    content: "";
    position: absolute;
    top: 50%;
    right: -8px;
    width: 0;
    height: 0;
    border-color: transparent transparent transparent #4DD0E1;
    border-style: solid;
    border-width: 6px 0 6px 8px;
    transform: translateY(-50%);
    z-index: 51;
    opacity: 0;
    transition: all 0.3s ease;
}
.floating-icon.connected::before {
    opacity: 1;
    right: -8px;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const StickyIcon = ({ isOpen, onClick, isConnected }: { isOpen: boolean; onClick: () => void; isConnected: boolean }) => (
    <div
        className={`floating-icon w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer relative ${isConnected ? 'connected' : ''}`}
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

    // Add observers to detect popup content and size changes
    useEffect(() => {
        if (isOpen && popupRef.current) {
            // Mutation observer for content changes
            const mutationObserver = new MutationObserver(() => {
                setTimeout(() => {
                    updatePopupPosition();
                }, 50);
            });
            
            // Resize observer for height changes
            const resizeObserver = new ResizeObserver(() => {
                setTimeout(() => {
                    updatePopupPosition();
                }, 50);
            });
            
            mutationObserver.observe(popupRef.current, {
                childList: true,
                subtree: true,
                characterData: true
            });
            
            resizeObserver.observe(popupRef.current);
            
            return () => {
                mutationObserver.disconnect();
                resizeObserver.disconnect();
            };
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure popup is rendered and positioned
            setTimeout(() => {
                updatePopupPosition();
            }, 100);
        }
    }, [isOpen]);

    const updatePopupPosition = () => {
        if (!iconRef.current) return;

        const iconRect = iconRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = viewportWidth < 768;
        
        // Get actual popup height if available
        const popupHeight = popupRef.current ? popupRef.current.offsetHeight : 300;
        
        if (isMobile) {
            // On mobile, center the popup horizontally and position it above the icon
            const popupWidth = Math.min(280, viewportWidth - 32);
            const leftPosition = (viewportWidth - popupWidth) / 2;
            const topPosition = Math.max(16, iconRect.top - popupHeight - 20);
            
            setPopupPosition({ 
                top: topPosition, 
                left: leftPosition 
            });
        } else {
            // Desktop: Position popup to connect directly with triangle
            const leftOffset = iconRect.right + 8; // Close connection for triangle
            let topPosition = iconRect.top + (iconRect.height / 2) - (popupHeight / 2); // Center with icon
            
            // Ensure popup doesn't go below viewport
            if (topPosition + popupHeight > viewportHeight - 20) {
                topPosition = viewportHeight - popupHeight - 20;
            }
            
            // Ensure popup doesn't go above viewport
            if (topPosition < 20) {
                topPosition = 20;
            }
            
            setPopupPosition({ top: topPosition, left: leftOffset });
        }
    };



    const handleChoice = (selectedChoice: string) => {
        localStorage.setItem('niddikChoice', selectedChoice);
        setChoice(selectedChoice);
        setConfirmationContent(getConfirmationContent(selectedChoice));
        setIsOpen(true);
        
        // Update popup position after content changes
        setTimeout(() => {
            updatePopupPosition();
        }, 100);
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



    return (
        <div>
            <div
                className={`fixed left-4 bottom-4 z-50 ${isBouncing ? 'animate-bounce' : ''}`}
                ref={iconRef}
            >
                <StickyIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} isConnected={isOpen} />
            </div>

            {isOpen && (
                <div
                    className="fixed bg-white rounded-lg popup-with-shadow z-50 w-72 md:w-80 max-w-[calc(100vw-2rem)]"
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
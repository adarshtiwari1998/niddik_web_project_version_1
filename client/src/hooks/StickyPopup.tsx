import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';

/* StickyPopup.css */

const styles = `
.arrow-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 51; /* Ensure it's above the icon and popup */
    pointer-events: none; /* Avoid interfering with clicks */
}
.arrow {
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid white; /* Arrow color */
    animation: flash 1s linear infinite;
}
@keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const StickyIcon = () => (
  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer">?</div>
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
            // Trigger bouncing and open the popup automatically for first-time users
            setIsBouncing(true);
            setTimeout(() => {
                setIsBouncing(false);
                setIsOpen(true);
            }, 2000); // Bounce for 2 seconds, then stop and show popup
        }
    }, [choice]);

    useEffect(() => {
        if (choice) {
            setConfirmationContent(getConfirmationContent(choice));
        }
    }, [choice]);

    useEffect(() => {
        updatePopupPosition();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            updateArrowPosition();
            setShowArrow(true);
            const timer = setTimeout(() => setShowArrow(false), 3000); // Hide arrow after 3 seconds
            return () => clearTimeout(timer);
        }
        setShowArrow(false);
    }, [isOpen]);

    const updatePopupPosition = () => {
        if (!iconRef.current) return;

        const iconRect = iconRef.current.getBoundingClientRect();
        const spaceAbove = iconRect.top;
        const popupHeight = 300;
        const topPosition = spaceAbove > popupHeight ? iconRect.top - popupHeight - 10 : iconRect.bottom + 10;
        const leftOffset = iconRect.right + 10;

        setPopupPosition({ top: topPosition, left: leftOffset });
    };

    const updateArrowPosition = () => {
        if (iconRef.current && popupRef.current) {
            const iconRect = iconRef.current.getBoundingClientRect();
            const popupRect = popupRef.current.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;
            const popupCenterX = popupRect.left + popupRect.width / 2;
            const popupCenterY = popupRect.top + popupRect.height / 2;

            setArrowPosition({
                top: iconCenterY,
                left: iconCenterX,
                endTop: popupCenterY,
                endLeft: popupCenterX,
            });
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
                    <div className="p-4">
                        <p className="text-lg font-semibold">Let's get in touch!</p>
                        <p>Get ready to hire talent 66% faster with NiDDik.</p>
                        <Link href="/request-demo" onClick={handleNavigation} className="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                            Request A Demo
                        </Link>
                    </div>
                );
            case 'role':
                return (
                    <div className="p-4">
                        <p className="text-lg font-semibold">You're in the right place!</p>
                        <p>Learn more about how to join NiDDik as a certified technologist.</p>
                        <Link href="/careers" onClick={handleNavigation} className="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                            Learn More
                        </Link>
                    </div>
                );
            case 'looking':
                return (
                    <div className="p-4">
                        <p className="text-lg font-semibold">Great, thanks for being here.</p>
                        <p>We recommend you start with Why NiDDik. You'll find everything you need to know.</p>
                        <Link href="/why-us" onClick={handleNavigation} className="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
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
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">What brings you to NiDDik?</h3>
                <p className="mb-4">We'd like to personalize your experience so you find what you're looking for!</p>
                <button onClick={() => handleChoice('hire')} className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2">
                    I want to hire talent
                </button>
                <button onClick={() => handleChoice('role')} className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2">
                    I am looking for my next role
                </button>
                <button onClick={() => handleChoice('looking')} className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                    I am looking around
                </button>
            </div>
        );
    };

    const calculateArrowStyle = () => {
        const { top, left, endTop, endLeft } = arrowPosition;
        const angle = (Math.atan2(endTop - top, endLeft - left) * 180) / Math.PI;
        const distance = Math.sqrt(Math.pow(endLeft - left, 2) + Math.pow(endTop - top, 2));

        return {
            top,
            left,
            width: distance,
            transformOrigin: '0 0',
            transform: `rotate(${angle}deg)`,
        };
    };

    return (
        <div>
            <div
                className={`fixed left-4 bottom-4 z-50 ${isBouncing ? 'animate-bounce' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                ref={iconRef}
            >
                <StickyIcon />
                {showArrow && (
                    <div className="arrow-container" style={calculateArrowStyle()}>
                        <div className="arrow"></div>
                    </div>
                )}
            </div>

            {isOpen && (
                <div
                    className="fixed bg-white rounded-lg shadow-xl z-50 w-80"
                    style={{
                        top: popupPosition.top,
                        left: popupPosition.left,
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

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementBarProps {
    text: string;
    linkText: string;
    linkUrl: string;
    bgColor?: string;
    textColor?: string;
}

export default function AnnouncementBar({ 
    text, 
    linkText, 
    linkUrl, 
    bgColor = "bg-andela-green", 
    textColor = "text-white",
}: AnnouncementBarProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleScroll = () => {
        setIsSticky(window.scrollY > 50);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${bgColor} ${textColor} w-full text-center py-2 h-auto fixed top-0 left-0 right-0 z-30 overflow-hidden`}
                    >
                        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                            <div className="flex-grow text-center mb-2 md:mb-0">
                                <p className="text-[12px] leading-[1.2] md:text-base">
                                    {text} {' '}
                                    <Link href={linkUrl} className={`font-bold underline ${textColor} hover:opacity-80`}>
                                        {linkText}
                                    </Link>
                                </p>
                            </div>
                            <button 
                                onClick={handleClose}
                                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Close announcement"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Buttons for Mobile */}
            {isSticky && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around z-50">
                    <button 
                        onClick={toggleDrawer} // Open the drawer
                        className="bg-andela-green text-white rounded-md px-4 py-2"
                    >
                        Sign In
                    </button>
                    <Link 
                        href="/careers" // Link to the careers page
                        className="bg-andela-blue text-white rounded-md px-4 py-2"
                    >
                        Apply Now
                    </Link>
                </div>
            )}

            {/* Right Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6 flex flex-col rounded-l-2xl"
                        style={{
                            backgroundColor: '#f9fafb',
                            boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
                            <button onClick={toggleDrawer} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            Choose your sign-in method to continue.
                        </p>
                        <div className="flex flex-col space-y-4 mb-8">
                            <Link
                                href="/admin"
                                className="block py-3 px-6 text-white rounded-md hover:bg-opacity-90 transition-colors text-center font-medium"
                                style={{ backgroundColor: '#16a34a' }}
                            >
                                Sign in as Admin/Member
                            </Link>
                            <Link 
                                href="/auth" 
                                className="block py-3 px-6 text-white rounded-md hover:bg-opacity-90 transition-colors text-center font-medium"
                                style={{ backgroundColor: '#3b82f6' }}
                            >
                                Sign in as Candidate
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

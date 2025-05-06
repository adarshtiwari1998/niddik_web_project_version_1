import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnouncementBarProps {
  text: string;
  linkText: string;
  linkUrl: string;
  bgColor?: string;
  textColor?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export default function AnnouncementBar({ 
  text, 
  linkText, 
  linkUrl, 
  bgColor = "bg-andela-green", 
  textColor = "text-white",
  onVisibilityChange
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Notify parent component when visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`${bgColor} ${textColor} w-full text-center py-2 h-10 fixed top-0 left-0 right-0 z-50`}
        >
          <div className="container mx-auto px-4 flex justify-center items-center">
            <p className="text-sm md:text-base">
              {text}{' '}
              <Link href={linkUrl} className={`font-bold underline ${textColor} hover:opacity-80`}>
                {linkText}
              </Link>
            </p>
            <button 
              onClick={handleClose}
              className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
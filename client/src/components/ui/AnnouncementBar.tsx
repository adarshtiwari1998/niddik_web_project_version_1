import { Linkedin, Youtube } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="bg-andela-green text-white py-2 px-4 text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Startup India logo */}
        <div className="flex items-center">
          <img 
            src="/images/startupindia-badge.png" 
            alt="Startup India" 
            className="h-6 w-auto"
          />
        </div>
        
        {/* Center - Message */}
        <div className="flex-1 text-center mx-4">
          <span className="font-medium">
            Download our new whitepaper on scaling tech teams effectively. 
            <a href="/whitepaper" className="underline hover:no-underline ml-1">
              Get it now
            </a>
          </span>
        </div>
        
        {/* Right side - Social media icons */}
        <div className="flex items-center space-x-3">
          <a 
            href="https://linkedin.com/company/niddik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="https://youtube.com/@niddik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
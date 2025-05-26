import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustedCompanies from "@/components/sections/TrustedCompanies";
import ForBusinesses from "@/components/sections/ForBusinesses";
import ForTechnologists from "@/components/sections/ForTechnologists";
import SuccessStories from "@/components/sections/SuccessStories";
import HowItWorks from "@/components/sections/HowItWorks";
import FocusScrollSection from "@/components/sections/FocusScrollSection";

import ContactSection from "@/components/sections/ContactSection";
import BenefitsStrengthsShowcase from "@/components/sections/BenefitsStrengthsShowcase";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Home = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  return (
    <div className="min-h-screen overflow-x-hidden pt-0"> {/* Removed padding-top */}
      {/* Fixed header components */}
      <AnnouncementBar 
        text="Download our new whitepaper on scaling tech teams effectively."
        linkText="Get it now"
        linkUrl="/whitepaper"
        bgColor="bg-green-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Add minimal padding to account for fixed elements - no background for transparency */}
      <div className={`${isAnnouncementVisible ? 'pt-[0px]' : 'pt-[40px]'} transition-all duration-300`} style={{ background: 'none', backgroundColor: 'transparent' }}>
        <main>
          <Hero />
          <TrustedCompanies />
          <FocusScrollSection />
          <BenefitsStrengthsShowcase />
          <ServicesShowcase />
          <ForBusinesses />
          <ForTechnologists />
          <SuccessStories />
          <HowItWorks />

          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;

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

      {/* Add minimal padding to account for fixed elements */}
      <div className={`${isAnnouncementVisible ? 'pt-[80px]' : 'pt-[40px]'} transition-all duration-300`}>
        <main>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover hero-video"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay with subtle blur effect */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </section>
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
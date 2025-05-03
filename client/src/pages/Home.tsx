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
import FeaturedCaseStudy from "@/components/sections/FeaturedCaseStudy";
import ContactSection from "@/components/sections/ContactSection";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Home = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Fixed header components */}
      <div className="fixed-header-group w-full z-50">
        <AnnouncementBar 
          text="Join our upcoming webinar on scaling tech teams effectively."
          linkText="Register now"
          linkUrl="#"
          bgColor="bg-indigo-600"
          textColor="text-white"
          onVisibilityChange={handleAnnouncementVisibilityChange}
        />
      </div>
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Add padding to account for fixed elements */}
      <div className={`${isAnnouncementVisible ? 'pt-28' : 'pt-20'} transition-all duration-300`}>
        <main>
          <Hero />
          <ForBusinesses />
          <ForTechnologists />
          <TrustedCompanies />
          <FocusScrollSection />
          <SuccessStories />
          <HowItWorks />
          <FeaturedCaseStudy />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;

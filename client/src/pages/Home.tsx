import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustedCompanies from "@/components/sections/TrustedCompanies";
import ForBusinesses from "@/components/sections/ForBusinesses";
import ForTechnologists from "@/components/sections/ForTechnologists";
import SuccessStories from "@/components/sections/SuccessStories";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedCaseStudy from "@/components/sections/FeaturedCaseStudy";
import ContactSection from "@/components/sections/ContactSection";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar 
        text="Join our upcoming webinar on scaling tech teams effectively."
        linkText="Register now"
        linkUrl="#"
        bgColor="bg-indigo-600"
        textColor="text-white"
      />
      <Navbar />
      <main>
        <Hero />
        <TrustedCompanies />
        <ForBusinesses />
        <ForTechnologists />
        <SuccessStories />
        <HowItWorks />
        <FeaturedCaseStudy />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

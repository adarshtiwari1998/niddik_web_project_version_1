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

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
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

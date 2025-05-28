
import { motion } from "framer-motion";
import { useState } from "react";
import { Cookie, Calendar, Clock } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const CookiePolicy = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const lastUpdated = "January 26, 2025";

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Learn about how we use cookies to improve your experience"
        linkText="Contact Us"
        linkUrl="/contact"
        bgColor="bg-gradient-to-r from-orange-600 to-red-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100">
                <Cookie className="w-10 h-10 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
              Cookie Policy
            </h1>
            
            {/* Last Updated Section */}
            <div className="flex items-center justify-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Effective Date: {lastUpdated}</span>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              This Cookie Policy explains how NIDDIK uses cookies and similar technologies to recognize you when you visit our platform.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">1. What Are Cookies?</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                    Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
                    as well as to provide reporting information.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">2. How We Use Cookies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use cookies for several reasons:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide secure login functionality</li>
                    <li>To remember your preferences and settings</li>
                    <li>To analyze how our website is used</li>
                    <li>To improve website performance and user experience</li>
                    <li>To provide personalized content and recommendations</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">3. Types of Cookies We Use</h2>
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                    <p>These cookies allow us to count visits and traffic sources to measure and improve website performance.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Functional Cookies</h3>
                    <p>These cookies enable the website to provide enhanced functionality and personalization.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Targeting Cookies</h3>
                    <p>These cookies may be set through our site by advertising partners to build a profile of your interests.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">4. Managing Cookies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    You can control and/or delete cookies as you wish. You can delete all cookies that are already on your 
                    computer and you can set most browsers to prevent them from being placed.
                  </p>
                  <p>
                    However, if you do this, you may have to manually adjust some preferences every time you visit a site 
                    and some services and functionalities may not work.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">5. Third-Party Cookies</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    In some special cases, we also use cookies provided by trusted third parties. The following section 
                    details which third-party cookies you might encounter through this site:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics for website usage analytics</li>
                    <li>Social media platforms for social sharing functionality</li>
                    <li>Content delivery networks for improved performance</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">6. Updates to This Policy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use 
                    or for other operational, legal, or regulatory reasons.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">7. Contact Us</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about our use of cookies or other technologies, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>Email:</strong> cookies@niddik.com</p>
                    <p><strong>Address:</strong> NIDDIK (An IT Division of NIDDIKKARE LLP)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;

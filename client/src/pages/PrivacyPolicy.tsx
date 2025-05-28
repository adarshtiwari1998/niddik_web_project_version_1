
import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Calendar, Clock } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const PrivacyPolicy = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const lastUpdated = "January 26, 2025";

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Your privacy is important to us - Learn about how we protect your data"
        linkText="Contact Us"
        linkUrl="/contact"
        bgColor="bg-gradient-to-r from-green-600 to-blue-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-green-100 to-blue-100">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Privacy Policy
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
              At NIDDIK, we are committed to protecting your privacy and ensuring the security of your personal information.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Information We Collect</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    apply for jobs, request demos, or contact us for support.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Professional information (resume, work experience, skills)</li>
                    <li>Account credentials and preferences</li>
                    <li>Communication records and feedback</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">2. How We Use Your Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and improve our recruitment services</li>
                    <li>Match candidates with suitable job opportunities</li>
                    <li>Communicate with you about our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Protect against fraud and ensure security</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">3. Information Sharing</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may share your information with prospective employers when you apply for jobs 
                    through our platform. We do not sell your personal information to third parties.
                  </p>
                  <p>
                    We may also share information when required by law or to protect our rights and safety.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">4. Data Security</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">5. Your Rights</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>File a complaint with supervisory authorities</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">6. Contact Us</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>Email:</strong> privacy@niddik.com</p>
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

export default PrivacyPolicy;

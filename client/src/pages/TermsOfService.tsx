
import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, Calendar, Clock } from "lucide-react";
import Container from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const TermsOfService = () => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  const handleAnnouncementVisibilityChange = (isVisible: boolean) => {
    setIsAnnouncementVisible(isVisible);
  };

  const lastUpdated = "January 26, 2025";

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        text="Read our Terms of Service to understand your rights and responsibilities"
        linkText="Contact Us"
        linkUrl="/contact"
        bgColor="bg-gradient-to-r from-purple-600 to-blue-600" 
        textColor="text-white"
        onVisibilityChange={handleAnnouncementVisibilityChange}
      />
      <Navbar hasAnnouncementAbove={isAnnouncementVisible} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-blue-100">
                <FileText className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Terms of Service
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
              These Terms of Service govern your use of NIDDIK's platform and services.
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By accessing and using NIDDIK's services, you accept and agree to be bound by the 
                    terms and provision of this agreement.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">2. Use License</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Permission is granted to temporarily use NIDDIK's platform for personal, 
                    non-commercial transitory viewing only.
                  </p>
                  <p>This license shall automatically terminate if you violate any of these restrictions.</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">3. User Accounts</h2>
                <div className="space-y-4 text-gray-700">
                  <p>When creating an account, you must provide accurate and complete information.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">4. Prohibited Uses</h2>
                <div className="space-y-4 text-gray-700">
                  <p>You may not use our service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">5. Service Availability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    We reserve the right to withdraw or amend our service, and any service or material 
                    we provide on the platform, without notice.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">6. Limitation of Liability</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    In no event shall NIDDIK or its suppliers be liable for any damages arising out of 
                    the use or inability to use the materials on NIDDIK's platform.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">7. Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p><strong>Email:</strong> legal@niddik.com</p>
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

export default TermsOfService;

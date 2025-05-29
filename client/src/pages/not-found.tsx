
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  return (
    <>
      <SEO 
        title="Page Not Found - 404 Error | NIDDIK"
        description="The page you're looking for doesn't exist. Return to NIDDIK's homepage to explore our IT recruitment services and job opportunities."
        keywords="404 error, page not found, NIDDIK, IT recruitment"
        robotsDirective="noindex,nofollow"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              {/* 404 Illustration */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="text-8xl font-bold text-blue-100 select-none">404</div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <AlertTriangle className="w-16 h-16 text-orange-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Oops! Page Not Found
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  The page you're looking for seems to have vanished into the digital void.
                </p>
                <p className="text-sm text-gray-500">
                  Don't worry, even the best developers encounter 404s sometimes!
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link href="/careers">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>

                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => window.history.back()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </motion.div>

              {/* Helpful Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/about-us" className="text-blue-600 hover:text-blue-800 hover:underline">
                    About Us
                  </Link>
                  <Link href="/services" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Our Services
                  </Link>
                  <Link href="/contact-us" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Contact Us
                  </Link>
                  <Link href="/request-demo" className="text-blue-600 hover:text-blue-800 hover:underline">
                    Request Demo
                  </Link>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;

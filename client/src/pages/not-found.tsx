
import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <>
      <SEO 
        fallback={{
          pageTitle: "404 - Page Not Found | Niddik",
          metaDescription: "The page you're looking for doesn't exist. Return to Niddik's homepage to explore our IT recruitment and staffing solutions.",
          robotsDirective: "noindex,nofollow"
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the digital wilderness.
            </p>
            <p className="text-sm text-gray-500">
              Don't worry, even the best explorers sometimes take a wrong turn.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/careers')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              Browse Jobs
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Popular Pages</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <button 
                  onClick={() => navigate('/about-us')}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  About Us
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Our Services
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Contact Us
                </button>
                <button 
                  onClick={() => navigate('/request-demo')}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Request Demo
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <div className="mt-8 text-xs text-gray-400">
            <p>Error Code: 404 | Page Not Found</p>
          </div>
        </div>
      </div>
    </>
  );
}

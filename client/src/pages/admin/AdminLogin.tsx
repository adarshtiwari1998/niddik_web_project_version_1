import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield, Clock } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useToast } from "@/hooks/use-toast";
import { setAuthToken, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Helmet } from 'react-helmet-async';

const AdminLogin = () => {
  return (
    <>
      <Helmet>
        <title>Admin Login | Niddik</title>
        <meta name="description" content="Secure login portal for Niddik administrators." />
        <meta property="og:title" content="Admin Login | Niddik" />
        <meta property="og:description" content="Secure login portal for Niddik administrators." />
      </Helmet>
    
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col items-start pt-2 pb-2">
              <div className="flex flex-col items-center">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="NiDDiK Logo" 
                  className="h-10"
                />
                <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div>
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/careers" className="text-sm font-medium hover:text-primary">
                Browse Jobs
              </Link>
              <Link href="/about-us" className="text-sm font-medium hover:text-primary">
                About Us
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-600 text-white rounded-md px-3 py-1 text-xs font-medium">
              Admin Area
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the administrator dashboard
            </CardDescription>
          </CardHeader>
          
        </div>
      </div>
    </div>
    </>
  );
}

export default AdminLogin;
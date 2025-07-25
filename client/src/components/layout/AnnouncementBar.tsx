import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Briefcase, Users, Clock, Activity, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface AnnouncementBarProps {
    text: string;
    linkText: string;
    linkUrl: string;
    bgColor?: string;
    textColor?: string;
    onVisibilityChange?: (isVisible: boolean) => void;
}

export default function AnnouncementBar({ 
    text, 
    linkText, 
    linkUrl, 
    bgColor = "bg-andela-green", 
    textColor = "text-white",
    onVisibilityChange
}: AnnouncementBarProps) {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Admin stats queries
    const { data: jobsData } = useQuery<{ data: any[] }>({
        queryKey: ['/api/job-listings', { page: 1, limit: 1000 }],
        queryFn: getQueryFn({ on401: "returnNull" }),
        enabled: !!user && user.role === 'admin' && isDrawerOpen,
        staleTime: 5 * 60 * 1000,
    });

    const { data: applicationsData } = useQuery<{ data: any[] }>({
        queryKey: ['/api/admin/applications'],
        queryFn: getQueryFn({ on401: "returnNull" }),
        enabled: !!user && user.role === 'admin' && isDrawerOpen,
        staleTime: 5 * 60 * 1000,
    });

    // Candidate stats queries
    const { data: candidateApplicationsData } = useQuery<{ data: any[] }>({
        queryKey: ['/api/my-applications'],
        queryFn: getQueryFn({ on401: "returnNull" }),
        enabled: !!user && user.role !== 'admin' && isDrawerOpen,
        staleTime: 5 * 60 * 1000,
    });

    const { data: recentJobsData } = useQuery<{ data: any[] }>({
        queryKey: ['/api/job-listings/recent', 5],
        queryFn: getQueryFn({ on401: "returnNull" }),
        enabled: !!user && user.role !== 'admin' && isDrawerOpen,
        staleTime: 5 * 60 * 1000,
    });

    // Calculate stats
    const adminStats = user?.role === 'admin' ? {
        totalJobs: jobsData?.data?.length || 0,
        activeJobs: jobsData?.data?.filter(job => job.status === 'active')?.length || 0,
        totalApplications: applicationsData?.data?.length || 0,
        newApplications: applicationsData?.data?.filter(app => app.status === 'new')?.length || 0,
    } : null;

    const candidateStats = user?.role !== 'admin' ? {
        totalApplications: candidateApplicationsData?.data?.length || 0,
        newApplications: candidateApplicationsData?.data?.filter(app => app.status === 'new')?.length || 0,
        interviewStage: candidateApplicationsData?.data?.filter(app => app.status === 'interview')?.length || 0,
        availableJobs: recentJobsData?.data?.length || 0,
    } : null;

    const handleClose = () => {
        setIsVisible(false);
        setShowContactInfo(true);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };


    useEffect(() => {
      const handleScroll = () => {
          setIsSticky(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
          window.removeEventListener("scroll", handleScroll);
      };
  }, []);

    return (
        <AnimatePresence mode="wait">
            {/* Conditionally render the entire motion.div */}
            {isVisible ? (
               <motion.div
               key="announcement-bar"
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 0.3 }}
               className={`${bgColor} ${textColor} w-full text-center py-2 h-auto fixed top-0 left-0 right-0 z-40 overflow-hidden`}
           >
               <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between items-center">
                   {/* Announcement Text (Centered) */}
                   <div className="flex-grow text-center mb-2 md:mb-0">
                       <p className="text-[12px] leading-[1.2] md:text-base">
                           {text}{' '}
                           <Link href={linkUrl} className={`font-bold underline ${textColor} hover:opacity-80`}>
                               {linkText}
                           </Link>
                       </p>
                   </div>

                   {/* Buttons Container */}
                   <div className="hidden md:flex items-center space-x-2">
                       {/* Startup India Logo */}
                       <div className="flex items-center mr-2">
                           <div className="bg-gray-100 rounded-md p-1.5 border border-gray-200">
                               <img 
                                   src="/images/startupindia-badge.png" 
                                   alt="Startup India" 
                                   className="h-4 w-auto block"
                               />
                           </div>
                       </div>

                       {/* Sign In Button (Opens Drawer) */}
                       <div className="relative group z-50">
                           <div 
                               className="hover:opacity-80 transition-opacity flex items-center cursor-pointer"
                               onClick={toggleDrawer}
                           >
                               <span className="mr-1">{user ? 'Dashboard' : 'Sign In'}</span>
                               <ChevronDown className="w-4 h-4" />
                           </div>
                       </div>

                       {/* Close Button */}
                       <button 
                           onClick={handleClose}
                           className="p-1 rounded-full hover:bg-white/20 transition-colors"
                           aria-label="Close announcement"
                       >
                           <X className="h-4 w-4" />
                       </button>
                   </div>
               </div>
           </motion.div>
            ) : (
                showContactInfo && (
                    <motion.div
                        key="contact-info"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${bgColor} ${textColor} w-full py-2 fixed top-0 left-0 right-0 z-50 overflow-hidden`}
                    >
                   <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-center"> {/* Center items on mobile and justify on desktop */}
                            {/* Contact Info (Left) */}
                            <div className="px-4 flex items-center text-left mb-2 md:mb-0">
                                <h3 className="hidden md:block text-lg font-semibold text-white mr-4">Need Assistance?</h3>
                                <p className="text-white text-sm mr-4">
                                    <a href="mailto:info@niddik.com" className="text-blue-200 hover:underline">info@niddik.com</a>
                                </p>
                                <p className="text-white text-sm mr-4 hidden md:block">
                                    +91 9717312058 (INDIA) | +1 (646) 889-9517 (USA)
                                </p>
                                {/* Sign In Button (Mobile) */}
                                <div className="relative group z-50 md:hidden">
                                    <div className="hover:opacity-80 transition-opacity flex items-center cursor-pointer" onClick={toggleDrawer}>
                                        <span className="mr-1">{user ? 'Dashboard' : 'Sign In'}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Whitepaper Link and Sign In (Right) */}
                            <div className="flex items-center">
                                <Link 
                                    href="/whitepaper"
                                    className={`text-white text-sm hover:underline mr-4 mb-2 md:mb-0 hidden md:block`}
                                >
                                    Read Whitepaper
                                </Link>
                                {/* Sign In Button (Desktop) */}
                                <div className="relative group z-50 hidden md:block">
                                    <div className="hover:opacity-80 transition-opacity flex items-center cursor-pointer" onClick={toggleDrawer}>
                                        <span className="mr-1">{user ? 'Dashboard' : 'Sign In'}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            )}

             {/* Sticky Buttons for Mobile Only */}
             {isSticky && (
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between z-30 md:hidden">
                    {user ? (
                        // Show dashboard button for authenticated users
                        <Link 
                            href={user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard'}
                            className="bg-andela-green text-white rounded-md flex-1 py-4 mx-1 text-center flex items-center justify-center"
                        >
                            {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                        </Link>
                    ) : (
                        // Show sign in button for non-authenticated users
                        <button 
                            onClick={toggleDrawer} // Open the drawer
                            className="bg-andela-green text-white rounded-md flex-1 py-4 mx-1"
                        >
                            Sign In
                        </button>
                    )}
                    <Link 
                        href="/careers" // Link to the careers page
                        className="bg-andela-blue text-white rounded-md flex-1 py-4 mx-1 text-center flex items-center justify-center"
                    >
                        {user && user.role !== 'admin' ? 'Browse Jobs' : 'Apply Now'}
                    </Link>
                </div>
            )}

            {/* Right Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        key="sign-in-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6 flex flex-col rounded-l-2xl"
                        style={{
                            backgroundColor: '#f9fafb',
                            boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {user ? `Welcome, ${user.fullName}!` : 'Welcome Back!'}
                            </h2>
                            <button onClick={toggleDrawer} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">
                            {user ? 'Access your dashboard to continue.' : 'Choose your sign-in method to continue.'}
                        </p>

                        {/* Stats Cards for Authenticated Users */}
                        {user && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-800 mb-3">Quick Stats</h3>
                                {user.role === 'admin' && adminStats ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center">
                                                <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-blue-700">{adminStats.activeJobs}</div>
                                                    <div className="text-xs text-blue-600">Active Jobs</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 text-green-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-green-700">{adminStats.totalApplications}</div>
                                                    <div className="text-xs text-green-600">Candidates</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-orange-700">{adminStats.newApplications}</div>
                                                    <div className="text-xs text-orange-600">New Apps</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                            <div className="flex items-center">
                                                <TrendingUp className="h-4 w-4 text-purple-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-purple-700">{adminStats.totalJobs}</div>
                                                    <div className="text-xs text-purple-600">Total Jobs</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : candidateStats ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center">
                                                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-blue-700">{candidateStats.totalApplications}</div>
                                                    <div className="text-xs text-blue-600">My Apps</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <div className="flex items-center">
                                                <Activity className="h-4 w-4 text-green-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-green-700">{candidateStats.interviewStage}</div>
                                                    <div className="text-xs text-green-600">Interviews</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-orange-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-orange-700">{candidateStats.newApplications}</div>
                                                    <div className="text-xs text-orange-600">Pending</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                            <div className="flex items-center">
                                                <Briefcase className="h-4 w-4 text-purple-600 mr-2" />
                                                <div>
                                                    <div className="text-lg font-semibold text-purple-700">{candidateStats.availableJobs}</div>
                                                    <div className="text-xs text-purple-600">New Jobs</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        <div className="flex flex-col space-y-4 mb-8">
                            {user ? (
                                // Show dashboard link based on user role
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard'}
                                    className="block py-3 px-6 text-white rounded-md hover:bg-opacity-90 transition-colors text-center font-medium"
                                    style={{ backgroundColor: user.role === 'admin' ? '#16a34a' : '#3b82f6' }}
                                >
                                    Go to {user.role === 'admin' ? 'Admin' : 'Candidate'} Dashboard
                                </Link>
                            ) : (
                                // Show sign-in options for non-authenticated users
                                <>
                                    <Link
                                        href="/admin"
                                        className="block py-3 px-6 text-white rounded-md hover:bg-opacity-90 transition-colors text-center font-medium"
                                        style={{ backgroundColor: '#16a34a' }}
                                    >
                                        Sign in as Admin/Member
                                    </Link>
                                    <Link 
                                        href="/auth" 
                                        className="block py-3 px-6 text-white rounded-md hover:bg-opacity-90 transition-colors text-center font-medium"
                                        style={{ backgroundColor: '#3b82f6' }}
                                    >
                                        Sign in as Candidate
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}
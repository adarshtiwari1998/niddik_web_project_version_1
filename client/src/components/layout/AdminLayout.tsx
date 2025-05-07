import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileText, Settings, ChevronRight, LogOut, Shield, Loader2, CalendarClock } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const location = _; // Current path
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    // Show loading screen immediately
    setIsLoggingOut(true);
    
    // Store a flag in sessionStorage that the login page will check
    sessionStorage.setItem('admin_login_after_logout', 'true');
    
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // We're still using the setTimeout to ensure the loading screen
        // is visible for a moment before redirecting
        setTimeout(() => {
          // This will redirect without a page reload
          setLocation("/admin/login");
          
          // Set a flag that the login page will check on mount
          // The loading screen will stay visible until the login page mounts
          sessionStorage.setItem('admin_login_after_logout', 'true');
        }, 800);
      },
      onError: (error) => {
        console.error("Logout error:", error);
        setIsLoggingOut(false);
        // If there's an error, clear the flag
        sessionStorage.removeItem('admin_login_after_logout');
      }
    });
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoggingOut && <LoadingScreen message="Logging out..." />}
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/admin/dashboard">
            <div className="flex flex-col cursor-pointer">
              <div className="flex items-center">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="Niddik Logo" 
                  className="h-10 mr-2" 
                />
                <h1 className="text-xl font-bold">Admin</h1>
              </div>
              <p className="text-sm text-gray-500 ml-1">Connecting People, Changing Lives</p>
            </div>
          </Link>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
              <span className="text-sm font-medium">Admin Area</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Admin Menu</CardTitle>
                <CardDescription>Manage your talent platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link href="/admin/dashboard">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/dashboard" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <User className="h-4 w-4 mr-3 text-primary" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link href="/admin/jobs">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/jobs" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <FileText className="h-4 w-4 mr-3 text-primary" />
                      <span>Manage Job Listings</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/admin/candidates">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/candidates" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <User className="h-4 w-4 mr-3 text-primary" />
                      <span>Candidates</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/admin/submitted-candidates">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/submitted-candidates" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <FileText className="h-4 w-4 mr-3 text-primary" />
                      <span>Submitted Candidates</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/admin/demo-requests">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/demo-requests" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <CalendarClock className="h-4 w-4 mr-3 text-primary" />
                      <span>Demo Requests</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/admin/dashboard">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      false // Account settings is part of dashboard tabs
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                      <Settings className="h-4 w-4 mr-3 text-primary" />
                      <span>Account Settings</span>
                    </div>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
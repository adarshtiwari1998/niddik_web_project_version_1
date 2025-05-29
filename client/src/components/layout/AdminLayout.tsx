import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, List, Home, FileText, Settings, ChevronRight, LogOut, Shield, Loader2, CalendarClock, Menu, X, Mail, Globe } from "lucide-react";
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

  // Sidebar state management
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  // Navigation handler for home page
  const handleHomeNavigation = () => {
    setLocation("/");
  };

  // Navigation handler for dashboard with tab routing
  const handleDashboardNavigation = () => {
    setLocation("/admin/dashboard");
    // Force a page reload to ensure proper tab state initialization
    setTimeout(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 10);
  };

  // Navigation handler for account settings with tab routing
  const handleAccountSettingsNavigation = () => {
    setLocation("/admin/dashboard?tab=account");
    // Force a page reload to ensure proper tab state initialization
    setTimeout(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 10);
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isLoggingOut && <LoadingScreen message="Logging out..." />}

      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
          <div className="flex items-center min-w-0 flex-1">
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="mr-2 sm:mr-3 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            >
              {isCollapsed ? <Menu className="h-4 w-4 sm:h-5 sm:w-5" /> : <X className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            <Link href="/admin/dashboard">
              <div className="flex items-center cursor-pointer min-w-0">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="Niddik Logo" 
                  className="h-7 sm:h-10 mr-1 sm:mr-2 flex-shrink-0" 
                />
                <h1 className="text-lg sm:text-xl font-bold truncate">Admin</h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center flex-shrink-0">
            <div className="hidden sm:flex items-center mr-4">
              <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
              <span className="text-sm font-medium">Admin Area</span>
            </div>
            <Button variant="ghost" onClick={handleLogout} size="sm" className="p-1.5 sm:p-2">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-[72px] sm:pt-[88px]">
        {/* Collapsible Sidebar */}
        <div className={`${isCollapsed ? 'w-12 sm:w-16' : 'w-64 sm:w-[276px]'} fixed left-0 top-[72px] sm:top-[88px] h-[calc(100vh-72px)] sm:h-[calc(100vh-88px)] transition-all duration-300 ease-in-out z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <div className="h-full overflow-y-auto">
            <div className={`p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'px-1 sm:px-2' : ''}`}>
              {!isCollapsed && (
                <>
                  <h2 className="text-base sm:text-lg font-semibold">Admin Menu</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage your talent platform</p>
                </>
              )}
              {isCollapsed && (
                <div className="flex justify-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              )}
            </div>

            <nav className="p-1 sm:p-2">
              {/* Home */}
              <div 
                onClick={handleHomeNavigation}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/"
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Home" : ""}
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                {!isCollapsed && <span className="ml-2 sm:ml-3 text-sm sm:text-base">Home</span>}
              </div>
              {/* Careers */}
              <div 
                onClick={handleHomeNavigation}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/careers"
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Careers" : ""}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                {!isCollapsed && <span className="ml-2 sm:ml-3 text-sm sm:text-base">Careers</span>}
              </div>
              {/* Dashboard */}
              <div 
                onClick={handleDashboardNavigation}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  (location === "/admin/dashboard" && !window.location.search.includes('tab='))
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Dashboard" : ""}
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                {!isCollapsed && <span className="ml-2 sm:ml-3 text-sm sm:text-base">Dashboard</span>}
              </div>

              {/* Manage Job Listings */}
              <Link href="/admin/jobs">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/jobs" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Manage Job Listings" : ""}
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Manage Job Listings</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Candidates */}
              <Link href="/admin/candidates">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/candidates" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Candidates" : ""}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Candidates</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Submitted Candidates */}
              <Link href="/admin/submitted-candidates">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/submitted-candidates" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Submitted Candidates" : ""}
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Submitted Candidates</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Users Management */}
              <Link href="/admin/users">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/users" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Users Management" : ""}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Users Management</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Demo Requests */}
              <Link href="/admin/demo-requests">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/demo-requests" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Demo Requests" : ""}
                >
                  <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Demo Requests</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Contact Submissions */}
              <Link href="/admin/contact-submissions">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/contact-submissions" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Contact Submissions" : ""}
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">Contact Submissions</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* SEO Pages */}
              <Link href="/admin/seo-pages">
                <div className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  location === "/admin/seo-pages" 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "SEO Pages" : ""}
                >
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 sm:ml-3 text-sm sm:text-base">SEO Pages</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                    </>
                  )}
                </div>
              </Link>

              {/* Account Settings */}
              <div 
                onClick={handleAccountSettingsNavigation}
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mb-1 rounded-md transition-colors cursor-pointer ${
                  (location === "/admin/dashboard" && window.location.search.includes('tab=account'))
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Account Settings" : ""}
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                {!isCollapsed && <span className="ml-2 sm:ml-3 text-sm sm:text-base">Account Settings</span>}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out`} style={{
          marginLeft: isCollapsed ? '48px' : '256px',
          width: isCollapsed ? 'calc(100% - 48px)' : 'calc(100% - 256px)'
        }}>
          {/* Page Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
                  {description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{description}</p>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="px-6 py-4 sm:px-8 sm:py-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-145px)] sm:min-h-[calc(100vh-161px)] w-full">
            <div className="w-full max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
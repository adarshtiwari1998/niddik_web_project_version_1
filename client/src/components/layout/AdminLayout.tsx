import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileText, Settings, ChevronRight, LogOut, Shield, Loader2, CalendarClock, Menu, X } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const location = _; // Current path
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navigation handler that sets the appropriate tab
  const handleNavigation = (path: string, tab?: string) => {
    if (tab) {
      // Store the desired tab in sessionStorage
      sessionStorage.setItem('admin_dashboard_tab', tab);
    }
    setLocation(path);
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

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {isLoggingOut && <LoadingScreen message="Logging out..." />}
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b fixed top-0 left-0 right-0 z-50">
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

      <div className="container mx-auto px-4 py-8 mt-[88px] flex-1">
        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-[276px]'} transition-all duration-300 fixed left-4 top-[120px] bottom-8 z-40`}>
            <Card className="h-full flex flex-col">
              <CardHeader className={`pb-3 ${sidebarCollapsed ? 'px-2' : ''}`}>
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <div>
                      <CardTitle>Admin Menu</CardTitle>
                      <CardDescription>Manage your talent platform</CardDescription>
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="h-8 w-8 p-0"
                  >
                    {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                <nav className="flex flex-col">
                  <div
                    onClick={() => handleNavigation("/admin/dashboard", "overview")}
                    className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/dashboard" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <User className="h-4 w-4 text-primary" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="ml-3">Dashboard</span>
                      </>
                    )}
                  </div>
                  <Link href="/admin/jobs">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/jobs" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                      <FileText className="h-4 w-4 text-primary" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3">Manage Job Listings</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </>
                      )}
                    </div>
                  </Link>
                  <Link href="/admin/candidates">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/candidates" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                      <User className="h-4 w-4 text-primary" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3">Candidates</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </>
                      )}
                    </div>
                  </Link>
                  <Link href="/admin/submitted-candidates">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/submitted-candidates" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                      <FileText className="h-4 w-4 text-primary" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3">Submitted Candidates</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </>
                      )}
                    </div>
                  </Link>
                  <Link href="/admin/demo-requests">
                    <div className={`flex items-center px-4 py-3 transition-colors cursor-pointer ${
                      location === "/admin/demo-requests" 
                        ? "bg-gray-100 dark:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
                      <CalendarClock className="h-4 w-4 text-primary" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3">Demo Requests</span>
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </>
                      )}
                    </div>
                  </Link>
                  <div
                    onClick={() => handleNavigation("/admin/dashboard", "account")}
                    className={`flex items-center px-4 py-3 transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Settings className="h-4 w-4 text-primary" />
                    {!sidebarCollapsed && (
                      <span className="ml-3">Account Settings</span>
                    )}
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-[300px]'}`}>
            {title && (
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {description && <p className="text-muted-foreground">{description}</p>}
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
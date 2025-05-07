import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileText, Settings, ChevronRight, LogOut, Shield, Loader2 } from "lucide-react";
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
    setIsLoggingOut(true);
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 500);
      },
      onError: () => {
        setIsLoggingOut(false);
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard">
            <div className="flex items-center cursor-pointer">
              <Shield className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-xl font-bold">Niddik Admin</h1>
            </div>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
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
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Settings, ChevronRight, LogOut, Shield } from "lucide-react";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  // Redirect to login if not authenticated or not an admin
  if (!user || user.role !== "admin") {
    return null; // The ProtectedRoute component will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold">Niddik Admin</h1>
          </div>
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
                    <div className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <User className="h-4 w-4 mr-3 text-primary" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <Link href="/admin/jobs">
                    <div className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <FileText className="h-4 w-4 mr-3 text-primary" />
                      <span>Manage Job Listings</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/admin/dashboard">
                    <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 cursor-pointer">
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
            <Tabs defaultValue="account">
              <TabsList className="mb-4">
                <TabsTrigger value="account">Account Overview</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Account</CardTitle>
                    <CardDescription>
                      Admin account details and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Username</h4>
                          <p className="text-lg font-medium">{user.username}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                          <p className="text-lg font-medium">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h4>
                          <p className="text-lg font-medium">{user.fullName}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Role</h4>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            <p className="text-lg font-medium capitalize">{user.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="password">
                <AdminPasswordChange />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
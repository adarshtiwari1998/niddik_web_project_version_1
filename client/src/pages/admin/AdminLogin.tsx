import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setAuthToken } from "@/lib/queryClient";
import { format } from "date-fns";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [lastLogoutTime, setLastLogoutTime] = useState<string | null>(null);
  
  // Fetch last logout time
  useEffect(() => {
    const fetchLastLogout = async () => {
      try {
        const response = await fetch('/api/last-logout');
        if (response.ok) {
          const data = await response.json();
          if (data.lastLogout) {
            setLastLogoutTime(data.lastLogout);
          }
        }
      } catch (error) {
        console.error('Error fetching last logout time:', error);
      }
    };
    
    fetchLastLogout();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    try {
      loginMutation.mutate(
        { username, password },
        {
          onSuccess: (userData: any) => {
            if (userData.role !== 'admin') {
              toast({
                title: "Access denied",
                description: "You do not have administrator privileges",
                variant: "destructive"
              });
              return;
            }
            
            // Store JWT token if available
            if (userData.token) {
              setAuthToken(userData.token);
            }
            
            // Get redirect URL from query parameters if it exists
            const urlParams = new URLSearchParams(window.location.search);
            const redirectUrl = urlParams.get("redirect");
            
            // Store a loading flag in sessionStorage that the dashboard will check
            sessionStorage.setItem('admin_dashboard_loading', 'true');
            
            // Navigate immediately to admin dashboard or specified redirect URL
            setTimeout(() => {
              if (redirectUrl) {
                window.location.href = redirectUrl; // Force immediate navigation
              } else {
                window.location.href = "/admin/dashboard"; // Force immediate navigation
              }
            }, 100); // Tiny delay to ensure navigation happens
            
            toast({
              title: "Welcome back",
              description: "You have successfully logged in to the admin panel",
            });
          },
          onError: (error) => {
            console.error("Login error:", error);
            toast({
              title: "Login failed",
              description: error.message || "Invalid credentials. Please try again.",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
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
            {lastLogoutTime && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs mr-2">
                <Clock className="h-3 w-3" />
                <span>Last seen: {format(new Date(lastLogoutTime), "MMM d, yyyy h:mm a")}</span>
              </div>
            )}
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
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Signing in...
                  </>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
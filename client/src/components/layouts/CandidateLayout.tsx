import { ReactNode, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  BarChart3, 
  Briefcase, 
  FileText, 
  User, 
  LogOut,
  ChevronDown,
  Menu,
  Loader2
} from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface CandidateLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export default function CandidateLayout({ children, activeTab = "" }: CandidateLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    setIsLoggingOut(true);
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        setIsLoggingOut(false);
      },
      onError: (error) => {
        setIsLoggingOut(false);
        toast({
          title: "Logout failed",
          description: "An error occurred during logout",
          variant: "destructive",
        });
      }
    });
  };

  // First letter of user's name or username for avatar fallback
  const getInitial = () => {
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {isLoggingOut && <LoadingScreen message="Logging out..." />}
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex flex-col items-center">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="NiDDiK Logo" 
                  className="h-10" 
                />
                <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div>
              </div>
            </Link>
            <span className="text-sm text-muted-foreground border-l pl-4">Candidate Portal</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.resumeUrl || ""} alt={user.fullName || user.username} />
                    <AvatarFallback>{getInitial()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user.fullName || user.username}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/candidate/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/candidate/applications">
                  <DropdownMenuItem className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>My Applications</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="px-2 py-4 border-b">
                    <div className="flex flex-col mb-4">
                      <div className="flex flex-col items-center">
                        <img 
                          src="/images/niddik_logo.png" 
                          alt="NiDDiK Logo" 
                          className="h-10" 
                        />
                        <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.resumeUrl || ""} alt={user.fullName || user.username} />
                        <AvatarFallback>{getInitial()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.fullName || user.username}</h3>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <nav className="flex-1 px-2 py-4 space-y-2">
                    <Link href="/candidate/dashboard">
                      <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'overview' ? 'bg-muted font-medium' : ''}`}>
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link href="/candidate/applications">
                      <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'applications' ? 'bg-muted font-medium' : ''}`}>
                        <Briefcase className="h-4 w-4" />
                        <span>My Applications</span>
                      </div>
                    </Link>
                    <Link href="/candidate/jobs">
                      <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'jobs' ? 'bg-muted font-medium' : ''}`}>
                        <FileText className="h-4 w-4" />
                        <span>Job Listings</span>
                      </div>
                    </Link>
                    <Link href="/candidate/profile">
                      <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'profile' ? 'bg-muted font-medium' : ''}`}>
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                  </nav>
                  
                  <div className="px-2 py-4 mt-auto border-t">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 p-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-16 min-h-screen overflow-hidden">
        {/* Sidebar - Desktop only */}
        <div className="hidden md:block fixed left-0 top-16 w-64 border-r bg-background h-[calc(100vh-64px)] overflow-y-auto">
          <div className="w-full p-4">
            <div className="flex flex-col h-full">
              <nav className="space-y-1">
                <Link href="/candidate/dashboard">
                  <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'overview' ? 'bg-muted font-medium' : ''}`}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link href="/candidate/applications">
                  <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'applications' ? 'bg-muted font-medium' : ''}`}>
                    <Briefcase className="h-4 w-4" />
                    <span>My Applications</span>
                  </div>
                </Link>
                <Link href="/candidate/jobs">
                  <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'jobs' ? 'bg-muted font-medium' : ''}`}>
                    <FileText className="h-4 w-4" />
                    <span>Job Listings</span>
                  </div>
                </Link>
                <Link href="/candidate/profile">
                  <div className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors ${activeTab === 'profile' ? 'bg-muted font-medium' : ''}`}>
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </div>
                </Link>
              </nav>
              
              <div className="pt-6 mt-auto border-t border-border">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 p-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 bg-background w-full relative z-[99]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 NiDDiK. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</span>
            </Link>
            <Link href="/contact">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  User, 
  LogOut, 
  Menu, 
  Calendar, 
  ChevronDown, 
  Clock,
  X,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function CareersHeader() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
      },
      onError: (error) => {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const formatLastLogout = (dateValue: string | Date | null) => {
    if (!dateValue) return '';

    const date = typeof dateValue === 'string' 
      ? new Date(dateValue) 
      : dateValue;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <header className="sticky top-0 z-50 flex justify-center w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex flex-col items-center">
                <img 
                  src="/images/niddik_logo.png" 
                  alt="NiDDiK Logo" 
                  className="h-10" 
                />
                {/* <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div> */}
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/careers" className="text-sm font-medium hover:text-primary">
                Browse Jobs
              </Link>
              <Link href="/about-us" className="text-sm font-medium hover:text-primary">
                About Us
              </Link>
              {user && user.role === 'admin' && (
                <>
                  <Link href="/admin/jobs" className="text-sm font-medium hover:text-primary">
                    Manage Job Listings
                  </Link>
                  <Link href="/admin/candidates" className="text-sm font-medium hover:text-primary">
                    Candidates
                  </Link>
                  <Link href="/admin/submitted-candidates" className="text-sm font-medium hover:text-primary">
                    Submitted Candidates
                  </Link>
                </>
              )}
              {user && user.role !== 'admin' && (
                <Link href="/candidate/applications" className="text-sm font-medium hover:text-primary">
                  My Applications
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user && user.lastLogout && (
                  <div className="hidden md:flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Last logout: {formatLastLogout(user.lastLogout)}</span>
                  </div>
                )}
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/candidate/dashboard'}>
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} 
                          alt={user.fullName} 
                        />
                        <AvatarFallback>{user.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {user.role === 'admin' ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/jobs" className="cursor-pointer w-full">
                            <Building className="mr-2 h-4 w-4" />
                            Manage Job Listings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/candidates" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            Candidates
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/submitted-candidates" className="cursor-pointer w-full">
                            <Building className="mr-2 h-4 w-4" />
                            Submitted Candidates
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            Users Management
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/demo-requests" className="cursor-pointer w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            Demo Requests
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/contact-submissions" className="cursor-pointer w-full">
                            <Building className="mr-2 h-4 w-4" />
                            Contact Submissions
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard?tab=account" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            Account Settings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/candidate/profile" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/candidate/applications" className="cursor-pointer w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            My Applications
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full" style="height: auto;
                  overflow: scroll;">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <Link href="/" className="flex flex-col items-start" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex flex-col items-center">
                        <img 
                          src="/images/niddik_logo.png" 
                          alt="NiDDiK Logo" 
                          className="h-10" 
                        />
                        <div className="text-[10px] text-gray-500 mt-0.5">Connecting People, Changing Lives</div>
                      </div>
                    </Link>
                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-4 py-4">
                    <Link 
                      href="/careers" 
                      className="px-2 py-1 text-lg font-medium hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Browse Jobs
                    </Link>
                    <Link 
                      href="/about-us" 
                      className="px-2 py-1 text-lg font-medium hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    {user && user.role === 'admin' && (
                      <>
                        <Link 
                          href="/admin/dashboard" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          href="/admin/jobs" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Manage Job Listings
                        </Link>
                        <Link 
                          href="/admin/candidates" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Candidates
                        </Link>
                        <Link 
                          href="/admin/submitted-candidates" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Submitted Candidates
                        </Link>
                        <Link 
                          href="/admin/users" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Users Management
                        </Link>
                        <Link 
                          href="/admin/demo-requests" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Demo Requests
                        </Link>
                        <Link 
                          href="/admin/contact-submissions" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Contact Submissions
                        </Link>
                      </>
                    )}
                    {user && user.role !== 'admin' && (
                      <>
                        <Link 
                          href="/candidate/dashboard" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          href="/candidate/applications" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Applications
                        </Link>
                        <Link 
                          href="/candidate/profile" 
                          className="px-2 py-1 text-lg font-medium hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </>
                    )}
                  </nav>

                  {user && user.lastLogout && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2 px-2">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Last logout: {formatLastLogout(user.lastLogout)}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t">
                    {user ? (
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }} 
                        className="w-full"
                        variant="outline"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        asChild
                      >
                        <Link href="/auth">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
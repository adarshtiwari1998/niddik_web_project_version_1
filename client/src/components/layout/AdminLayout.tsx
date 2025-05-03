import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageCircle, 
  Building2, 
  UserCircle, 
  Settings 
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { href: "/admin/jobs", label: "Job Listings", icon: <Briefcase className="w-4 h-4 mr-2" /> },
    { href: "/admin/contacts", label: "Contact Inquiries", icon: <MessageCircle className="w-4 h-4 mr-2" /> },
    { href: "/admin/clients", label: "Clients", icon: <Building2 className="w-4 h-4 mr-2" /> },
    { href: "/admin/testimonials", label: "Testimonials", icon: <UserCircle className="w-4 h-4 mr-2" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-primary">Admin Dashboard</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
              <UserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile navbar */}
      <div className="md:hidden w-full border-b bg-white dark:bg-gray-950 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            <span className="text-primary">Admin</span>
          </Link>
          <Button variant="outline" size="icon">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
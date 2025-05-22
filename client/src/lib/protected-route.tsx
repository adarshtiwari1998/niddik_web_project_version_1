import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Create a wrapper component that incorporates all our protection logic
  const ProtectedComponent = () => {
    const { user, isLoading } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    // Check both auth contexts - session storage and user state
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const userRole = sessionStorage.getItem('userRole');

    if (!isLoading && !user && !isAuthenticated) {
      // Clear any stale auth state
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userRole');
      window.location.href = `/admin/login?redirect=${encodeURIComponent(location)}`;
    }
  }, [user, isLoading, location]);

    useEffect(() => {
      // If there's a role mismatch, show a message and redirect
      if (user && requiredRole && user.role !== requiredRole) {
        // Stop multiple toasts from appearing
        if (!showRedirectMessage) {
          setShowRedirectMessage(true);

          // Show different messages based on user role and attempted access
          if (user.role === "admin" && (path.startsWith("/candidate") || requiredRole === "user")) {
            toast({
              title: "Access Restricted",
              description: "You are logged in as an administrator. Redirecting to admin dashboard.",
              variant: "default",
            });
            setRedirectPath("/admin/dashboard");
          } else if (user.role === "user" && (path.startsWith("/admin") || requiredRole === "admin")) {
            toast({
              title: "Access Restricted",
              description: "You don't have administrator privileges. Redirecting to candidate dashboard.",
              variant: "default",
            });
            setRedirectPath("/candidate/dashboard");
          }

          // Delay the redirect slightly to allow the toast to be seen
          setTimeout(() => {
            setShowRedirectMessage(false);
          }, 1500);
        }
      }
    }, [user, requiredRole, path, showRedirectMessage]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    // If we need to redirect the user after showing a message
    if (redirectPath) {
      return <Redirect to={redirectPath} />;
    }

    if (!user || (path.startsWith("/admin") && !user.role)) {
      // Create redirect URL with the current path for after login
      const redirectParam = `?redirect=${encodeURIComponent(path)}`;

      if (path.startsWith("/admin")) {
        return <Redirect to={`/admin/login${redirectParam}`} />;
      } else if (path.startsWith("/candidate")) {
        return <Redirect to={`/auth${redirectParam}`} />;
      } else {
        return <Redirect to={`/auth${redirectParam}`} />;
      }
    }

    // Check for role-based access if requiredRole is specified
    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "admin") {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/candidate/dashboard" />;
      }
    }

    return <Component />;
  };

  return <Route path={path} component={ProtectedComponent} />;
}
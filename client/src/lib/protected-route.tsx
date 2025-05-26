
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ component: Component, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect after loading is complete and we have a definitive auth state
    if (!isLoading) {
      if (!user) {
        const redirectPath = requiredRole === "admin" 
          ? `/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`
          : `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
        setLocation(redirectPath);
        return;
      }

      if (user && requiredRole && user.role !== requiredRole) {
        const redirectPath = user.role === "admin" ? "/admin" : "/candidate/dashboard";
        setLocation(redirectPath);
      }
    }
  }, [user, isLoading, requiredRole, setLocation]);

  // Always show loading screen while authentication state is being determined
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Don't render anything if user is not authenticated or doesn't have required role
  if (!user) {
    return <LoadingScreen />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <LoadingScreen />;
  }

  // Only render the component when we're sure the user is properly authenticated
  return <Component />;
}

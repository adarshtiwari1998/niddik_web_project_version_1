
import { useEffect, startTransition } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ component: Component, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, error } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Use startTransition to avoid suspense errors during navigation
    if (!isLoading && !error) {
      startTransition(() => {
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
      });
    }
  }, [user, isLoading, error, requiredRole, setLocation]);

  // Show loading screen while authentication state is being determined or if there's an error
  if (isLoading || error) {
    return <LoadingScreen />;
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return <LoadingScreen />;
  }

  // Don't render anything if user doesn't have required role
  if (requiredRole && user.role !== requiredRole) {
    return <LoadingScreen />;
  }

  // Only render the component when we're sure the user is properly authenticated
  return <Component />;
}


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
    if (!isLoading && !user) {
      const redirectPath = requiredRole === "admin" 
        ? `/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`
        : `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
      setLocation(redirectPath);
      return;
    }

    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      const redirectPath = user.role === "admin" ? "/admin" : "/candidate/dashboard";
      setLocation(redirectPath);
    }
  }, [user, isLoading, requiredRole, setLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return <Component />;
}

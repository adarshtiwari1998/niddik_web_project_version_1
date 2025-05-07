import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

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

  // Create a wrapper component that incorporates all our protection logic
  const ProtectedComponent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to={path.startsWith("/admin") ? "/admin/login" : "/auth"} />;
    }

    // Check for role-based access if requiredRole is specified
    if (requiredRole && user.role !== requiredRole) {
      return <Redirect to={user.role === "admin" ? "/admin" : "/"} />;
    }

    return <Component />;
  };

  return <Route path={path} component={ProtectedComponent} />;
}
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

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to={path.startsWith("/admin") ? "/admin/login" : "/auth"} />
      </Route>
    );
  }

  // Check for role-based access if requiredRole is specified
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Route path={path}>
        <Redirect to={user.role === "admin" ? "/admin" : "/"} />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
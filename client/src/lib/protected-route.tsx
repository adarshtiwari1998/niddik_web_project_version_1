import { Redirect, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ component: Component, path, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Route
      path={path}
      component={() => {
        if (!user) {
          return <Redirect to="/auth" />;
        }

        if (requiredRole && user.role !== requiredRole) {
          return <Redirect to="/" />;
        }

        return <Component />;
      }}
    />
  );
}
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "user";
}

export function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    const redirectUrl = encodeURIComponent(location);
    return <Redirect to={`/admin/login?redirect=${redirectUrl}`} />;
  }

  if (user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return <Component />;
}
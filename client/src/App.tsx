import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ServiceDetail from "@/pages/ServiceDetail";
import ServicesOverview from "@/pages/ServicesOverview";
import WebAppSolutions from "@/pages/WebAppSolutions";
import AboutUs from "@/pages/AboutUs";
import WhyUs from "@/pages/WhyUs";
import LandingPage from "@/pages/LandingPage";
import AdaptiveHiring from "@/pages/AdaptiveHiringFix";
import { default as Whitepaper } from "@/pages/Whitepaper";
import AuthPage from "@/pages/AuthPage";
import CareerPage from "@/pages/CareerPage";
import JobDetail from "@/pages/JobDetail";
import MyApplications from "@/pages/MyApplications";
import ProfilePage from "@/pages/ProfilePage";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import JobListings from "@/pages/admin/JobListings";
import JobForm from "@/pages/admin/JobForm";
import Candidates from "@/pages/admin/Candidates";

// Auth Provider
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/landing" component={LandingPage} />
      
      {/* Service Routes */}
      <Route path="/services" component={ServicesOverview} />
      <Route path="/services/:serviceSlug" component={ServiceDetail} />
      <Route path="/web-app-solutions" component={WebAppSolutions} />
      <Route path="/adaptive-hiring" component={AdaptiveHiring} />
      <Route path="/whitepaper" component={Whitepaper} />
      
      {/* Company Routes */}
      <Route path="/about-us" component={AboutUs} />
      <Route path="/why-us" component={WhyUs} />
      
      {/* Careers & Jobs */}
      <Route path="/careers" component={CareerPage} />
      <Route path="/jobs/:id" component={JobDetail} />
      <ProtectedRoute path="/my-applications" component={MyApplications} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Auth Routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Admin Routes - Require admin role */}
      <ProtectedRoute path="/admin" component={AdminDashboard} requiredRole="admin" />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} requiredRole="admin" />
      <ProtectedRoute path="/admin/jobs" component={JobListings} requiredRole="admin" />
      <ProtectedRoute path="/admin/jobs/new" component={JobForm} requiredRole="admin" />
      <ProtectedRoute path="/admin/jobs/:id/edit" component={JobForm} requiredRole="admin" />
      <ProtectedRoute path="/admin/candidates" component={Candidates} requiredRole="admin" />
      
      {/* 404 - Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

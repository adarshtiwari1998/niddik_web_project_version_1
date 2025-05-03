import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ServiceDetail from "@/pages/ServiceDetail";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import JobListings from "@/pages/admin/JobListings";
import JobForm from "@/pages/admin/JobForm";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      
      {/* Service Detail Routes */}
      <Route path="/services/:serviceSlug" component={ServiceDetail} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/jobs" component={JobListings} />
      <Route path="/admin/jobs/new" component={JobForm} />
      <Route path="/admin/jobs/:id/edit" component={JobForm} />
      
      {/* 404 - Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

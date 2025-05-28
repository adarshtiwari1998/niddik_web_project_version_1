import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ServiceDetail from "@/pages/ServiceDetail";
import ServicesOverview from "@/pages/ServicesOverview";
import WebAppSolutions from "@/pages/WebAppSolutions";
import AboutUs from "@/pages/AboutUs";
import WhyUs from "@/pages/WhyUs";
import LeadershipTeam from "@/pages/LeadershipTeam";
import ContactUs from "@/pages/ContactUs";
import LandingPage from "@/pages/LandingPage";
import AdaptiveHiring from "@/pages/AdaptiveHiringFix";
import AdaptiveHiringFixed from "@/pages/AdaptiveHiringFixed";
import Whitepaper from "@/pages/Whitepaper";
import AuthPage from "@/pages/AuthPage";
import CareerPage from "@/pages/CareerPage";
import JobDetail from "@/pages/JobDetail";
import MyApplications from "@/pages/MyApplications";
import ProfilePage from "@/pages/ProfilePage";
import JobApplication from "@/pages/JobApplication";
import CandidateDashboard from "@/pages/CandidateDashboard";
import RequestDemo from "@/pages/RequestDemo";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import JobListings from "@/pages/admin/JobListings";
import JobForm from "@/pages/admin/JobForm";
import Candidates from "@/pages/admin/Candidates";
import SubmittedCandidates from "@/pages/admin/SubmittedCandidates";
import Users from "@/pages/admin/Users";
import DemoRequests from "./pages/admin/DemoRequests";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import SEOPages from "./pages/admin/SEOPages";
import FAQs from "@/pages/FAQs";
import Clients from "@/pages/Clients";
import Testimonials from "@/pages/Testimonials";
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import CommunityInvolvement from "@/pages/CommunityInvolvement";
import CorporateResponsibilities from "@/pages/CorporateResponsibilities";

// Auth Provider
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import StickyPopup from '@/hooks/StickyPopup';
import Insights from "./pages/Insights";
import FactsAndTrends from "./pages/FactsAndTrends";
import HiringAdvice from "./pages/HiringAdvice";
import CareerAdvice from "./pages/CareerAdvice";
import SixFactorModel from './pages/SixFactorModel';
import AgileRecruiting from './pages/AgileRecruiting';
import ITPartners from './pages/ITPartners';
import NonITPartners from './pages/NonITPartners';
import HealthcarePartners from './pages/HealthcarePartners';
import SearchPage from "@/pages/SearchPage";
import { lazy, Suspense } from "react";
import SEO from "@/components/SEO";
import AdminPasswordChange from "@/components/admin/AdminPasswordChange";

// Component to handle scroll restoration
function ScrollToTop() {
    const [location] = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return null;
}

function Router() {
    return (
        <>
            <ScrollToTop />
            <Switch>
            {/* Public Routes */}
            <Route path="/" component={() => (
              <>
                <SEO pagePath="/" />
                <Home />
              </>
            )} />
            <Route path="/landing" component={() => (
              <>
                <SEO pagePath="/landing" />
                <LandingPage />
              </>
            )} />

            {/* Service Routes */}
            <Route path="/services" component={() => (
              <>
                <SEO pagePath="/services" />
                <ServicesOverview />
              </>
            )} />
            <Route path="/services/:serviceSlug" component={ServiceDetail} />
            <Route path="/web-app-solutions" component={() => (
              <>
                <SEO pagePath="/web-app-solutions" />
                <WebAppSolutions />
              </>
            )} />
            <Route path="/adaptive-hiring" component={() => (
              <>
                <SEO pagePath="/adaptive-hiring" />
                <AdaptiveHiring />
              </>
            )} />
            <Route path="/adaptive-hiring-fixed" component={() => (
              <>
                <SEO pagePath="/adaptive-hiring-fixed" />
                <AdaptiveHiringFixed />
              </>
            )} />
            <Route path="/whitepaper" component={() => (
              <>
                <SEO pagePath="/whitepaper" />
                <Whitepaper />
              </>
            )} />
            <Route path="/insights" component={() => (
              <>
                <SEO pagePath="/insights" />
                <Insights />
              </>
            )} />
            <Route path="/facts-and-trends" component={() => (
              <>
                <SEO pagePath="/facts-and-trends" />
                <FactsAndTrends />
              </>
            )} />
            <Route path="/hiring-advice" component={() => (
              <>
                <SEO pagePath="/hiring-advice" />
                <HiringAdvice />
              </>
            )} />
            <Route path="/corporate-social-responsibilities" component={() => (
              <>
                <SEO pagePath="/corporate-social-responsibilities" />
                <CorporateResponsibilities />
              </>
            )} />
            <Route path="/career-advice" component={() => (
              <>
                <SEO pagePath="/career-advice" />
                <CareerAdvice />
              </>
            )} />
            <Route path="/six-factor-recruiting-model" component={() => (
              <>
                <SEO pagePath="/six-factor-recruiting-model" />
                <SixFactorModel />
              </>
            )} />
            <Route path="/agile-approach-based-recruiting" component={() => (
              <>
                <SEO pagePath="/agile-approach-based-recruiting" />
                <AgileRecruiting />
              </>
            )} />
            <Route path="/community-involvement" component={() => (
              <>
                <SEO pagePath="/community-involvement" />
                <CommunityInvolvement />
              </>
            )} />
            <Route path="/partners/it" component={() => (
              <>
                <SEO pagePath="/partners/it" />
                <ITPartners />
              </>
            )} />
            <Route path="/partners/non-it" component={() => (
              <>
                <SEO pagePath="/partners/non-it" />
                <NonITPartners />
              </>
            )} />
            <Route path="/partners/healthcare" component={() => (
              <>
                <SEO pagePath="/partners/healthcare" />
                <HealthcarePartners />
              </>
            )} />
            <Route path="/search" component={() => (
              <>
                <SEO pagePath="/search" />
                <SearchPage />
              </>
            )} />
            <Route path="/clients" component={() => (
              <>
                <SEO pagePath="/clients" />
                <Clients />
              </>
            )} />
            <Route path="/testimonials" component={() => (
              <>
                <SEO pagePath="/testimonials" />
                <Testimonials />
              </>
            )} />
            <Route path="/contact" component={() => (
              <>
                <SEO pagePath="/contact" />
                <ContactUs />
              </>
            )} />
             <Route path="/privacy-policy" component={() => (
              <>
                <SEO pagePath="/privacy-policy" />
                <PrivacyPolicy />
              </>
            )} />
            <Route path="/terms-of-service" component={() => (
              <>
                <SEO pagePath="/terms-of-service" />
                <TermsOfService />
              </>
            )} />
            <Route path="/cookie-policy" component={() => (
              <>
                <SEO pagePath="/cookie-policy" />
                <CookiePolicy />
              </>
            )} />

            {/* Company Routes */}
            <Route path="/about-us" component={() => (
              <>
                <SEO pagePath="/about-us" />
                <AboutUs />
              </>
            )} />
            <Route path="/why-us" component={() => (
              <>
                <SEO pagePath="/why-us" />
                <WhyUs />
              </>
            )} />
            <Route path="/leadership-team" component={() => (
              <>
                <SEO pagePath="/leadership-team" />
                <LeadershipTeam />
              </>
            )} />
          <Route path="/faqs" component={() => (
              <>
                <SEO pagePath="/faqs" />
                <FAQs />
              </>
            )} />

            {/* Careers & Jobs */}
            <Route path="/careers" component={() => (
              <>
                <SEO pagePath="/careers" />
                <CareerPage />
              </>
            )} />
            <Route path="/jobs/:id" component={JobDetail} />
            <ProtectedRoute path="/candidate/jobs" component={CareerPage} />

            {/* Candidate Routes */}
            <ProtectedRoute path="/candidate/dashboard" component={CandidateDashboard} requiredRole="user" />
            <ProtectedRoute path="/dashboard" component={CandidateDashboard} />
            <ProtectedRoute path="/candidate/applications" component={MyApplications} />
            <ProtectedRoute path="/my-applications" component={MyApplications} />
            <ProtectedRoute path="/candidate/profile" component={ProfilePage} />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <ProtectedRoute path="/candidate/jobs/:id" component={JobDetail} />
            <ProtectedRoute path="/candidate/apply/:id" component={JobApplication} />
            <ProtectedRoute path="/apply/:id" component={JobApplication} />

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
            <ProtectedRoute path="/admin/submitted-candidates" component={SubmittedCandidates} requiredRole="admin" />
            <ProtectedRoute path="/admin/users" component={Users} requiredRole="admin" />
            <ProtectedRoute path="/admin/demo-requests" component={DemoRequests} requiredRole="admin"/>
            <ProtectedRoute path="/admin/contact-submissions" component={ContactSubmissions} requiredRole="admin"/>
            <ProtectedRoute path="/admin/seo-pages" component={SEOPages} requiredRole="admin"/>
            <ProtectedRoute path="/admin/account" component={() => <AdminPasswordChange />} requiredRole="admin"/>

            {/* Demo Request */}
            <Route path="/request-demo" component={() => (
              <>
                <SEO pagePath="/request-demo" />
                <RequestDemo />
              </>
            )} />

            {/* 404 - Not Found */}
            <Route component={NotFound} />
        </Switch>
        </>
    );
}

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router />
                    {window.location.pathname.startsWith('/admin') || 
                     window.location.pathname.startsWith('/candidate') ? null : <StickyPopup />}
                    <Toaster />
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

export default App;
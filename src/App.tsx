
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useState, useEffect } from "react";
import OnboardingFlow from "./components/OnboardingFlow";

// Pages
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import Auth from "./pages/Auth";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages
import AdminAuth from "./pages/admin/AdminAuth";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import UserManagement from "./pages/admin/UserManagement";
import ErrorReportsManagement from "./pages/admin/ErrorReportsManagement";
import AdminInvite from "./pages/admin/AdminInvite";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const isAuthenticated = localStorage.getItem('accessAuth') === 'true';
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    const userData = localStorage.getItem('userData');
    
    if (isAuthenticated && onboardingComplete && userData) {
      setIsOnboardingComplete(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-movieDark flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isOnboardingComplete) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/series" element={<SeriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/adminserver48493989" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reports" element={<ErrorReportsManagement />} />
                <Route path="invite" element={<AdminInvite />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

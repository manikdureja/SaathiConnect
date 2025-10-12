import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authStorage } from "./lib/auth";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import HospitalPortal from "./pages/HospitalPortal";
import PatientChat from "./pages/PatientChat";
import DoctorChat from "./pages/DoctorChat";
import NotFound from "./pages/not-found";

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(authStorage.isAuthenticated());

  // Update authentication state when location changes
  useEffect(() => {
    setIsAuthenticated(authStorage.isAuthenticated());
  }, [location]);

  // If not authenticated and not on auth page, redirect to auth
  if (!isAuthenticated && location !== '/auth') {
    return <Auth />;
  }

  // If authenticated and on auth page, redirect to home
  if (isAuthenticated && location === '/auth') {
    return <Home />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/community" component={Community} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/auth" component={Auth} />
      <Route path="/hospital" component={HospitalPortal} />
      <Route path="/chat" component={PatientChat} />
      <Route path="/doctor/chat" component={DoctorChat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

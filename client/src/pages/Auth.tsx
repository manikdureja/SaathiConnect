import { useState } from "react";
import { useLocation } from "wouter";
import AuthForm, { type AuthFormData } from "@/components/AuthForm";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import { authStorage } from "@/lib/auth";

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      
      if (mode === 'register') {
        const response = await authAPI.registerUser({
          name: data.name,
          phoneNumber: data.phoneNumber,
          password: data.password,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
        });

        authStorage.setToken(response.token);
        authStorage.setUserData({
          id: response.user.id,
          name: response.user.name,
          phoneNumber: response.user.phoneNumber,
          type: 'user',
        });

        toast({
          title: "Account Created",
          description: "Welcome to Saathi!",
        });

        // Force a page reload to update authentication state
        window.location.href = '/';
      } else {
        const response = await authAPI.loginUser(data.phoneNumber, data.password);

        authStorage.setToken(response.token);
        authStorage.setUserData({
          id: response.user.id,
          name: response.user.name,
          phoneNumber: response.user.phoneNumber,
          type: 'user',
        });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`,
        });

        // Force a page reload to update authentication state
        window.location.href = '/';
      }
    } catch (error: any) {
      toast({
        title: mode === 'register' ? "Registration Failed" : "Login Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Saathi</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your Safety & Community Companion
            </p>
          </div>
          
          <AuthForm
            mode={mode}
            onSubmit={handleSubmit}
            onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')}
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import HospitalAuthForm, { 
  type HospitalRegisterData, 
  type DoctorRegisterData 
} from "@/components/HospitalAuthForm";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { hospitalAPI, doctorAPI } from "@/lib/api";
import { authStorage } from "@/lib/auth";

export default function HospitalPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleHospitalLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await hospitalAPI.login(email, password);
      
      authStorage.setToken(response.token);
      authStorage.setUserData({
        id: response.hospital.id,
        name: response.hospital.name,
        email: response.hospital.email,
        type: 'hospital'
      });

      toast({
        title: "Login Successful",
        description: "Welcome to the hospital portal",
      });

      // Redirect to hospital dashboard
      setLocation('/hospital/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await doctorAPI.login(email, password);
      
      authStorage.setToken(response.token);
      authStorage.setUserData({
        id: response.doctor.id,
        name: response.doctor.name,
        email: response.doctor.email,
        type: 'doctor'
      });

      toast({
        title: "Login Successful",
        description: `Welcome Dr. ${response.doctor.name}`,
      });

      // Redirect to doctor chat
      setLocation('/doctor/chat');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHospitalRegister = async (data: HospitalRegisterData) => {
    try {
      setIsLoading(true);
      const response = await hospitalAPI.register(data);
      
      authStorage.setToken(response.token);
      authStorage.setUserData({
        id: response.hospital.id,
        name: response.hospital.name,
        email: response.hospital.email,
        type: 'hospital'
      });

      toast({
        title: "Registration Successful",
        description: "Hospital account has been created",
      });

      setLocation('/hospital/dashboard');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorRegister = async (data: DoctorRegisterData) => {
    try {
      setIsLoading(true);
      const response = await doctorAPI.register(data);
      
      authStorage.setToken(response.token);
      authStorage.setUserData({
        id: response.doctor.id,
        name: response.doctor.name,
        email: response.doctor.email,
        type: 'doctor'
      });

      toast({
        title: "Registration Successful",
        description: "Doctor account has been created",
      });

      setLocation('/doctor/chat');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account",
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
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Saathi</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Healthcare Provider Portal
            </p>
          </div>
          
          <HospitalAuthForm
            onHospitalLogin={handleHospitalLogin}
            onDoctorLogin={handleDoctorLogin}
            onHospitalRegister={handleHospitalRegister}
            onDoctorRegister={handleDoctorRegister}
          />
        </div>
      </div>
    </div>
  );
}

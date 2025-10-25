import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Stethoscope } from "lucide-react";

interface HospitalAuthFormProps {
  onHospitalLogin: (email: string, password: string) => void;
  onDoctorLogin: (email: string, password: string) => void;
  onHospitalRegister: (data: HospitalRegisterData) => void;
  onDoctorRegister: (data: DoctorRegisterData) => void;
}

export interface HospitalRegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
}

export interface DoctorRegisterData {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hospitalId: string;
  phoneNumber: string;
}

export default function HospitalAuthForm({ 
  onHospitalLogin, 
  onDoctorLogin,
  onHospitalRegister,
  onDoctorRegister
}: HospitalAuthFormProps) {
  const [activeTab, setActiveTab] = useState<'hospital' | 'doctor'>('hospital');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [hospitalData, setHospitalData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: ''
  });

  const [doctorData, setDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    hospitalId: '',
    phoneNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'hospital') {
      if (mode === 'login') {
        onHospitalLogin(hospitalData.email, hospitalData.password);
      } else {
        onHospitalRegister(hospitalData);
      }
    } else {
      if (mode === 'login') {
        onDoctorLogin(doctorData.email, doctorData.password);
      } else {
        onDoctorRegister(doctorData);
      }
    }
  };

  return (
    <Card className="p-6 md:p-8 w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hospital' | 'doctor')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="hospital" className="text-lg">
            <Building2 className="mr-2 h-5 w-5" />
            Hospital
          </TabsTrigger>
          <TabsTrigger value="doctor" className="text-lg">
            <Stethoscope className="mr-2 h-5 w-5" />
            Doctor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hospital">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                {mode === 'login' ? 'Hospital Login' : 'Register Hospital'}
              </h2>
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="hospital-name" className="text-lg">Hospital Name</Label>
                  <Input
                    id="hospital-name"
                    data-testid="input-hospital-name"
                    type="text"
                    value={hospitalData.name}
                    onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
                    className="min-h-14 text-xl"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="hospital-email" className="text-lg">Email</Label>
                <Input
                  id="hospital-email"
                  data-testid="input-hospital-email"
                  type="email"
                  value={hospitalData.email}
                  onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
                  className="min-h-14 text-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital-password" className="text-lg">Password</Label>
                <Input
                  id="hospital-password"
                  data-testid="input-hospital-password"
                  type="password"
                  value={hospitalData.password}
                  onChange={(e) => setHospitalData({ ...hospitalData, password: e.target.value })}
                  className="min-h-14 text-xl"
                  required
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hospital-address" className="text-lg">Address</Label>
                    <Input
                      id="hospital-address"
                      data-testid="input-hospital-address"
                      type="text"
                      value={hospitalData.address}
                      onChange={(e) => setHospitalData({ ...hospitalData, address: e.target.value })}
                      className="min-h-14 text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital-phone" className="text-lg">Phone Number</Label>
                    <Input
                      id="hospital-phone"
                      data-testid="input-hospital-phone"
                      type="tel"
                      value={hospitalData.phoneNumber}
                      onChange={(e) => setHospitalData({ ...hospitalData, phoneNumber: e.target.value })}
                      className="min-h-14 text-xl"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              data-testid="button-hospital-auth"
              className="w-full min-h-14 text-lg"
            >
              {mode === 'login' ? 'Login' : 'Register Hospital'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-lg text-primary hover:underline"
                data-testid="button-toggle-hospital-mode"
              >
                {mode === 'login' ? 'Register new hospital' : 'Already registered? Login'}
              </button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="doctor">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                {mode === 'login' ? 'Doctor Login' : 'Register Doctor'}
              </h2>
            </div>

            <div className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name" className="text-lg">Name</Label>
                    <Input
                      id="doctor-name"
                      data-testid="input-doctor-name"
                      type="text"
                      value={doctorData.name}
                      onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                      className="min-h-14 text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-specialization" className="text-lg">Specialization</Label>
                    <Input
                      id="doctor-specialization"
                      data-testid="input-doctor-specialization"
                      type="text"
                      value={doctorData.specialization}
                      onChange={(e) => setDoctorData({ ...doctorData, specialization: e.target.value })}
                      className="min-h-14 text-xl"
                      placeholder="e.g., Cardiology, General Medicine"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="doctor-email" className="text-lg">Email</Label>
                <Input
                  id="doctor-email"
                  data-testid="input-doctor-email"
                  type="email"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                  className="min-h-14 text-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor-password" className="text-lg">Password</Label>
                <Input
                  id="doctor-password"
                  data-testid="input-doctor-password"
                  type="password"
                  value={doctorData.password}
                  onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                  className="min-h-14 text-xl"
                  required
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-hospital" className="text-lg">Hospital ID</Label>
                    <Input
                      id="doctor-hospital"
                      data-testid="input-doctor-hospital"
                      type="text"
                      value={doctorData.hospitalId}
                      onChange={(e) => setDoctorData({ ...doctorData, hospitalId: e.target.value })}
                      className="min-h-14 text-xl"
                      placeholder="Enter your hospital ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-phone" className="text-lg">Phone Number</Label>
                    <Input
                      id="doctor-phone"
                      data-testid="input-doctor-phone"
                      type="tel"
                      value={doctorData.phoneNumber}
                      onChange={(e) => setDoctorData({ ...doctorData, phoneNumber: e.target.value })}
                      className="min-h-14 text-xl"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              data-testid="button-doctor-auth"
              className="w-full min-h-14 text-lg"
            >
              {mode === 'login' ? 'Login' : 'Register Doctor'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-lg text-primary hover:underline"
                data-testid="button-toggle-doctor-mode"
              >
                {mode === 'login' ? 'Register new doctor' : 'Already registered? Login'}
              </button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

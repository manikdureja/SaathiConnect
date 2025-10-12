import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, LogIn } from "lucide-react";

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthFormData) => void;
  onToggleMode: () => void;
}

export interface AuthFormData {
  name: string;
  phoneNumber: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export default function AuthForm({ mode, onSubmit, onToggleMode }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    phoneNumber: '',
    password: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 md:p-8 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Join Saathi'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        <div className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Your Name</Label>
              <Input
                id="name"
                data-testid="input-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="min-h-14 text-xl"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-lg">Phone Number</Label>
            <Input
              id="phone"
              data-testid="input-phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="min-h-14 text-xl"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">Password</Label>
            <Input
              id="password"
              data-testid="input-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="min-h-14 text-xl"
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName" className="text-lg">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      data-testid="input-emergency-name"
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="min-h-14 text-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone" className="text-lg">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      data-testid="input-emergency-phone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="min-h-14 text-xl"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <Button
          type="submit"
          data-testid="button-auth-submit"
          className="w-full min-h-14 text-lg"
        >
          {mode === 'login' ? (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </>
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-lg text-primary hover:underline"
            data-testid="button-toggle-auth-mode"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Card>
  );
}

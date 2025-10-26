import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Bell, MapPin, Smartphone, LogOut } from "lucide-react";
import { useState } from "react";
<<<<<<< HEAD
import { useLocation } from 'wouter';
import { authStorage } from '@/lib/auth';
=======
>>>>>>> e928a868f20db69a2347c48ab1b1261ec9fbadf7

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
<<<<<<< HEAD
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    authStorage.clearAuth();  // Clear the stored token and user data
    setLocation('/auth');     // Redirect to login page
=======

  const handleLogout = () => {
    console.log('Logout triggered');
    // TODO: Implement actual logout
>>>>>>> e928a868f20db69a2347c48ab1b1261ec9fbadf7
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Preferences</h2>
          
          <div className="flex items-center justify-between min-h-16 gap-4">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label htmlFor="notifications" className="text-xl">
                  Notifications
                </Label>
                <p className="text-base text-muted-foreground">
                  Receive alerts and updates
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              data-testid="switch-notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
              className="scale-125"
            />
          </div>

          <div className="flex items-center justify-between min-h-16 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label htmlFor="location" className="text-xl">
                  Location Sharing
                </Label>
                <p className="text-base text-muted-foreground">
                  Share location for SOS alerts
                </p>
              </div>
            </div>
            <Switch
              id="location"
              data-testid="switch-location"
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
              className="scale-125"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">About</h2>
          <div className="space-y-3 text-lg text-muted-foreground">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <span>Version 1.0.0</span>
            </div>
            <p className="leading-relaxed">
              Saathi is your trusted companion for safety and community connection.
            </p>
          </div>
        </Card>

        <Button
          data-testid="button-logout"
          onClick={handleLogout}
          variant="destructive"
          className="w-full min-h-14 text-lg"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}

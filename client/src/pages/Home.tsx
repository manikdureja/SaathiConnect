import { useState } from "react";
import { Link } from "wouter";
import SOSButton from "@/components/SOSButton";
import EmergencyContact from "@/components/EmergencyContact";
import LocationStatus from "@/components/LocationStatus";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Stethoscope, Building2 } from "lucide-react";

// TODO: remove mock functionality
const mockUser = {
  name: "Sarla Devi",
  emergencyContact: {
    name: "Ramesh Kumar",
    phoneNumber: "+91 98765 43210"
  }
};

export default function Home() {
  const [location] = useState({ enabled: true, address: "Mumbai, Maharashtra" });
  const { toast } = useToast();

  const handleSOS = () => {
    // TODO: Implement actual SOS functionality with GPS and SMS
    console.log('SOS triggered');
    toast({
      title: "Emergency Alert Sent",
      description: `Alert sent to ${mockUser.emergencyContact.name} with your location.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Saathi</h1>
            <p className="text-base text-muted-foreground">Your Safety Companion</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <LocationStatus 
          enabled={location.enabled} 
          location={location.address}
        />

        <SOSButton onClick={handleSOS} />

        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/chat">
            <Card className="p-6 hover-elevate cursor-pointer" data-testid="card-talk-to-doctor">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">Talk to a Doctor</h3>
                  <p className="text-base text-muted-foreground">Get medical consultation</p>
                </div>
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          <Link href="/hospital">
            <Card className="p-6 hover-elevate cursor-pointer" data-testid="card-hospital-portal">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">Hospital Portal</h3>
                  <p className="text-base text-muted-foreground">For healthcare providers</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Emergency Contact</h2>
          <EmergencyContact
            name={mockUser.emergencyContact.name}
            phoneNumber={mockUser.emergencyContact.phoneNumber}
            onEdit={() => console.log('Edit contact')}
            onCall={() => console.log('Call contact')}
          />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

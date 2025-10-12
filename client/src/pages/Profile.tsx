import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Phone, MapPin, Calendar } from "lucide-react";

// TODO: remove mock functionality
const mockUser = {
  name: "Sarla Devi",
  phoneNumber: "+91 98765 43210",
  joinedDate: "January 2025",
  location: "Mumbai, Maharashtra",
  emergencyContact: {
    name: "Ramesh Kumar",
    phoneNumber: "+91 98765 43210"
  }
};

export default function Profile() {
  const initials = mockUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl font-bold" data-testid="text-user-name">
                {mockUser.name}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span className="text-lg" data-testid="text-user-phone">
                    {mockUser.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{mockUser.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">Joined {mockUser.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-2xl font-semibold">Emergency Contact</h3>
          <div className="space-y-2">
            <p className="text-xl font-medium">{mockUser.emergencyContact.name}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span className="text-lg">{mockUser.emergencyContact.phoneNumber}</span>
            </div>
          </div>
          <Button
            data-testid="button-edit-emergency-contact"
            variant="outline"
            className="w-full min-h-14 text-lg"
            onClick={() => console.log('Edit emergency contact')}
          >
            Edit Emergency Contact
          </Button>
        </Card>

        <Button
          data-testid="button-edit-profile"
          variant="outline"
          className="w-full min-h-14 text-lg"
          onClick={() => console.log('Edit profile')}
        >
          Edit Profile
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}

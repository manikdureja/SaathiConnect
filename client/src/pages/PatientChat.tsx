import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatInterface from "@/components/ChatInterface";
import DoctorCard from "@/components/DoctorCard";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { doctorAPI, chatAPI } from "@/lib/api";
import { authStorage } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PatientChat() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const { toast } = useToast();
  const userData = authStorage.getUserData();
  const token = authStorage.getToken();

  // Fetch online doctors
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['/api/doctors/online'],
    queryFn: () => doctorAPI.getOnline(),
  });

  // Fetch chat messages when room is selected
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/chat/messages', chatRoomId],
    queryFn: () => chatRoomId && token ? chatAPI.getMessages(chatRoomId, token) : Promise.resolve([]),
    enabled: !!chatRoomId && !!token,
  });

  const handleStartChat = async (doctorId: string) => {
    if (!userData || !token) {
      toast({
        title: "Authentication Required",
        description: "Please login to start a chat",
        variant: "destructive",
      });
      return;
    }

    try {
      const chatRoom = await chatAPI.createRoom(userData.id, doctorId, token);
      setChatRoomId(chatRoom.id);
      setSelectedDoctor(doctorId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not start chat",
        variant: "destructive",
      });
    }
  };

  const doctor = selectedDoctor ? doctors.find((d: any) => d.id === selectedDoctor) : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {selectedDoctor ? (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedDoctor(null);
                setChatRoomId(null);
              }}
              data-testid="button-back-to-doctors"
              className="text-lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Doctors
            </Button>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold">Talk to a Doctor</h1>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {selectedDoctor && doctor && chatRoomId ? (
          <ChatInterface
            chatRoomId={chatRoomId}
            currentUserId={userData?.id || 'user1'}
            currentUserType="user"
            otherPartyName={doctor.name}
            messages={messages}
          />
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Available Doctors</h2>
              <p className="text-lg text-muted-foreground">
                Choose a doctor to start a consultation
              </p>
            </div>
            
            {isLoading ? (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground">Loading doctors...</p>
              </Card>
            ) : doctors.length > 0 ? (
              <div className="space-y-4">
                {doctors.map((doctor: any) => (
                  <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    name={doctor.name}
                    specialization={doctor.specialization}
                    isOnline={doctor.isOnline}
                    onStartChat={handleStartChat}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-2xl font-semibold mb-2">No Doctors Online</h3>
                <p className="text-lg text-muted-foreground">
                  Please check back later or try again
                </p>
              </Card>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

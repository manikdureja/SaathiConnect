import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// TODO: remove mock functionality
const mockMessages = [
  {
    id: "1",
    senderId: "user1",
    senderType: "user" as const,
    message: "Hello doctor, I'm not feeling well today.",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: "2",
    senderId: "doctor1",
    senderType: "doctor" as const,
    message: "I'm sorry to hear that. Can you describe your symptoms?",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: "3",
    senderId: "user1",
    senderType: "user" as const,
    message: "I have a headache and feel dizzy.",
    timestamp: new Date(Date.now() - 180000)
  }
];

export default function DoctorChat() {
  const [showChat] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-4">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
              data-testid="button-back"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Patient Consultation</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showChat ? (
          <ChatInterface
            chatRoomId="room123"
            currentUserId="doctor1"
            currentUserType="doctor"
            otherPartyName="Sarla Devi"
            messages={mockMessages}
          />
        ) : (
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">No Active Chat</h2>
            <p className="text-lg text-muted-foreground">
              Select a patient to start a consultation
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}

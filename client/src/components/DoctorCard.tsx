import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Stethoscope } from "lucide-react";

interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string;
  isOnline: boolean;
  onStartChat: (doctorId: string) => void;
}

export default function DoctorCard({ 
  id, 
  name, 
  specialization, 
  isOnline, 
  onStartChat 
}: DoctorCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-doctor-${id}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-semibold" data-testid={`text-doctor-name-${id}`}>
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">{specialization}</p>
              </div>
            </div>
            <Badge 
              variant={isOnline ? "default" : "secondary"}
              className="text-sm"
              data-testid={`badge-status-${id}`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <Button
            data-testid={`button-chat-${id}`}
            onClick={() => onStartChat(id)}
            disabled={!isOnline}
            className="w-full min-h-12 text-lg mt-3"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Consultation
          </Button>
        </div>
      </div>
    </Card>
  );
}

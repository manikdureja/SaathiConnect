import { Phone, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmergencyContactProps {
  name: string;
  phoneNumber: string;
  onEdit?: () => void;
  onCall?: () => void;
}

export default function EmergencyContact({ 
  name, 
  phoneNumber, 
  onEdit,
  onCall 
}: EmergencyContactProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Emergency Contact</h3>
          {onEdit && (
            <Button 
              data-testid="button-edit-contact" 
              variant="ghost" 
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-xl font-medium" data-testid="text-contact-name">{name}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-5 w-5" />
            <p className="text-lg" data-testid="text-contact-phone">{phoneNumber}</p>
          </div>
        </div>
        {onCall && (
          <Button 
            data-testid="button-call-contact" 
            className="w-full min-h-14 text-lg"
            onClick={onCall}
          >
            <Phone className="mr-2 h-5 w-5" />
            Call {name}
          </Button>
        )}
      </div>
    </Card>
  );
}

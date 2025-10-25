import { AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOSButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SOSButton({ onClick, disabled = false }: SOSButtonProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <Button
        data-testid="button-sos"
        onClick={onClick}
        disabled={disabled}
        variant="destructive"
        className="h-48 w-48 md:h-56 md:w-56 rounded-full flex flex-col items-center justify-center gap-3 shadow-xl"
      >
        <Phone className="h-16 w-16 md:h-20 md:w-20" />
        <span className="text-3xl md:text-4xl font-bold">SOS</span>
      </Button>
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-5 w-5" />
        <p className="text-lg md:text-xl">Press for Emergency Help</p>
      </div>
    </div>
  );
}

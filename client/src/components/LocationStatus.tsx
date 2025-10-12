import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocationStatusProps {
  enabled: boolean;
  location?: string;
}

export default function LocationStatus({ enabled, location }: LocationStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-5 w-5 text-muted-foreground" />
      <Badge 
        variant={enabled ? "default" : "secondary"}
        className="text-base px-3 py-1"
        data-testid="badge-location-status"
      >
        {enabled ? (
          <>
            <CheckCircle className="h-4 w-4 mr-1" />
            Location Enabled
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-1" />
            Location Disabled
          </>
        )}
      </Badge>
      {location && enabled && (
        <span className="text-base text-muted-foreground" data-testid="text-location">
          {location}
        </span>
      )}
    </div>
  );
}

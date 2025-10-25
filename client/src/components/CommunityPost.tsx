import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface CommunityPostProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

export default function CommunityPost({ 
  id,
  authorName, 
  authorAvatar,
  content, 
  timestamp 
}: CommunityPostProps) {
  const initials = authorName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card 
      className="p-6 space-y-4 hover-elevate" 
      data-testid={`card-post-${id}`}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={authorAvatar} alt={authorName} />
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h4 className="text-xl font-semibold" data-testid={`text-author-${id}`}>
            {authorName}
          </h4>
          <p className="text-base text-muted-foreground" data-testid={`text-time-${id}`}>
            {timestamp}
          </p>
        </div>
      </div>
      <p className="text-xl leading-relaxed" data-testid={`text-content-${id}`}>
        {content}
      </p>
    </Card>
  );
}

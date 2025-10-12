import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CreatePostFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
}

export default function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const maxChars = 500;

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-2xl font-semibold">Share Your Thoughts</h3>
      <div className="space-y-2">
        <Textarea
          data-testid="input-post-content"
          placeholder="What would you like to share today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] text-xl resize-none"
          maxLength={maxChars}
        />
        <p className="text-base text-muted-foreground text-right">
          {content.length} / {maxChars}
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          data-testid="button-share-post"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex-1 min-h-14 text-lg"
        >
          <Send className="mr-2 h-5 w-5" />
          Share Post
        </Button>
        {onCancel && (
          <Button
            data-testid="button-cancel-post"
            onClick={onCancel}
            variant="outline"
            className="flex-1 min-h-14 text-lg"
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}

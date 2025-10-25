import { useState } from "react";
import CommunityPost from "@/components/CommunityPost";
import CreatePostForm from "@/components/CreatePostForm";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

// TODO: remove mock functionality
const mockPosts = [
  {
    id: "1",
    authorName: "Sarla Devi",
    content: "Today in the park, I saw a beautiful peacock! It was such a delightful morning.",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    authorName: "Ramesh Kumar",
    content: "Just finished my morning walk. The weather is perfect today!",
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    authorName: "Meena Sharma",
    content: "My grandson visited me today. We had such a wonderful time together.",
    timestamp: "1 day ago"
  }
];

export default function Community() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const handleCreatePost = (content: string) => {
    // TODO: Implement actual post creation
    const newPost = {
      id: Date.now().toString(),
      authorName: "You", // TODO: Use actual user name
      content,
      timestamp: "Just now"
    };
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
    console.log('Post created:', content);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Community</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showCreatePost ? (
          <div className="space-y-4">
            <Button
              data-testid="button-back-to-feed"
              variant="ghost"
              onClick={() => setShowCreatePost(false)}
              className="text-lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Feed
            </Button>
            <CreatePostForm
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreatePost(false)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              data-testid="button-create-post"
              onClick={() => setShowCreatePost(true)}
              className="w-full min-h-14 text-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Post
            </Button>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Recent Posts</h2>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <CommunityPost key={post.id} {...post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    No posts yet. Be the first to share!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

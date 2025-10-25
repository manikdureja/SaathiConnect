import CommunityPost from '../CommunityPost';

export default function CommunityPostExample() {
  return (
    <div className="p-6 bg-background space-y-4">
      <CommunityPost 
        id="1"
        authorName="Sarla Devi"
        content="Today in the park, I saw a beautiful peacock! It was such a delightful morning."
        timestamp="2 hours ago"
      />
      <CommunityPost 
        id="2"
        authorName="Ramesh Kumar"
        content="Just finished my morning walk. The weather is perfect today!"
        timestamp="5 hours ago"
      />
    </div>
  );
}

import CreatePostForm from '../CreatePostForm';

export default function CreatePostFormExample() {
  return (
    <div className="p-6 bg-background">
      <CreatePostForm 
        onSubmit={(content) => console.log('Post submitted:', content)}
        onCancel={() => console.log('Post cancelled')}
      />
    </div>
  );
}

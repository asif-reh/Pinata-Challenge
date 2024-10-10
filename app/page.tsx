import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import FileGallery from '@/components/FileGallery';
import CollaborationSpace from '@/components/CollaborationSpace';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Creative Collaboration Hub</h1>
        <FileUpload />
        <FileGallery />
        <CollaborationSpace />
      </main>
    </div>
  );
}
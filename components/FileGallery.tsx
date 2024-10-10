"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface File {
  id: string;
  name: string;
  type: string;
  url: string;
}

export default function FileGallery() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/files');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <Image
          src={file.url}
          alt={file.name}
          width={200}
          height={200}
          className="object-cover rounded-t-lg"
        />
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <video width="200" height="200" controls className="rounded-t-lg">
          <source src={file.url} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-40 bg-gray-200 rounded-t-lg">
          <span className="text-gray-500">{file.type}</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">File Gallery</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              {renderFilePreview(file)}
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{file.name}</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2 w-full">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{file.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <p><strong>Type:</strong> {file.type}</p>
                      <p><strong>URL:</strong> <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{file.url}</a></p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
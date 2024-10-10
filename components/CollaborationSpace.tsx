"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CollaborationSpace() {
  const [comments, setComments] = useState<{ author: string; text: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && author.trim()) {
      setComments([...comments, { author, text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Collaboration Space</h2>
      <Card>
        <CardHeader>
          <CardTitle>Project Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-secondary p-3 rounded-lg">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmitComment} className="space-y-2">
            <Input
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
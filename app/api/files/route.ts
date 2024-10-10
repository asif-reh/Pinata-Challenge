import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionId = process.env.APPWRITE_COLLECTION_ID;

    if (!databaseId || !collectionId) {
      throw new Error('Appwrite database or collection ID is not configured');
    }

    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderDesc('$createdAt'),
      ]
    );

    return NextResponse.json(response.documents);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export async function POST(req: NextRequest) {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    return NextResponse.json({ error: 'Pinata API keys are not configured' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily
    const tempFilePath = join('/tmp', `${uuidv4()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', new Blob([buffer]), file.name);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', pinataFormData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${pinataFormData.getBoundary()}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    // Save file metadata to Appwrite
    const fileData = {
      name: file.name,
      type: file.type,
      size: file.size,
      ipfsHash: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    };

    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const collectionId = process.env.APPWRITE_COLLECTION_ID!;

    await databases.createDocument(databaseId, collectionId, ID.unique(), fileData);

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      ipfsHash: response.data.IpfsHash,
      pinSize: response.data.PinSize,
      timestamp: response.data.Timestamp,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
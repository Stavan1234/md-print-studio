import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Create uploads directory in the project (or use a temp directory)
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'png';
    const filename = `image-${timestamp}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filepath, buffer);

    // Return the public URL path
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      url,
      filename,
      success: true 
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { error: 'Failed to save image' },
      { status: 500 }
    );
  }
}


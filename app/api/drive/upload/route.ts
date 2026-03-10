import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDriveClient, ensureAppFolder } from '@/lib/drive';

interface SessionWithAccessToken {
  accessToken?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession() as SessionWithAccessToken | null;
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const drive = getDriveClient(session.accessToken as string);
    
    // Ensure the MD Print Studio folder exists
    const folderId = await ensureAppFolder(drive);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.type,
        body: Buffer.from(buffer),
      },
      fields: 'id, name, webViewLink',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id as string,
      requestBody: {
        type: 'anyone',
        role: 'reader',
      },
    });

    // Get the public URL
    const fileId = response.data.id as string;
    const publicUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

    return NextResponse.json({
      url: publicUrl,
      name: response.data.name,
      webViewLink: response.data.webViewLink,
      success: true,
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    return NextResponse.json(
      { error: 'Failed to upload to Drive' },
      { status: 500 }
    );
  }
}


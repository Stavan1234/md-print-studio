'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

type Props = {
  imageUrl: string;
  onUploadComplete?: (url: string) => void;
};

export default function UploadToDrive({ imageUrl, onUploadComplete }: Props) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!session) {
      signIn('google');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a file from the blob
      const fileName = `image-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: blob.type });

      // Upload to Google Drive
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/drive/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await uploadResponse.json();
      setUploadedUrl(data.url);
      if (onUploadComplete) {
        onUploadComplete(data.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
    }
  };

  if (!session) {
    return (
      <button
        onClick={() => signIn('google')}
        className="mt-2 text-xs text-blue-600 hover:underline"
      >
        Sign in with Google to save to Drive
      </button>
    );
  }

  if (uploadedUrl) {
    return (
      <div className="mt-2 p-2 bg-green-50 rounded text-xs">
        <p className="text-green-700 font-medium">✓ Saved to Google Drive</p>
        <button
          onClick={copyToClipboard}
          className="mt-1 text-blue-600 hover:underline"
        >
          Copy URL
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Save to Google Drive'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}


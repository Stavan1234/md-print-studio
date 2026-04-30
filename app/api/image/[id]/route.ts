import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  try {
    // We use the drive.google.com/uc endpoint which redirects to the actual image download
    const driveUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    
    // Fetch the image from Google Drive
    // The file was made public during upload, so this fetch will succeed without auth
    const response = await fetch(driveUrl);
    
    if (!response.ok) {
      console.error(`Failed to fetch image from Drive. Status: ${response.status}`);
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    // Get the headers to forward
    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    // Some responses from Drive might be HTML if there's a virus scan warning or error.
    // If it's HTML, we shouldn't serve it as an image.
    if (contentType.includes("text/html")) {
      console.error("Drive returned HTML instead of an image.");
      return new NextResponse("Image not accessible directly", { status: 403 });
    }

    // Return the raw stream
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

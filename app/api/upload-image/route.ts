import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!(session as any)?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  const metadata = {
    name: file.name,
  };

  const boundary = "foo_bar_baz";

  const body =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\n` +
    `Content-Type: ${file.type}\r\n\r\n`;

  const fileBuffer = await file.arrayBuffer();

  const end = `\r\n--${boundary}--`;

  const multipartBody = new Blob([body, fileBuffer, end]);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  const data = await res.json();
  const fileId = data.id;

  if (fileId) {
    // Make the file publicly accessible so the <img> tag can load it without auth
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone",
      }),
    });
  }

  return Response.json({
    fileId: fileId,
    url: `/api/image/${fileId}`,
  });
}

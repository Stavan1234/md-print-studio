import { google, drive_v3 } from 'googleapis';

export const getDriveClient = (accessToken: string): drive_v3.Drive => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
};

export async function ensureAppFolder(drive: drive_v3.Drive): Promise<string> {
  // Check if "MD Print Studio" folder exists, create if not
  const response = await drive.files.list({
    q: "name='MD Print Studio' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id, name)',
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id as string;
  }

  // Create folder
  const folder = await drive.files.create({
    requestBody: {
      name: 'MD Print Studio',
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return folder.data.id as string;
}


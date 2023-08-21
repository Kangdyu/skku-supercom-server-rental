import { formidableParse } from '@/lib/formidable';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { APPLICATION_FILE_UPLOAD_DIR } from '@/constants';

async function postFile(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable();

  try {
    const { files } = await formidableParse(form, req);
    const file = files.applicationFile[0];

    const uploadDir = path.join(process.cwd(), APPLICATION_FILE_UPLOAD_DIR);
    const newName = `application-${new Date().toISOString()}.${file.originalFilename
      ?.split('.')
      .pop()}`;
    const newPath = path.join(uploadDir, newName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.rename(file.filepath, newPath, (err) => {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).json({ error: 'File upload failed.' });
      }

      const fileUrl = `/uploads/applications/${newName}`;
      res.status(200).json({ url: fileUrl });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'failed to upload file' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await postFile(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import IncomingForm from 'formidable/Formidable';
import { NextApiRequest } from 'next';

export function formidableParse(form: IncomingForm, req: NextApiRequest) {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      return resolve({ fields, files });
    });
  });
}

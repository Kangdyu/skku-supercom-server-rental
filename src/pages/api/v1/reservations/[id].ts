import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { APPLICATION_FILE_UPLOAD_DIR } from '@/constants';
import path from 'path';

/**
 * DELETE /api/v1/reservations/:id
 */
async function deleteReservation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    await prisma.reservationDate.deleteMany({
      where: {
        reservationId: Number(id),
      },
    });

    const deletedReservation = await prisma.reservation.delete({
      where: {
        id: Number(id),
      },
    });

    const applicationFileName = deletedReservation.applicationFileUrl.split('/').pop()!;
    const applicationFileDir = path.join(process.cwd(), APPLICATION_FILE_UPLOAD_DIR);
    const applicationFilePath = path.join(applicationFileDir, applicationFileName);

    fs.unlinkSync(applicationFilePath);

    res.status(200).json({ message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    await deleteReservation(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

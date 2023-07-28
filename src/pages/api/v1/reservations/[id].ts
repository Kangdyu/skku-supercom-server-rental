import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

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

    await prisma.reservation.delete({
      where: {
        id: Number(id),
      },
    });

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

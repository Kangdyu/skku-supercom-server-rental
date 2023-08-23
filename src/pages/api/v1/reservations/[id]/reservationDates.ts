import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/reservations/:id/reservationDates
 */
async function getReservationDates(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, year, month } = req.query;

    const reservationDates = await prisma.reservationDate.findMany({
      where: {
        reservationId: Number(id),
        date: {
          lt: year && month && new Date(Number(year), Number(month), 1),
          gte: year && month && new Date(Number(year), Number(month) - 1, 1),
        },
      },
    });

    return res.status(200).json(reservationDates.flatMap((rd) => rd.date));
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getReservationDates(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

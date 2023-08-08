import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/servers/:id/reservationDates
 */
async function getReservationDates(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, year, month } = req.query;

    const reservations = await prisma.reservation.findMany({
      where: {
        serverId: Number(id),
      },
      select: {
        reservationDates: {
          select: {
            date: true,
          },
          where: {
            date: {
              lt: year && month && new Date(Number(year), Number(month), 1),
              gte: year && month && new Date(Number(year), Number(month) - 1, 1),
            },
          },
        },
      },
    });

    if (reservations == null) {
      return res.status(404).json({ message: 'Server reservations not found' });
    }

    const reservationDates = reservations.flatMap((r) => r.reservationDates.map((rd) => rd.date));

    return res.status(200).json(reservationDates);
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

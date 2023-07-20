import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { ReservationDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/reservations
 */
async function getReservations(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { serverId, userId } = req.query;
    const reservations = await prisma.reservation.findMany({
      where: {
        serverId: serverId ? Number(serverId) : undefined,
        userId: userId ? Number(userId) : undefined,
      },
      include: {
        reservationDates: true,
        server: true,
        user: true,
      },
    });

    return res.status(200).json({ reservations });
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * POST /api/v1/reservations
 */
async function postReservation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { serverId, userId, dates }: ReservationDTO = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        serverId,
        userId,
      },
    });

    await prisma.reservationDate.createMany({
      data: dates.map((date) => ({
        reservationId: reservation.id,
        date,
      })),
    });

    return res.status(201).json({ ...reservation });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getReservations(req, res);
  } else if (req.method === 'POST') {
    await postReservation(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

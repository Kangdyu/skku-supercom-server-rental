import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { ReservationDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/reservations
 */
async function getReservations(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pageSize: pageSizeQuery, pageNumber: pageNumberQuery, serverId } = req.query;
    if (!pageSizeQuery || !pageNumberQuery) {
      return res.status(400).json({ message: 'pageSize and pageNumber are required' });
    }

    const pageSize = Number(pageSizeQuery);
    const pageNumber = Number(pageNumberQuery);

    const totalCount = await prisma.reservation.count({
      where: {
        serverId: serverId ? Number(serverId) : undefined,
      },
    });
    const reservations = await prisma.reservation.findMany({
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      where: {
        serverId: serverId ? Number(serverId) : undefined,
      },
      include: {
        reservationDates: true,
        server: true,
      },
    });

    return res.status(200).json({
      pageSize,
      pageNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      contents: reservations,
    });
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * POST /api/v1/reservations
 */
async function postReservation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { serverId, applicationFileUrl, dates }: ReservationDTO = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        serverId,
        applicationFileUrl,
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

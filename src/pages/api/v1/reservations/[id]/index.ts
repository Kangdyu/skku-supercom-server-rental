import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { APPLICATION_FILE_UPLOAD_DIR } from '@/constants';
import path from 'path';
import { withAdminAuth } from '@/lib/auth';
import { ReservationDTO } from '@/types/api';

/**
 * GET /api/v1/reservations/:id
 */
async function getReservation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        reservationDates: true,
        server: true,
      },
    });

    return res.status(200).json(reservation);
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * PATCH /api/v1/reservations/:id
 */
async function patchReservation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { applicationFileUrl, dates }: Partial<Omit<ReservationDTO, 'serverId'>> = req.body;

    if (applicationFileUrl) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: Number(id) },
      });

      if (!reservation) {
        return res.status(404).json({ message: 'reservation not found' });
      }

      const applicationFileName = reservation.applicationFileUrl.split('/').pop()!;
      const applicationFileDir = path.join(process.cwd(), APPLICATION_FILE_UPLOAD_DIR);
      const applicationFilePath = path.join(applicationFileDir, applicationFileName);
      fs.unlinkSync(applicationFilePath);

      await prisma.reservation.update({
        where: { id: Number(id) },
        data: {
          applicationFileUrl,
        },
      });
    }

    if (dates) {
      await prisma.reservationDate.deleteMany({
        where: {
          reservationId: Number(id),
        },
      });

      await prisma.reservationDate.createMany({
        data: dates.map((date) => ({
          reservationId: Number(id),
          date,
        })),
      });
    }

    res.status(200).json({ message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

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
  if (req.method === 'GET') {
    await getReservation(req, res);
  } else if (req.method === 'PATCH') {
    await withAdminAuth(patchReservation)(req, res);
  } else if (req.method === 'DELETE') {
    await withAdminAuth(deleteReservation)(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

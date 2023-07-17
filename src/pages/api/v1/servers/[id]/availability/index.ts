import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { ServerAvailabilityDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/servers/:id/availability
 */
async function getServerAvailability(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const availability = await prisma.serverAvailability.findUnique({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ availability });
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * POST /api/v1/servers/:id/availability
 */
async function postServerAvailability(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { dates }: ServerAvailabilityDTO = req.body;

    const availability = await prisma.serverAvailability.createMany({
      data: dates.map((date) => {
        const [year, month] = date.split('-');
        return {
          year: Number(year),
          month: Number(month),
          serverId: Number(id),
        };
      }),
    });

    return res.status(201).json({ availability, message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * PUT /api/v1/servers/:id/availability
 */
async function putServerAvailability(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { dates }: ServerAvailabilityDTO = req.body;

    const availability = await prisma.serverAvailability.updateMany({
      where: {
        serverId: Number(id),
      },
      data: dates.map((date) => {
        const [year, month] = date.split('-');
        return {
          year: Number(year),
          month: Number(month),
        };
      }),
    });

    return res.status(200).json({ availability, message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getServerAvailability(req, res);
  } else if (req.method === 'POST') {
    await postServerAvailability(req, res);
  } else if (req.method === 'PUT') {
    await putServerAvailability(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

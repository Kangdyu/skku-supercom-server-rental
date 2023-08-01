import { withAdminAuth } from '@/lib/auth';
import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { ServerDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/servers/:id
 */
async function getServer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const server = await prisma.server.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        serverAvailability: true,
        reservations: {
          include: {
            reservationDates: true,
          },
        },
      },
    });

    if (server == null) {
      return res.status(404).json({ message: 'Server not found' });
    }

    return res.status(200).json(server);
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * PUT /api/v1/servers/:id
 */
async function putServer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, description }: Partial<ServerDTO> = req.body;

    const server = await prisma.server.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json(server);
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * DELETE /api/v1/servers/:id
 */
async function deleteServer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const server = await prisma.server.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json(server);
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getServer(req, res);
  } else if (req.method === 'PUT') {
    await withAdminAuth(putServer)(req, res);
  } else if (req.method === 'DELETE') {
    await withAdminAuth(deleteServer)(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

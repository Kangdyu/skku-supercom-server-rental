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
        reservations: true,
      },
    });

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getServer(req, res);
  } else if (req.method === 'PUT') {
    await putServer(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { ServerDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/servers
 */
async function getServers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pageSize: pageSizeQuery, pageNumber: pageNumberQuery } = req.query;
    if (!pageSizeQuery || !pageNumberQuery) {
      return res.status(400).json({ message: 'pageSize and pageNumber are required' });
    }

    const pageSize = Number(pageSizeQuery);
    const pageNumber = Number(pageNumberQuery);

    const totalCount = await prisma.server.count();
    const servers = await prisma.server.findMany({
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      include: {
        serverAvailability: true,
        reservations: true,
      },
    });

    return res.status(200).json({
      pageSize,
      pageNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      contents: servers,
    });
  } catch (e) {
    handleApiError(e, res);
  }
}

/**
 * POST /api/v1/servers
 */
async function postServer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description }: ServerDTO = req.body;

    const server = await prisma.server.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(server);
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getServers(req, res);
  } else if (req.method === 'POST') {
    await postServer(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

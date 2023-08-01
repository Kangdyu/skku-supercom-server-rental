import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { UserDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * GET /api/v1/users
 */
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pageSize: pageSizeQuery, pageNumber: pageNumberQuery } = req.query;
    if (!pageSizeQuery || !pageNumberQuery) {
      return res.status(400).json({ message: 'pageSize and pageNumber are required' });
    }

    const pageSize = Number(pageSizeQuery);
    const pageNumber = Number(pageNumberQuery);

    const totalCount = await prisma.server.count();
    const users = await prisma.user.findMany({
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      include: {
        reservations: true,
      },
    });

    return res.status(200).json({
      pageSize,
      pageNumber,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      contents: users,
    });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getUsers(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

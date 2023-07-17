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

/**
 * POST /api/v1/users
 *
 * NOTE: 현재 unique 필드를 email로 둬서 기존 신청자 정보의 이메일과 신규 신청의 이메일이 같을 시
 * 유저 정보를 업데이트, 아니면 신규 유저 생성
 */
async function postUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, phone, college, major, role }: UserDTO = req.body;

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        name,
        email,
        phone,
        college,
        major,
        role,
      },
      update: {
        name,
        phone,
        college,
        major,
        role,
      },
    });

    return res.status(200).json({ user, message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getUsers(req, res);
  } else if (req.method === 'POST') {
    await postUser(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

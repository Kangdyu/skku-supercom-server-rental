import { handleApiError } from '@/lib/errorHandlers';
import prisma from '@/lib/prisma';
import { AdminDTO } from '@/types/api';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { withAdminAuth } from '@/lib/auth';

/**
 * POST /api/v1/admin/register
 */
async function postRegister(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { loginId, password }: AdminDTO = req.body;

    const existing = await prisma.admin.findUnique({
      where: { loginId },
    });

    if (existing) {
      return res.status(400).json({ message: '해당 아이디를 가진 어드민이 존재합니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        loginId,
        password: hashedPassword,
      },
    });

    const { password: _, ...adminWithoutPassword } = admin;

    return res.status(201).json({ admin: adminWithoutPassword });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await withAdminAuth(postRegister)(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

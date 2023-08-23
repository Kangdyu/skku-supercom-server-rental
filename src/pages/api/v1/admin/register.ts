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

/**
 * PUT /api/v1/admin/register
 */
async function putAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { loginId, password }: AdminDTO = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.update({
      where: {
        loginId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: 'success' });
  } catch (e) {
    handleApiError(e, res);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    /** NOTE: DB가 초기화되어 어드민 계정이 사라졌을 시,
     * 아래 주석처리 되어있는 코드를 주석 해제, 기존 코드를 주석 처리하여 POST 요청을 보내 계정 생성할 것
     */
    await postRegister(req, res);
  } else if (req.method === 'PUT') {
    await withAdminAuth(putAdmin)(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

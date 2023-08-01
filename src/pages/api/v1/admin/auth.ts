import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { AdminDTO } from '@/types/api';
import { sign } from '@/lib/jwt';

async function postLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { loginId, password }: AdminDTO = req.body;

  const admin = await prisma.admin.findUnique({
    where: {
      loginId: loginId,
    },
  });

  if (!admin) {
    return res.status(404).json({ error: '회원 정보가 없습니다.' });
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return res.status(400).json({ error: '아이디와 비밀번호를 다시 확인해주세요.' });
  }

  const token = await sign({ id: admin.id, loginId: admin.loginId }, process.env.JWT_SECRET);

  const { password: _, ...adminWithoutPassword } = admin;

  return res.status(200).json({ admin: adminWithoutPassword, token });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await postLogin(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

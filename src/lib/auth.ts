// jose codes: https://github.com/vercel/next.js/discussions/38227#discussioncomment-3063432
// jsonwebtoken 라이브러리의 경우 crypto 패키지로 인해 middleware에서 사용 불가하여 jose 사용

import { TOKEN_EXPIRE_TIME } from '@/constants';
import { getCookie } from '@/lib/cookie';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';

export async function sign(payload: JWTPayload, secret: string): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_EXPIRE_TIME; // 24 hours

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

  return payload;
}

export function withAdminAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const jwt = req.headers.authorization?.split(' ')[1];

    if (!jwt) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    try {
      await verify(jwt, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    await handler(req, res);
  };
}

export function getAuthHeaderObject() {
  return {
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
    },
  };
}

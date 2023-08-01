// https://github.com/vercel/next.js/discussions/38227#discussioncomment-3063432
// jsonwebtoken 라이브러리의 경우 crypto 패키지로 인해 middleware에서 사용 불가하여 jose 사용

import { TOKEN_EXPIRE_TIME } from '@/constants';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

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

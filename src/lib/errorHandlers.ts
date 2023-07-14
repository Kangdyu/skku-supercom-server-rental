import { NextApiResponse } from 'next';

// TODO: 상세 에러처리
export function handleApiError(e: unknown, res: NextApiResponse) {
  console.error(e);
  return res.status(500).json({ message: (e as Error).message });
}

import { Providers } from '@/app/Providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스',
  description: '성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

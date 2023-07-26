import { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
import { MantineProvider, ColorScheme, Button } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SWRConfig } from 'swr';
import 'dayjs/locale/ko';

const pretendard = localFont({ src: './PretendardVariable.woff2' });

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>성균관대학교 슈퍼컴퓨팅센터 서버대여서비스</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          primaryColor: 'green',
          fontFamily: pretendard.style.fontFamily,
        }}
      >
        <SWRConfig value={{ suspense: true }}>
          <Notifications />
          <main>
            <Component {...pageProps} />
          </main>
        </SWRConfig>
      </MantineProvider>
    </>
  );
}

import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, Button } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SWRConfig } from 'swr';

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
        }}
      >
        <SWRConfig value={{ suspense: true }}>
          <Notifications />
          <Component {...pageProps} />
        </SWRConfig>
      </MantineProvider>
    </>
  );
}

import { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout } from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const selector = 'meta[name="viewport"]';
    if (!document.querySelector(selector)) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, initial-scale=1');
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ChakraProvider resetCSS>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;

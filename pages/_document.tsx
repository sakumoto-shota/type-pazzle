import React from 'react';
import type { JSX } from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(): JSX.Element {
  return (
    <Html lang="ja">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

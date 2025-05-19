import { render } from '@testing-library/react';
import { createElement, type ReactElement } from 'react';
import { describe, it, expect } from 'vitest';
import MyApp from './_app';

const Dummy = (): ReactElement => createElement('div', null, 'dummy');

// routerのモック
const mockRouter = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  prefetch: () => Promise.resolve(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  events: { on: () => {}, off: () => {} },
  isFallback: false,
  basePath: '',
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
};

describe('MyApp', () => {
  it('adds viewport meta tag', () => {
    render(createElement(MyApp, { Component: Dummy, pageProps: {}, router: mockRouter as any }));
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe(
      'width=device-width, initial-scale=1'
    );
  });
});

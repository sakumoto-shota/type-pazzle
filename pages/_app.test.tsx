import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';
import MyApp from './_app';

const Dummy = (): ReactElement => React.createElement('div', null, 'dummy');

describe('MyApp', () => {
  it('adds viewport meta tag', () => {
    render(
      React.createElement(MyApp, { Component: Dummy, pageProps: {} })
    );
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe(
      'width=device-width, initial-scale=1'
    );
  });
});

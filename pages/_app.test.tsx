import { render } from '@testing-library/react';
import React from 'react';
import MyApp from './_app';

const Dummy = (): JSX.Element => <div>dummy</div>;

describe('MyApp', () => {
  it('adds viewport meta tag', () => {
    render(<MyApp Component={Dummy} pageProps={{}} />);
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe(
      'width=device-width, initial-scale=1'
    );
  });
});

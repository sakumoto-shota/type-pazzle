import { render } from '@testing-library/react';
import MyApp from './_app';
import { describe, it, expect, vi } from 'vitest';
import type { Router } from 'next/router';
import type { NextComponentType, NextPageContext } from 'next';

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('MyApp', () => {
  it('renders without crashing', () => {
    const mockPageProps = {};
    const MockComponent: NextComponentType<NextPageContext> = () => <div>Test Component</div>;
    const mockRouter = {} as Router;

    const { container } = render(
      <MyApp Component={MockComponent} pageProps={mockPageProps} router={mockRouter} />,
    );

    expect(container).toBeDefined();
  });
});

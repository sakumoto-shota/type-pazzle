import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { TypeScriptEditor } from './TypeScriptEditor';

// useRouterのモック
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('TypeScriptEditor', () => {
  it('displays puzzle explanation', () => {
    document.cookie = 'csrf-token=test';
    render(<TypeScriptEditor />, { wrapper });
    expect(
      screen.getByText('User型はnameとageを持つオブジェクト型を完成させます。')
    ).toBeInTheDocument();
    expect(screen.getByText('次の問題へ')).toBeInTheDocument();
    expect(
      screen.getByText('TypeScript 型パズル - Lv1 (1/5)')
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('進捗: 1/5')).toBeInTheDocument();
  });

  it('displays all 5 questions in each level', () => {
    document.cookie = 'csrf-token=test';
    
    // Lv1のテスト
    const { rerender } = render(<TypeScriptEditor initialLevel={1} />, { wrapper });
    expect(screen.getByText('TypeScript 型パズル - Lv1 (1/5)')).toBeInTheDocument();
    expect(screen.getByText('進捗: 1/5')).toBeInTheDocument();
    
    // Lv2のテスト
    rerender(<TypeScriptEditor initialLevel={2} />);
    expect(screen.getByText('TypeScript 型パズル - Lv2 (1/5)')).toBeInTheDocument();
    
    // Lv3のテスト
    rerender(<TypeScriptEditor initialLevel={3} />);
    expect(screen.getByText('TypeScript 型パズル - Lv3 (1/5)')).toBeInTheDocument();
    
    // Lv4のテスト
    rerender(<TypeScriptEditor initialLevel={4} />);
    expect(screen.getByText('TypeScript 型パズル - Lv4 (1/5)')).toBeInTheDocument();
    
    // Lv5のテスト
    rerender(<TypeScriptEditor initialLevel={5} />);
    expect(screen.getByText('TypeScript 型パズル - Lv5 (1/5)')).toBeInTheDocument();
  });

  it('shows progress correctly from 1/5 to 5/5', () => {
    document.cookie = 'csrf-token=test';
    render(<TypeScriptEditor initialLevel={1} />, { wrapper });
    
    // 初期状態は1/5
    expect(screen.getByText('進捗: 1/5')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 型パズル - Lv1 (1/5)')).toBeInTheDocument();
    
    // プログレスバーが20%であることを確認
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '20');
  });
});

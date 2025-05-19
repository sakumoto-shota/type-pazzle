import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { TypeScriptEditor } from './TypeScriptEditor';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('TypeScriptEditor', () => {
  it('displays puzzle explanation', () => {
    document.cookie = 'csrf-token=test';
    render(<TypeScriptEditor initialLevel={1} />, { wrapper });
    expect(
      screen.getByText('User型はnameとageを持つオブジェクト型を完成させます。')
    ).toBeInTheDocument();
    expect(screen.getByText('次の問題へ')).toBeInTheDocument();
    expect(
      screen.getByText('TypeScript 型パズル - Lv1 (1/5)')
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

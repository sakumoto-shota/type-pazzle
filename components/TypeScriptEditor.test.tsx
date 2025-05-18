import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeScriptEditor } from './TypeScriptEditor';
import { ChakraProvider } from '@chakra-ui/react';

// Monaco Editorのモック
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('TypeScriptEditor', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ result: '✅ 型チェック成功!' }),
      })
    ) as unknown as typeof fetch;
  });

  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <TypeScriptEditor />
      </ChakraProvider>
    );
  };

  it('初期状態で正しく表示される', () => {
    renderComponent();
    
    expect(screen.getByText('TypeScript 型パズル')).toBeInTheDocument();
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '型チェック' })).toBeInTheDocument();
  });

  it('コードを編集できる', async () => {
    renderComponent();
    const editor = screen.getByTestId('monaco-editor');
    
    fireEvent.change(editor, { target: { value: 'type User = { name: string };' } });
    
    expect(editor).toHaveValue('type User = { name: string };');
  });

  it('型チェックボタンをクリックするとAPIが呼ばれる', async () => {
    renderComponent();
    const button = screen.getByRole('button', { name: '型チェック' });
    
    await userEvent.click(button);
    
    // APIの呼び出しを確認
    expect(fetch).toHaveBeenCalledWith('/api/typecheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': expect.any(String),
      },
      credentials: 'include',
      body: expect.any(String),
    });
  });
}); 
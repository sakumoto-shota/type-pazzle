import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultPage from './result';
import * as progressUtils from '../src/utils/progress';
import '@testing-library/jest-dom';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../src/utils/progress', () => ({
  getLevel: vi.fn(),
  getScores: vi.fn(),
  setLevel: vi.fn(),
  setScores: vi.fn(),
  getResults: vi.fn(),
}));

vi.mock('../src/hooks/useScoreAnimation', () => ({
  useScoreAnimation: (score: number) => score,
}));

const mockRouter = {
  push: vi.fn(),
  query: {},
  pathname: '',
  asPath: '',
  route: '',
  basePath: '',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  back: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  prefetch: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  forward: vi.fn(),
};

describe('ResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
  });

  it('レベル結果と問題詳細が表示される', () => {
    const mockResults = [
      {
        level: 1,
        results: [
          {
            puzzleIndex: 0,
            isCorrect: true,
            explanation: 'User型はnameとageを持つオブジェクト型を完成させます。',
            code: 'type User = ???;\\nconst u: User = { name: "Taro", age: 20 };',
          },
          {
            puzzleIndex: 1,
            isCorrect: false,
            explanation: 'Point型はxとyを持つ二次元座標を表します。',
            code: 'type Point = ???;\\nconst p: Point = { x: 1, y: 2 };',
          },
        ],
      },
    ];

    (progressUtils.getScores as ReturnType<typeof vi.fn>).mockReturnValue([40, 0, 0, 0, 0]);
    (progressUtils.getLevel as ReturnType<typeof vi.fn>).mockReturnValue(1);
    (progressUtils.getResults as ReturnType<typeof vi.fn>).mockReturnValue(mockResults);

    mockRouter.query = { level: '1' };

    render(
      <ChakraProvider>
        <ResultPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Lv1 結果')).toBeInTheDocument();
    expect(screen.getByText('40 / 100')).toBeInTheDocument();
    expect(screen.getByText('問題ごとの結果')).toBeInTheDocument();
    expect(screen.getByText('問題 1')).toBeInTheDocument();
    expect(screen.getByText('問題 2')).toBeInTheDocument();
    expect(screen.getByText('正解')).toBeInTheDocument();
    expect(screen.getByText('不正解')).toBeInTheDocument();
  });

  it('全レベルのスコア一覧が表示される', () => {
    (progressUtils.getScores as ReturnType<typeof vi.fn>).mockReturnValue([80, 60, 40, 20, 0]);
    (progressUtils.getLevel as ReturnType<typeof vi.fn>).mockReturnValue(1);
    (progressUtils.getResults as ReturnType<typeof vi.fn>).mockReturnValue([
      {
        level: 1,
        results: [
          { puzzleIndex: 0, isCorrect: true, explanation: '', code: '' },
          { puzzleIndex: 1, isCorrect: true, explanation: '', code: '' },
          { puzzleIndex: 2, isCorrect: true, explanation: '', code: '' },
          { puzzleIndex: 3, isCorrect: true, explanation: '', code: '' },
          { puzzleIndex: 4, isCorrect: false, explanation: '', code: '' },
        ],
      },
    ]);

    mockRouter.query = { level: '1' };

    render(
      <ChakraProvider>
        <ResultPage />
      </ChakraProvider>
    );

    expect(screen.getByText('Lv1: 80 / 100')).toBeInTheDocument();
    expect(screen.getByText('Lv2: 60 / 100')).toBeInTheDocument();
    expect(screen.getByText('4/5 問正解')).toBeInTheDocument();
  });

  it('次のレベルへボタンが正しく動作する', () => {
    (progressUtils.getScores as ReturnType<typeof vi.fn>).mockReturnValue([100, 0, 0, 0, 0]);
    (progressUtils.getLevel as ReturnType<typeof vi.fn>).mockReturnValue(1);
    (progressUtils.getResults as ReturnType<typeof vi.fn>).mockReturnValue([]);

    mockRouter.query = { level: '1' };

    const { getByText } = render(
      <ChakraProvider>
        <ResultPage />
      </ChakraProvider>
    );

    const nextButton = getByText('次のレベルへ');
    nextButton.click();

    expect(progressUtils.setScores).toHaveBeenCalledWith([100, 0, 0, 0, 0]);
    expect(progressUtils.setLevel).toHaveBeenCalledWith(2);
    expect(mockRouter.push).toHaveBeenCalledWith('/play');
  });
});
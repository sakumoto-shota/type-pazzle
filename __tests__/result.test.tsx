import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResultPage from '../pages/result';
import * as progressUtils from '../src/utils/progress';

// Next.js router mock
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

// Progress utils mock
vi.mock('../src/utils/progress', () => ({
  getLevel: vi.fn(),
  getScores: vi.fn(),
  setLevel: vi.fn(),
  setScores: vi.fn(),
  getResults: vi.fn(),
}));

// Score animation hook mock
vi.mock('../src/hooks/useScoreAnimation', () => ({
  useScoreAnimation: vi.fn((score) => score),
}));

const mockRouter = {
  route: '',
  pathname: '',
  query: {},
  asPath: '',
  basePath: '',
  isLocaleDomain: false,
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
};

const mockPuzzleResults = [
  {
    answer: true,
    puzzleIndex: 0,
    description: 'User型はnameとageを持つオブジェクト型を完成させます。',
    userAnswer: '{ name: string; age: number }',
    correctAnswer: '{ name: string; age: number }',
  },
  {
    answer: false,
    puzzleIndex: 1,
    description: 'Point型はxとyを持つ二次元座標を表します。',
    userAnswer: '{ x: string; y: string }',
    correctAnswer: '{ x: number; y: number }',
  },
  {
    answer: true,
    puzzleIndex: 2,
    description: 'greetは文字列を返す関数型を指定します。',
    userAnswer: '(name: string) => string',
    correctAnswer: '(name: string) => string',
  },
];

describe('ResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it('renders basic result page with score', () => {
    vi.mocked(progressUtils.getLevel).mockReturnValue(1);
    vi.mocked(progressUtils.getScores).mockReturnValue([60, 0, 0, 0, 0]);
    vi.mocked(progressUtils.getResults).mockReturnValue({});

    render(<ResultPage />);

    expect(screen.getByText('Lv1 結果')).toBeInTheDocument();
    expect(screen.getByText('60 / 100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TOPへ' })).toBeInTheDocument();
  });

  it('displays detailed results when available', () => {
    vi.mocked(progressUtils.getLevel).mockReturnValue(1);
    vi.mocked(progressUtils.getScores).mockReturnValue([60, 0, 0, 0, 0]);
    vi.mocked(progressUtils.getResults).mockReturnValue({
      '1': mockPuzzleResults,
    });

    render(<ResultPage />);

    // Check if detailed results section is rendered
    expect(screen.getByText('問題詳細')).toBeInTheDocument();

    // Check for problem items
    expect(screen.getByText('問題 1')).toBeInTheDocument();
    expect(screen.getByText('問題 2')).toBeInTheDocument();
    expect(screen.getByText('問題 3')).toBeInTheDocument();

    // Check for correct/incorrect badges
    expect(screen.getAllByText('正解 ✓')).toHaveLength(2);
    expect(screen.getAllByText('不正解 ✗')).toHaveLength(1);
  });

  it('sorts results by puzzle index', () => {
    const unsortedResults = [
      { ...mockPuzzleResults[1], puzzleIndex: 1 },
      { ...mockPuzzleResults[0], puzzleIndex: 0 },
      { ...mockPuzzleResults[2], puzzleIndex: 2 },
    ];

    vi.mocked(progressUtils.getLevel).mockReturnValue(1);
    vi.mocked(progressUtils.getScores).mockReturnValue([60, 0, 0, 0, 0]);
    vi.mocked(progressUtils.getResults).mockReturnValue({
      '1': unsortedResults,
    });

    render(<ResultPage />);

    // Get all problem text elements
    const problemTexts = screen.getAllByText(/問題 \d/);

    // Check if they are in correct order
    expect(problemTexts[0]).toHaveTextContent('問題 1');
    expect(problemTexts[1]).toHaveTextContent('問題 2');
    expect(problemTexts[2]).toHaveTextContent('問題 3');
  });

  it('calculates score from detailed results when scores cookie is missing', () => {
    vi.mocked(progressUtils.getLevel).mockReturnValue(1);
    vi.mocked(progressUtils.getScores).mockReturnValue([]);
    vi.mocked(progressUtils.getResults).mockReturnValue({
      '1': mockPuzzleResults, // 2 correct out of 3 = 40 points
    });
    vi.mocked(progressUtils.setScores).mockImplementation(() => {});

    render(<ResultPage />);

    // Should calculate 2 correct * 20 = 40 points
    expect(screen.getByText('40 / 100')).toBeInTheDocument();
    expect(progressUtils.setScores).toHaveBeenCalled();
  });

  it('infers level from results when level cookie is missing', () => {
    mockRouter.query = {};
    vi.mocked(progressUtils.getLevel).mockReturnValue(null);
    vi.mocked(progressUtils.getScores).mockReturnValue([]);
    vi.mocked(progressUtils.getResults).mockReturnValue({
      '1': mockPuzzleResults,
      '2': [],
    });

    render(<ResultPage />);

    // Should infer level 2 (highest level with results)
    expect(screen.getByText('Lv2 結果')).toBeInTheDocument();
  });

  it('does not show detailed results when no results available', () => {
    vi.mocked(progressUtils.getLevel).mockReturnValue(1);
    vi.mocked(progressUtils.getScores).mockReturnValue([60, 0, 0, 0, 0]);
    vi.mocked(progressUtils.getResults).mockReturnValue(null);

    render(<ResultPage />);

    expect(screen.queryByText('問題詳細')).not.toBeInTheDocument();
  });
});

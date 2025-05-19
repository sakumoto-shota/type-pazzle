import { TypeScriptEditor } from '../components/TypeScriptEditor';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  getLevel,
  getScores,
  setLevel,
  setScores,
  resetProgress,
} from '../src/utils/progress';

export default function PlayPage() {
  const router = useRouter();
  if (!router.isReady) return null;
  let levelParam = router.query.level;
  let scoresParam = router.query.scores;

  // 初回アクセス時はscores=0-0-0-0-0でリセット
  if (!scoresParam && (!levelParam || levelParam === '1')) {
    scoresParam = '0-0-0-0-0';
  }

  const cookieLevel = getLevel();
  const cookieScores = getScores();

  const level =
    typeof levelParam === 'string'
      ? parseInt(levelParam, 10)
      : cookieLevel ?? 1;

  const initialLevel = Number.isNaN(level) ? 1 : level;

  const initialScores =
    typeof scoresParam === 'string'
      ? scoresParam.split('-').map((s) => parseInt(s, 10))
      : cookieScores ?? undefined;

  if (initialLevel === 1 && typeof scoresParam !== 'string') {
    resetProgress();
  }

  setLevel(initialLevel);
  if (initialScores) {
    setScores(initialScores);
  }
  return (
    <>
      <Head>
        <title>Type Puzzle - プレイ</title>
        <meta name="description" content="TypeScript 型パズルをプレイするページです。" />
      </Head>
      <TypeScriptEditor
        initialLevel={initialLevel}
        initialScores={initialScores}
      />
    </>
  );
}

import { TypeScriptEditor } from '../components/TypeScriptEditor';
import { useRouter } from 'next/router';

export default function PlayPage(): JSX.Element | null {
  const router = useRouter();
  if (!router.isReady) return null;
  const levelParam = router.query.level;
  const scoresParam = router.query.scores;
  const level = typeof levelParam === 'string' ? parseInt(levelParam, 10) : 1;
  const initialLevel = Number.isNaN(level) ? 1 : level;
  const initialScores =
    typeof scoresParam === 'string'
      ? scoresParam.split('-').map((s) => parseInt(s, 10))
      : undefined;
  return (
    <TypeScriptEditor
      initialLevel={initialLevel}
      initialScores={initialScores}
    />
  );
}

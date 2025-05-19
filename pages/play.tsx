import { TypeScriptEditor } from '../components/TypeScriptEditor';
import { useRouter } from 'next/router';

export default function PlayPage() {
  const router = useRouter();
  if (!router.isReady) return null;
  const levelParam = router.query.level;
  const level = typeof levelParam === 'string' ? parseInt(levelParam, 10) : 1;
  const initialLevel = Number.isNaN(level) ? 1 : level;
  return <TypeScriptEditor initialLevel={initialLevel} />;
}

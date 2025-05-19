import { TypeScriptEditor } from '../components/TypeScriptEditor';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PlayPage() {
  const router = useRouter();
  if (!router.isReady) return null;
  const levelParam = router.query.level;
  const level = typeof levelParam === 'string' ? parseInt(levelParam, 10) : 1;
  const initialLevel = Number.isNaN(level) ? 1 : level;
  return (
    <>
      <Head>
        <title>プレイ - TypeScript 型パズル</title>
        <meta
          name="description"
          content="パズルを解いて TypeScript の理解を深めましょう"
        />
      </Head>
      <TypeScriptEditor initialLevel={initialLevel} />
    </>
  );
}

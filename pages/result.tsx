import { useEffect, useState } from 'react';
import { Button, Container, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useScoreAnimation } from '../src/hooks/useScoreAnimation';
import { getLevel, getScores, setLevel, setScores, getResults } from '../src/utils/progress';

export default function ResultPage() {
  const router = useRouter();
  const [finalScore, setFinalScore] = useState(0);
  const [level, setLevelState] = useState<number | null>(null);

  useEffect(() => {
    // Client-side only cookie reading
    const scoresParam = router.query.scores;
    const levelParam = router.query.level;
    const cookieScores = getScores() ?? [];
    const cookieLevel = getLevel();
    const detailedResults = getResults();

    // 詳細な結果からスコアを計算
    let calculatedScores = [...cookieScores];
    let inferredLevel = cookieLevel;

    if (detailedResults) {
      // レベルが設定されていない場合、結果から推論
      if (!inferredLevel) {
        const levelKeys = Object.keys(detailedResults);
        if (levelKeys.length > 0) {
          // 最新の結果のレベルを使用
          inferredLevel = Math.max(...levelKeys.map((k) => parseInt(k, 10)));
        }
      }

      if (inferredLevel) {
        const levelKey = String(inferredLevel);
        const levelResults = detailedResults[levelKey];
        if (levelResults) {
          // 正解数をカウント
          const correctCount = levelResults.filter((r) => r.answer).length;
          calculatedScores[inferredLevel - 1] = correctCount * 20;
          // 計算したスコアをCookieに保存
          setScores(calculatedScores);
        }
      }
    }

    const scores =
      typeof scoresParam === 'string'
        ? scoresParam.split('-').map((s) => parseInt(s, 10))
        : calculatedScores;
    const currentLevel = typeof levelParam === 'string' ? parseInt(levelParam, 10) : inferredLevel;

    setLevelState(currentLevel);
    setFinalScore(currentLevel ? (scores[currentLevel - 1] ?? 0) : 0);
    setScores(scores);
    setLevel(currentLevel ?? null);
  }, [router.query]);

  const animatedScore = useScoreAnimation(finalScore);

  const handleNext = (): void => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Type Puzzle - 結果</title>
        <meta name='description' content='ゲーム結果を表示するページです。' />
      </Head>
      <Container maxW={{ base: 'container.sm', md: 'container.md' }} py={8}>
        <Heading size='lg' mb={4} textAlign='center'>
          {level ? `Lv${level} 結果` : '結果'}
        </Heading>
        <Text fontSize='4xl' fontWeight='bold' mb={4} textAlign='center'>
          {animatedScore} / 100
        </Text>
        <Button colorScheme='teal' onClick={handleNext}>
          TOPへ
        </Button>
      </Container>
    </>
  );
}

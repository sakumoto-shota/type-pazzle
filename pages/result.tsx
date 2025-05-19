import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import puzzlesData from '../data/puzzles.json';
import { useScoreAnimation } from '../src/hooks/useScoreAnimation';
import {
  getLevel,
  getScores,
  setLevel,
  setScores,
} from '../src/utils/progress';

export default function ResultPage() {
  const router = useRouter();
  const scoresParam = router.query.scores;
  const levelParam = router.query.level;
  const cookieScores = getScores() ?? [];
  const cookieLevel = getLevel();
  const scores =
    typeof scoresParam === 'string'
      ? scoresParam.split('-').map((s) => parseInt(s, 10))
      : cookieScores;
  const level =
    typeof levelParam === 'string'
      ? parseInt(levelParam, 10)
      : cookieLevel;
  const total = scores.reduce((sum, s) => sum + (Number.isNaN(s) ? 0 : s), 0);
  const finalScore = level ? scores[level - 1] ?? 0 : total;
  const animatedScore = useScoreAnimation(finalScore);

  useEffect(() => {
    setScores(scores);
    setLevel(level ?? null);
  }, [scores, level]);

  const handleNext = (): void => {
    if (level && level < puzzlesData.levels.length) {
      setScores(scores);
      setLevel(level + 1);
      router.push('/play');
    } else {
      setScores(scores);
      setLevel(null);
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Type Puzzle - 結果</title>
        <meta name="description" content="ゲーム結果を表示するページです。" />
      </Head>
      <Container maxW={{ base: 'container.sm', md: 'container.md' }} py={8}>
      <Heading size="lg" mb={4} textAlign="center">
        {level ? `Lv${level} 結果` : '結果'}
      </Heading>
      <Text fontSize="4xl" fontWeight="bold" mb={4} textAlign="center">
        {animatedScore} / 100
      </Text>
      <Box mb={4}>
        <List spacing={1}>
          {scores.map((s, i) => (
            <ListItem key={i}>Lv{i + 1}: {s} / 100</ListItem>
          ))}
        </List>
      </Box>
      {!level && <Text fontSize="lg" mb={4}>合計: {total} 点</Text>}
      <Button colorScheme="teal" onClick={handleNext}>
        {level && level < puzzlesData.levels.length ? '次のレベルへ' : 'TOPへ戻る'}
      </Button>
    </Container>
    </>
  );
}

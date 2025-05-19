import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import puzzlesData from '../data/puzzles.json';
import { useScoreAnimation } from '../src/hooks/useScoreAnimation';

export default function ResultPage(): JSX.Element {
  const router = useRouter();
  const scoresParam = router.query.scores;
  const levelParam = router.query.level;
  const scores =
    typeof scoresParam === 'string'
      ? scoresParam.split('-').map((s) => parseInt(s, 10))
      : [];
  const level =
    typeof levelParam === 'string' ? parseInt(levelParam, 10) : null;
  const total = scores.reduce((sum, s) => sum + (Number.isNaN(s) ? 0 : s), 0);
  const finalScore = level ? scores[level - 1] ?? 0 : total;
  const animatedScore = useScoreAnimation(finalScore);

  const handleNext = (): void => {
    if (level && level < puzzlesData.levels.length) {
      router.push({
        pathname: '/play',
        query: { level: level + 1, scores: scores.join('-') },
      });
    } else {
      router.push('/');
    }
  };

  return (
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
  );
}

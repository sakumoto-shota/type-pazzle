import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
  HStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Head from 'next/head';
import puzzlesData from '../data/puzzles.json';
import { useScoreAnimation } from '../src/hooks/useScoreAnimation';
import {
  getLevel,
  getScores,
  setLevel,
  setScores,
  getResults,
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
  const allResults = getResults() ?? [];
  const currentLevelResults = level ? allResults.find(r => r.level === level) : null;

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
      <VStack spacing={6}>
        <Heading size="lg" textAlign="center">
          {level ? `Lv${level} 結果` : '結果'}
        </Heading>
        <Text fontSize="4xl" fontWeight="bold" textAlign="center">
          {animatedScore} / 100
        </Text>
        
        {currentLevelResults && currentLevelResults.results.length > 0 && (
          <Box w="100%">
            <Heading size="md" mb={4}>問題ごとの結果</Heading>
            <Accordion allowToggle>
              {currentLevelResults.results.map((result, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <HStack spacing={3}>
                          <Icon
                            as={result.isCorrect ? FaCheckCircle : FaTimesCircle}
                            color={result.isCorrect ? 'green.500' : 'red.500'}
                          />
                          <Text>問題 {result.puzzleIndex + 1}</Text>
                          <Badge colorScheme={result.isCorrect ? 'green' : 'red'}>
                            {result.isCorrect ? '正解' : '不正解'}
                          </Badge>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold">説明:</Text>
                      <Text>{result.explanation}</Text>
                      <Text fontWeight="bold">問題コード:</Text>
                      <Box
                        bg="gray.100"
                        p={3}
                        borderRadius="md"
                        fontFamily="monospace"
                        fontSize="sm"
                        whiteSpace="pre"
                        overflowX="auto"
                        w="100%"
                      >
                        {result.code}
                      </Box>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}
        
        <Box w="100%">
          <Heading size="md" mb={4}>全レベルのスコア</Heading>
          <List spacing={2}>
            {scores.map((s, i) => {
              const levelResult = allResults.find(r => r.level === i + 1);
              const correctCount = levelResult ? levelResult.results.filter(r => r.isCorrect).length : 0;
              const totalCount = levelResult ? levelResult.results.length : 0;
              return (
                <ListItem key={i}>
                  <HStack justify="space-between">
                    <Text>Lv{i + 1}: {s} / 100</Text>
                    {totalCount > 0 && (
                      <Badge colorScheme="blue">
                        {correctCount}/{totalCount} 問正解
                      </Badge>
                    )}
                  </HStack>
                </ListItem>
              );
            })}
          </List>
        </Box>
        
        {!level && <Text fontSize="lg" fontWeight="bold">合計: {total} 点</Text>}
        
        <Button colorScheme="teal" onClick={handleNext} size="lg">
          {level && level < puzzlesData.levels.length ? '次のレベルへ' : 'TOPへ戻る'}
        </Button>
      </VStack>
    </Container>
    </>
  );
}

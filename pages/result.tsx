import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Alert,
  AlertIcon,
  Code,
  VStack,
  HStack,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useScoreAnimation } from '../src/hooks/useScoreAnimation';
import {
  getLevel,
  getScores,
  setLevel,
  setScores,
  getResults,
  type PuzzleResult,
} from '../src/utils/progress';

interface ResultDetailProps {
  results: PuzzleResult[];
}

const ResultDetail: React.FC<ResultDetailProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <Box mt={6}>
      <Heading size='md' mb={4}>
        問題詳細
      </Heading>
      <Accordion allowMultiple>
        {results.map((result, index) => (
          <AccordionItem key={result.puzzleIndex}>
            <h2>
              <AccordionButton>
                <HStack flex='1' textAlign='left' spacing={3}>
                  <Text fontWeight='bold'>問題 {result.puzzleIndex + 1}</Text>
                  <Badge colorScheme={result.answer ? 'green' : 'red'} variant='solid'>
                    {result.answer ? '正解 ✓' : '不正解 ✗'}
                  </Badge>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack align='stretch' spacing={4}>
                {/* 解説 */}
                <Alert status='info'>
                  <AlertIcon />
                  <Text>{result.description}</Text>
                </Alert>

                {/* 正解例 */}
                {result.correctAnswer && (
                  <Box>
                    <Text fontWeight='bold' mb={2}>
                      正解例:
                    </Text>
                    <Code
                      p={3}
                      display='block'
                      whiteSpace='pre-wrap'
                      bg='green.50'
                      border='1px solid'
                      borderColor='green.200'
                      borderRadius='md'
                    >
                      {result.correctAnswer}
                    </Code>
                  </Box>
                )}

                {/* ユーザーの回答 */}
                {result.userAnswer && (
                  <Box>
                    <Text fontWeight='bold' mb={2}>
                      あなたの回答:
                    </Text>
                    <Code
                      p={3}
                      display='block'
                      whiteSpace='pre-wrap'
                      bg={result.answer ? 'green.50' : 'red.50'}
                      border='1px solid'
                      borderColor={result.answer ? 'green.200' : 'red.200'}
                      borderRadius='md'
                    >
                      {result.userAnswer}
                    </Code>
                  </Box>
                )}

                {index < results.length - 1 && <Divider />}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default function ResultPage() {
  const router = useRouter();
  const [finalScore, setFinalScore] = useState(0);
  const [level, setLevelState] = useState<number | null>(null);
  const [currentResults, setCurrentResults] = useState<PuzzleResult[]>([]);

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

    // 現在のレベルの詳細結果を設定
    if (detailedResults && currentLevel) {
      const levelKey = String(currentLevel);
      const levelResults = detailedResults[levelKey];
      if (levelResults) {
        // パズルインデックス順にソート
        const sortedResults = [...levelResults].sort((a, b) => a.puzzleIndex - b.puzzleIndex);
        setCurrentResults(sortedResults);
      }
    }
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

        {/* 詳細表示コンポーネント */}
        {level && currentResults.length > 0 && <ResultDetail results={currentResults} />}

        <Box mt={6} textAlign='center'>
          <Button colorScheme='teal' onClick={handleNext}>
            TOPへ
          </Button>
        </Box>
      </Container>
    </>
  );
}

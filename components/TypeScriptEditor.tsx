
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  HStack,
  Progress,
} from '@chakra-ui/react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import { useTypeChecker } from '../hooks/useTypeChecker';
import puzzlesData from '../data/puzzles.json';

type Puzzles = typeof puzzlesData.levels;

const levels: Puzzles = puzzlesData.levels;
import { getCsrfToken } from '../src/utils/csrf';
import { setLevel, setScores as setScoresCookie, setResults, getResults } from '../src/utils/progress';

import { useRouter } from 'next/router';
import type { EditorProps, PuzzleResult, LevelResults } from '../types/components';

export const TypeScriptEditor = ({
  initialLevel = 1,
  initialScores,
  initialResults,
}: EditorProps) => {
  const [levelIndex] = useState(initialLevel - 1);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [code, setCode] = useState<string>(levels[initialLevel - 1].puzzles[0].code);
  const [finished] = useState(false);
  const { result, checkType } = useTypeChecker();
  const [csrfError, setCsrfError] = useState<string | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [scores, setScores] = useState<number[]>(
    initialScores ?? new Array(levels.length).fill(0)
  );
  const [levelResults, setLevelResults] = useState<PuzzleResult[]>(() => {
    if (initialResults) {
      const currentLevelResult = initialResults.find(r => r.level === initialLevel);
      return currentLevelResult?.results ?? [];
    }
    return [];
  });
  const monaco = useMonaco();
  const router = useRouter();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [1005],
      });
    }
  }, [monaco]);

  const goToNext = () => {
    if (puzzleIndex < levels[levelIndex].puzzles.length - 1) {
      setPuzzleIndex((p) => p + 1);
    } else {
      // Save level results before navigating
      const allResults = getResults() ?? [];
      const currentLevelResult: LevelResults = {
        level: levelIndex + 1,
        results: levelResults,
      };
      const updatedResults = [...allResults.filter(r => r.level !== levelIndex + 1), currentLevelResult];
      setResults(updatedResults);
      
      if (levelIndex < levels.length - 1) {
        setLevel(levelIndex + 2);
      } else {
        setLevel(null);
      }
      router.push('/result');
    }
  };

  useEffect(() => {
    if (finished) {
      setLevel(null);
      router.push('/result');
    }
  }, [finished, router]);

  useEffect(() => {
    // ページロード時にCookieを確認
    const token = getCsrfToken();
    if (!token) {
      setCsrfError('CSRFトークンが見つかりません。ページを手動で再読み込みしてください。');
    } else {
      setCsrfError(null);
    }
  }, []);

  useEffect(() => {
    setCode(levels[levelIndex].puzzles[puzzleIndex].code);
  }, [levelIndex, puzzleIndex]);

  useEffect(() => {
    if (!result) {
      return;
    }

    // Record puzzle result
    const puzzleResult: PuzzleResult = {
      puzzleIndex,
      isCorrect: result.success,
      explanation: levels[levelIndex].puzzles[puzzleIndex].explanation,
      code: levels[levelIndex].puzzles[puzzleIndex].code,
    };
    setLevelResults((prev) => [...prev, puzzleResult]);

    if (result.success) {
      setScores((prev) => {
        const arr = [...prev];
        arr[levelIndex] = Math.min(arr[levelIndex] + 20, 100);
        setScoresCookie(arr);
        return arr;
      });
    }

    goToNext();
  }, [result, levelIndex]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value ?? '');
  };

  const handleTypeCheck = async () => {
    await checkType(code);
  };

  const handleSkip = () => {
    goToNext();
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          TypeScript 型パズル - Lv{levels[levelIndex].level} ({puzzleIndex + 1}/
          {levels[levelIndex].puzzles.length})
        </Heading>
        <Box>
          <Text>
            進捗: {puzzleIndex + 1}/{levels[levelIndex].puzzles.length}
          </Text>
          <Progress
            value={
              ((puzzleIndex + 1) / levels[levelIndex].puzzles.length) * 100
            }
            size="sm"
            mt={2}
          />
        </Box>
        <Text fontSize="md" color="gray.600">
          {levels[levelIndex].puzzles[puzzleIndex].explanation}
        </Text>
        {finished && (
          <Alert status="success">
            <AlertIcon />すべてのレベルをクリアしました！
          </Alert>
        )}
        {csrfError && (
          <Alert status="error">
            <AlertIcon />
            {csrfError}
          </Alert>
        )}
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <MonacoEditor
            language="typescript"
            value={code}
            onChange={handleEditorChange}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
            }}
            height={300}
          />
        </Box>
        <Box>
          <HStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={handleTypeCheck}
              size="lg"
              isDisabled={!!csrfError || finished}
            >
              型チェック
            </Button>
            <Button
              colorScheme="gray"
              onClick={handleSkip}
              size="lg"
              isDisabled={finished}
            >
              次の問題へ
            </Button>
          </HStack>
          {result && (
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text
                as="pre"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                fontSize="sm"
                m={0}
              >
                {result.message}
              </Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
}; 
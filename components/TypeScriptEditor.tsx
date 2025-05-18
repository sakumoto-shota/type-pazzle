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
} from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import { useState, useEffect } from 'react';
import { useTypeChecker } from '../hooks/useTypeChecker';
import puzzlesData from '../data/puzzles.json';

type Puzzles = typeof puzzlesData.levels;

const levels: Puzzles = puzzlesData.levels;
import { getCsrfToken } from '../src/utils/csrf';

export const TypeScriptEditor = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [code, setCode] = useState<string>(levels[0].puzzles[0].code);
  const [finished, setFinished] = useState(false);
  const { result, checkType } = useTypeChecker();
  const [csrfError, setCsrfError] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>(
    new Array(levels.length).fill(0)
  );

  const goToNext = () => {
    if (puzzleIndex < levels[levelIndex].puzzles.length - 1) {
      setPuzzleIndex((p) => p + 1);
    } else if (levelIndex < levels.length - 1) {
      setLevelIndex((l) => l + 1);
      setPuzzleIndex(0);
    } else {
      setFinished(true);
    }
  };

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
    if (result?.success) {
      setScores((prev) => {
        const arr = [...prev];
        arr[levelIndex] = Math.min(arr[levelIndex] + 20, 100);
        return arr;
      });
      goToNext();
    }
  }, [result]);

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
          {scores.map((s, i) => (
            <Text key={i}>Lv{i + 1}: {s} / 100</Text>
          ))}
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
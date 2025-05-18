import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
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
      if (puzzleIndex < levels[levelIndex].puzzles.length - 1) {
        setPuzzleIndex(puzzleIndex + 1);
      } else if (levelIndex < levels.length - 1) {
        setLevelIndex(levelIndex + 1);
        setPuzzleIndex(0);
      }
      if (
        levelIndex === levels.length - 1 &&
        puzzleIndex === levels[levelIndex].puzzles.length - 1
      ) {
        setFinished(true);
      }
    }
  }, [result]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value ?? '');
  };

  const handleTypeCheck = async () => {
    await checkType(code);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          TypeScript 型パズル - Lv{levels[levelIndex].level} ({puzzleIndex + 1}/
          {levels[levelIndex].puzzles.length})
        </Heading>
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
          <Button
            colorScheme="blue"
            onClick={handleTypeCheck}
            size="lg"
            w="100%"
            isDisabled={!!csrfError || finished}
          >
            型チェック
          </Button>
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
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import { useState } from 'react';
import { useTypeChecker } from '../hooks/useTypeChecker';

export const TypeScriptEditor = () => {
  const [code, setCode] = useState<string>(`type User = ???;\nconst u: User = { name: "Taro", age: 20 };`);
  const { result, checkType } = useTypeChecker();

  const handleEditorChange = (value: string | undefined) => {
    setCode(value ?? '');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">TypeScript 型パズル</Heading>
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
            onClick={() => checkType(code)}
            size="lg"
            w="100%"
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
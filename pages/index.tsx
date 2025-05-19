import { Box, Container, Heading, List, ListItem, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import puzzlesData from '../data/puzzles.json';

export default function Home() {
  return (
    <Container maxW="container.md" py={8}>
      <Heading size="lg" mb={4}>
        TypeScript 型パズル
      </Heading>
      <Text mb={4}>エディタに回答を入力して型チェックを通過するとクリアです。</Text>
      <Box mb={4}>
        <Heading size="md" mb={2}>
          レベル一覧
        </Heading>
        <List spacing={1}>
          {puzzlesData.levels.map((l) => (
            <ListItem key={l.level}>
              <Link href={`/play?level=${l.level}`} passHref>
                <Button as="a" size="sm" colorScheme="teal">
                  Lv{l.level}
                </Button>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
      <Link href="/play" passHref>
        <Button colorScheme="teal">ゲームを始める</Button>
      </Link>
    </Container>
  );
}

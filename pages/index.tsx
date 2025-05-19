import { Box, Button, Container, Heading, List, ListItem, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import puzzlesData from '../data/puzzles.json';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Container maxW="container.md" py={8}>
      <Head>
        <title>TypeScript 型パズル</title>
        <meta
          name="description"
          content="TypeScript の型を使ったパズルゲームです"
        />
      </Head>
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
              <Button as={NextLink} href={`/play?level=${l.level}`} size="sm" colorScheme="teal">
                Lv{l.level}
              </Button>
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

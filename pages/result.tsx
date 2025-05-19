import { Box, Button, Container, Heading, List, ListItem, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ResultPage() {
  const router = useRouter();
  const scoresParam = router.query.scores;
  const scores = typeof scoresParam === 'string' ? scoresParam.split('-').map((s) => parseInt(s, 10)) : [];
  const total = scores.reduce((sum, s) => sum + (Number.isNaN(s) ? 0 : s), 0);

  return (
    <Container maxW="container.md" py={8}>
      <Head>
        <title>結果 - TypeScript 型パズル</title>
        <meta
          name="description"
          content="ゲームの結果を表示するページです"
        />
      </Head>
      <Heading size="lg" mb={4}>
        結果
      </Heading>
      <Box mb={4}>
        <List spacing={1}>
          {scores.map((s, i) => (
            <ListItem key={i}>Lv{i + 1}: {s} / 100</ListItem>
          ))}
        </List>
      </Box>
      <Text fontSize="lg" mb={4}>合計: {total} 点</Text>
      <Link href="/" passHref>
        <Button colorScheme="teal">TOPへ戻る</Button>
      </Link>
    </Container>
  );
}

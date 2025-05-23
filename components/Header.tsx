import { Box, Heading } from '@chakra-ui/react';
import Link from 'next/link';

const Header = () => (
  <Box as="header" bg="teal.500" color="white" py={2} px={4}>
    <Heading size="md">
      <Link href="/">Type Puzzle</Link>
    </Heading>
  </Box>
);

export default Header;

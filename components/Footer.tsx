import React from 'react';
import type { JSX } from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer = (): JSX.Element => (
  <Box as="footer" bg="gray.100" py={2} textAlign="center">
    <Text fontSize="sm">© 2025 Type Puzzle</Text>
  </Box>
);

export default Footer;

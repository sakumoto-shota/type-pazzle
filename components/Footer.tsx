import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const Footer = (): JSX.Element => (
  <Box as="footer" bg="gray.100" py={2} textAlign="center">
    <Text fontSize="sm">© 2023 Type Puzzle</Text>
  </Box>
);

export default Footer;

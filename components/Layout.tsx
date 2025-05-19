import React from 'react';
import type { JSX } from 'react';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import type { LayoutProps } from '../types/components';

export const Layout = ({ children }: LayoutProps): JSX.Element => (
  <Box minH="100vh" display="flex" flexDirection="column">
    <Header />
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer />
  </Box>
);

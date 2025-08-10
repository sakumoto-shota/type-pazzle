import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import type { LayoutProps } from '../types/components';

export const Layout = ({ children }: LayoutProps) => (
  <Box minH='100vh' display='flex' flexDirection='column'>
    <Header />
    <Box as='main' flex='1'>
      {children}
    </Box>
    <Footer />
  </Box>
);

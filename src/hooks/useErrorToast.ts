import { useToast } from '@chakra-ui/react';

export const useErrorToast = () => {
  const toast = useToast();

  const showError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'エラーが発生しました';
    toast({
      title: 'エラー',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };

  return { showError };
}; 
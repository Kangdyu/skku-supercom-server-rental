import { Button, Stack, Text, Title } from '@mantine/core';
import { isAxiosError } from 'axios';
import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = (() => {
    if (isAxiosError(error)) {
      return error.response?.data.message ?? error.message;
    } else {
      return error.message;
    }
  })();

  return (
    <Stack align="center">
      <Title order={2}>에러가 발생했습니다.</Title>
      <Text color="gray">{message}</Text>
      <Button onClick={() => resetErrorBoundary()} mt="24px">
        다시 시도
      </Button>
    </Stack>
  );
}

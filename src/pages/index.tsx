import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { ServerList } from '@/components/home/ServerList';
import { Container } from '@mantine/core';

export default function HomePage() {
  return (
    <Container py="32px">
      <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<div>loading...</div>}>
        <ServerList />
      </AsyncBoundary>
    </Container>
  );
}

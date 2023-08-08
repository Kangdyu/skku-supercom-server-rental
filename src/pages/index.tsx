import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { ServerList } from '@/components/home/ServerList';
import { Container, Title } from '@mantine/core';

export default function HomePage() {
  return (
    <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<div>loading...</div>}>
      <Container size={1540} py="32px">
        <Title mb="32px">성균관대학교 슈퍼컴퓨팅센터 서버대여</Title>
        <ServerList />
      </Container>
    </AsyncBoundary>
  );
}

import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { ServerInfo } from '@/components/reservation/ServerInfo';
import { ServerReservationForm } from '@/components/reservation/ServerReservationForm';
import { Container, LoadingOverlay, Skeleton, Title } from '@mantine/core';
import { useRouter } from 'next/router';

export default function ServerReservationPage() {
  const router = useRouter();
  const serverId = router.query.serverId ? Number(router.query.serverId) : null;

  if (!serverId) {
    return <LoadingOverlay loaderProps={{ size: 'xl' }} visible />;
  }

  return (
    <Container size="sm" py="60px">
      <Title mb="36px">서버 예약</Title>

      <Title order={2} mb="12px">
        서버 정보
      </Title>
      <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<Skeleton h="165px" visible />}>
        <ServerInfo serverId={serverId} />
      </AsyncBoundary>

      <Title order={2} mt="24px" mb="12px">
        신청 정보
      </Title>
      <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<Skeleton h="200px" visible />}>
        <ServerReservationForm serverId={serverId} />
      </AsyncBoundary>
    </Container>
  );
}

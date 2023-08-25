import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReservationCalendar } from '@/components/admin/servers/ReservationCalendar';
import { ServerInfoEditor } from '@/components/admin/servers/ServerInfoEditor';
import { ServerReservationTable } from '@/components/admin/servers/ServerReservationTable';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { Skeleton, Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';

export default function ServerDetailPage() {
  const router = useRouter();
  const serverId = router.query.id ? Number(router.query.id) : null;

  return (
    <AdminLayout
      title="서버 상세"
      description="서버의 상세 정보를 확인하고 수정할 수 있는 페이지입니다."
    >
      {serverId && (
        <Tabs defaultValue="detail">
          <Tabs.List>
            <Tabs.Tab value="detail">서버 정보</Tabs.Tab>
            <Tabs.Tab value="reservations">예약 현황</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="detail">
            <AsyncBoundary
              errorFallback={ErrorFallback}
              loadingFallback={<Skeleton height="500px" visible />}
            >
              <ServerInfoEditor serverId={serverId} />
            </AsyncBoundary>
          </Tabs.Panel>

          <Tabs.Panel value="reservations" p="16px">
            <AsyncBoundary
              errorFallback={ErrorFallback}
              loadingFallback={<Skeleton height="500px" visible />}
            >
              <Stack>
                <ReservationCalendar serverId={serverId} />
                <ServerReservationTable serverId={serverId} />
              </Stack>
            </AsyncBoundary>
          </Tabs.Panel>
        </Tabs>
      )}
    </AdminLayout>
  );
}

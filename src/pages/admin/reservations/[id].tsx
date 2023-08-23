import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReservationInfoEditor } from '@/components/admin/reservations/ReservationInfoEditor';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { Skeleton } from '@mantine/core';
import { useRouter } from 'next/router';

export default function ReservationDetailPage() {
  const router = useRouter();
  const reservationId = router.query.id ? Number(router.query.id) : null;

  return (
    <AdminLayout
      title="예약 상세"
      description="예약의 상세 정보를 확인하고 수정할 수 있는 페이지입니다."
    >
      {reservationId && (
        <AsyncBoundary
          errorFallback={ErrorFallback}
          loadingFallback={<Skeleton height="500px" visible />}
        >
          <ReservationInfoEditor reservationId={reservationId} />
        </AsyncBoundary>
      )}
    </AdminLayout>
  );
}

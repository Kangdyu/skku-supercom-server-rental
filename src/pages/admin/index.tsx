import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServerTable } from '@/components/admin/servers/ServerTable';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { Skeleton } from '@mantine/core';

export default function AdminMainPage() {
  return (
    <AdminLayout title="서버 관리" description="서버를 추가/관리할 수 있는 페이지입니다.">
      <AsyncBoundary
        errorFallback={ErrorFallback}
        loadingFallback={
          <>
            <Skeleton height="530px" visible />
          </>
        }
      >
        <ServerTable />
      </AsyncBoundary>
    </AdminLayout>
  );
}

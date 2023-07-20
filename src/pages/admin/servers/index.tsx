import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServerTable } from '@/components/admin/servers/ServerTable';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { Skeleton } from '@mantine/core';

export default function AdminServersPage() {
  return (
    <AdminLayout title="서버 관리" description="서버 관리 페이지">
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

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServerTable } from '@/components/admin/ServerTable';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { Button, Group, Skeleton } from '@mantine/core';
import Link from 'next/link';

export default function AdminServersPage() {
  return (
    <AdminLayout title="서버 관리" description="서버 관리 페이지">
      <AsyncBoundary
        errorFallback={ErrorFallback}
        loadingFallback={
          <>
            <Skeleton height="36px" mb="12px" visible />
            <Skeleton height="500px" visible />
          </>
        }
      >
        <Group position="right" mb="12px">
          <Button component={Link} href="/admin/server/add">
            서버 추가
          </Button>
        </Group>

        <ServerTable />
      </AsyncBoundary>
    </AdminLayout>
  );
}

import { ServerAddModal } from '@/components/admin/servers/ServerAddModal';
import { useServers } from '@/hooks/useServers';
import { formatDate } from '@/lib/date';
import {
  ActionIcon,
  Button,
  Group,
  Pagination,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileDots } from '@tabler/icons-react';
import { useState } from 'react';

export function ServerTable() {
  const [opened, { open, close }] = useDisclosure();
  const [page, setPage] = useState(1);
  const { data, mutate } = useServers({ pageSize: 10, pageNumber: page });

  if (data.totalCount === 0) {
    return (
      <Stack align="center">
        <Title order={3}>서버가 없습니다.</Title>
        <Text color="gray">서버를 추가해보세요!</Text>
      </Stack>
    );
  }

  return (
    <>
      <ServerAddModal
        opened={opened}
        onClose={() => {
          mutate();
          close();
        }}
      />

      <Table sx={{ backgroundColor: 'white', borderRadius: 8 }}>
        <thead>
          <tr>
            <th>id</th>
            <th>서버명</th>
            <th>생성일자</th>
            <th>수정일자</th>
            <th>설정</th>
          </tr>
        </thead>
        <tbody>
          {data.contents.map((server) => (
            <tr key={server.id}>
              <td>{server.id}</td>
              <td>{server.name}</td>
              <td>{formatDate(server.createdAt)}</td>
              <td>{formatDate(server.updatedAt)}</td>
              <td>
                <Group>
                  <Tooltip label="상세 보기">
                    <ActionIcon>
                      <IconFileDots />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <Group position="apart" p="12px">
                <Pagination value={page} onChange={setPage} total={data.totalPages} />
                <Button onClick={open}>서버 추가</Button>
              </Group>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

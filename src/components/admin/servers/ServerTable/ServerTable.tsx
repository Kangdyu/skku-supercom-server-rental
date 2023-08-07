import { ServerAddModal } from '@/components/admin/servers/ServerAddModal';
import { useServers } from '@/hooks/useServers';
import { formatDate } from '@/lib/date';
import {
  ActionIcon,
  Badge,
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
import Link from 'next/link';
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

  console.log(data);

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
            <th>공개 여부</th>
            <th>예약 가능 여부</th>
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
              <td>
                {server.isPublic ? (
                  <Badge color="green">공개</Badge>
                ) : (
                  <Badge color="red">비공개</Badge>
                )}
              </td>
              <td>
                {server.isAvailable ? (
                  <Badge color="green">예약 가능</Badge>
                ) : (
                  <Badge color="red">예약 불가</Badge>
                )}
              </td>
              <td>{formatDate(server.createdAt)}</td>
              <td>{formatDate(server.updatedAt)}</td>
              <td>
                <Group>
                  <Tooltip label="상세 보기">
                    <ActionIcon component={Link} href={`/admin/servers/${server.id}`}>
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
            <td colSpan={7}>
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

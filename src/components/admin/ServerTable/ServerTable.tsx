import { useServers } from '@/hooks/useServers';
import { formatDate } from '@/lib/date';
import { ActionIcon, Stack, Table, Text, Title } from '@mantine/core';
import { IconDetails } from '@tabler/icons-react';

export function ServerTable() {
  const { data } = useServers({ pageSize: 10, pageNumber: 1 });

  if (data.totalCount === 0) {
    return (
      <Stack align="center">
        <Title order={3}>서버가 없습니다.</Title>
        <Text color="gray">서버를 추가해보세요!</Text>
      </Stack>
    );
  }

  return (
    <Table sx={{ backgroundColor: 'white', borderRadius: 8 }}>
      <thead>
        <tr>
          <th>id</th>
          <th>서버명</th>
          <th>생성일자</th>
          <th>수정일자</th>
          <th>상세</th>
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
              <ActionIcon>
                <IconDetails />
              </ActionIcon>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

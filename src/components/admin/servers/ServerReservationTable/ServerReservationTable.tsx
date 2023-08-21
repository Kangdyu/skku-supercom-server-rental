import { ServerReservationRow } from '@/components/admin/servers/ServerReservationTable/ServerReservationRow';
import { useReservations } from '@/hooks/useReservations';
import { Group, Pagination, Table, Text, Title } from '@mantine/core';
import { useState } from 'react';

interface ServerReservationTableProps {
  serverId: number;
}

export function ServerReservationTable({ serverId }: ServerReservationTableProps) {
  const [page, setPage] = useState(1);
  const { data } = useReservations({ pageSize: 10, pageNumber: page, serverId });

  if (data.totalCount === 0) {
    return <Text>아직 예약이 없습니다.</Text>;
  }

  return (
    <>
      <Title order={3}>테이블 보기</Title>
      <Table sx={{ backgroundColor: 'white', borderRadius: 8 }}>
        <thead>
          <tr>
            <th>서버명</th>
            <th>예약 희망일</th>
            <th>신청서</th>
            <th>예약 생성 일자</th>
            <th>설정</th>
          </tr>
        </thead>
        <tbody>
          {data.contents.map((reservation) => (
            <ServerReservationRow key={reservation.id} reservation={reservation} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <Group position="apart" p="12px">
                <Pagination value={page} onChange={setPage} total={data.totalPages} />
              </Group>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

import { useReservations } from '@/hooks/useReservations';
import { formatDate } from '@/lib/date';
import {
  ActionIcon,
  Button,
  Group,
  Pagination,
  Popover,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconFileDots } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

interface ServerReservationtableProps {
  serverId: number;
}

export function ServerReservationtable({ serverId }: ServerReservationtableProps) {
  const [page, setPage] = useState(1);
  const { data } = useReservations({ pageSize: 10, pageNumber: page, serverId });

  if (data.totalCount === 0) {
    return <Text>아직 예약이 없습니다.</Text>;
  }

  return (
    <>
      <Table sx={{ backgroundColor: 'white', borderRadius: 8 }}>
        <thead>
          <tr>
            <th>서버명</th>
            <th>예약자</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>소속대학</th>
            <th>전공</th>
            <th>직무</th>
            <th>예약 희망일</th>
            <th>예약 생성 일자</th>
            <th>설정</th>
          </tr>
        </thead>
        <tbody>
          {data.contents.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.server.name}</td>
              <td>{reservation.user.name}</td>
              <td>{reservation.user.email}</td>
              <td>{reservation.user.phone}</td>
              <td>{reservation.user.college}</td>
              <td>{reservation.user.major}</td>
              <td>{reservation.user.role}</td>
              <td>
                <Popover>
                  <Popover.Target>
                    <Button size="xs">날짜 보기</Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    {reservation.reservationDates.map((data) => (
                      <Text key={data.id}>{formatDate(data.date)}</Text>
                    ))}
                  </Popover.Dropdown>
                </Popover>
              </td>
              <td>{formatDate(reservation.createdAt)}</td>
              <td>
                <Group>
                  <Tooltip label="상세 보기">
                    <ActionIcon component={Link} href="#">
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
              </Group>
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

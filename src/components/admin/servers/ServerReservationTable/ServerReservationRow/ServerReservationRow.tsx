import { formatDate } from '@/lib/date';
import { ReservationResponse } from '@/types/api';
import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { IconDownload, IconFileDots } from '@tabler/icons-react';
import Link from 'next/link';

interface ServerReservationRowProps {
  reservation: ReservationResponse;
}

export function ServerReservationRow({ reservation }: ServerReservationRowProps) {
  return (
    <>
      <tr key={reservation.id}>
        <td>{reservation.server.name}</td>
        <td>
          <Button
            component="a"
            href={reservation.applicationFileUrl}
            download
            leftIcon={<IconDownload size="16px" />}
            size="xs"
          >
            파일 다운로드
          </Button>
        </td>
        <td>{formatDate(reservation.createdAt)}</td>
        <td>
          <Group>
            <Tooltip label="예약 상세">
              <ActionIcon component={Link} href={`/admin/reservations/${reservation.id}`}>
                <IconFileDots />
              </ActionIcon>
            </Tooltip>
          </Group>
        </td>
      </tr>
    </>
  );
}

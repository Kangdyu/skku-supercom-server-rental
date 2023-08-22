import { ReservationDeleteModal } from '@/components/admin/servers/ReservationDeleteModal/ReservationDeleteModal';
import { formatDate } from '@/lib/date';
import { ReservationResponse } from '@/types/api';
import { ActionIcon, Button, Group, Popover, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconTrash } from '@tabler/icons-react';

interface ServerReservationRowProps {
  reservation: ReservationResponse;
}

export function ServerReservationRow({ reservation }: ServerReservationRowProps) {
  const [opened, { open, close }] = useDisclosure();

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
            <Tooltip label="예약 삭제">
              <ActionIcon onClick={open}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Group>
        </td>
      </tr>

      <ReservationDeleteModal reservationId={reservation.id} opened={opened} onClose={close} />
    </>
  );
}

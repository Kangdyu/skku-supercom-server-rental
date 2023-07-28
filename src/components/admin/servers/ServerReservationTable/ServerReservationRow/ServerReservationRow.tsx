import { ReservationDeleteModal } from '@/components/admin/servers/ReservationDeleteModal/ReservationDeleteModal';
import { formatDate } from '@/lib/date';
import { ReservationResponse } from '@/types/api';
import { ActionIcon, Button, Group, Popover, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';

interface ServerReservationRowProps {
  reservation: ReservationResponse;
}

export function ServerReservationRow({ reservation }: ServerReservationRowProps) {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
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

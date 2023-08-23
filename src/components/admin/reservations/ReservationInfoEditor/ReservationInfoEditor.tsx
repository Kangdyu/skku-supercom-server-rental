import { ReservationCalendar } from '@/components/admin/servers/ReservationCalendar';
import { Row } from '@/components/common/Row';
import { ReservationDatePicker } from '@/components/reservation/ServerReservationForm/ReservationDatePicker';
import { useReservation } from '@/hooks/useReservation';
import { Button, Paper, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface ReservationInfoEditorProps {
  reservationId: number;
}

export function ReservationInfoEditor({ reservationId }: ReservationInfoEditorProps) {
  const { data: reservation } = useReservation(reservationId);

  return (
    <Paper withBorder>
      <Stack spacing={0}>
        <Row label="id">{reservation.id}</Row>
        <Row label="신청서">
          <Button
            component="a"
            href={reservation.applicationFileUrl}
            download
            leftIcon={<IconDownload />}
          >
            신청서 파일 다운로드
          </Button>
        </Row>
        <Row label="예약 날짜">
          <ReservationCalendar
            serverId={reservation.serverId}
            reservationId={reservation.id}
            withTitle={false}
          />
        </Row>
      </Stack>
    </Paper>
  );
}

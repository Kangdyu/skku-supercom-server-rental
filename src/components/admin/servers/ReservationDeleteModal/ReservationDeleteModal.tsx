import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { Button, Group, Modal, ModalProps, Stack } from '@mantine/core';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface ReservationDeleteModalProps extends ModalProps {
  reservationId: number;
}

export function ReservationDeleteModal({
  reservationId,
  onClose,
  ...props
}: ReservationDeleteModalProps) {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axiosClient.delete(`/reservations/${reservationId}`);
      mutate((key) => typeof key === 'string' && key.startsWith('/reservations'));
      showSuccessNotification({
        title: '예약 삭제 완료',
        message: '예약이 삭제되었습니다.',
      });
      onClose();
    } catch (e) {
      console.error(e);
      showFailNotification({
        title: '예약 삭제 실패',
        message: '오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="예약을 삭제하시겠습니까?"
      centered
      onClose={onClose}
      styles={{ title: { fontWeight: 'bold' } }}
      {...props}
    >
      <Stack>
        삭제한 예약은 복구할 수 없습니다.
        <Group position="right">
          <Button color="red" onClick={onDelete} loading={isLoading}>
            삭제
          </Button>
          <Button onClick={onClose}>취소</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

import { getAuthHeaderObject } from '@/lib/auth';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { Button, Group, Modal, ModalProps, Stack } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface ServerDeleteModalProps extends ModalProps {
  serverId: number;
}

export function ServerDeleteModal({ serverId, onClose, ...props }: ServerDeleteModalProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axiosClient.delete(`/servers/${serverId}`, getAuthHeaderObject());
      mutate((key) => typeof key === 'string' && key.startsWith('/servers'));
      showSuccessNotification({
        title: '서버 삭제 완료',
        message: '서버가 삭제되었습니다.',
      });
      onClose();
      router.replace('/admin/servers');
    } catch (e) {
      console.error(e);
      showFailNotification({
        title: '서버 삭제 실패',
        message: '오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="서버를 삭제하시겠습니까?"
      centered
      onClose={onClose}
      styles={{ title: { fontWeight: 'bold' } }}
      {...props}
    >
      <Stack>
        삭제한 서버는 복구할 수 없으며, 예약도 모두 삭제됩니다. 정말로 삭제하시겠습니까?
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

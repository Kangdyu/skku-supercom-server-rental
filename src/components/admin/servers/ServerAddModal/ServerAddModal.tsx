import { ServerDTO, ServerResponse } from '@/types/api';
import { Button, Group, Modal, ModalProps, Stack, Text, TextInput } from '@mantine/core';
import { MonthPicker, MonthPickerInput } from '@mantine/dates';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import { axiosClient } from '@/lib/fetcher';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

type ServerAddInputs = ServerDTO;

export function ServerAddModal({ onClose, ...props }: ModalProps) {
  const [selectedMonths, setSelectedMonths] = useState<Date[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ServerAddInputs>();

  const onCloseModal = () => {
    reset();
    setSelectedMonths([]);
    onClose();
  };

  const onSubmit: SubmitHandler<ServerAddInputs> = async (data) => {
    const dates = selectedMonths.map((date) => `${dayjs(date).year()}-${dayjs(date).month() + 1}`);

    try {
      const {
        data: { id: serverId },
      } = await axiosClient.post<ServerResponse>('/servers', data);

      if (dates.length !== 0) {
        await axiosClient.post(`/servers/${serverId}/availability`, { dates });
      }

      notifications.show({
        title: '서버 추가 완료',
        message: '서버가 추가되었습니다.',
        color: 'green',
        icon: <IconCheck />,
      });
      onCloseModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      title="서버 추가"
      onClose={onCloseModal}
      centered
      closeOnClickOutside={false}
      styles={{ title: { fontWeight: 'bold' } }}
      {...props}
    >
      <Text size="sm" color="gray" mb="16px">
        아래 값들은 추후 수정/추가 가능합니다.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="서버명"
            placeholder="예약자에게 공개되는 이름입니다."
            withAsterisk
            error={formErrors.name?.message}
            {...register('name', { required: '서버명을 입력해주세요.' })}
          />
          <TextInput label="설명" placeholder="GPU: V100, ..." {...register('description')} />
          <Text size="sm">예약 가능 월</Text>
          <Group position="center">
            <MonthPicker
              type="multiple"
              value={selectedMonths}
              onChange={setSelectedMonths}
              minDate={new Date()}
              locale="ko"
            />
          </Group>
          <Button type="submit" loading={isSubmitting}>
            추가
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}

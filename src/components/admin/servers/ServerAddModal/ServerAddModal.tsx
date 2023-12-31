import { ServerDTO, ServerResponse } from '@/types/api';
import {
  Button,
  Checkbox,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { MonthPicker, MonthPickerInput } from '@mantine/dates';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { axiosClient } from '@/lib/fetcher';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getAuthHeaderObject } from '@/lib/auth';

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
      } = await axiosClient.post<ServerResponse>('/servers', data, getAuthHeaderObject());

      if (dates.length !== 0) {
        await axiosClient.post(
          `/servers/${serverId}/availability`,
          { dates },
          getAuthHeaderObject(),
        );
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
      notifications.show({
        title: '서버 추가 실패',
        message: '오류가 발생했습니다.',
        color: 'red',
        icon: <IconX />,
      });
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
          <Textarea
            label="설명"
            placeholder="GPU: V100, ..."
            minRows={3}
            maxRows={4}
            autosize
            {...register('description')}
          />
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
          <Checkbox
            label="유저에게 공개?"
            description="체크 시 유저들에게 해당 서버가 보여집니다."
            {...register('isPublic')}
          />
          <Checkbox
            label="예약 가능?"
            description="체크 시 유저들이 서버를 예약할 수 있게 됩니다."
            {...register('isAvailable')}
          />
          <Button type="submit" loading={isSubmitting}>
            추가
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}

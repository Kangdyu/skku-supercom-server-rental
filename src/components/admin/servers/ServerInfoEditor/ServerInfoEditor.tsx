import { Row } from '@/components/admin/Row';
import { useServer } from '@/hooks/useServer';
import { axiosClient } from '@/lib/fetcher';
import { ServerResponse } from '@/types/api';
import { Box, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ServerInfoInputs {
  name: string;
  description: string;
}

interface ServerInfoEditorProps {
  serverId: number;
}

export function ServerInfoEditor({ serverId }: ServerInfoEditorProps) {
  const { data, mutate } = useServer(serverId);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ServerInfoInputs>({
    defaultValues: {
      name: data.name,
      description: data.description ?? undefined,
    },
  });
  const [availableMonths, setAvailableMonths] = useState<Date[]>([]);
  const [availableMonthsBeforeEditing, setAvailableMonthsBeforeEditing] = useState<Date[]>([]);
  useEffect(() => {
    if (data == null) return;

    const availableDates = data.serverAvailability.map((availability) =>
      dayjs(`${availability.year}-${availability.month}`).toDate(),
    );
    setAvailableMonths(availableDates);
  }, [data]);

  const onSubmit: SubmitHandler<ServerInfoInputs> = async (data) => {
    const dates = availableMonths.map((date) => `${dayjs(date).year()}-${dayjs(date).month() + 1}`);

    try {
      await Promise.all([
        axiosClient.put<ServerResponse>(`/servers/${serverId}`, data),
        axiosClient.put(`/servers/${serverId}/availability`, { dates }),
      ]);

      notifications.show({
        title: '서버 수정 완료',
        message: '서버 정보가 수정되었습니다.',
        color: 'green',
        icon: <IconCheck />,
      });

      setEditing(false);
      mutate();
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

  const onStartEditing = () => {
    setAvailableMonthsBeforeEditing(availableMonths);
    setEditing(true);
  };

  const onCancelEditing = () => {
    setValue('name', data.name);
    setValue('description', data.description ?? '');
    setAvailableMonths(availableMonthsBeforeEditing);
    clearErrors();
    setEditing(false);
  };

  return (
    <Box component="section" bg="white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={0}>
          <Row label="id">
            <Text>{data.id}</Text>
          </Row>
          <Row label="서버명">
            <TextInput
              w="300px"
              disabled={!editing}
              error={formErrors.name?.message}
              {...register('name', { required: '서버명을 입력해주세요.' })}
            />
          </Row>
          <Row label="설명">
            <TextInput
              w="300px"
              disabled={!editing}
              error={formErrors.description?.message}
              {...register('description')}
            />
          </Row>
          <Row label="예약 가능 월">
            <MonthPickerInput
              type="multiple"
              value={availableMonths}
              onChange={setAvailableMonths}
              minDate={new Date()}
              disabled={!editing}
              locale="ko"
              w="300px"
            />
          </Row>
          <Group p="16px" position="right">
            {editing ? (
              <>
                <Button type="submit">저장</Button>
                <Button onClick={onCancelEditing} color="red">
                  취소
                </Button>
              </>
            ) : (
              <Button onClick={onStartEditing}>수정</Button>
            )}
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
import { ServerDeleteModal } from '@/components/admin/servers/ServerInfoEditor/ServerDeleteModal';
import { Row } from '@/components/common/Row';
import { useServer } from '@/hooks/useServer';
import { getAuthHeaderObject } from '@/lib/auth';
import { axiosClient } from '@/lib/fetcher';
import { ServerResponse } from '@/types/api';
import { Badge, Box, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
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
  const { data: server, mutate } = useServer(serverId);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ServerInfoInputs>({
    defaultValues: {
      name: server.name,
      description: server.description ?? undefined,
    },
  });

  const [availableMonths, setAvailableMonths] = useState<Date[]>([]);
  const [availableMonthsBeforeEditing, setAvailableMonthsBeforeEditing] = useState<Date[]>([]);
  const [publicInEdit, setPublicInEdit] = useState(server.isPublic ?? true);
  const [availableInEdit, setAvailableInEdit] = useState(server.isAvailable ?? true);

  useEffect(() => {
    if (server == null) return;

    const availableDates = server.serverAvailability.map((availability) =>
      dayjs(`${availability.year}-${availability.month}`).toDate(),
    );
    setAvailableMonths(availableDates);
  }, [server]);

  const onSubmit: SubmitHandler<ServerInfoInputs> = async (data) => {
    const dates = availableMonths.map((date) => `${dayjs(date).year()}-${dayjs(date).month() + 1}`);

    try {
      await Promise.all([
        axiosClient.put<ServerResponse>(
          `/servers/${serverId}`,
          { ...data, isPublic: publicInEdit, isAvailable: availableInEdit },
          getAuthHeaderObject(),
        ),
        axiosClient.put(`/servers/${serverId}/availability`, { dates }, getAuthHeaderObject()),
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
    setValue('name', server.name);
    setValue('description', server.description ?? '');
    setAvailableMonths(availableMonthsBeforeEditing);
    setPublicInEdit(server.isPublic);
    setAvailableInEdit(server.isAvailable);
    clearErrors();
    setEditing(false);
  };

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure();

  return (
    <>
      <Box component="section" bg="white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={0}>
            <Row label="id">
              <Text>{server.id}</Text>
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
            <Row label="공개 여부">
              <Group spacing={32} h="100%">
                {!editing &&
                  (server.isPublic ? (
                    <Badge color="green">공개</Badge>
                  ) : (
                    <Badge color="red">비공개</Badge>
                  ))}
                {editing && (
                  <Button
                    onClick={() => setPublicInEdit((p) => !p)}
                    color={publicInEdit ? 'red' : 'green'}
                  >
                    {publicInEdit ? '비공개로 전환' : '공개로 전환'}
                  </Button>
                )}
              </Group>
            </Row>
            <Row label="예약 가능 여부">
              <Group spacing={32} h="100%">
                {!editing &&
                  (server.isAvailable ? (
                    <Badge color="green">예약 가능</Badge>
                  ) : (
                    <Badge color="red">예약 불가</Badge>
                  ))}
                {editing && (
                  <Button
                    onClick={() => setAvailableInEdit((p) => !p)}
                    color={availableInEdit ? 'red' : 'green'}
                  >
                    {availableInEdit ? '예약 불가로 전환' : '예약 가능으로 전환'}
                  </Button>
                )}
              </Group>
            </Row>

            <Group p="16px" position="right">
              {editing ? (
                <>
                  <Button key="save" type="submit" loading={isSubmitting}>
                    저장
                  </Button>
                  <Button key="cancel" onClick={onCancelEditing} color="red">
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button key="modify" onClick={onStartEditing}>
                    수정
                  </Button>
                  <Button key="delete" onClick={openDeleteModal} color="red">
                    삭제
                  </Button>
                </>
              )}
            </Group>
          </Stack>
        </form>
      </Box>

      <ServerDeleteModal
        serverId={serverId}
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
      />
    </>
  );
}

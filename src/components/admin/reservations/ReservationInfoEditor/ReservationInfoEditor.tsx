import { ReservationDeleteModal } from '@/components/admin/reservations/ReservationInfoEditor/ReservationDeleteModal';
import { ReservationCalendar } from '@/components/admin/servers/ReservationCalendar';
import { Row } from '@/components/common/Row';
import { ReservationDatePicker } from '@/components/common/ReservationDatePicker';
import { useReservation } from '@/hooks/useReservation';
import { useReservationDates } from '@/hooks/useReservationDates';
import { getAuthHeaderObject } from '@/lib/auth';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { uploadFile } from '@/lib/uploadFile';
import { Button, FileInput, Group, Paper, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface ReservationInfoInputs {
  applicationFile?: File;
  dates: Date[];
}

interface ReservationInfoEditorProps {
  reservationId: number;
}

export function ReservationInfoEditor({ reservationId }: ReservationInfoEditorProps) {
  const router = useRouter();

  const { data: reservation, mutate: reservationMutate } = useReservation(reservationId);
  const { data: reservationDates, mutate: reservationDateMutate } = useReservationDates({
    reservationId,
  });

  const [editing, setEditing] = useState(false);

  const {
    control,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ReservationInfoInputs>({
    defaultValues: {
      dates: reservationDates,
    },
  });

  const onSubmit: SubmitHandler<ReservationInfoInputs> = async (data) => {
    try {
      let fileUrl;
      if (data.applicationFile != null) {
        fileUrl = await uploadFile(data.applicationFile);
      }

      const body = {
        applicationFileUrl: fileUrl,
        dates: data.dates,
      };

      await axiosClient.patch(`/reservations/${reservationId}`, body, getAuthHeaderObject());

      showSuccessNotification({
        title: '예약 정보 수정 완료',
        message: '예약 정보가 수정되었습니다.',
      });

      setEditing(false);
      reservationMutate();
      reservationDateMutate();
    } catch (e) {
      showFailNotification({
        title: '예약 정보 수정 실패',
        message: '오류가 발생했습니다.',
      });
    }
  };

  const onStartEditing = () => {
    setEditing(true);
  };

  const onCancelEditing = () => {
    setValue('applicationFile', undefined);
    setValue('dates', reservationDates);
    clearErrors();
    setEditing(false);
  };

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(
    false,
    { onClose: () => router.push(`/admin/servers/${reservation.serverId}`) },
  );

  return (
    <>
      <Paper withBorder>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={0}>
            <Row label="id">{reservation.id}</Row>
            <Row label="신청서">
              {editing ? (
                <Controller
                  name="applicationFile"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      w="400px"
                      icon={<IconUpload size="16px" />}
                      placeholder="파일 교체가 필요하면 클릭하여 업로드해주세요."
                      error={formErrors.applicationFile?.message}
                      {...field}
                    />
                  )}
                />
              ) : (
                <Button
                  component="a"
                  href={reservation.applicationFileUrl}
                  download
                  leftIcon={<IconDownload />}
                >
                  신청서 파일 다운로드
                </Button>
              )}
            </Row>
            <Row label="예약 날짜">
              {editing ? (
                <Controller
                  name="dates"
                  control={control}
                  rules={{
                    required: '예약 날짜를 선택해주세요.',
                  }}
                  render={({ field: { value, onChange } }) => (
                    <ReservationDatePicker
                      serverId={reservation.serverId}
                      value={value}
                      onChange={onChange}
                      error={formErrors.dates?.message}
                      withTitle={false}
                      previouslyReservedDates={reservationDates}
                    />
                  )}
                />
              ) : (
                <ReservationCalendar
                  serverId={reservation.serverId}
                  reservationId={reservation.id}
                  withTitle={false}
                />
              )}
            </Row>

            <Group p="16px" position="right">
              {editing ? (
                <>
                  <Button key="save" type="submit" loading={isSubmitting}>
                    내용 저장
                  </Button>
                  <Button key="cancel" onClick={onCancelEditing} color="red">
                    수정 취소
                  </Button>
                </>
              ) : (
                <>
                  <Button key="modify" onClick={onStartEditing}>
                    예약 수정
                  </Button>
                  <Button key="delete" onClick={openDeleteModal} color="red">
                    예약 삭제
                  </Button>
                </>
              )}
            </Group>
          </Stack>
        </form>
      </Paper>

      <ReservationDeleteModal
        reservationId={reservation.id}
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
      />
    </>
  );
}

import { ReservationCalendarInput } from '@/components/reservation/ServerReservationForm/ReservationCalendarInput';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { ReservationDTO } from '@/types/api';
import { Anchor, Button, FileInput, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = ReservationDTO;

interface ServerReservationFormProps {
  serverId: number;
}

export function ServerReservationForm({ serverId }: ServerReservationFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await axiosClient.post('/reservations', { ...data, serverId });

      router.push('/');

      showSuccessNotification({
        title: '예약 성공',
        message: '관리자가 확인 후 연락처로 별도 안내드릴 예정입니다.',
      });
    } catch (e) {
      console.error(e);
      showFailNotification({ title: '예약 실패', message: '오류가 발생했습니다.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Anchor
          href="https://supercom.skku.edu/supercom/rule.do?mode=view&articleNo=42277&article.offset=0&articleLimit=10"
          target="_blank"
          color="blue"
        >
          신청서 양식 다운로드 &gt;
        </Anchor>

        <Controller
          name="applicationFile"
          control={control}
          rules={{
            required: '파일을 선택해주세요.',
          }}
          render={({ field }) => (
            <FileInput
              label="신청서 파일 업로드"
              icon={<IconUpload size="16px" />}
              placeholder="클릭하여 파일 업로드"
              error={formErrors.applicationFile?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="dates"
          control={control}
          rules={{
            required: '예약 날짜를 선택해주세요.',
          }}
          render={({ field }) => (
            <ReservationCalendarInput
              serverId={serverId}
              {...field}
              error={formErrors.dates?.message}
            />
          )}
        />

        <Button type="submit" loading={isSubmitting}>
          예약
        </Button>
      </Stack>
    </form>
  );
}

import { ReservationCalendarInput } from '@/components/reservation/ServerReservationForm/ReservationCalendarInput';
import { ReservationDatePicker } from '@/components/common/ReservationDatePicker';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { uploadFile } from '@/lib/uploadFile';
import { ReservationDTO } from '@/types/api';
import { Anchor, Button, FileInput, Stack } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface FormInputs {
  serverId: number;
  applicationFile: File;
  dates: Date[];
}

interface ServerReservationFormProps {
  serverId: number;
}

export function ServerReservationForm({ serverId }: ServerReservationFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      dates: [],
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const url = await uploadFile(data.applicationFile);

      await axiosClient.post('/reservations', {
        serverId,
        applicationFileUrl: url,
        dates: data.dates,
      });

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
          render={({ field: { value, onChange } }) => (
            <ReservationDatePicker
              serverId={serverId}
              value={value}
              onChange={onChange}
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

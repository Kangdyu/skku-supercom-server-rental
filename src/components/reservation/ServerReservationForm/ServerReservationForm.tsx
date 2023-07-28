import { ReservationCalendarInput } from '@/components/reservation/ServerReservationForm/ReservationCalendarInput';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { ReservationDTO } from '@/types/api';
import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = ReservationDTO;

interface ServerReservationFormProps {
  serverId: number;
}

export function ServerReservationForm({ serverId }: ServerReservationFormProps) {
  const router = useRouter();

  const {
    register,
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
        <Group grow>
          <TextInput
            label="이름"
            placeholder="홍길동"
            error={formErrors.user?.name?.message}
            withAsterisk
            {...register('user.name', { required: '이름을 입력해주세요.' })}
          />
          <TextInput
            label="전화번호"
            placeholder="- 제외, 숫자만 입력"
            error={formErrors.user?.phone?.message}
            withAsterisk
            {...register('user.phone', { required: '전화번호를 입력해주세요.' })}
          />
          <TextInput
            label="이메일"
            placeholder="hong@skku.edu"
            error={formErrors.user?.email?.message}
            withAsterisk
            {...register('user.email', { required: '이메일을 입력해주세요.' })}
          />
        </Group>
        <Group grow>
          <TextInput
            label="소속대학"
            placeholder="소프트웨어융합대학"
            error={formErrors.user?.college?.message}
            withAsterisk
            {...register('user.college', { required: '소속대학을 입력해주세요.' })}
          />
          <TextInput
            label="전공"
            placeholder="소프트웨어학과"
            error={formErrors.user?.major?.message}
            withAsterisk
            {...register('user.major', { required: '전공을 입력해주세요.' })}
          />
          <TextInput
            label="직무"
            placeholder="교수, 대학원생, ..."
            error={formErrors.user?.role?.message}
            withAsterisk
            {...register('user.role', { required: '직무를 입력해주세요.' })}
          />
        </Group>

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

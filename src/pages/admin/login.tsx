import { TOKEN_EXPIRE_TIME } from '@/constants';
import { setCookie } from '@/lib/cookie';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification } from '@/lib/notification';
import { AdminResponse } from '@/types/api';
import { Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormValues {
  loginId: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const {
        data: { token },
      } = await axiosClient.post<{ token: string; admin: AdminResponse }>('/admin/auth', data);

      setCookie('token', token, { path: '/', maxAge: TOKEN_EXPIRE_TIME });
      router.push('/admin');
    } catch (e) {
      let message = '오류가 발생했습니다.';
      if (isAxiosError(e)) {
        message = e.response?.data?.error ?? message;
      }
      showFailNotification({
        title: '로그인 실패',
        message,
      });
    }
  };

  return (
    <Center h="100vh">
      <Paper shadow="sm" p="36px">
        <Stack align="center">
          <Title order={2}>로그인</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="아이디"
                size="md"
                error={formErrors.loginId?.message}
                {...register('loginId', { required: '아이디를 입력해주세요.' })}
              />
              <PasswordInput
                label="비밀번호"
                size="md"
                error={formErrors.password?.message}
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
              />
              <Button type="submit" size="md" loading={isSubmitting}>
                로그인
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}

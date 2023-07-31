import { Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';

interface LoginFormValues {
  loginId: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {};

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
              <Button type="submit" size="md">
                로그인
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Center>
  );
}

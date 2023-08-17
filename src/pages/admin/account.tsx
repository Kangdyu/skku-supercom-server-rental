import { AdminLayout } from '@/components/admin/AdminLayout';
import { Row } from '@/components/common/Row';
import { axiosClient } from '@/lib/fetcher';
import { showFailNotification, showSuccessNotification } from '@/lib/notification';
import { Button, Group, Paper, PasswordInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { getAuthHeaderObject } from '@/lib/auth';

interface AccountFormInputs {
  password: string;
}

export default function AccountPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    setValue,
  } = useForm<AccountFormInputs>();

  const onSubmit: SubmitHandler<AccountFormInputs> = async (data) => {
    try {
      // TODO: loginId를 api에서 받아올 수 있어야함
      const body = { loginId: 'admin', password: data.password };
      await axiosClient.put('/admin/register', body, getAuthHeaderObject());

      setValue('password', '');
      showSuccessNotification({
        title: '비밀번호 변경 성공',
        message: '비밀번호가 변경되었습니다.',
      });
    } catch (e) {
      console.error(e);
      showFailNotification({ title: '비밀번호 변경 실패', message: '오류가 발생했습니다.' });
    }
  };

  return (
    <AdminLayout
      title="비밀번호 변경"
      description="관리자 계정의 비밀번호를 변경할 수 있는 페이지입니다."
    >
      <Paper withBorder p="24px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row label="새 비밀번호">
            <Group w="100%" align="flex-start">
              <PasswordInput
                maw="300px"
                w="100%"
                error={formErrors.password?.message}
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
              />
              <Button type="submit" loading={isSubmitting}>
                변경
              </Button>
            </Group>
          </Row>
        </form>
      </Paper>
    </AdminLayout>
  );
}

import { AppShell, Navbar, NavLink, Text } from '@mantine/core';
import { IconHome, IconServer } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const ROUTES = [
  {
    label: '홈',
    href: '/admin',
    icon: <IconHome size="1rem" />,
  },
  {
    label: '서버 관리',
    href: '/admin/servers',
    icon: <IconServer size="1rem" />,
  },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { pathname } = useRouter();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height="100vh" p="xs">
          <Navbar.Section mt="xs">
            <Text fz={24} fw={700} ta="center">
              서버대여서비스
            </Text>
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            {ROUTES.map(({ label, href, icon }) => (
              <NavLink
                key={href}
                label={label}
                component={Link}
                href={href}
                icon={icon}
                active={pathname === href}
                styles={{ root: { paddingTop: 12, paddingBottom: 16 }, label: { fontSize: 16 } }}
              />
            ))}
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}

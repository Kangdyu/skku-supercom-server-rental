import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { ServerReservationCalendar } from '@/components/common/ServerReservationCalendar';
import { useServers } from '@/hooks/useServers';
import { useServerTime } from '@/hooks/useServerTime';
import {
  ActionIcon,
  Button,
  Center,
  ColorSwatch,
  Grid,
  Group,
  Loader,
  Paper,
  Popover,
  Stack,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconHelpCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

const COLUMNS = 14;
const START_MONTH = 3;
const monthsInSchoolYear = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

export function ServerList() {
  const { data: servers } = useServers({ pageSize: 99999, pageNumber: 1 });
  const { data: time } = useServerTime();

  const theme = useMantineTheme();
  const statusColor = {
    available: {
      color: theme.colors.green[3],
      label: '예약 가능',
    },
    unavailable: {
      color: theme.colors.gray[0],
      label: '예약 불가',
    },
  };

  const currentYear = time.getFullYear();
  const currentMonth = time.getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear ?? new Date().getFullYear());

  return (
    <Stack>
      <Group position="apart" align="flex-end">
        <Group>
          <ActionIcon
            disabled={selectedYear <= currentYear}
            onClick={() => setSelectedYear((prev) => prev - 1)}
            sx={{
              '&[data-disabled]': { background: 'transparent', border: 'none' },
            }}
          >
            <IconChevronLeft size="24px" />
          </ActionIcon>
          <Title order={3}>{selectedYear} 학년도</Title>
          <ActionIcon onClick={() => setSelectedYear((prev) => prev + 1)}>
            <IconChevronRight size="24px" />
          </ActionIcon>
        </Group>
        <Group spacing={24} sx={{ fontSize: '14px' }}>
          <Text color="gray">예약 가능한 칸을 누르면 현재 예약 현황 달력을 볼 수 있습니다.</Text>
          {Object.entries(statusColor).map(([key, { color, label }]) => (
            <Group key={key} spacing={12}>
              <ColorSwatch color={color} size="20px" />
              <Text>{label}</Text>
            </Group>
          ))}
        </Group>
      </Group>

      <Grid columns={COLUMNS} align="flex-end">
        <Grid.Col span={2}></Grid.Col>
        {monthsInSchoolYear.map((month) => (
          <Grid.Col span={1} key={month}>
            <Stack align="center" spacing={0}>
              {month === 3 && (
                <Text color="gray" fz="14px">
                  {selectedYear}
                </Text>
              )}
              {month === 1 && (
                <Text color="gray" fz="14px">
                  {selectedYear + 1}
                </Text>
              )}
              <Text fz="18px">{month}월</Text>
            </Stack>
          </Grid.Col>
        ))}
      </Grid>

      {servers.contents
        .filter((server) => server.isPublic)
        .map((server) => {
          const availableDates = server.serverAvailability.map((a) => `${a.year}-${a.month}`);

          return (
            <Grid key={server.id} columns={COLUMNS}>
              <Grid.Col span={2}>
                <Paper p="12px" withBorder>
                  <Stack>
                    <Group spacing={8} position="apart">
                      <Tooltip label={server.name} position="top-start">
                        <Text
                          fw="bold"
                          fz="18px"
                          sx={{
                            flex: 1,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {server.name}
                        </Text>
                      </Tooltip>

                      <Popover shadow="md">
                        <Popover.Target>
                          <Tooltip label="서버 스펙 상세">
                            <ActionIcon>
                              <IconHelpCircle color="gray" size="16px" />
                            </ActionIcon>
                          </Tooltip>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Text size="sm" sx={{ whiteSpace: 'pre-wrap' }}>
                            {server.description}
                          </Text>
                        </Popover.Dropdown>
                      </Popover>
                    </Group>

                    <Button
                      component={Link}
                      href={`/reservation/${server.id}`}
                      disabled={!server.isAvailable}
                    >
                      {server.isAvailable ? '예약' : '예약 불가'}
                    </Button>
                  </Stack>
                </Paper>
              </Grid.Col>

              {monthsInSchoolYear.map((month) => {
                const year = month < START_MONTH ? selectedYear + 1 : selectedYear;
                const isPreviousMonth = month < currentMonth && year === currentYear;
                const isAvailableMonth =
                  availableDates.includes(`${year}-${month}`) &&
                  server.isAvailable &&
                  !isPreviousMonth;

                return (
                  <Grid.Col span={1} key={month}>
                    <Popover withArrow>
                      <Popover.Target>
                        <Paper
                          component="button"
                          p="24px"
                          withBorder
                          w="100%"
                          h="100%"
                          sx={(theme) => ({
                            pointerEvents: !isAvailableMonth ? 'none' : 'auto',
                            cursor: 'pointer',
                            background: isAvailableMonth
                              ? theme.colors.green[3]
                              : theme.colors.gray[0],
                            ':hover': {
                              background: theme.colors.green[5],
                              '> div': {
                                display: 'block',
                              },
                            },
                            transition: 'background 0.1s ease-in-out',
                          })}
                        >
                          <Center sx={{ display: 'none' }}>
                            <Text color="white">예약 확인</Text>
                          </Center>
                        </Paper>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<Loader />}>
                          <ServerReservationCalendar
                            serverId={server.id}
                            year={year}
                            month={month}
                          />
                        </AsyncBoundary>
                      </Popover.Dropdown>
                    </Popover>
                  </Grid.Col>
                );
              })}
            </Grid>
          );
        })}
    </Stack>
  );
}

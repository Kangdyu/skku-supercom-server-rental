import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { ErrorFallback } from '@/components/common/ErrorFallback/ErrorFallback';
import { ServerReservationCalendar } from '@/components/common/ServerReservationCalendar';
import { useServers } from '@/hooks/useServers';
import { useServerTime } from '@/hooks/useServerTime';
import {
  Button,
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
import { IconHelpCircle } from '@tabler/icons-react';
import Link from 'next/link';

const COLUMNS = 14;
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

  return (
    <Stack>
      <Group position="apart" align="flex-end">
        <Title order={3}>{currentYear}학년도</Title>

        <Group spacing={24} sx={{ fontSize: '14px' }}>
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
        {Array.from({ length: 12 }).map((_, index) => {
          const month = monthsInSchoolYear[index];

          return (
            <Grid.Col span={1} key={index}>
              <Stack align="center" spacing={0}>
                {month === 3 && (
                  <Text color="gray" fz="14px">
                    {currentYear}
                  </Text>
                )}
                {month === 1 && (
                  <Text color="gray" fz="14px">
                    {currentYear + 1}
                  </Text>
                )}
                <Text fz="18px">{month}월</Text>
              </Stack>
            </Grid.Col>
          );
        })}
      </Grid>
      {servers.contents.map((server) => {
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

                    <Tooltip label={server.description}>
                      <IconHelpCircle color="gray" size="16px" />
                    </Tooltip>
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
            {Array.from({ length: 12 }).map((_, index) => {
              const month = monthsInSchoolYear[index];
              const isPreviousMonth = index < currentMonth - 1;
              const isAvailableMonth =
                availableDates.includes(`${currentYear}-${month}`) &&
                server.isAvailable &&
                !isPreviousMonth;

              return (
                <Grid.Col span={1} key={index}>
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
                        })}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <AsyncBoundary errorFallback={ErrorFallback} loadingFallback={<Loader />}>
                        <ServerReservationCalendar
                          serverId={server.id}
                          year={currentYear}
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

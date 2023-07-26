import { ServerResponse } from '@/types/api';
import {
  Badge,
  Button,
  Card,
  CardProps,
  Center,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconServer } from '@tabler/icons-react';

interface ServerCardProps extends Omit<CardProps, 'children'> {
  server: ServerResponse;
}

export function ServerCard({ server }: ServerCardProps) {
  const isAvailable = server.serverAvailability.length !== 0;

  return (
    <>
      <Paper withBorder shadow="sm" radius="md">
        <Grid>
          <Grid.Col span={3}>
            <Center h="100%">
              <IconServer size="48px" />
            </Center>
          </Grid.Col>

          <Grid.Col span="auto">
            <Stack p="16px" pl="0px" h="100%">
              <Stack spacing="4px">
                <Title order={3}>{server.name}</Title>
                <Text color="gray">{server.description}</Text>
              </Stack>

              <Stack spacing="4px">
                <Text fw="medium">대여 가능 연월</Text>
                {isAvailable ? (
                  <Group spacing="8px">
                    {server.serverAvailability.map((availability) => (
                      <Badge key={availability.id}>
                        {availability.year}-{availability.month}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text color="orange">대여 불가</Text>
                )}
              </Stack>

              <Button fullWidth disabled={!isAvailable}>
                예약
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}

import { Grid, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface RowProps {
  label: string;
  children: ReactNode;
}

export function Row({ label, children }: RowProps) {
  return (
    <Grid px="16px" py="12px">
      <Grid.Col span={2}>
        <Text color="gray">{label}</Text>
      </Grid.Col>
      <Grid.Col span="auto">{children}</Grid.Col>
    </Grid>
  );
}

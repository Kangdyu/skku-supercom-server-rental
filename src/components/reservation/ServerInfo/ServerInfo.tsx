import { Row } from '@/components/common/Row';
import { useServer } from '@/hooks/useServer';
import { Badge, Group, Text } from '@mantine/core';

interface ServerInfoProps {
  serverId: number;
}

export function ServerInfo({ serverId }: ServerInfoProps) {
  const { data: server } = useServer(serverId);

  return (
    <>
      <Row label="서버명">{server.name}</Row>
      <Row label="설명">
        <Text sx={{ whiteSpace: 'pre-wrap' }}>{server.description}</Text>
      </Row>
    </>
  );
}

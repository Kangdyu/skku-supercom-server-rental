import { ServerCard } from '@/components/home/ServerCardList/ServerCard';
import { useServers } from '@/hooks/useServers';
import { SimpleGrid } from '@mantine/core';

export function ServerCardList() {
  const { data } = useServers({ pageSize: 99999, pageNumber: 1 });

  return (
    <SimpleGrid cols={3} spacing="16px">
      {data.contents
        .filter((server) => server.isPublic)
        .map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
    </SimpleGrid>
  );
}

interface ServerInfoProps {
  serverId: number;
}

export function ServerInfo({ serverId }: ServerInfoProps) {
  return <div>{serverId}</div>;
}

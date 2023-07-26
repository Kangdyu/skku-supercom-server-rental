export function createQueryString(params: Record<string, string | number | undefined>) {
  const searchParamObject = Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  const searchParams = new URLSearchParams(searchParamObject);

  return searchParams.toString();
}

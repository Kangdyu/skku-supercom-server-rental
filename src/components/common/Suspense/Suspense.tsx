import { ComponentProps, useState, Suspense as ReactSuspense, useEffect } from 'react';

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function Suspense(props: ComponentProps<typeof ReactSuspense>) {
  const isMounted = useMounted();

  if (isMounted) {
    return <ReactSuspense {...props} />;
  }
  return <>{props.fallback}</>;
}

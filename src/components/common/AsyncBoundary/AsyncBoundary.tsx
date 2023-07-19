import { Suspense } from '@/components/common/Suspense';
import { ComponentType, ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

interface AsyncBoundaryProps {
  errorFallback: ComponentType<FallbackProps>;
  loadingFallback: ReactNode;
  children: ReactNode;
}

export function AsyncBoundary({ errorFallback, loadingFallback, children }: AsyncBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

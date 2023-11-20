import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MyWorkspaceErrorBoundaryFallback } from './MyWorkspaceErrorBoundaryFallback';
import { useSelector } from 'react-redux';
import { getFeatureFlagErrorBoundary } from 'src/store/selectors';

interface IProps {
  children: React.ReactNode;
  size: 'small' | 'large';
  className?: string;
}

export const MyWorkspaceErrorBoundary = (props: IProps) => {
  const featureFlagErrorBoundary = useSelector(getFeatureFlagErrorBoundary);
  if (!featureFlagErrorBoundary) {
    return <>{props.children}</>;
  }
  return (
    <ErrorBoundary
      FallbackComponent={(fallbackProps) => (
        <MyWorkspaceErrorBoundaryFallback
          {...fallbackProps}
          size={props.size}
          className={props.className ?? ''}
        />
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
};

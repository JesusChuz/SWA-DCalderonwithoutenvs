import * as React from 'react';
import { useSelector } from 'react-redux';
import { getFeatureFlagErrorBoundary } from 'src/store/selectors';
import { MyWorkspaceErrorBoundary } from './MyWorkspaceErrorBoundary';

interface IProps {
  children: React.ReactNode;
}

export const RouteErrorBoundaryWrapper = (props: IProps) => {
  const featureFlagErrorBoundary = useSelector(getFeatureFlagErrorBoundary);
  if (!featureFlagErrorBoundary) {
    return <>{props.children}</>;
  }
  return (
    <MyWorkspaceErrorBoundary size='large'>
      {props.children}
    </MyWorkspaceErrorBoundary>
  );
};

import * as React from 'react';
import { MyWorkspaceErrorBoundary } from './MyWorkspaceErrorBoundary';
import { useSelector } from 'react-redux';
import { getFeatureFlagErrorBoundary } from 'src/store/selectors';

interface IProps {
  children: React.ReactNode;
}

export const PivotItemErrorBoundaryWrapper = (props: IProps) => {
  const featureFlagErrorBoundary = useSelector(getFeatureFlagErrorBoundary);
  if (!featureFlagErrorBoundary) {
    return <>{props.children}</>;
  }
  return (
    <MyWorkspaceErrorBoundary size='small'>
      {props.children}
    </MyWorkspaceErrorBoundary>
  );
};

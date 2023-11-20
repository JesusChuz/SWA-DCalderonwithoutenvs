import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  getUserRoleAssignmentConstraint,
  getWorkspaceCountUnshared,
} from '../../../store/selectors/index';
import { SegmentConstraintDto } from '../../../types/AuthService/SegmentConstraintDto.types';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { ProgressIndicator, useTheme, Text, Label } from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getDashboardStyles } from '../Dashboard.styles';
import { InfoButton } from '../../GeneralComponents/InfoButton';
import { useHistory } from 'react-router';

export const WorkspaceCountOverviewCard = (): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getDashboardStyles(theme);
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(
    getWorkspaceCountUnshared
  );
  const userConstraint: SegmentConstraintDto = useSelector(
    getUserRoleAssignmentConstraint
  );

  const percentWorkspacesUsed =
    allWorkspaces.length / userConstraint.MaxAzureWorkspacesAllowed;

  return (
    <DashboardCard
      title='Workspaces'
      className={styles.smDashboardCard}
      subTitle={
        <InfoButton
          buttonId='infobutton-workspace-count'
          calloutTitle='Workspace Count Overview'
          calloutBody={
            <Text>
              The total number of workspaces that are currently deployed, along
              with remaining workspaces that can be deployed under the quota
              limit.
            </Text>
          }
        />
      }
    >
      <Label className={commonStyles.font39}>{allWorkspaces.length}</Label>
      <ProgressIndicator
        description={`${
          userConstraint.MaxAzureWorkspacesAllowed - allWorkspaces.length
        } available`}
        percentComplete={percentWorkspacesUsed}
        barHeight={6}
        ariaLabel='Workspace count progress bar'
      />
    </DashboardCard>
  );
};

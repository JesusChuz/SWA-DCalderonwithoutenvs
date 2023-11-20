import * as React from 'react';
import { Pivot, PivotItem, Stack, useTheme } from '@fluentui/react';

import { getCommonStyles } from './../../GeneralComponents/CommonStyles';
import { TenantSegmentAdminTab } from './TenantSegmentAdminTabs.utils';
import { TenantSegmentAdminMembers } from './TenantSegmentAdminMembers/TenantSegmentAdminMembers';
import { TenantSegmentAdminWorkspaceActivity } from './TenantSegmentAdminWorkspaceActivity/TenantSegmentAdminWorkspaceActivity';
import { QuotasInfo } from '../../Nav/HeaderNavBar/Quotas/QuotasInfo';
import { useQuery } from '../../../shared/useQuery';
import { useHistory } from 'react-router-dom';
import { TenantSegmentConstraints } from './TenantSegmentConstraints';
import { useSelector } from 'react-redux';
import {
  getCurrentPendingUserManagementRequestCount,
  getFeatureFlagAdminTemplateCreation,
  getFeatureFlagCostAnalysisView,
  getFeatureFlagEndpointAccessManagement,
  getFeatureFlagMoveTenantSegmentUser,
  getFeatureFlagRemoveTenantSegmentUser,
} from '../../../store/selectors';
import clsx from 'clsx';
import { TenantSegmentAdminUserManagement } from './TenantSegmentAdminUserManagement/TenantSegmentAdminUserManagement';
import { TenantSegmentAdminTemplate } from './TenantSegmentAdminTemplate/TenantSegmentAdminTemplate';
import { CostAnalysisView } from './CostAnalysis/CostAnalysisView';
import { PivotItemErrorBoundaryWrapper } from 'src/components/GeneralComponents/ErrorBoundary/PivotItemErrorBoundaryWrapper';
import { CounterBadge } from 'src/components/GeneralComponents/CounterBadge';
import { useCounterBadgeStyles } from 'src/components/GeneralComponents/CounterBadge.styles';

const basePath = '/admin/TenantSegment';
export const TenantSegmentAdminTabs = (): JSX.Element => {
  const counterBadgeStyles = useCounterBadgeStyles();
  const query = useQuery();
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const endpointAccessManagement = useSelector(
    getFeatureFlagEndpointAccessManagement
  );
  const FeatureFlagAdminTemplate = useSelector(
    getFeatureFlagAdminTemplateCreation
  );
  const featureFlagCostAnalysis = useSelector(getFeatureFlagCostAnalysisView);
  const moveFeatureFlag = useSelector(getFeatureFlagMoveTenantSegmentUser);
  const removeFeatureFlag = useSelector(getFeatureFlagRemoveTenantSegmentUser);
  const pendingUserManagementRequests = useSelector(
    getCurrentPendingUserManagementRequestCount
  );

  const pivotClick = (key: string) => {
    history.push(`${basePath}?tab=${key}`);
  };

  const tab = React.useMemo(() => {
    const key = query.get('tab');
    switch (key) {
      case 'segmentQuotas':
        return TenantSegmentAdminTab.SegmentQuotas;
      case 'workspaceActivity':
        return TenantSegmentAdminTab.WorkspaceActivity;
      case 'segmentConstraints':
        return TenantSegmentAdminTab.SegmentConstraints;
      case 'userManagement':
        return TenantSegmentAdminTab.UserManagement;
      case 'costAnalysis':
        return TenantSegmentAdminTab.CostAnalysis;
      case 'templateCreation':
        return TenantSegmentAdminTab.TemplateCreation;
      default:
        return TenantSegmentAdminTab.Members;
    }
  }, [query]);

  return (
    <Stack
      className={clsx(
        commonStyles.fullHeight,
        commonStyles.flexItem,
        commonStyles.overflowYHidden,
        commonStyles.flexGrow.replace,
        commonStyles.minHeight250
      )}
    >
      <Pivot
        selectedKey={tab.toString()}
        onLinkClick={(item: PivotItem) =>
          pivotClick(item.props.itemKey as TenantSegmentAdminTab)
        }
        overflowAriaLabel='More Tabs'
        overflowBehavior={'menu'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'hidden',
        }}
        styles={{
          itemContainer: {
            flexGrow: 1,
            overflowY: 'hidden',
            selectors: {
              '& > div': {
                height: '100%',
              },
            },
          },
        }}
        linkSize={'large'}
      >
        <PivotItem headerText='Members' itemKey='members'>
          <PivotItemErrorBoundaryWrapper>
            <TenantSegmentAdminMembers />
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        <PivotItem headerText='Workspace Activity' itemKey='workspaceActivity'>
          <PivotItemErrorBoundaryWrapper>
            <TenantSegmentAdminWorkspaceActivity />
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        {(moveFeatureFlag || removeFeatureFlag) && (
          <PivotItem
            headerText='User Management'
            itemKey='userManagement'
            onRenderItemLink={(props, defaultRender) => (
              <Stack horizontal>
                {defaultRender(props)}
                <CounterBadge
                  className={counterBadgeStyles.pivotCounterBadgeStyle}
                  count={pendingUserManagementRequests}
                  ariaLabel={`${pendingUserManagementRequests} pending user management request${
                    pendingUserManagementRequests === 1 ? '' : 's'
                  }`}
                />
              </Stack>
            )}
          >
            <PivotItemErrorBoundaryWrapper>
              <TenantSegmentAdminUserManagement />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
        )}
        <PivotItem headerText='Segment Quotas' itemKey='segmentQuotas'>
          <PivotItemErrorBoundaryWrapper>
            <QuotasInfo type='admin' />
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        {featureFlagCostAnalysis && (
          <PivotItem headerText='Cost Analysis' itemKey='costAnalysis'>
            <PivotItemErrorBoundaryWrapper>
              <CostAnalysisView />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
        )}
        {FeatureFlagAdminTemplate && (
          <PivotItem headerText='Template Creation' itemKey='templateCreation'>
            <PivotItemErrorBoundaryWrapper>
              <TenantSegmentAdminTemplate />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
        )}
        {endpointAccessManagement && (
          <PivotItem
            headerText='Segment Constraints'
            itemKey='segmentConstraints'
          >
            <PivotItemErrorBoundaryWrapper>
              <TenantSegmentConstraints />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
        )}
      </Pivot>
    </Stack>
  );
};

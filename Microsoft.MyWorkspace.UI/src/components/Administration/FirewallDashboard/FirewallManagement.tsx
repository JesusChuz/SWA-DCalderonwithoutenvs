import * as React from 'react';
import { Pivot, PivotItem, Stack, useTheme } from '@fluentui/react';

import { FirewallListView } from './FirewallListView';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../../shared/useQuery';
import { FirewallDashboard } from './FirewallDashboard';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { HubNetworksListView } from './HubNetworksListView';
import { ConfigProfileListView } from './ConfigProfileListView';
import { PivotItemErrorBoundaryWrapper } from 'src/components/GeneralComponents/ErrorBoundary/PivotItemErrorBoundaryWrapper';

const basePath = '/admin/FirewallManagement';
export const FirewallManagement = (): JSX.Element => {
  const history = useHistory();
  const query = useQuery();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const pivotClick = (key: string) => {
    history.push(`${basePath}?tab=${key}`);
  };

  const tab = React.useMemo(() => {
    const key = query.get('tab');
    switch (key) {
      case 'firewalls':
        return 'firewalls';
      case 'configurations':
        return 'configurations';
      case 'hubs':
        return 'hubs';
      default:
        return 'dashboard';
    }
  }, [query]);

  return (
    <div className={commonStyles.marginLeft20}>
      <Pivot
        aria-label='Firewall Dashboard Sections'
        selectedKey={tab}
        onLinkClick={(g) => pivotClick(g.props.itemKey)}
      >
        <PivotItem headerText='Dashboard' itemKey='dashboard'>
          <PivotItemErrorBoundaryWrapper>
            <Stack className={commonStyles.margin20}>
              <FirewallDashboard />
            </Stack>
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        <PivotItem headerText='Firewalls' itemKey='firewalls'>
          <PivotItemErrorBoundaryWrapper>
            <Stack className={commonStyles.margin20}>
              <FirewallListView />
            </Stack>
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        <PivotItem headerText='Hub Networks' itemKey='hubs'>
          <PivotItemErrorBoundaryWrapper>
            <Stack className={commonStyles.margin20}>
              <HubNetworksListView />
            </Stack>
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
        <PivotItem headerText='Configuration Profiles' itemKey='configurations'>
          <PivotItemErrorBoundaryWrapper>
            <Stack className={commonStyles.margin20}>
              <ConfigProfileListView />
            </Stack>
          </PivotItemErrorBoundaryWrapper>
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default FirewallManagement;

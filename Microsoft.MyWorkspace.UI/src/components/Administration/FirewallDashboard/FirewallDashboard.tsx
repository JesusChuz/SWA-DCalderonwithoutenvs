import * as React from 'react';
import { Stack } from '@fluentui/react';
import { useSelector } from 'react-redux';

import { getAdminFirewalls } from '../../../store/selectors/adminFirewallSelectors';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { useHistory } from 'react-router-dom';
import { CapacityCircleCard } from '../../GeneralComponents/DashboardCards/CapacityCircleCard';

export const FirewallDashboard = (): JSX.Element => {
  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);
  const history = useHistory();

  const consumedSpokes: number = React.useMemo(
    () =>
      firewalls.reduce(
        (previous, f) => previous + f.TotalSpokeNetworkConsumed,
        0
      ),
    [firewalls]
  );

  const totalSpokes: number = React.useMemo(
    () => firewalls.reduce((previous, f) => previous + f.MaxSpokeAllowed, 0),
    [firewalls]
  );

  return (
    <Stack horizontal wrap horizontalAlign='start' tokens={{ childrenGap: 30 }}>
      <CapacityCircleCard
        usedItems={consumedSpokes}
        totalItems={totalSpokes}
        dashboardCardProps={{
          title: 'Total Spoke Usage',
          size: 'med',
          buttonProps: {
            title: 'See All Hubs',
            onClick: () => history.push('/admin/FirewallManagement/?tab=hubs'),
          },
        }}
      />
    </Stack>
  );
};

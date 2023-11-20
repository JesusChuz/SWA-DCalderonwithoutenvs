import * as React from 'react';
import { Stack, useTheme } from '@fluentui/react';
import { useParams } from 'react-router-dom';

import { HubNetworksListView } from './HubNetworksListView';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';

export const Firewall = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  return (
    <div className={commonStyles.marginLeft20}>
      <Stack>
        <Stack className={commonStyles.margin20}></Stack>
        <Stack className={commonStyles.margin20}>
          <HubNetworksListView includeTitle firewallID={id} />
        </Stack>
      </Stack>
    </div>
  );
};
export default Firewall;

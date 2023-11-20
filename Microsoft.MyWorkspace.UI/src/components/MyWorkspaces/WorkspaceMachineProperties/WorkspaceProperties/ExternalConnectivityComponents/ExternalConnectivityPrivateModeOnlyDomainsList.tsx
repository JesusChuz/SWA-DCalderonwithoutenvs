import * as React from 'react';
import { Stack, useTheme, Link, List, Text } from '@fluentui/react';
import { useSelector } from 'react-redux';

import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';

import {
  getUserRoleAssignmentConstraint,
  getUserRoleAssignmentSegmentId,
  getUserRoleAssignmentSegmentName,
} from '../../../../../store/selectors';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import { RestrictedDomainsPanel } from '../../../../Administration/TenantSegmentAdmin/RestrictedDomainsPanel';
import { PRIVATE_MODE_ONLY_DOMAINS_INFO_TEXT } from '../../../../../shared/Constants';

export const ExternalConnectivityPrivateModeOnlyDomainsList =
  (): JSX.Element => {
    const theme = useTheme();
    const commonStyles = getCommonStyles(theme);
    const segmentId = useSelector(getUserRoleAssignmentSegmentId);
    const segmentName = useSelector(getUserRoleAssignmentSegmentName);
    const [openRestrictedDomainsPanel, setOpenRestrictedDomainsPanel] =
      React.useState(false);
    const constraints = useSelector(getUserRoleAssignmentConstraint);

    const onRenderCell = (item: string): JSX.Element => {
      return (
        <div data-is-focusable={true}>
          <Text>{item}</Text>
        </div>
      );
    };

    return (
      <div>
        <Stack
          horizontal
          className={commonStyles.fullWidth}
          tokens={{ ...defaultStackTokens }}
          horizontalAlign='space-between'
          verticalAlign='center'
        >
          <Stack.Item>
            <h3 className={commonStyles.margin0}>
              Private-Mode Domains
              <InfoButton
                buttonId={'infoButton-privateDomains'}
                calloutTitle={'Private-Mode Domains'}
                calloutBody={PRIVATE_MODE_ONLY_DOMAINS_INFO_TEXT}
              />
            </h3>
            {constraints.RestrictedDnsEndpoints &&
            constraints.RestrictedDnsEndpoints.length > 0 ? (
              <Stack.Item>
                {constraints.RestrictedDnsEndpoints.length > 3 ? (
                  <List
                    items={constraints.RestrictedDnsEndpoints.slice(
                      0,
                      3
                    ).concat(['...'])}
                    onRenderCell={onRenderCell}
                  />
                ) : (
                  <Stack.Item>
                    <List
                      items={constraints.RestrictedDnsEndpoints}
                      onRenderCell={onRenderCell}
                    />
                  </Stack.Item>
                )}
                <Link
                  onClick={() => setOpenRestrictedDomainsPanel(true)}
                  disabled={constraints.RestrictedDnsEndpoints.length === 0}
                >
                  View All {constraints.RestrictedDnsEndpoints.length}{' '}
                  Private-Mode Domains
                </Link>
              </Stack.Item>
            ) : (
              <Stack.Item>No Private-Mode Domains configured</Stack.Item>
            )}
          </Stack.Item>
        </Stack>
        <RestrictedDomainsPanel
          openRestrictedDomainsPanel={openRestrictedDomainsPanel}
          dismissPanel={() => setOpenRestrictedDomainsPanel(false)}
          segmentName={segmentName}
          segmentId={segmentId}
          editable={false}
        />
      </div>
    );
  };

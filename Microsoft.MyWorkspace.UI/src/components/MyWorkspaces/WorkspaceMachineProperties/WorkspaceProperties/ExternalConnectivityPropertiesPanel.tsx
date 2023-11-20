import * as React from 'react';
import { Stack, useTheme } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import {
  getFeatureFlagEndpointAccessManagement,
  getNatRuleJitEntries,
  getUserRoleAssignmentSegmentId,
} from '../../../../store/selectors';
import {
  fetchExternalConnectivityJitEntries,
  fetchSegmentUpdatePercentage,
} from '../../../../store/actions';
import { ExternalConnectivityIPAddressList } from './ExternalConnectivityComponents/ExternalConnectivityIPAddressList';
import { ExternalConnectivityNatRuleList } from './ExternalConnectivityComponents/ExternalConnectivityNatRuleList';
import { ExternalConnectivityNatRulePanel } from './ExternalConnectivityComponents/ExternalConnectivityNatRulePanel';
import { ExternalConnectivityJitPanel } from './ExternalConnectivityComponents/ExternalConnectivityJitPanel';
import { NetworkProtocols } from '../../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { getEditableWorkspace } from '../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { signalRConnection } from '../../../../services/signalRService';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { ExternalConnectivityPrivateModeOnlyDomainsList } from './ExternalConnectivityComponents/ExternalConnectivityPrivateModeOnlyDomainsList';

export const ExternalConnectivityPropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const jitEntries = useSelector(getNatRuleJitEntries);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const segmentId = useSelector(getUserRoleAssignmentSegmentId);
  const [open, setOpen] = React.useState(false);
  const [daySelection, setDaySelection] = React.useState(24);

  const endpointAccessManagement = useSelector(
    getFeatureFlagEndpointAccessManagement
  );

  const currentJitEntry = React.useMemo(() => {
    return jitEntries.find(
      (e) =>
        e.Protocol != NetworkProtocols.RDP &&
        e.WorkspaceID === editableWorkspace.ID &&
        e.InternalPort !== 0 &&
        e.ExternalPort !== 0
    );
  }, [jitEntries, editableWorkspace.ID]);

  React.useEffect(() => {
    signalRConnection.on('onNatRuleUpdate', () => {
      dispatch(fetchExternalConnectivityJitEntries());
    });
    return () => signalRConnection?.off('onNatRuleUpdate');
  }, []);

  React.useEffect(() => {
    dispatch(fetchSegmentUpdatePercentage(segmentId));
  }, [segmentId]);

  return (
    <Stack className={styles.propertiesContent}>
      {editableWorkspace.PrivateMode ? (
        <Stack
          className={`${commonStyles.errorTextBold} ${commonStyles.marginTop16} ${commonStyles.marginLeft8}`}
        >
          External Connectivity is disabled for this workspace as Private Mode
          is enabled.
        </Stack>
      ) : (
        <>
          <Stack>
            <ExternalConnectivityIPAddressList />
          </Stack>
          <Stack>
            <ExternalConnectivityNatRuleList
              isJitActive={!!currentJitEntry}
              openPanel={() => setOpen(true)}
            />
          </Stack>
          <ExternalConnectivityNatRulePanel
            open={open}
            closePanel={() => setOpen(false)}
          />
          <Stack>
            <ExternalConnectivityJitPanel
              daySelection={daySelection}
              setDaySelection={setDaySelection}
              loading={false}
              jitEntries={jitEntries}
              currentJitEntry={currentJitEntry}
              workspace={editableWorkspace}
            />
          </Stack>
          {endpointAccessManagement && (
            <ExternalConnectivityPrivateModeOnlyDomainsList />
          )}
        </>
      )}
    </Stack>
  );
};

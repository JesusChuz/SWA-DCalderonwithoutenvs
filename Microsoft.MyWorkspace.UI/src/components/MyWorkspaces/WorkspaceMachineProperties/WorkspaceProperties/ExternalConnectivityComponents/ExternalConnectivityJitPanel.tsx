import * as React from 'react';
import {
  Dropdown,
  PrimaryButton,
  Stack,
  Text,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateExternalConnectivityJitEntry,
  deactivateExternalConnectivityJitEntry,
} from '../../../../../store/actions';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getCatalogUserProfile,
  getNatRuleJitEntriesLoading,
} from '../../../../../store/selectors';
import { SyncStatus } from '../../../../../types/enums/SyncStatus';
import { NatRuleJitEntryDto } from '../../../../../types/AzureWorkspace/NatRuleJitEntryDto.types';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { getJitStatusText } from '../../../JitRDP/JitRDP.utils';
import { getFormattedDateTime } from '../../../../../shared/DateTimeHelpers';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { isEqual } from 'lodash';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import { ValidationChecklist } from 'src/components/GeneralComponents/ValidationChecklist';

interface IProps {
  daySelection: number;
  setDaySelection: (hours: number) => void;
  loading: boolean;
  workspace: AzureWorkspaceDto;
  jitEntries: NatRuleJitEntryDto[];
  currentJitEntry: NatRuleJitEntryDto;
}
interface ExternalConnectivityJitSteps {
  WorkspaceRunning: boolean;
  PublicIp: boolean;
  NatRule: boolean;
}

export const ExternalConnectivityJitPanel = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [activateButton, setActivateButton] = React.useState(
    !!!props.currentJitEntry
  );
  const dispatch = useDispatch();
  const userProfile = useSelector(getCatalogUserProfile);
  const jitEntriesLoading = useSelector(getNatRuleJitEntriesLoading);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const dayOptions = [
    { key: 24 * 1, text: '1' },
    { key: 24 * 2, text: '2' },
    { key: 24 * 3, text: '3' },
    { key: 24 * 4, text: '4' },
    { key: 24 * 5, text: '5' },
    { key: 24 * 6, text: '6' },
    { key: 24 * 7, text: '7' },
  ];

  const filteredExistingIPAddresses = React.useMemo(() => {
    return editableWorkspace.PublicAddresses.filter(
      (address) => address.State !== ResourceState.Deleting
    );
  }, [
    editableWorkspace.PublicAddresses,
    editableWorkspace,
    editableWorkspace.VirtualMachines,
  ]);

  const handleClick = async () => {
    activateButton ? handleActivateClick() : handleDeactivateClick();
    setActivateButton(!activateButton);
  };

  const handleActivateClick = async () => {
    await activateExternalConnectivityJitEntry({
      WorkspaceID: props.workspace.ID,
      Hours: props.daySelection,
    })(dispatch);
  };

  const handleDeactivateClick = async () => {
    if (props.currentJitEntry) {
      await deactivateExternalConnectivityJitEntry(props.workspace.ID)(
        dispatch
      );
    }
  };
  const isJitDisabled = () => {
    return (
      loading ||
      EditsDisabled(
        userProfile,
        props.workspace,
        originalWorkspace,
        true,
        true
      ) ||
      (activateButton &&
        (!!props.currentJitEntry ||
          props.workspace.VirtualMachines.flatMap((m) => m.NatRules).length ===
            0 ||
          pendingNatRuleChanges)) ||
      (!activateButton &&
        (!props.currentJitEntry ||
          isTransitioning(props.currentJitEntry) ||
          props.currentJitEntry.Status === SyncStatus.Failed))
    );
  };

  const isTransitioning = (jitEntry: NatRuleJitEntryDto) => {
    const status = jitEntry.Status;
    return (
      status === SyncStatus.CreatePending ||
      status === SyncStatus.Creating ||
      status === SyncStatus.DeletePending ||
      status === SyncStatus.Deleting
    );
  };

  const loading = props.loading || jitEntriesLoading;

  const getActivateTooltipText = () => {
    if (props.currentJitEntry) {
      return isTransitioning(props.currentJitEntry)
        ? 'The current JIT status is transitioning.'
        : 'JIT is currently active.';
    }
    const noNatRules =
      props.workspace.VirtualMachines.flatMap((m) => m.NatRules).length === 0;
    if (noNatRules) {
      return 'JIT Activation requires at least one NAT Entry to be created.';
    }
    if (loading) {
      return 'Loading.';
    }
    return '';
  };

  const getDeactivateTooltipText = () => {
    if (!props.currentJitEntry) {
      return 'JIT is currently not active.';
    }
    if (isTransitioning(props.currentJitEntry)) {
      return 'The current JIT status is transitioning.';
    }
    if (loading) {
      return 'Loading.';
    }
    return '';
  };

  const pendingNatRuleChanges = React.useMemo(() => {
    const originalNatRuleList = originalWorkspace.VirtualMachines.flatMap(
      (vm) => vm.NatRules
    );
    const editableNatRuleList = editableWorkspace.VirtualMachines.flatMap(
      (vm) => vm.NatRules
    );
    return !isEqual(editableNatRuleList.sort(), originalNatRuleList.sort());
  }, [originalWorkspace, editableWorkspace]);

  const externalConnectivityJitSteps: ExternalConnectivityJitSteps =
    React.useMemo(() => {
      return {
        WorkspaceRunning:
          props.workspace.State === ResourceState.Running ||
          props.workspace.State === ResourceState.PartiallyRunning,
        PublicIp: filteredExistingIPAddresses.length > 0,
        NatRule:
          props.workspace.VirtualMachines.flatMap((m) => m.NatRules).length !==
            0 && !pendingNatRuleChanges,
      };
    }, [props.workspace, pendingNatRuleChanges, filteredExistingIPAddresses]);

  return (
    <Stack>
      <Stack horizontal horizontalAlign='end'>
        <Stack
          className={commonStyles.fullWidth}
          tokens={defaultStackTokens}
          verticalAlign='end'
        >
          <Stack.Item>
            <h3 className={commonStyles.marginBottom0}>
              {`External Connectivity JIT`}
            </h3>
          </Stack.Item>
          <Text
            className={commonStyles.marginBottom0}
          >{`Current Status: ${getJitStatusText(
            props.currentJitEntry,
            true
          )}`}</Text>
          {props.currentJitEntry && props.currentJitEntry.Expiration && (
            <Text
              className={commonStyles.marginBottom0}
            >{`Expires: ${getFormattedDateTime(
              props.currentJitEntry.Expiration
            )}`}</Text>
          )}
        </Stack>
        <Stack
          horizontal
          className={commonStyles.fullWidth}
          tokens={defaultStackTokens}
          verticalAlign='end'
          horizontalAlign='end'
        >
          <Stack.Item>
            <Dropdown
              label='Duration in Days'
              selectedKey={props.daySelection}
              onChange={(event, option) => {
                props.setDaySelection(option.key as number);
              }}
              disabled={
                !!props.currentJitEntry ||
                EditsDisabled(
                  userProfile,
                  props.workspace,
                  originalWorkspace,
                  true,
                  true
                )
              }
              options={dayOptions}
              ariaLabel='time to live drop down'
            />
          </Stack.Item>
          <Stack.Item>
            <TooltipHost
              content={
                activateButton
                  ? getActivateTooltipText()
                  : getDeactivateTooltipText()
              }
            >
              <PrimaryButton
                text={activateButton ? 'Activate' : 'Deactivate'}
                onClick={handleClick}
                disabled={
                  isJitDisabled() ||
                  (props.workspace.State !== ResourceState.Running &&
                    props.workspace.State !== ResourceState.PartiallyRunning)
                }
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
      </Stack>
      <Stack>
        <ValidationChecklist
          items={[
            {
              validText: 'Workspace currently running',
              invalidText: 'Workspace not currently running',
              valid: externalConnectivityJitSteps.WorkspaceRunning,
            },
            {
              validText: 'Public IP Address successfully created',
              invalidText: 'Public IP Addresses missing',
              valid: externalConnectivityJitSteps.PublicIp,
            },
            {
              validText: 'NAT Inbound Port successfully created',
              invalidText: 'NAT Inbound Ports missing',
              valid: externalConnectivityJitSteps.NatRule,
            },
          ]}
        />
      </Stack>
    </Stack>
  );
};

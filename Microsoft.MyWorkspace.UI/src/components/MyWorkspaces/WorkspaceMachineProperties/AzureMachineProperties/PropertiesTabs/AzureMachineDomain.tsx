import * as React from 'react';
import {
  IDropdownOption,
  Stack,
  Dropdown,
  TextField,
  MessageBar,
  MessageBarType,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCatalogMachines,
  getCatalogUserProfile,
} from '../../../../../store/selectors';
import { DomainRoles } from '../../../../../types/AzureWorkspace/enums/DomainRoles';
import { styles } from './AzureMachinePropertyTab.styles';
import {
  getEditableWorkspace,
  getEditableWorkspaceDomainErrors,
  getEditableWorkspaceDomains,
  getEditableWorkspaceEditType,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceUpdateDomainMemberDomain,
  editableWorkspaceUpdateDomainName,
  editableWorkspaceUpdateDomainRole,
} from '../../../../../store/actions/editableWorkspaceActions';
import { validateDomainControllerRoleHasMembers } from '../../../../../store/validators/workspaceValidators';
import {
  fetchCatalogMachines,
  showDomainControllerConfirmationDialog,
} from '../../../../../store/actions';
import { WorkspaceEditType } from '../../../../../types/enums/WorkspaceEditType';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { OSVersion } from '../../../../../types/enums/OSVersion';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import {
  EditsAreDisabled,
  MachineMustBeRunning,
  MachineMustBeWindows,
  MachineMustBeWorkgroupMember,
} from '../../../../../store/validators/ErrorConstants';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';

interface IProps {
  machineIndex: number;
}

export const AzureMachineDomain = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userProfile = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const domains = useSelector(getEditableWorkspaceDomains);
  const domainErrors = useSelector(getEditableWorkspaceDomainErrors);
  const catalogMachines = useSelector(getCatalogMachines);

  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const originalMachines = React.useMemo(() => {
    return originalWorkspace.VirtualMachines;
  }, [originalWorkspace.VirtualMachines, workspaceEditType]);

  const selectDomainRoles: IDropdownOption[] = [
    { key: DomainRoles.WorkgroupMember, text: 'Workgroup Member' },
    { key: DomainRoles.DomainMember, text: 'Domain Member' },
    { key: DomainRoles.DomainController, text: 'Domain Controller' },
  ];

  const selectDomains: IDropdownOption[] = React.useMemo(() => {
    return domains.map((d) => ({ key: d.ID, text: d.Name }));
  }, [domains]);

  const currentDomain = React.useMemo(() => {
    return (
      domains.find((d) => d.ID === machines[props.machineIndex].DomainID) ||
      null
    );
  }, [domains, machines, props.machineIndex]);

  const currentDomainError = React.useMemo(() => {
    return (
      domainErrors.find((err) => err.domainID === currentDomain.ID) || null
    );
  }, [domainErrors, currentDomain]);

  const machinesInDomainEditAreRunning = () => {
    const isWM =
      (machines[props.machineIndex] as AzureVirtualMachineDto).DomainRole ===
      DomainRoles.WorkgroupMember;
    const existingDC = machines.some(
      (m: AzureVirtualMachineDto) =>
        m.DomainRole === DomainRoles.DomainController
    );
    const associatedDCIsRunning =
      isWM && existingDC
        ? machines.some(
            (m: AzureVirtualMachineDto) =>
              m.DomainRole === DomainRoles.DomainController &&
              (m?.State === ResourceState.Running || m?.State === undefined)
          )
        : true;
    return workspaceEditType === WorkspaceEditType.EditWorkspace
      ? ((machines[props.machineIndex] as AzureVirtualMachineDto).State ===
          ResourceState.Running ||
          (machines[props.machineIndex] as AzureVirtualMachineDto).State ===
            undefined) &&
          associatedDCIsRunning
      : true;
  };

  const canMachineDomainBeEdited = () => {
    return (
      (workspaceEditType !== WorkspaceEditType.EditWorkspace ||
        originalMachines[props.machineIndex]?.DomainRole ===
          DomainRoles.WorkgroupMember ||
        !(machines[props.machineIndex] as AzureVirtualMachineDto).ID) &&
      machines[props.machineIndex].OSVersion === OSVersion.Windows &&
      !EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      ) &&
      machinesInDomainEditAreRunning()
    );
  };

  const cannotEditDomainReason = () => {
    if (
      EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      )
    ) {
      return EditsAreDisabled;
    } else if (machines[props.machineIndex].OSVersion !== OSVersion.Windows) {
      return MachineMustBeWindows;
    } else if (
      workspaceEditType === WorkspaceEditType.EditWorkspace &&
      machines[props.machineIndex]?.DomainRole !== DomainRoles.WorkgroupMember
    ) {
      return MachineMustBeWorkgroupMember;
    } else if (!machinesInDomainEditAreRunning()) {
      return MachineMustBeRunning;
    }
  };

  React.useEffect(() => {
    if (!catalogMachines || catalogMachines.length === 0) {
      dispatch(fetchCatalogMachines());
    }
  }, []);

  return (
    <Stack className={styles.propertiesContent}>
      <Stack>
        {!canMachineDomainBeEdited() && (
          <Stack className={commonStyles.width60}>
            <MessageBar messageBarType={MessageBarType.warning}>
              {cannotEditDomainReason()}
            </MessageBar>
          </Stack>
        )}
        <Stack
          horizontal
          tokens={{
            childrenGap: 10,
            padding: 10,
          }}
        >
          <Dropdown
            label='Domain Role'
            style={{ maxWidth: '200px' }}
            selectedKey={machines[props.machineIndex].DomainRole}
            options={selectDomainRoles}
            disabled={!canMachineDomainBeEdited()}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              option?: IDropdownOption
            ) => {
              const machine = machines[props.machineIndex];
              const callback = () => {
                dispatch(
                  editableWorkspaceUpdateDomainRole(
                    props.machineIndex,
                    option.key as DomainRoles,
                    userProfile
                  )
                );
              };
              if (
                machine.DomainRole === DomainRoles.DomainController &&
                validateDomainControllerRoleHasMembers(
                  machines,
                  machine.DomainID
                )
              ) {
                dispatch(showDomainControllerConfirmationDialog(callback));
                return;
              }
              callback();
            }}
          />
          {machines[props.machineIndex].DomainRole ===
            DomainRoles.DomainMember && (
            <Dropdown
              label='Domain'
              styles={{ dropdown: { width: '200px' } }}
              options={selectDomains}
              selectedKey={machines[props.machineIndex].DomainID}
              disabled={!canMachineDomainBeEdited()}
              onChange={(event, option) => {
                dispatch(
                  editableWorkspaceUpdateDomainMemberDomain(
                    props.machineIndex,
                    option.key.toString()
                  )
                );
              }}
            />
          )}
          {machines[props.machineIndex].DomainRole ===
            DomainRoles.DomainController && (
            <TextField
              aria-label='Domain Name'
              label='Domain Name'
              style={{ width: '225px' }}
              maxLength={70}
              disabled={currentDomain === null || !canMachineDomainBeEdited()}
              errorMessage={
                currentDomainError ? currentDomainError.message : ''
              }
              value={currentDomain ? currentDomain.Name : ''}
              onChange={(event, newValue) => {
                dispatch(
                  editableWorkspaceUpdateDomainName(
                    props.machineIndex,
                    newValue
                  )
                );
              }}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

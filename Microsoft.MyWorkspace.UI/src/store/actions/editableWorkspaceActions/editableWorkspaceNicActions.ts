import cloneDeep from 'lodash/cloneDeep';

import {
  EDITABLE_WORKSPACE_ADD_NIC,
  EDITABLE_WORKSPACE_REMOVE_NIC,
  EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
  EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
} from '../actionTypes';
import { checkNicNatRuleAssociation } from '../../validators/nicNatRuleValidators';
import { AzureNicForCreationDto } from '../../../types/ResourceCreation/AzureNicForCreationDto.types';

import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { AzureNicDto } from '../../../types/AzureWorkspace/AzureNicDto.types';
import { showBlockedNotification, showErrorNotification } from '..';
import { EditableWorkspaceDispatch } from './index';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { validateDomainSubnets } from '../../validators/workspaceValidators';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

export const editableWorkspaceAddNic = (
  machineIndex: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const machine = machines[machineIndex];
    (machine.Nics as AzureNicForCreationDto[]).push({
      Name: `NIC ${machine.Nics.length + 1}`,
      Description: '',
      VirtualNetworkName:
        editableWorkspace.editableWorkspace.VirtualNetworks[0].Name,
      SubnetName: Object.keys(
        editableWorkspace.editableWorkspace.VirtualNetworks[0].SubnetProperties
      )[0],
    } as AzureNicForCreationDto);
    dispatch({
      type: EDITABLE_WORKSPACE_ADD_NIC,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceRemoveNic = (
  machineIndex: number,
  nicIndex: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const machine = machines[machineIndex];
    if (machine.Nics.length <= 1) {
      dispatch(
        showBlockedNotification('This machine must have at least one NIC.')
      );
      return;
    }
    const nicNatRules =
      editableWorkspace.workspaceEditType === WorkspaceEditType.EditWorkspace
        ? checkNicNatRuleAssociation(
            machine as AzureVirtualMachineDto,
            nicIndex
          )
        : null;
    if (nicNatRules != null) {
      dispatch(showBlockedNotification(nicNatRules));
      return;
    } else {
      const [removedNic] = machine.Nics.splice(nicIndex, 1);
      if (machine.PrimaryNicName === removedNic.Name) {
        machine.PrimaryNicName = machine.Nics[0].Name;
      }
      machine.Nics = (machine.Nics as AzureNicForCreationDto[]).map(
        (nic, index) => {
          const newNicName = `NIC ${index + 1}`;
          if (machine.PrimaryNicName === nic.Name) {
            machine.PrimaryNicName = newNicName;
          }
          return { ...nic, Name: newNicName };
        }
      ) as AzureNicDto[] | AzureNicForCreationDto[];
    }
    if (machine.DomainRole !== DomainRoles.WorkgroupMember) {
      const domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
      const domain = domains.find((d) => d.ID === machine.DomainID);
      const domainSubnetsError = validateDomainSubnets(
        domain,
        machines,
        machine.DomainRole
      );
      if (domainSubnetsError) {
        dispatch(showBlockedNotification(domainSubnetsError));
        return;
      }
    }
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_NIC,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceChangePrimaryNic = (
  machineIndex: number,
  nicName: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const machine = machines[machineIndex];
    machine.PrimaryNicName = nicName;
    dispatch({
      type: EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceChangeNicSubnet = (
  machineIndex: number,
  nicName: string,
  subnetName: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const machine = machines[machineIndex];
    const nicIndex = machine.Nics.findIndex((nic) => nic.Name === nicName);
    if (nicIndex < 0) {
      dispatch(showErrorNotification('Unable to change nic network.'));
      return;
    }
    machine.Nics[nicIndex].SubnetName = subnetName;
    if (machine.DomainRole !== DomainRoles.WorkgroupMember) {
      const domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
      const domain = domains.find((d) => d.ID === machine.DomainID);
      const domainSubnetsError = validateDomainSubnets(
        domain,
        machines,
        machine.DomainRole
      );
      if (domainSubnetsError) {
        dispatch(showBlockedNotification(domainSubnetsError));
        return;
      }
    }
    dispatch({
      type: EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
      payload: {
        machines,
      },
    });
  };
};

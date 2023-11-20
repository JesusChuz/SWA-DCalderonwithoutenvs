import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { NetworkProtocols } from '../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { NatRuleDto } from '../../../types/AzureWorkspace/NatRuleDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import {
  EDITABLE_WORKSPACE_ADD_NAT_RULE,
  EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
  EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_REMOVE_ALL_NEW_IP_ADDRESSES,
} from '../actionTypes';
import { EditableWorkspaceAction, EditableWorkspaceDispatch } from './index';

export const editableWorkspaceAddNewPublicAddress =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
    };
  };

export const editableWorkspaceRemoveNewPublicAddress =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
    };
  };

export const editableWorkspaceRemoveAllNewPublicAddresses =
  (): EditableWorkspaceAction => {
    return {
      type: EDITABLE_WORKSPACE_REMOVE_ALL_NEW_IP_ADDRESSES,
    };
  };

export const editableWorkspaceRemoveNatRule = (
  machine: AzureVirtualMachineDto,
  natRule: NatRuleDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = [
      ...editableWorkspace.editableWorkspace.VirtualMachines,
    ] as AzureVirtualMachineDto[];
    const vmIndex = machines.findIndex(
      (vm: AzureVirtualMachineDto) => vm.ID === machine.ID
    );
    if (vmIndex >= 0) {
      const vm = machines[vmIndex] as AzureVirtualMachineDto;
      const natRules = vm.NatRules.filter((nat) => nat.ID !== natRule.ID);
      machines[vmIndex] = { ...vm, NatRules: natRules };
    }
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
      payload: {
        machines,
      },
    });
  };
};

export const editableWorkspaceAddNatRule = (
  natRule: NatRuleDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = [
      ...editableWorkspace.editableWorkspace.VirtualMachines,
    ] as AzureVirtualMachineDto[];
    const newName = `${
      natRule.Protocol === NetworkProtocols.TCP ? 'TCP' : 'UDP'
    }-${natRule.ExternalPort}-${natRule.InternalAddress}`;

    const virtualMachineID = natRule.VirtualMachineID;

    const vmIndex = machines.findIndex(
      (vm: AzureVirtualMachineDto) => vm.ID === virtualMachineID
    );

    if (vmIndex >= 0) {
      const vm = machines[vmIndex] as AzureVirtualMachineDto;
      const natRules = [...vm.NatRules, { ...natRule, Name: newName }];
      machines[vmIndex] = { ...vm, NatRules: natRules };
    }
    dispatch({
      type: EDITABLE_WORKSPACE_ADD_NAT_RULE,
      payload: {
        machines,
      },
    });
  };
};

import cloneDeep from 'lodash/cloneDeep';
import { EditableWorkspaceDispatch } from './index';
import { showBlockedNotification } from '..';
import { workspaceTempSubnetsToSubnetProperties } from '../../../shared/TypeConversions';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { TempSubnet } from '../../../types/Forms/TempSubnet.types';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { checkNetworksQuota } from '../../validators/quotaValidators';
import { workspaceValidateSubnetNames } from '../../validators/workspaceValidators';
import { EDITABLE_WORKSPACE_UPDATE_SUBNETS } from '../actionTypes';

export const editableWorkspaceUpdateSubnetName = (
  index: number,
  newName: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const subnets = cloneDeep(editableWorkspace.subnets);
    const network = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualNetworks[0]
    );
    const changedSubnetName = subnets[index].name;
    subnets[index].name = newName;
    network.SubnetProperties = workspaceTempSubnetsToSubnetProperties(subnets);
    const machines = setMachineNicSubnetNames(
      editableWorkspace.editableWorkspace,
      changedSubnetName,
      newName
    );
    const error = workspaceValidateSubnetNames(subnets.map((v) => v.name));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets,
        network,
        machines,
      },
      error,
    });
  };
};

export const editableWorkspaceUpdateSubnet = (
  index: number,
  subnet: TempSubnet
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const subnets = cloneDeep(editableWorkspace.subnets);
    const network = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualNetworks[0]
    );
    const changedSubnetName = subnets[index].name;
    subnets[index] = subnet;
    network.SubnetProperties = workspaceTempSubnetsToSubnetProperties(subnets);
    const machines = setMachineNicSubnetNames(
      editableWorkspace.editableWorkspace,
      changedSubnetName,
      subnet.name
    );
    const error = workspaceValidateSubnetNames(subnets.map((v) => v.name));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets,
        network,
        machines,
      },
      error,
    });
  };
};

const setMachineNicSubnetNames = (
  workspace: EditableWorkspace,
  oldName: string,
  newName: string
): AzureVirtualMachineForCreationDto[] => {
  const machines = cloneDeep(workspace.VirtualMachines);
  machines.forEach(
    (m: AzureVirtualMachineForCreationDto | AzureVirtualMachineDto) => {
      m.Nics.forEach((nic) => {
        if (nic.SubnetName === oldName) {
          nic.SubnetName = newName;
        }
      });
    }
  );
  return machines;
};

const getUniqueSubnetName = (subnets: TempSubnet[]) => {
  let subnetSuffix = 1;
  let subnetName = `subnet${subnetSuffix}`;
  while (subnets.some((subnet) => subnet.name === subnetName)) {
    subnetSuffix += 1;
    subnetName = `subnet${subnetSuffix}`;
  }
  return subnetName;
};

export const editableWorkspaceAddSubnet = (): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const subnets = cloneDeep(editableWorkspace.subnets);
    const network = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualNetworks[0]
    );
    subnets.push({
      name: getUniqueSubnetName(subnets),
      subnet: {
        IsRoutable: true,
      },
    });
    network.SubnetProperties = workspaceTempSubnetsToSubnetProperties(subnets);
    const quotaError = checkNetworksQuota(subnets.map((v) => v.name));
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    const error = workspaceValidateSubnetNames(subnets.map((v) => v.name));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets,
        network,
      },
      error,
    });
  };
};

export const editableWorkspaceRemoveSubnet = (
  index: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const subnets = cloneDeep(editableWorkspace.subnets);
    const network = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualNetworks[0]
    );
    const [removedSubnet] = subnets.splice(index, 1);
    network.SubnetProperties = workspaceTempSubnetsToSubnetProperties(subnets);
    const quotaError = checkNetworksQuota(subnets.map((v) => v.name));
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    const machines = setMachineNicSubnetNames(
      editableWorkspace.editableWorkspace,
      removedSubnet.name,
      subnets[0].name
    );
    const error = workspaceValidateSubnetNames(subnets.map((v) => v.name));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets,
        network,
        machines,
      },
      error,
    });
  };
};

export const editableWorkspaceUpdateRoutable = (
  index: number,
  routable: boolean
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const subnets = cloneDeep(editableWorkspace.subnets);
    const network = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualNetworks[0]
    );
    subnets[index].subnet.IsRoutable = routable;
    network.SubnetProperties = workspaceTempSubnetsToSubnetProperties(subnets);
    const error = workspaceValidateSubnetNames(subnets.map((v) => v.name));
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets,
        network,
      },
      error,
    });
  };
};

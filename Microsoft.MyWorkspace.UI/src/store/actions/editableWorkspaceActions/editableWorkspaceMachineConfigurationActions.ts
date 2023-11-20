import cloneDeep from 'lodash/cloneDeep';
import { EditableWorkspaceDispatch, EditableWorkspaceAction } from './index';
import { setPoliteScreenReaderAnnouncement, showBlockedNotification } from '..';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureStorageAccountType } from '../../../types/AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { VirtualMachineCustomDto } from '../../../types/Catalog/VirtualMachineCustomDto.types';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { Default_AzureOSDiskDto } from '../../../data/Default_AzureOSDiskDto';
import {
  checkMaxMachinesQuota,
  checkMaxMemoryQuotaWithAddition,
} from '../../validators/quotaValidators';
import {
  workspaceValidateMachineAmount,
  setDomainMembersToWorkgroupMembers,
} from '../../validators/workspaceValidators';
import {
  EDITABLE_WORKSPACE_ADD_MACHINE,
  EDITABLE_WORKSPACE_REMOVE_MACHINE,
  EDITABLE_WORKSPACE_BUILD_MACHINES,
  EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
} from '../actionTypes';
import { MachineImageType } from '../../../types/AzureWorkspace/enums/MachineImageType';

export const editableWorkspaceAddMachines = (
  machine: VirtualMachineCustomDto,
  amount: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<EditableWorkspaceAction>) => {
  return async (dispatch, getState): Promise<EditableWorkspaceAction> => {
    const { editableWorkspace, authService, catalog } = getState();
    const machines = cloneDeep(editableWorkspace.machines);
    const i = machines.findIndex(
      (c) => c.machine.ImageSourceID === machine.ImageSourceID
    );
    i === -1
      ? machines.push({
          machine: machine,
          count: amount,
        })
      : (machines[i].count = amount);
    const minMemory = Math.min(
      ...catalog.catalogMachineSkus.map((m) => m.Memory / 1024)
    );
    const error = workspaceValidateMachineAmount(amount);
    const maxMachinesError = checkMaxMachinesQuota(
      editableWorkspace.editableWorkspace.VirtualMachines,
      authService.constraint,
      machines,
      editableWorkspace.isNestedVirtualizationEnabled
    );
    const quotaError = maxMachinesError
      ? maxMachinesError
      : checkMaxMemoryQuotaWithAddition(
          editableWorkspace.editableWorkspace.VirtualMachines,
          minMemory,
          authService.constraint
        );
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    // Our only offerings are currently Generalized. This may change in the future and we'll need to change this logic
    dispatch({
      type: EDITABLE_WORKSPACE_ADD_MACHINE,
      payload: machines,
      error,
    });
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `${amount} ${machine.Name} Machine${amount !== 1 ? 's' : ''} Selected`
      )
    );
  };
};

export const editableWorkspaceAddMachine = (
  machine: VirtualMachineCustomDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, authService, catalog } = getState();
    const machines = cloneDeep(editableWorkspace.machines);
    const i = machines.findIndex(
      (c) => c.machine.ImageSourceID === machine.ImageSourceID
    );
    i === -1
      ? machines.push({
          machine: machine,
          count: 1,
        })
      : (machines[i].count += 1);
    const minMemory = Math.min(
      ...catalog.catalogMachineSkus.map((m) => m.Memory / 1024)
    );
    const maxMachinesError = checkMaxMachinesQuota(
      editableWorkspace.editableWorkspace.VirtualMachines,
      authService.constraint,
      machines,
      editableWorkspace.isNestedVirtualizationEnabled
    );
    const quotaError = maxMachinesError
      ? maxMachinesError
      : checkMaxMemoryQuotaWithAddition(
          editableWorkspace.editableWorkspace.VirtualMachines,
          minMemory,
          authService.constraint
        );
    if (quotaError) {
      dispatch(showBlockedNotification(quotaError));
      return;
    }
    dispatch({
      type: EDITABLE_WORKSPACE_ADD_MACHINE,
      payload: machines,
    });
    const count = i === -1 ? 1 : machines[i].count;
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `${count} ${machine.Name} Machine${count !== 1 ? 's' : ''} Selected`
      )
    );
  };
};

export const editableWorkspaceRemoveMachine = (
  machine: VirtualMachineCustomDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(editableWorkspace.machines);
    const i = machines.findIndex(
      (mach) => mach.machine.ImageSourceID === machine.ImageSourceID
    );
    if (i !== -1) {
      machines[i].count -= 1;
      machines[i].count === 0 && machines.splice(i, 1);
    }
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_MACHINE,
      payload: machines,
    });
    const newIndex = machines.findIndex(
      (mach) => mach.machine.ImageSourceID === machine.ImageSourceID
    );
    const newCount = newIndex === -1 ? 0 : machines[newIndex].count;
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `${newCount ?? 'No'} ${machine.Name} Machine${
          newCount !== 1 ? 's' : ''
        } Selected`
      )
    );
  };
};

export const editableWorkspaceRemoveMachines = (
  machine: VirtualMachineCustomDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(editableWorkspace.machines);
    const i = machines.findIndex(
      (c) => c.machine.ImageSourceID === machine.ImageSourceID
    );
    if (i !== -1) {
      machines.splice(i, 1);
    }
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_MACHINE,
      payload: machines,
    });
    dispatch(
      setPoliteScreenReaderAnnouncement(`All ${machine.Name} Machines Removed`)
    );
  };
};

export const editableWorkspaceRemoveConfiguredMachine = (
  index: number
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    let domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
    const [deletedMachine] = machines.splice(index, 1);
    if (deletedMachine.DomainRole === DomainRoles.DomainController) {
      domains = domains.filter((d) => d.ID !== deletedMachine.DomainID);
      setDomainMembersToWorkgroupMembers(deletedMachine, machines);
    }
    dispatch({
      type: EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
      payload: {
        machines,
        domains,
      },
    });
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `${deletedMachine.ComputerName} Machine Removed`
      )
    );
  };
};

const getUniqueComputerName = (names: string[]) => {
  let computerSuffix = 0;
  let computerName = `VM${computerSuffix}`;
  while (names.some((name) => name === computerName)) {
    computerSuffix += 1;
    computerName = `VM${computerSuffix}`;
  }
  return computerName;
};

export const editableWorkspaceBuildMachines = (): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, catalog } = getState();
    const newMachines: AzureVirtualMachineForCreationDto[] = [];
    const defaultOSDisk = { ...Default_AzureOSDiskDto };
    const minSku = catalog.catalogMachineSkus
      .filter(
        (sku) =>
          sku.CanSupportVirtualization ===
          editableWorkspace.isNestedVirtualizationEnabled
      )
      .reduce((min, curr) => (curr.Memory < min.Memory ? curr : min));

    for (let i = 0; i < editableWorkspace.machines.length; i++) {
      let count = editableWorkspace.machines[i].count;
      while (count > 0) {
        newMachines.push({
          Name: editableWorkspace.machines[i].machine.Name,
          ComputerName: getUniqueComputerName([
            ...(
              editableWorkspace.editableWorkspace.VirtualMachines as (
                | AzureVirtualMachineDto
                | AzureVirtualMachineForCreationDto
              )[]
            ).map((m) => m.ComputerName),
            ,
            ...newMachines.map((m) => m.ComputerName),
          ]),
          Description: '',
          AdministratorName: editableWorkspace.administratorName,
          AdministratorPassword: editableWorkspace.administratorPassword,
          ImageSourceID: editableWorkspace.machines[i].machine.ImageSourceID,
          Sku: minSku.Name,
          MemoryGB: minSku.Memory / 1024,
          DomainRole: DomainRoles.WorkgroupMember,
          PrimaryNicName: 'NIC 1',
          StorageAccountType: AzureStorageAccountType.StandardSSD_LRS,
          Nics: [
            {
              Name: 'NIC 1',
              Description: 'Default NIC',
              VirtualNetworkName:
                editableWorkspace.editableWorkspace.VirtualNetworks[0].Name,
              SubnetName: Object.keys(
                editableWorkspace.editableWorkspace.VirtualNetworks[0]
                  .SubnetProperties
              )[0],
            },
          ],
          OSDiskSizeInGB: defaultOSDisk.SizeGB,
          DataDisks: [],
          PatchMode: editableWorkspace.machines[i].machine.PatchMode,
          OSVersion: editableWorkspace.machines[i].machine.OSVersion,
          MachineImageType: MachineImageType.Marketplace,
          IsNested: editableWorkspace.isNestedVirtualizationEnabled ?? false,
        });
        count -= 1;
      }
    }

    dispatch({
      type: EDITABLE_WORKSPACE_BUILD_MACHINES,
      // We currently only offer generalized vm's. This will need updating when we offer specialized.
      payload: newMachines,
    });
  };
};

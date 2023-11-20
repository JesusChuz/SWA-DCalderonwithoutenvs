import cloneDeep from 'lodash/cloneDeep';

import { MachineSelectionWithCount } from '../../types/Forms/MachineSelectionWithCount.types';
import { WorkspaceErrors } from '../../types/Forms/WorkspaceErrors.types';
import { AzureVirtualMachineForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureWorkspaceForCreationDto } from '../../types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { DataDiskError } from '../../types/Forms/DataDiskError.types';
import {
  EDITABLE_WORKSPACE_ADD_DATA_DISK,
  EDITABLE_WORKSPACE_ADD_MACHINE,
  EDITABLE_WORKSPACE_BUILD_MACHINES,
  EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
  EDITABLE_WORKSPACE_REMOVE_MACHINE,
  EDITABLE_WORKSPACE_RESET_CHANGES,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
  EDITABLE_WORKSPACE_UPDATE_DATA_DISK,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
  EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB,
  EDITABLE_WORKSPACE_UPDATE_NAME,
  EDITABLE_WORKSPACE_UPDATE_VM_NAME,
  EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
  EDITABLE_WORKSPACE_ADD_NIC,
  EDITABLE_WORKSPACE_REMOVE_NIC,
  EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
  EDITABLE_WORKSPACE_UPDATE_SUBNETS,
  EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
  EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
  EDITABLE_WORKSPACE_ADD_NAT_RULE,
  EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
  EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
  EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
  EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
  EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_SET_SAVING,
  EDITABLE_WORKSPACE_UPDATE_DOMAIN,
  EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
  EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
  EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
  EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_SAVE_FAILURE,
  EDITABLE_WORKSPACE_SAVE_SUCCESS,
  EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
  EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
  EDITABLE_WORKSPACE_SAVE_DNS_ZONE,
  CREATE_SNAPSHOT_BEGIN,
  CREATE_SNAPSHOT_SUCCESS,
  CREATE_SNAPSHOT_FAILURE,
  RESTORE_SNAPSHOT_BEGIN,
  RESTORE_SNAPSHOT_FAILURE,
  RESTORE_SNAPSHOT_SUCCESS,
  DELETE_SNAPSHOT_BEGIN,
  DELETE_SNAPSHOT_FAILURE,
  DELETE_SNAPSHOT_SUCCESS,
  EDITABLE_WORKSPACE_SET_NESTED_VIRTUALIZATION,
  EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
  EDITABLE_WORKSPACE_UPDATE_SEGMENT_SHARING,
  EDITABLE_WORKSPACE_REMOVE_ALL_NEW_IP_ADDRESSES,
} from '../actions/actionTypes';
import {
  EditableWorkspaceAction,
  EditableWorkspaceAddSharedOwnerPayload,
  EditableWorkspaceAdminNamePayload,
  EditableWorkspaceDomainsPayload,
  EditableWorkspaceMachinesPayload,
  EditableWorkspacePayload,
  EditableWorkspaceRemoveSharedOwnerPayload,
  EditableWorkspaceSubnetPayload,
} from '../actions/editableWorkspaceActions';
import { VMNameError } from '../../types/Forms/VMNameError.types';
import { SubnetNameError } from '../../types/Forms/SubnetNameError.types';
import { TempSubnet } from '../../types/Forms/TempSubnet.types';
import { editableWorkspaceSubnetsToTempSubnets } from '../../shared/TypeConversions';
import { EditableWorkspace } from '../../types/Forms/EditableWorkspace.types';
import { ExternalConnectivityChanges } from '../../types/Forms/ExternalConnectivityChanges.types';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { WorkspaceEditType } from '../../types/enums/WorkspaceEditType';
import { Blank_AzureWorkspaceForCreationDto } from '../../data/Blank_AzureWorkspaceForCreationDto';
import { Blank_Subnet } from '../../data/Blank_Subnet';
import { Blank_WorkspaceErrors } from '../../data/Blank_WorkspaceErrors';
import { Blank_EditableWorkspace } from '../../data/Blank_EditableWorkspace';
import { Blank_ExternalConnectivityChanges } from '../../data/Blank_ExternalConnectivityChanges';
import { AzureDNSZoneDto } from '../../types/AzureWorkspace/AzureDNSZoneDto.types';
import { Blank_AzureDNSZoneDto } from '../../data/Blank_AzureDNSZoneDto';
import { DomainError } from '../../types/Forms/DomainError.types';
import { AzureVirtualMachineDto } from '../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { WorkspaceScheduledJobDto } from '../../types/Job/WorkspaceScheduledJobDto.types';
import { WorkspaceScheduledJobError } from '../../types/Forms/WorkspaceScheduledJobError.types';
import { AzureVirtualMachineSnapshotForCreationDto } from '../../types/AzureWorkspace/AzureVirtualMachineSnapshotForCreationDto.types';
import { AzureVirtualMachineSnapshotDto } from '../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';

export interface ReduxEditableWorkspaceState {
  editableWorkspace: EditableWorkspace;
  originalWorkspace: AzureWorkspaceForCreationDto | AzureWorkspaceDto;
  machines: MachineSelectionWithCount[];
  externalConnectivityChanges: ExternalConnectivityChanges;
  editedWorkspaceScheduledJob: WorkspaceScheduledJobDto;
  originalWorkspaceScheduledJob: WorkspaceScheduledJobDto;
  administratorName: string;
  administratorPassword: string;
  administratorPasswordConfirm: string;
  saving: boolean;
  subnets: TempSubnet[];
  errors: WorkspaceErrors;
  workspaceEditType: WorkspaceEditType;
  isAdminSelection: boolean;
  lastSaveSuccess: boolean;
  snapshotVirtualMachineSavingID: string;
  isNestedVirtualizationEnabled: boolean;
}

export const editableWorkspaceInitialState: ReduxEditableWorkspaceState = {
  editableWorkspace: Blank_EditableWorkspace,
  originalWorkspace: Blank_AzureWorkspaceForCreationDto,
  machines: [],
  externalConnectivityChanges: Blank_ExternalConnectivityChanges,
  editedWorkspaceScheduledJob: null,
  originalWorkspaceScheduledJob: null,
  administratorName: '',
  administratorPassword: '',
  administratorPasswordConfirm: '',
  saving: false,
  subnets: [Blank_Subnet],
  // all of our validators will return an empty string '' if there isn't an error. This way, if they aren't null they're dirty
  errors: Blank_WorkspaceErrors,
  workspaceEditType: WorkspaceEditType.NewCustomWorkspace,
  isAdminSelection: false,
  lastSaveSuccess: false,
  snapshotVirtualMachineSavingID: '',
  isNestedVirtualizationEnabled: false,
};

export default function editableWorkspaceReducer(
  state: ReduxEditableWorkspaceState = editableWorkspaceInitialState,
  action: EditableWorkspaceAction
): ReduxEditableWorkspaceState {
  switch (action.type) {
    case EDITABLE_WORKSPACE_UPDATE_NAME:
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          Name: action.payload as string,
        },
        errors: {
          ...state.errors,
          workspaceName: action.error as string,
        },
      };
    case EDITABLE_WORKSPACE_UPDATE_DESCRIPTION:
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          Description: action.payload as string,
        },
      };
    case EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME:
      return {
        ...state,
        administratorName: (action.payload as EditableWorkspaceAdminNamePayload)
          .name,
        errors: {
          ...state.errors,
          administratorName: action.error as string,
        },
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: (action.payload as EditableWorkspaceAdminNamePayload)
            .machines,
        },
      };
    case EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD:
      return {
        ...state,
        administratorPassword: action.payload as string,
        errors: {
          ...state.errors,
          administratorPassword: action.error as string,
        },
      };
    case EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM:
      return {
        ...state,
        administratorPasswordConfirm: action.payload as string,
        errors: {
          ...state.errors,
          administratorPasswordConfirm: action.error as string,
        },
      };
    case EDITABLE_WORKSPACE_UPDATE_VM_NAME: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: (action.payload as EditableWorkspaceMachinesPayload)
            .machines,
        },
        errors: {
          ...state.errors,
          vmNames: action.error as VMNameError[],
        },
      };
    }
    case EDITABLE_WORKSPACE_ADD_MACHINE: {
      return {
        ...state,
        machines: action.payload as MachineSelectionWithCount[],
        errors: {
          ...state.errors,
          machineAmount: action.error as string,
        },
      };
    }
    case EDITABLE_WORKSPACE_REMOVE_MACHINE: {
      return {
        ...state,
        machines: action.payload as MachineSelectionWithCount[],
      };
    }
    case EDITABLE_WORKSPACE_BUILD_MACHINES: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: [
            ...state.editableWorkspace.VirtualMachines,
            ...(action.payload as AzureVirtualMachineDto[]),
          ],
        },
        machines: [],
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE: {
      return {
        ...state,
        workspaceEditType: action.payload as WorkspaceEditType,
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_DATA_DISK: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: (action.payload as EditableWorkspaceMachinesPayload)
            .machines,
        },
        errors: {
          ...state.errors,
          dataDisks: action.error as DataDiskError[],
        },
      };
    }
    case EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE: {
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: payload.machines,
          Domains: payload.domains,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          Geography: action.payload as string,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE: {
      return {
        ...state,
        editableWorkspace: {
          ...(action.payload as AzureWorkspaceForCreationDto),
          SecurityLock: false,
          SharedWithSegment: false,
        },
        isNestedVirtualizationEnabled: (
          action.payload as AzureWorkspaceForCreationDto
        ).VirtualMachines.some((vm) => vm.IsNested),
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_SUBNETS: {
      const machinePayload = action.payload as EditableWorkspaceMachinesPayload;
      const VirtualMachines =
        machinePayload.machines !== undefined
          ? machinePayload.machines
          : state.editableWorkspace.VirtualMachines;
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualNetworks: [
            (action.payload as EditableWorkspaceSubnetPayload).network,
          ],
          VirtualMachines,
        },
        subnets: (action.payload as EditableWorkspaceSubnetPayload).subnets,
        errors: {
          ...state.errors,
          subnetNames: action.error as SubnetNameError[],
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_DOMAIN: {
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: (action.payload as EditableWorkspaceMachinesPayload)
            .machines,
          Domains: payload.domains,
        },
        errors: {
          ...state.errors,
          domains:
            action.error !== undefined
              ? (action.error as DomainError[])
              : state.errors.domains,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          SecurityLock: action.payload as boolean,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB:
    case EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB:
    case EDITABLE_WORKSPACE_ADD_DATA_DISK:
    case EDITABLE_WORKSPACE_REMOVE_DATA_DISK:
    case EDITABLE_WORKSPACE_ADD_NIC:
    case EDITABLE_WORKSPACE_REMOVE_NIC:
    case EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC:
    case EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET:
    case EDITABLE_WORKSPACE_ADD_NAT_RULE:
    case EDITABLE_WORKSPACE_REMOVE_NAT_RULE: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: (action.payload as EditableWorkspaceMachinesPayload)
            .machines,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_DNS_ZONE: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          DNSZone: action.payload as AzureDNSZoneDto,
        },
      };
    }
    case EDITABLE_WORKSPACE_SAVE_DNS_ZONE: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          DNSZone: action.payload as AzureDNSZoneDto,
        },
        originalWorkspace: {
          ...state.originalWorkspace,
          DNSZone: action.payload as AzureDNSZoneDto,
        },
      };
    }
    case EDITABLE_WORKSPACE_ADD_SHARED_OWNER: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          SharedOwnerEmails: [
            ...state.editableWorkspace.SharedOwnerEmails,
            (action.payload as EditableWorkspaceAddSharedOwnerPayload).alias,
          ],
          SharedOwnerIDs: [
            ...state.editableWorkspace.SharedOwnerIDs,
            (action.payload as EditableWorkspaceAddSharedOwnerPayload).id,
          ],
        },
      };
    }
    case EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          SharedOwnerEmails: (
            action.payload as EditableWorkspaceRemoveSharedOwnerPayload
          ).emails,
          SharedOwnerIDs: (
            action.payload as EditableWorkspaceRemoveSharedOwnerPayload
          ).ids,
        },
      };
    }
    case EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS: {
      return {
        ...state,
        externalConnectivityChanges: {
          ...state.externalConnectivityChanges,
          NewPublicAddressCount:
            state.externalConnectivityChanges.NewPublicAddressCount + 1,
        },
      };
    }
    case EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS: {
      return {
        ...state,
        externalConnectivityChanges: {
          ...state.externalConnectivityChanges,
          NewPublicAddressCount: Math.max(
            state.externalConnectivityChanges.NewPublicAddressCount - 1,
            0
          ),
        },
      };
    }
    case EDITABLE_WORKSPACE_REMOVE_ALL_NEW_IP_ADDRESSES: {
      return {
        ...state,
        externalConnectivityChanges: {
          ...state.externalConnectivityChanges,
          NewPublicAddressCount: 0,
        },
      };
    }
    case EDITABLE_WORKSPACE_SET_SAVING: {
      return {
        ...state,
        saving: action.payload as boolean,
      };
    }
    case EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT: {
      const workspace = cloneDeep(action.payload as AzureWorkspaceDto);
      const originalWorkspace = cloneDeep(action.payload as AzureWorkspaceDto);
      workspace.DNSZone = workspace.DNSZone
        ? workspace.DNSZone
        : Blank_AzureDNSZoneDto;
      originalWorkspace.DNSZone = originalWorkspace.DNSZone
        ? originalWorkspace.DNSZone
        : Blank_AzureDNSZoneDto;

      const adminName =
        [...workspace.VirtualMachines].pop()?.AdministratorName || '';

      return {
        ...editableWorkspaceInitialState,
        workspaceEditType: WorkspaceEditType.EditWorkspace,
        editableWorkspace: workspace,
        originalWorkspace: workspace,
        subnets: editableWorkspaceSubnetsToTempSubnets(workspace),
        isAdminSelection: action.isAdminSelection,
        administratorName: adminName,
        isNestedVirtualizationEnabled: workspace.VirtualMachines.some(
          (vm) => vm.IsNested
        ),
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT: {
      const payload = action.payload as EditableWorkspacePayload;
      return {
        ...state,
        editableWorkspace: payload.editedWorkspace as AzureWorkspaceDto,
        originalWorkspace: payload.originalWorkspace as AzureWorkspaceDto,
      };
    }
    case EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW: {
      return {
        ...editableWorkspaceInitialState,
        workspaceEditType: action.payload as WorkspaceEditType,
      };
    }
    case EDITABLE_WORKSPACE_RESET_CHANGES: {
      const adminName =
        [
          ...(state.originalWorkspace.VirtualMachines as (
            | AzureVirtualMachineDto
            | AzureVirtualMachineForCreationDto
          )[]),
        ].pop()?.AdministratorName || '';

      return {
        ...editableWorkspaceInitialState,
        editableWorkspace: cloneDeep(
          state.originalWorkspace
        ) as EditableWorkspace,
        subnets: editableWorkspaceSubnetsToTempSubnets(
          state.originalWorkspace as AzureWorkspaceDto
        ),
        originalWorkspaceScheduledJob: state.originalWorkspaceScheduledJob,
        editedWorkspaceScheduledJob: state.originalWorkspaceScheduledJob,
        workspaceEditType: state.workspaceEditType,
        originalWorkspace: state.originalWorkspace,
        administratorName: adminName,
      };
    }
    case EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION: {
      return {
        ...state,
        machines: [],
      };
    }
    case EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: [],
          Domains: [],
        },
      };
    }
    case EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES: {
      return {
        ...state,
        editableWorkspace: cloneDeep(action.payload) as EditableWorkspace,
        errors: cloneDeep(action.error) as WorkspaceErrors,
      };
    }
    case EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES: {
      return {
        ...state,
        subnets: editableWorkspaceSubnetsToTempSubnets(
          state.originalWorkspace as AzureWorkspaceDto
        ),
      };
    }
    case EDITABLE_WORKSPACE_SAVE_FAILURE: {
      return {
        ...state,
        lastSaveSuccess: false,
      };
    }
    case EDITABLE_WORKSPACE_SAVE_SUCCESS: {
      return {
        ...state,
        lastSaveSuccess: true,
        originalWorkspace: {
          ...state.originalWorkspace,
          ...cloneDeep(state.editableWorkspace),
        },
        originalWorkspaceScheduledJob: cloneDeep(
          state.editedWorkspaceScheduledJob
        ),
        externalConnectivityChanges: Blank_ExternalConnectivityChanges,
        errors: Blank_WorkspaceErrors,
      };
    }
    case EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB: {
      return {
        ...state,
        editedWorkspaceScheduledJob: cloneDeep(
          action.payload as WorkspaceScheduledJobDto
        ),
        originalWorkspaceScheduledJob: cloneDeep(
          action.payload as WorkspaceScheduledJobDto
        ),
        errors: {
          ...state.errors,
          workspaceScheduledJob: action.error as WorkspaceScheduledJobError,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB: {
      return {
        ...state,
        editedWorkspaceScheduledJob: cloneDeep(
          action.payload as WorkspaceScheduledJobDto
        ),
        errors: {
          ...state.errors,
          workspaceScheduledJob: action.error as WorkspaceScheduledJobError,
        },
      };
    }
    case EDITABLE_WORKSPACE_UPDATE_SEGMENT_SHARING: {
      return {
        ...state,
        editableWorkspace: {
          ...state.editableWorkspace,
          SharedWithSegment: action.payload as boolean,
        },
      };
    }
    case CREATE_SNAPSHOT_BEGIN: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: (
          action.payload as AzureVirtualMachineSnapshotForCreationDto
        ).VirtualMachineID,
      };
    }
    case CREATE_SNAPSHOT_SUCCESS: {
      const snapshot = action.payload as AzureVirtualMachineSnapshotDto;
      const originalVirtualMachines = cloneDeep(
        state.originalWorkspace.VirtualMachines as AzureVirtualMachineDto[]
      );
      const editedVirtualMachines = cloneDeep(
        state.editableWorkspace.VirtualMachines as AzureVirtualMachineDto[]
      );
      const originalVirtualMachine = originalVirtualMachines.find(
        (vm) => vm.ID === snapshot.VirtualMachineID
      );
      const editedVirtualMachine = editedVirtualMachines.find(
        (vm) => vm.ID === snapshot.VirtualMachineID
      );
      originalVirtualMachine.Snapshots = [
        ...originalVirtualMachine.Snapshots,
        snapshot,
      ];
      editedVirtualMachine.Snapshots = [
        ...editedVirtualMachine.Snapshots,
        snapshot,
      ];
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
        originalWorkspace: {
          ...state.originalWorkspace,
          VirtualMachines: originalVirtualMachines,
        },
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: editedVirtualMachines,
        },
      };
    }
    case CREATE_SNAPSHOT_FAILURE: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
      };
    }
    case RESTORE_SNAPSHOT_BEGIN: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: (
          action.payload as AzureVirtualMachineSnapshotForCreationDto
        ).VirtualMachineID,
      };
    }
    case RESTORE_SNAPSHOT_SUCCESS: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
      };
    }
    case RESTORE_SNAPSHOT_FAILURE: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
      };
    }
    case DELETE_SNAPSHOT_BEGIN: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: (
          action.payload as AzureVirtualMachineSnapshotForCreationDto
        ).VirtualMachineID,
      };
    }
    case DELETE_SNAPSHOT_SUCCESS: {
      const snapshot = action.payload as AzureVirtualMachineSnapshotDto;
      const originalVirtualMachines = cloneDeep(
        state.originalWorkspace.VirtualMachines as AzureVirtualMachineDto[]
      );
      const editedVirtualMachines = cloneDeep(
        state.editableWorkspace.VirtualMachines as AzureVirtualMachineDto[]
      );
      const originalVirtualMachine = originalVirtualMachines.find(
        (vm) => vm.ID === snapshot.VirtualMachineID
      );
      const editedVirtualMachine = editedVirtualMachines.find(
        (vm) => vm.ID === snapshot.VirtualMachineID
      );
      originalVirtualMachine.Snapshots =
        originalVirtualMachine.Snapshots.filter(
          (snap) => snap.ID !== snapshot.ID
        );
      editedVirtualMachine.Snapshots = editedVirtualMachine.Snapshots.filter(
        (snap) => snap.ID !== snapshot.ID
      );
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
        originalWorkspace: {
          ...state.originalWorkspace,
          VirtualMachines: originalVirtualMachines,
        },
        editableWorkspace: {
          ...state.editableWorkspace,
          VirtualMachines: editedVirtualMachines,
        },
      };
    }
    case DELETE_SNAPSHOT_FAILURE: {
      return {
        ...state,
        snapshotVirtualMachineSavingID: '',
      };
    }
    case EDITABLE_WORKSPACE_SET_NESTED_VIRTUALIZATION: {
      return {
        ...state,
        isNestedVirtualizationEnabled: action.payload as boolean,
      };
    }
    default:
      return state;
  }
}

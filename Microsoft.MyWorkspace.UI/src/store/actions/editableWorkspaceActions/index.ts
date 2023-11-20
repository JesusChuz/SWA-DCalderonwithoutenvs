import { ThunkDispatch } from '@reduxjs/toolkit';
import { VirtualMachineCustomDto } from '../../../types/Catalog/VirtualMachineCustomDto.types';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureWorkspaceForCreationDto } from '../../../types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import { Action } from '../actionTypes';
import { DataDiskError } from '../../../types/Forms/DataDiskError.types';
import { MachineSelectionWithCount } from '../../../types/Forms/MachineSelectionWithCount.types';
import { VMNameError } from '../../../types/Forms/VMNameError.types';
import { SubnetNameError } from '../../../types/Forms/SubnetNameError.types';
import { AzureVirtualNetworkForCreationDto } from '../../../types/ResourceCreation/AzureVirtualNetworkForCreationDto.types';
import { TempSubnet } from '../../../types/Forms/TempSubnet.types';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { AzureDNSZoneDto } from '../../../types/AzureWorkspace/AzureDNSZoneDto.types';
import { AzurePublicAddressDto } from '../../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { AzureDomainDto } from '../../../types/AzureWorkspace/AzureDomainDto.types';
import { DomainError } from '../../../types/Forms/DomainError.types';
import { WorkspaceErrors } from '../../../types/Forms/WorkspaceErrors.types';
import { WorkspaceScheduledJobDto } from '../../../types/Job/WorkspaceScheduledJobDto.types';
import { WorkspaceScheduledJobError } from '../../../types/Forms/WorkspaceScheduledJobError.types';
import { NotificationAction } from '../';
import { AzureVirtualMachineSnapshotForCreationDto } from '../../../types/AzureWorkspace/AzureVirtualMachineSnapshotForCreationDto.types';
import { AzureVirtualMachineSnapshotDto } from '../../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';
import { AxiosError } from 'axios';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

export interface EditableWorkspaceAdminNamePayload {
  name: string;
  machines: AzureVirtualMachineForCreationDto[];
}

export interface EditableWorkspacePayload {
  editedWorkspace: AzureWorkspaceForCreationDto;
  originalWorkspace: AzureWorkspaceForCreationDto;
}

export interface EditableWorkspaceMachinesPayload {
  machines: AzureVirtualMachineForCreationDto[];
}

export interface EditableWorkspaceDomainsPayload {
  domains: AzureDomainDto[];
}

export interface EditableWorkspaceSubnetPayload {
  subnets: TempSubnet[];
  network: AzureVirtualNetworkForCreationDto;
}

export interface EditableWorkspaceAddSharedOwnerPayload {
  alias: string;
  id: string;
}

export interface EditableWorkspaceRemoveSharedOwnerPayload {
  emails: string[];
  ids: string[];
}

export interface EditableWorkspaceAction extends Action {
  payload?:
    | string
    | string[]
    | VirtualMachineCustomDto
    | number
    | boolean
    | AzureWorkspaceForCreationDto
    | AzureVirtualMachineDto
    | EditableWorkspaceAdminNamePayload
    | MachineSelectionWithCount[]
    | EditableWorkspaceMachinesPayload
    | AzureVirtualMachineForCreationDto[]
    | AzureVirtualNetworkForCreationDto
    | EditableWorkspaceSubnetPayload
    | EditableWorkspace
    | AzureDNSZoneDto
    | EditableWorkspaceAddSharedOwnerPayload
    | EditableWorkspaceRemoveSharedOwnerPayload
    | AzurePublicAddressDto[]
    | WorkspaceEditType
    | EditableWorkspacePayload
    | WorkspaceScheduledJobDto
    | AzureVirtualMachineSnapshotDto
    | AzureVirtualMachineSnapshotForCreationDto
    | AxiosError;
  isAdminSelection?: boolean;
  error?:
    | string
    | null
    | DataDiskError[]
    | VMNameError[]
    | SubnetNameError[]
    | DomainError[]
    | WorkspaceScheduledJobError
    | WorkspaceErrors;
}

export type EditableWorkspaceDispatch = ThunkDispatch<
  MyWorkspacesStore,
  undefined,
  EditableWorkspaceAction | NotificationAction
>;

export * from './editableWorkspaceDataDiskActions';
export * from './editableWorkspaceDnsActions';
export * from './editableWorkspaceDomainActions';
export * from './editableWorkspaceExternalConnectivityActions';
export * from './editableWorkspaceGeneralActions';
export * from './editableWorkspaceMachineConfigurationActions';
export * from './editableWorkspaceSubnetActions';
export * from './editableWorkspaceVirtualMachineActions';
export * from './editableWorkspaceNicActions';
export * from './editableWorkspaceFormActions';
export * from './editableWorkspaceScheduleActions';

import { MyWorkspacesStore } from '../../store/reducers/rootReducer';
import { EditableWorkspace } from '../../types/Forms/EditableWorkspace.types';
import { AzureVirtualMachineForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';

export const getEditableWorkspace = (
  myWorkspaceStore: MyWorkspacesStore
): EditableWorkspace => {
  return myWorkspaceStore.editableWorkspace.editableWorkspace;
};
export const getOriginalMachineList = (
  myWorkspaceStore: MyWorkspacesStore
): AzureVirtualMachineForCreationDto[] => {
  return myWorkspaceStore.editableWorkspace.editableWorkspace.VirtualMachines;
};

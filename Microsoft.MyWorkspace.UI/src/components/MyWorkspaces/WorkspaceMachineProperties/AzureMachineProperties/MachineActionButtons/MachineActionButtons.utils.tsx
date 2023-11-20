import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';

export interface MachineProps {
  machine: AzureVirtualMachineDto;
  workspace: AzureWorkspaceDto;
  variant:
    | 'CommandBarButton'
    | 'ContextualMenuButton'
    | 'IconOnly'
    | 'PrimaryButton';
  openJit?: (workspaceID: string, id?: string) => void;
}

export const contextMenuStyles = {
  root: {
    color: '#004fa9',
    selectors: {
      '&:hover': {
        color: '#004fa9',
      },
      '&:active': {
        color: '#0064bf',
      },
    },
  },
};

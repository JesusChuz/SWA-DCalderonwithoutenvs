import { Stack, Text, useTheme } from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  getEditableWorkspaceMachineSelection,
  getEditableWorkspaceVirtualMachines,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { AzureVirtualMachineDto } from '../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from '../../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { getNewAzureWorkspaceStyles } from '../../NewWorkspace.styles';
import { CurrentlyConfiguredMachineView } from './CurrentlyConfiguredMachineView';
import { SelectedMachineView } from './SelectedMachineView';

export const SelectedMachineColumn = (): JSX.Element => {
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const selectedMachines = useSelector(getEditableWorkspaceMachineSelection);
  const virtualMachines: (
    | AzureVirtualMachineDto
    | AzureVirtualMachineForCreationDto
  )[] = useSelector(getEditableWorkspaceVirtualMachines);

  return (
    <Stack className={commonStyles.fullWidth}>
      <Stack className={commonStyles.fullWidth}>
        <h3>Currently Configured Machines</h3>
      </Stack>
      <Stack
        className={`${commonStyles.fullWidth} ${
          virtualMachines.length ? styles.selectedTemplate : ''
        }`}
        style={{ marginRight: '10px' }}
      >
        {virtualMachines.map((machine, i) => {
          return (
            <CurrentlyConfiguredMachineView
              key={`vm-${machine.ImageSourceID}-${i}`}
              virtualMachine={machine}
              index={i}
            />
          );
        })}
        {virtualMachines.length === 0 && (
          <Text className={commonStyles.italicFont}>None</Text>
        )}
      </Stack>
      <Stack className={commonStyles.fullWidth}>
        <h3>Selected Machines</h3>
      </Stack>
      <Stack
        className={`${commonStyles.fullWidth} ${
          selectedMachines.length !== 0 ? styles.selectedTemplate : ''
        }`}
        style={{ marginRight: '10px', marginBottom: '15px' }}
      >
        {selectedMachines.map((machine, i) => {
          return (
            <SelectedMachineView
              key={`vm-new-${machine.machine.ImageSourceID}-${i}`}
              virtualMachine={machine.machine}
              count={machine.count}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

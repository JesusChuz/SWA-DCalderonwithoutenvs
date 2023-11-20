import * as React from 'react';

import {
  Stack,
  Text,
  Panel,
  TextField,
  Label,
  DefaultButton,
  PrimaryButton,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../../../../GeneralComponents/CommonStyles';
import { AzureVirtualMachineSnapshotForCreationDto } from '../../../../../../types/ResourceCreation/AzureVirtualMachineSnapshotForCreationDto';
import { useDispatch } from 'react-redux';
import { createSnapshot } from '../../../../../../store/actions/editableWorkspaceActions';
import { AzureVirtualMachineDto } from '../../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { ResourceState } from '../../../../../../types/AzureWorkspace/enums/ResourceState';
import { AzureVirtualMachineSnapshotDto } from '../../../../../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';

interface IProps {
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => void;
  machines: AzureVirtualMachineDto[];
  machineIndex: number;
  snapshots: AzureVirtualMachineSnapshotDto[];
}

export const AzureMachineSnapshotsPanel = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [newSnapshotName, setNewSnapshotName] = React.useState('');

  const dismissPanel = () => {
    props.setIsPanelOpen(false);
    setNewSnapshotName('');
  };

  const duplicateSnapshotNameError = React.useMemo(
    () => props.snapshots.find((snap) => snap.Name === newSnapshotName),
    [props.snapshots, newSnapshotName]
  );

  const newSnapshotError = React.useMemo(() => {
    if (newSnapshotName === '') {
      return 'A snapshot name is required.';
    }
    if (duplicateSnapshotNameError) {
      return 'This snapshot name conflicts with another snapshot name.';
    }
    return '';
  }, [newSnapshotName, duplicateSnapshotNameError]);

  const onRenderFooterContent = () => {
    return (
      <Stack
        className={commonStyles.paddingTop12}
        horizontal
        tokens={{ childrenGap: 8 }}
      >
        <PrimaryButton
          onClick={() => {
            const snapshot: AzureVirtualMachineSnapshotForCreationDto = {
              Name: newSnapshotName,
              Description: '',
              VirtualMachineID: (
                props.machines[props.machineIndex] as AzureVirtualMachineDto
              ).ID,
            };
            dispatch(createSnapshot(snapshot));
            dismissPanel();
          }}
          disabled={newSnapshotName === '' || !!duplicateSnapshotNameError}
          text='Save'
        />
        <DefaultButton onClick={dismissPanel} text='Cancel' />
      </Stack>
    );
  };
  return (
    <Panel
      isOpen={props.isPanelOpen}
      closeButtonAriaLabel='Close'
      headerText={'New Snapshot'}
      isFooterAtBottom={true}
      onDismiss={dismissPanel}
      onRenderFooterContent={onRenderFooterContent}
    >
      <Stack tokens={{ childrenGap: 8 }}>
        <TextField
          label={'Snapshot Name'}
          value={newSnapshotName}
          errorMessage={newSnapshotError}
          onChange={(event, newValue) => {
            setNewSnapshotName(newValue);
          }}
        />
        {(props.machines[props.machineIndex] as AzureVirtualMachineDto)
          .State === ResourceState.Running && (
          <>
            <Label>{'Warning'}</Label>
            <Text>
              {
                'For safety, snapshots are created when the machine is off. Since this machine is running, it will shut down and restart as part of the snapshot creation process.'
              }
            </Text>
          </>
        )}
      </Stack>
    </Panel>
  );
};

import * as React from 'react';
import { Text, TextField, Toggle, Stack, useTheme } from '@fluentui/react';

import { useDispatch, useSelector } from 'react-redux';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { UserProfileDto } from '../../../../types/Catalog/UserProfileDto.types';
import { getCatalogUserProfile } from '../../../../store/selectors/catalogSelectors';
import { EditsDisabled } from '../../../../shared/helpers/WorkspaceHelper';
import {
  getEditableWorkspace,
  getEditableWorkspaceNameError,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceUpdateDeleteLock,
  editableWorkspaceUpdateDescription,
  editableWorkspaceUpdateName,
} from '../../../../store/actions/editableWorkspaceActions';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';

export const GeneralPropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const userProfile: UserProfileDto = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const nameError = useSelector(getEditableWorkspaceNameError);

  return (
    <Stack className={styles.propertiesContent}>
      <TextField
        className={commonStyles.flexItem}
        id='workspaceName'
        label='Workspace Name'
        ariaLabel='workspace name'
        required
        maxLength={100}
        value={editableWorkspace.Name}
        onChange={(event, newValue: string) =>
          dispatch(editableWorkspaceUpdateName(newValue))
        }
        disabled={EditsDisabled(
          userProfile,
          editableWorkspace,
          originalWorkspace,
          true
        )}
        errorMessage={nameError}
      />
      <TextField
        className={commonStyles.flexItem}
        id='workspaceDescription'
        label='Workspace Description'
        ariaLabel='workspace description'
        multiline={true}
        maxLength={1000}
        value={editableWorkspace.Description}
        onChange={(event, newValue: string) =>
          dispatch(editableWorkspaceUpdateDescription(newValue))
        }
        inputClassName={commonStyles.multiLineTextField}
        disabled={EditsDisabled(
          userProfile,
          editableWorkspace,
          originalWorkspace,
          true
        )}
      />

      <div className={commonStyles.flexItem}>
        <Toggle
          id='deleteLock'
          label='Delete Lock'
          inlineLabel
          onText='On'
          offText='Off'
          ariaLabel='delete lock switch'
          disabled={EditsDisabled(
            userProfile,
            editableWorkspace,
            originalWorkspace,
            true
          )}
          checked={editableWorkspace.SecurityLock}
          onChange={(
            event: React.MouseEvent<HTMLElement, MouseEvent>,
            checked: boolean
          ) => dispatch(editableWorkspaceUpdateDeleteLock(checked))}
        />
        <Text block>
          {' '}
          Workspaces with Delete Lock turned on, cannot be deleted. You must
          disable Delete Lock before deleting a workspace.
        </Text>
      </div>
    </Stack>
  );
};

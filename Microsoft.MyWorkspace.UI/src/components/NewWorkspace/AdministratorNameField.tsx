import React, { useMemo } from 'react';
import {
  TooltipHost,
  TextField,
  useTheme,
  DirectionalHint,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { editableWorkspaceUpdateAdministratorName } from 'src/store/actions/editableWorkspaceActions';
import { getReduxEditableWorkspace } from 'src/store/selectors/editableWorkspaceSelectors';
import { WorkspaceEditType } from 'src/types/enums/WorkspaceEditType';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import { ValidationChecklist } from '../GeneralComponents/ValidationChecklist';
import {
  AdministratorNameIllegalCharacters,
  AdministratorNameNoReservedWords,
  AdministratorNameRange,
} from 'src/store/validators/ErrorConstants';
import {
  checkIllegalCharactersAdministratorName,
  checkInvalidAdministratorName,
  isAdministratorNameValidLength,
} from 'src/shared/AdministratorNameHelper';
import { OSVersion } from 'src/types/enums/OSVersion';

export const AdministratorNameField = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(getReduxEditableWorkspace);

  const validLength = useMemo(() => {
    return isAdministratorNameValidLength(
      OSVersion.Windows,
      editableWorkspace.administratorName
    );
  }, [editableWorkspace]);

  const noReservedWords = useMemo(() => {
    return (
      checkInvalidAdministratorName(editableWorkspace.administratorName) ===
      null
    );
  }, [editableWorkspace]);

  const noIllegalCharacters = useMemo(() => {
    return (
      checkIllegalCharactersAdministratorName(
        editableWorkspace.administratorName
      ) === null
    );
  }, [editableWorkspace]);

  return (
    <TooltipHost
      directionalHint={DirectionalHint.rightCenter}
      content={
        <ValidationChecklist
          items={[
            {
              validText: AdministratorNameIllegalCharacters,
              invalidText: AdministratorNameIllegalCharacters,
              valid: noIllegalCharacters,
            },
            {
              validText: AdministratorNameNoReservedWords,
              invalidText: AdministratorNameNoReservedWords,
              valid: noReservedWords,
            },
            {
              validText: AdministratorNameRange,
              invalidText: AdministratorNameRange,
              valid: validLength,
            },
          ]}
        />
      }
    >
      <TextField
        label='Administrator Name'
        value={editableWorkspace.administratorName}
        maxLength={20}
        className={`${commonStyles.fullWidth}`}
        onChange={(event, newValue: string) =>
          dispatch(editableWorkspaceUpdateAdministratorName(newValue))
        }
        errorMessage={editableWorkspace.errors.administratorName}
        disabled={
          editableWorkspace.workspaceEditType ===
          WorkspaceEditType.EditWorkspace
        }
        description={
          editableWorkspace.workspaceEditType ===
          WorkspaceEditType.EditWorkspace
            ? 'Because this Workspace has been deployed, changes to the administrator name cannot be made.'
            : 'After a Workspace is deployed, changes to the administrator name will not be permitted.'
        }
        validateOnLoad={false}
        required
      />
    </TooltipHost>
  );
};

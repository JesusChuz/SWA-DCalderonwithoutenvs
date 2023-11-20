import * as React from 'react';
import { Stack, TextField, TooltipHost, useTheme } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getNewAzureWorkspaceStyles } from '../NewWorkspace.styles';
import { PasswordDisplayField } from '../../GeneralComponents/PasswordDisplayField';
import {
  getEditableWorkspaceEditType,
  getReduxEditableWorkspace,
} from '../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceUpdateAdministratorPassword,
  editableWorkspaceUpdateAdministratorPasswordConfirm,
  editableWorkspaceUpdateDescription,
  editableWorkspaceUpdateName,
} from '../../../store/actions/editableWorkspaceActions';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { maxPasswordLength } from '../../../store/validators/ErrorConstants';
import { AdministratorNameField } from '../AdministratorNameField';

export const NameAndDescription = (): JSX.Element => {
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(getReduxEditableWorkspace);
  const dispatch = useDispatch();
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);

  return (
    <div
      className={styles.wrapper}
      data-custom-parent-group='group1'
      data-custom-parentid={`${workspaceEditType} Workspace - Name and Description`}
    >
      <Stack
        horizontal
        className={`${styles.wrap} ${commonStyles.fitContentHeight} ${styles.nameAndDescriptionContainer}`}
      >
        <Stack
          className={`${commonStyles.width90} ${commonStyles.leftAlignText}`}
        >
          <TextField
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            label='Workspace Name'
            value={editableWorkspace.editableWorkspace.Name}
            maxLength={100}
            className={`${commonStyles.fullWidth} ${commonStyles.textFieldSpacing}`}
            onChange={(event, newValue: string) =>
              dispatch(editableWorkspaceUpdateName(newValue))
            }
            errorMessage={editableWorkspace.errors.workspaceName}
            validateOnLoad={false}
            required
          />
          <TextField
            label='Description'
            multiline
            value={editableWorkspace.editableWorkspace.Description}
            maxLength={1000}
            className={`${commonStyles.fullWidth} ${commonStyles.textFieldSpacing}`}
            onChange={(event, newValue: string) =>
              dispatch(editableWorkspaceUpdateDescription(newValue))
            }
          />
        </Stack>

        {editableWorkspace.workspaceEditType !==
          WorkspaceEditType.NewTemplateWorkspace && (
          <Stack className={commonStyles.width90}>
            <>
              <Stack
                horizontal
                className={`${commonStyles.leftAlignText}  ${commonStyles.textFieldSpacing}`}
              >
                <AdministratorNameField />
              </Stack>
              {false && (
                /* This should be removed/added back when we re-evaluate the need for custom passwords */ <>
                  <Stack
                    horizontal
                    className={`${commonStyles.leftAlignText} ${commonStyles.textFieldSpacing}`}
                  >
                    <PasswordDisplayField
                      label='Administrator Password'
                      className={`${styles.passwordInput}`}
                      password={editableWorkspace.administratorPassword}
                      showCopy={true}
                      maxLength={maxPasswordLength}
                      onChange={(event, newValue) =>
                        dispatch(
                          editableWorkspaceUpdateAdministratorPassword(newValue)
                        )
                      }
                      errorMessage={
                        editableWorkspace.errors.administratorPassword
                      }
                      validateOnLoad={false}
                      required
                    />
                  </Stack>
                  <Stack
                    horizontal
                    className={`${commonStyles.leftAlignText} ${commonStyles.textFieldSpacing}`}
                  >
                    <PasswordDisplayField
                      label='Confirm Administrator Password'
                      className={`${styles.passwordInput}`}
                      password={editableWorkspace.administratorPasswordConfirm}
                      showCopy={true}
                      maxLength={maxPasswordLength}
                      onChange={(event, newValue) =>
                        editableWorkspaceUpdateAdministratorPasswordConfirm(
                          newValue
                        )
                      }
                      errorMessage={
                        editableWorkspace.errors.administratorPasswordConfirm
                      }
                      validateOnFocusOut
                      required
                    />
                  </Stack>
                </>
              )}
            </>
          </Stack>
        )}
      </Stack>
    </div>
  );
};

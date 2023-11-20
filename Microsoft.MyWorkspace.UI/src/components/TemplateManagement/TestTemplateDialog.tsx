import React, { useState, useMemo, useEffect } from 'react';
import {
  Text,
  useTheme,
  IDropdownOption,
  DialogType,
  IDropdownStyles,
  Dialog,
  Stack,
  Icon,
  Spinner,
  SpinnerSize,
  Dropdown,
  TextField,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createAzureWorkspace } from 'src/store/actions';
import {
  editableWorkspaceUpdateGeography,
  editableWorkspaceUpdateWithTemplate,
  editableWorkspaceUpdateName,
  editableWorkspaceUpdateDescription,
} from 'src/store/actions/editableWorkspaceActions';
import { getGeographies } from 'src/store/selectors';
import { getReduxEditableWorkspace } from 'src/store/selectors/editableWorkspaceSelectors';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';

interface ITestTemplateDialog {
  template: WorkspaceTemplateDto;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const TestTemplateDialog = (props: ITestTemplateDialog) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccessful, setSubmitSuccessful] = useState(null);
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(getReduxEditableWorkspace);
  const geographies = useSelector(getGeographies);

  const geographyOption: IDropdownOption[] = useMemo(() => {
    return geographies.map((geo) => ({ key: geo.ID, text: geo.Name }));
  }, [geographies]);

  const submitDisabled = useMemo(() => {
    return (
      submitted ||
      !editableWorkspace.editableWorkspace.Name ||
      editableWorkspace.editableWorkspace.Name.length === 0 ||
      !editableWorkspace.editableWorkspace.Geography ||
      editableWorkspace.editableWorkspace.Geography.length === 0
    );
  }, [editableWorkspace.editableWorkspace, props.template, submitted]);

  const dialogContentProps = useMemo(() => {
    return {
      type: DialogType.normal,
      title: `Test Deployment of "${props.template.Name}"`,
      closeButtonAriaLabel: 'Close',
      subText: submitted
        ? ''
        : 'By submitting a test deployment of this template, a new workspace will be made from this template that will show up in your workspace list.',
    };
  }, [submitted]);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  const handleGeographyChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ) => {
    const geoID = item.key;
    const geography = geographies.find((geo) => geo.ID === geoID);
    dispatch(editableWorkspaceUpdateGeography(geography.Name));
  };

  const submitAndReturnSuccessStatus = async (): Promise<boolean> => {
    try {
      const res: AxiosResponse = await createAzureWorkspace(
        editableWorkspace.editableWorkspace
      )(dispatch);
      return res.status === 200 ? true : false;
    } catch {
      return false;
    }
  };

  const submit = async () => {
    setSubmitted(true);
    const successful = await submitAndReturnSuccessStatus();
    setSubmitSuccessful(successful);
  };

  useEffect(() => {
    if (props.open) {
      dispatch(editableWorkspaceUpdateWithTemplate(props.template));
    }
  }, [props.template, props.open]);

  return (
    <Dialog
      hidden={!props.open}
      onDismiss={() => props.setOpen(false)}
      dialogContentProps={dialogContentProps}
    >
      {submitted && submitSuccessful && (
        <Stack tokens={{ childrenGap: 15 }}>
          <Stack horizontal horizontalAlign='center'>
            <Icon
              aria-label='success icon'
              iconName='SkypeCircleCheck'
              style={{
                color: theme.semanticColors.successIcon,
                fontSize: 50,
                height: 50,
                width: 50,
              }}
            />
          </Stack>
          <b>
            <Text>
              The test deployment of this template was submitted successfully.
              The workspace will show up in your workspaces list.
            </Text>
          </b>
        </Stack>
      )}
      {submitted && submitSuccessful === false && (
        <Stack tokens={{ childrenGap: 15 }}>
          <Stack horizontal horizontalAlign='center'>
            <Icon
              aria-label='error icon'
              iconName='Error'
              style={{
                color: theme.semanticColors.errorIcon,
                fontSize: 50,
                height: 50,
                width: 50,
              }}
            />
          </Stack>
          <b>
            <Text>The test deployment of this template was unsuccessful.</Text>
          </b>
        </Stack>
      )}
      {submitted && submitSuccessful === null && (
        <Spinner size={SpinnerSize.large} />
      )}
      {!submitted && (
        <>
          <Stack>
            <Dropdown
              styles={dropdownStyles}
              placeholder={
                editableWorkspace.editableWorkspace.Geography === ''
                  ? 'Select an option'
                  : editableWorkspace.editableWorkspace.Geography
              }
              label='Select Azure Geography'
              onChange={handleGeographyChange}
              options={geographyOption}
              ariaLabel='Select Azure geography'
              data-custom-id='Azure Geography Dropdown'
              required
            />
            <TextField
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
          <DialogFooter>
            <PrimaryButton
              onClick={submit}
              disabled={submitDisabled}
              text='Submit'
            />
            <DefaultButton onClick={() => props.setOpen(false)} text='Cancel' />
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
};

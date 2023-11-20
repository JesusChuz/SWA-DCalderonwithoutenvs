import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getNewAzureWorkspaceStyles } from '../NewWorkspace.styles';
import {
  Image,
  Text,
  Stack,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  PrimaryButton,
  IStackTokens,
  Spinner,
  SpinnerSize,
  useTheme,
  IDropdown,
} from '@fluentui/react';

import reviewImage from '../../../assets/review.png';
import { getGeographies } from '../../../store/selectors/catalogSelectors';
import { getAzureWorkspacesSavingStatus } from '../../../store/selectors/azureWorkspaceSelectors';
import {
  editableWorkspaceSaveChanges,
  editableWorkspaceUpdateGeography,
} from '../../../store/actions/editableWorkspaceActions';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
  getEditableWorkspaceHasChanges,
  getEditableWorkspaceIsSaving,
  getEditableWorkspaceIsValid,
  getEditableWorkspaceLastSaveSuccess,
} from '../../../store/selectors/editableWorkspaceSelectors';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  setPoliteScreenReaderAnnouncement,
  showErrorNotification,
} from '../../../store/actions';
import { CanvasLazy } from 'src/containers/LazyComponents';
import { getFeatureFlagCanvasView } from 'src/store/selectors';
import { LazyLoadingSpinner } from 'src/components/GeneralComponents/LazyLoadingSpinner';
import { submitNewWorkspace } from '../NewWorkspace.utils';

export const DetailsAndFinish = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const dropdownRef = React.createRef<IDropdown>();
  const styles = getNewAzureWorkspaceStyles(theme);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const changes = useSelector(getEditableWorkspaceHasChanges);
  const valid = useSelector(getEditableWorkspaceIsValid);
  const workspaceSaving = useSelector(getEditableWorkspaceIsSaving);
  const lastSaveSuccess = useSelector(getEditableWorkspaceLastSaveSuccess);
  const geographies = useSelector(getGeographies);
  const workspaceDeploying = useSelector(getAzureWorkspacesSavingStatus);
  const featureFlagCanvasView = useSelector(getFeatureFlagCanvasView);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { maxWidth: 300 },
  };
  const verticalGapStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
  };

  const [deployButtonPressed, setDeployButtonPressed] = React.useState(false);
  const history = useHistory();

  const handleGeographyChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ) => {
    const geoID = item.key;
    const geography = geographies.find((geo) => geo.ID === geoID);
    dispatch(editableWorkspaceUpdateGeography(geography.Name));
  };

  const deploy = async () => {
    if (!deployButtonPressed) {
      setDeployButtonPressed(true);
      dispatch(
        setPoliteScreenReaderAnnouncement(
          'Please wait a moment for the workspace to submit before being redirected to the workspace list page upon completion.'
        )
      );
      const success = await submitNewWorkspace(dispatch, editableWorkspace);
      if (success) {
        dispatch(
          setPoliteScreenReaderAnnouncement(
            'Workspace successfully saved and currently deploying.'
          )
        );
        setTimeout(() => {
          setDeployButtonPressed(false);
          history.push('/');
          return;
        }, 1500);
      } else {
        dispatch(
          showErrorNotification(
            'The workspace could not be deployed. Please try again.'
          )
        );
        setDeployButtonPressed(false);
      }
    }
  };

  const geographyOption: IDropdownOption[] = React.useMemo(() => {
    return geographies.map((geo) => ({ key: geo.ID, text: geo.Name }));
  }, [geographies]);

  React.useEffect(() => {
    if (lastSaveSuccess) {
      setTimeout(() => {
        setDeployButtonPressed(false);
        history.push('/');
        return;
      }, 1500);
    }
  }, [lastSaveSuccess]);

  React.useEffect(() => {
    dropdownRef.current?.focus(true);
  }, [dropdownRef.current]);

  return (
    <div
      data-custom-parent-group='group1'
      data-custom-parentid={`${workspaceEditType} Workspace - Details And Finish`}
      data-testid='details-and-finish'
    >
      <Stack horizontal style={{ height: '100%' }}>
        <Stack style={{ width: '20%' }}>
          <Stack tokens={verticalGapStackTokens}>
            <Image src={reviewImage} alt='Review workspace image' />
            <Text variant='medium'>
              <h3>Please review your workspace</h3>
            </Text>
          </Stack>

          <Stack tokens={verticalGapStackTokens}>
            <Text>
              <b>Name </b>
            </Text>
            <Text>{editableWorkspace.Name}</Text>
            <Text>
              <b>Description</b>
            </Text>
            <Text
              className={`${styles.descriptionStyles} ${
                editableWorkspace.Description ? '' : styles.italicFont
              }`}
            >
              {editableWorkspace.Description
                ? editableWorkspace.Description
                : 'No Description'}
            </Text>
            {workspaceEditType === WorkspaceEditType.EditWorkspace && (
              <PrimaryButton
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className={styles.button}
                text='Save'
                allowDisabledFocus
                disabled={
                  !changes ||
                  !valid ||
                  (editableWorkspace as AzureWorkspaceDto).State ==
                    ResourceState.Deploying ||
                  workspaceSaving
                }
                onClick={async () => dispatch(editableWorkspaceSaveChanges())}
              />
            )}
            {workspaceEditType !== WorkspaceEditType.EditWorkspace && (
              <>
                <Dropdown
                  componentRef={dropdownRef}
                  styles={dropdownStyles}
                  placeholder={
                    editableWorkspace.Geography === ''
                      ? 'Select an option'
                      : editableWorkspace.Geography
                  }
                  label='Select Azure Geography'
                  onChange={handleGeographyChange}
                  options={geographyOption}
                  data-custom-id='Azure Geography Dropdown'
                  required
                />
                <PrimaryButton
                  className={styles.button}
                  ariaDescription='Deploy!'
                  disabled={
                    editableWorkspace.Geography === '' || deployButtonPressed
                  }
                  onClick={deploy}
                >
                  Deploy!
                </PrimaryButton>
              </>
            )}
            {(workspaceDeploying || workspaceSaving) && (
              <Spinner
                data-testid='workspace-submitting'
                aria-label='Workspace submitting spinner'
                className={styles.button}
                size={SpinnerSize.large}
              />
            )}
          </Stack>
        </Stack>

        <Stack style={{ width: '80%' }}>
          {featureFlagCanvasView && (
            <React.Suspense fallback={<LazyLoadingSpinner />}>
              <CanvasLazy workspace={editableWorkspace} />
            </React.Suspense>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

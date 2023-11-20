import * as React from 'react';
import { NewTemplateWorkspace } from './NewTemplateWorkspace';
import { NewCustomWorkspace } from './NewCustomWorkspace';
import { NewWorkspaceStep } from '../../types/enums/DeploymentStep';
import {
  Announced,
  DefaultButton,
  Icon,
  IIconProps,
  IPivotItemProps,
  PrimaryButton,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { getNewAzureWorkspaceStyles } from './NewWorkspace.styles';
import { defaultStackTokens } from '../../shared/StackTokens';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEditableWorkspaceHasChanges,
  getEditableWorkspaceHasNewMachines,
  getEditableWorkspaceIsNestedVirtualizationEnabled,
  getReduxEditableWorkspace,
} from '../../store/selectors/editableWorkspaceSelectors';
import {
  getAzureWorkspaces,
  getAzureWorkspacesLoadingStatus,
  getCatalogMachineSkus,
  getFeatureFlagMultipleSubnet,
  getFeatureFlagTemplateQuotaAdjustment,
  getUserRoleAssignmentConstraint,
  getAllQuotaErrors,
  getSelectedAdminWorkspaces,
} from '../../store/selectors';
import {
  getStepCompleteAnnouncement,
  getStepErrorAnnouncement,
  getTabsComplete,
  getTabsErrors,
  getTitleText,
  nextDisabled,
} from './NewWorkspace.utils';
import { WorkspaceEditType } from '../../types/enums/WorkspaceEditType';
import {
  editableWorkspaceResetChanges,
  editableWorkspaceResetMachineSelection,
  editableWorkspaceSetCurrentWorkspaceEdit,
  editableWorkspaceSetCurrentWorkspaceNew,
  editableWorkspaceUpdateWorkspaceEditType,
} from '../../store/actions/editableWorkspaceActions';
import { useParams } from 'react-router-dom';
import { ErrorPage } from '../Pages/ErrorPage';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import clsx from 'clsx';

interface IProps {
  workspaceEditType: WorkspaceEditType;
  step: NewWorkspaceStep;
  setStep: (step: NewWorkspaceStep) => void;
  initialStepsDirty: Set<NewWorkspaceStep>;
}

const resetIcon: IIconProps = { iconName: 'Reset to Default' };

export const NewWorkspace = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getNewAzureWorkspaceStyles(theme);
  const editableWorkspace = useSelector(getReduxEditableWorkspace);
  const multiSubnetFeature = useSelector(getFeatureFlagMultipleSubnet);
  const templateQuotaAdjustmentEnabled = useSelector(
    getFeatureFlagTemplateQuotaAdjustment
  );
  const { id } = useParams<{ id: string }>();
  const userWorkspaces = useSelector(getAzureWorkspaces);
  const adminWorkspaces = useSelector(getSelectedAdminWorkspaces);
  const workspacesLoading = useSelector(getAzureWorkspacesLoadingStatus);
  const changes = useSelector(getEditableWorkspaceHasChanges);
  const hasNewMachines = useSelector(getEditableWorkspaceHasNewMachines);
  const skus = useSelector(getCatalogMachineSkus);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const quotaErrors = useSelector(getAllQuotaErrors);
  const isNestedVirtualizationEnabled = useSelector(
    getEditableWorkspaceIsNestedVirtualizationEnabled
  );

  const defaultTabSettings = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  };

  const [workspaceEditType, setWorkspaceEditType] =
    React.useState<WorkspaceEditType>(props.workspaceEditType);

  const [stepsDirty, setStepsDirty] = React.useState<Set<NewWorkspaceStep>>(
    () => props.initialStepsDirty
  );

  const [tabErrors, setTabErrors] = React.useState<
    Record<NewWorkspaceStep, boolean>
  >({ ...defaultTabSettings });

  const [tabsComplete, setTabsComplete] = React.useState<
    Record<NewWorkspaceStep, boolean>
  >({ ...defaultTabSettings });

  const showError = React.useMemo(() => {
    return (
      props.workspaceEditType === WorkspaceEditType.EditWorkspace &&
      [...userWorkspaces, ...adminWorkspaces].findIndex((w) => w.ID === id) ===
        -1 &&
      !workspacesLoading
    );
  }, [
    props.workspaceEditType,
    userWorkspaces,
    adminWorkspaces,
    workspacesLoading,
  ]);

  const nextClick = () => {
    let nextStep = Math.min(
      props.step + 1,
      Object.keys(NewWorkspaceStep).length / 2
    );
    nextStep =
      nextStep === NewWorkspaceStep.ConfigureNetworks
        ? multiSubnetFeature
          ? nextStep
          : nextStep + 1
        : nextStep;
    props.setStep(nextStep);
  };

  const previousClick = () => {
    let nextStep = Math.max(props.step - 1, 0);
    nextStep =
      nextStep === NewWorkspaceStep.ConfigureNetworks
        ? multiSubnetFeature
          ? nextStep
          : nextStep - 1
        : nextStep;
    props.setStep(nextStep);
  };

  const pivotClick = (s: NewWorkspaceStep) => {
    if (s > props.step) {
      for (let i = s - 1; i >= props.step; i--) {
        if (nextDisabled(i, tabsComplete)) {
          return;
        }
      }
      props.setStep(s);
    } else if (s <= props.step) {
      props.setStep(s);
    }
  };

  const currentStepMessage = React.useMemo(() => {
    if (tabErrors[props.step]) {
      return getStepErrorAnnouncement(props.step, props.workspaceEditType);
    } else if (tabsComplete[props.step]) {
      return getStepCompleteAnnouncement(props.step, props.workspaceEditType);
    } else {
      return '';
    }
  }, [props.step, tabErrors, tabsComplete]);

  React.useEffect(() => {
    if (props.workspaceEditType === WorkspaceEditType.EditWorkspace) {
      const workspace = [...userWorkspaces, ...adminWorkspaces].find(
        (w) => w.ID === id
      );
      if (workspace) {
        dispatch(editableWorkspaceSetCurrentWorkspaceEdit(workspace));
      }
    }
  }, [props.workspaceEditType, id, userWorkspaces, adminWorkspaces]);

  React.useEffect(() => {
    props.setStep(NewWorkspaceStep.Choose);
    if (props.workspaceEditType !== WorkspaceEditType.EditWorkspace) {
      dispatch(
        editableWorkspaceSetCurrentWorkspaceNew(props.workspaceEditType)
      );
    } else {
      dispatch(
        editableWorkspaceUpdateWorkspaceEditType(props.workspaceEditType)
      );
    }
  }, [props.workspaceEditType]);

  React.useEffect(() => {
    if (!stepsDirty.has(props.step)) {
      setStepsDirty((sd) => {
        const dirtySteps = new Set(sd);
        dirtySteps.add(props.step);
        return dirtySteps;
      });
    }
  }, [props.step]);

  React.useEffect(() => {
    if (workspaceEditType !== props.workspaceEditType) {
      setStepsDirty(() => {
        const newStepsDirty = new Set<NewWorkspaceStep>();
        newStepsDirty.add(NewWorkspaceStep.Choose);
        return newStepsDirty;
      });
      setWorkspaceEditType(() => props.workspaceEditType);
    }
  }, [props.workspaceEditType, workspaceEditType]);

  const renderState = (
    pivotProps: IPivotItemProps,
    defaultRenderer: (link: IPivotItemProps) => JSX.Element,
    step: NewWorkspaceStep
  ): JSX.Element => {
    const error = tabErrors[step];
    const complete = tabsComplete[step];
    return (
      <Text>
        {defaultRenderer(pivotProps)}
        <Text>
          {error && (
            <Icon
              iconName='Error'
              className={styles.tabError}
              aria-label={`Step Has An Error`}
            />
          )}
          {complete && (
            <Icon
              iconName='SkypeCircleCheck'
              className={styles.tabComplete}
              ariaLabel={`Step Is Complete.`}
            />
          )}
        </Text>
      </Text>
    );
  };

  React.useEffect(() => {
    setTabsComplete(
      getTabsComplete(
        editableWorkspace,
        tabsComplete,
        quotaErrors,
        templateQuotaAdjustmentEnabled,
        stepsDirty
      )
    );
    setTabErrors(
      getTabsErrors(editableWorkspace, tabErrors, quotaErrors, stepsDirty)
    );
  }, [
    editableWorkspace,
    constraint,
    skus,
    templateQuotaAdjustmentEnabled,
    stepsDirty,
  ]);

  const renderProperties = (editType: WorkspaceEditType) => {
    switch (editType) {
      case WorkspaceEditType.EditWorkspace:
      case WorkspaceEditType.NewCustomWorkspace:
        return (
          <NewCustomWorkspace
            step={props.step}
            pivotClick={pivotClick}
            renderState={renderState}
          />
        );
      case WorkspaceEditType.NewTemplateWorkspace:
        return (
          <NewTemplateWorkspace
            step={props.step}
            pivotClick={pivotClick}
            renderState={renderState}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <div className={commonStyles.fullHeight}>
      {showError && (
        <ErrorPage
          title='Workspace not found.'
          message='Please select a valid workspace from your list.'
          showButton={true}
          buttonMessage='Go to Workspaces'
        />
      )}
      {!showError &&
        (isNestedVirtualizationEnabled &&
        props.workspaceEditType === WorkspaceEditType.EditWorkspace ? (
          <ErrorPage
            title='Cannot Edit Workspace.'
            message='Nested Workspace cannot be edited.'
            showButton={true}
            buttonMessage='Go to Workspaces'
          />
        ) : (
          <Stack className={commonStyles.fullHeight}>
            <Stack.Item grow={0}>
              <Stack className={styles.container}>
                <Text as='h1' variant='xxLarge'>
                  {getTitleText(props.workspaceEditType)}
                </Text>
              </Stack>
            </Stack.Item>

            <Stack.Item
              grow={1}
              className={clsx(
                commonStyles.overflowYHidden,
                commonStyles.minHeight250
              )}
            >
              {renderProperties(props.workspaceEditType)}
            </Stack.Item>

            <Stack horizontal tokens={defaultStackTokens}>
              <DefaultButton
                text='Previous'
                disabled={props.step === 0}
                onClick={previousClick}
                data-custom-id={`${props.workspaceEditType} Workspace Previous Step`}
                data-custom-parentid={`${props.workspaceEditType} Workspace`}
                data-custom-bhr={'NAVIGATIONBACK'}
              />
              <PrimaryButton
                text='Next'
                disabled={nextDisabled(props.step, tabsComplete)}
                onClick={nextClick}
                data-custom-id={`${props.workspaceEditType} Workspace Next Step`}
                data-custom-parentid={`${props.workspaceEditType} Workspace`}
                data-custom-bhr={'NAVIGATIONFORWARD'}
              />
              {props.workspaceEditType === WorkspaceEditType.EditWorkspace && (
                <DefaultButton
                  text='Reset Changes'
                  iconProps={resetIcon}
                  onClick={() => {
                    dispatch(editableWorkspaceResetChanges());
                    dispatch(editableWorkspaceResetMachineSelection());
                    props.setStep(NewWorkspaceStep.Choose);
                    setTabErrors({ ...defaultTabSettings });
                    setTabsComplete({ ...defaultTabSettings });
                  }}
                  disabled={!changes && !hasNewMachines}
                />
              )}
            </Stack>
            <Announced message={currentStepMessage} />
          </Stack>
        ))}
    </div>
  );
};

export { NewWorkspace as default };

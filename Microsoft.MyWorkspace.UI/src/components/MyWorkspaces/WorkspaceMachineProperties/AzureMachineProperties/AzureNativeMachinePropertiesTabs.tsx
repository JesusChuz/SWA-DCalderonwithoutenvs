import * as React from 'react';
import {
  Pivot,
  Stack,
  Spinner,
  SpinnerSize,
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogFooter,
  DialogType,
  useTheme,
  PivotItem,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonStyles,
  PivotStyles,
} from '../../../GeneralComponents/CommonStyles';
import {
  getEditWorkspaceIsAdminSelection,
  getEditableWorkspace,
  getEditableWorkspaceHasChanges,
  getEditableWorkspaceHasDataDiskChanges,
  getEditableWorkspaceHasSkuChanges,
  getEditableWorkspaceIsValid,
  getEditableWorkspaceSaving,
  getEditableWorkspaceSnapshotSavingID,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { AzureVirtualMachineDto } from '../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureMachineDataDisks } from './PropertiesTabs/AzureMachineDataDisks';
import { AzureMachineGeneral } from './PropertiesTabs/AzureMachineGeneral';
import { AzureMachineNetworking } from './PropertiesTabs/AzureMachineNetworking';
import { AzureMachineSnapshots } from './PropertiesTabs/AzureMachineSnapshots';
import {
  editableWorkspaceResetChanges,
  editableWorkspaceSaveChanges,
} from '../../../../store/actions/editableWorkspaceActions';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { Prompt, useHistory } from 'react-router-dom';
import { AzureMachineDomain } from './PropertiesTabs/AzureMachineDomain';
import { AzureMachineConnect } from './PropertiesTabs/AzureMachineConnect';
import { ResourceState } from '../../../../types/AzureWorkspace/enums/ResourceState';
import {
  getFeatureFlagComplianceMonitoring,
  getFeatureFlagDiagnostics,
  getFeatureFlagSnapshot,
  getPasswordResetPending,
  getUserRoleAssignmentConstraint,
} from '../../../../store/selectors';
import clsx from 'clsx';
import { AzureMachineCompliance } from './PropertiesTabs/AzureMachineCompliance';
import { useQuery } from '../../../../shared/useQuery';
import { AdminDiagnosticsPage } from './PropertiesTabs/Diagnostics/AdminDiagnosticsPage';
import { PivotItemErrorBoundaryWrapper } from 'src/components/GeneralComponents/ErrorBoundary/PivotItemErrorBoundaryWrapper';

interface IProps {
  machineIndex: number;
}

export const AzureMachinePropertiesTabs = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const workspace = useSelector(getEditableWorkspace) as AzureWorkspaceDto;
  const changes = useSelector(getEditableWorkspaceHasChanges);
  const dataDiskChanges = useSelector(getEditableWorkspaceHasDataDiskChanges);
  const skuChanges = useSelector(getEditableWorkspaceHasSkuChanges);
  const valid = useSelector(getEditableWorkspaceIsValid);
  const saving = useSelector(getEditableWorkspaceSaving);
  const passwordResetPending = useSelector(getPasswordResetPending);
  const snapshotSaving = useSelector(getEditableWorkspaceSnapshotSavingID);
  const dispatch = useDispatch();
  const [warningDialogOpen, setWarningDialogOpen] = React.useState(false);
  const machines: AzureVirtualMachineDto[] = React.useMemo(() => {
    return workspace.VirtualMachines;
  }, [workspace]);
  const snapshotFeatureFlag = useSelector(getFeatureFlagSnapshot);
  const complianceMonitoringFeatureFlag = useSelector(
    getFeatureFlagComplianceMonitoring
  );
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const isAdminSelection = useSelector(getEditWorkspaceIsAdminSelection);
  const diagnosticsFeatureFlag = useSelector(getFeatureFlagDiagnostics);

  const showSpinner = saving || passwordResetPending || snapshotSaving;

  const history = useHistory();
  const query = useQuery();
  const basePath = location.pathname;

  const pivotClick = (key: string) => {
    history.push(`${basePath}?tab=${key}`);
  };

  const tab = React.useMemo(() => {
    const key = query.get('tab');
    switch (key) {
      case 'disks':
        return 'disks';
      case 'snapshots':
        return 'snapshots';
      case 'networks':
        return 'networks';
      case 'compliance':
        return 'compliance';
      case 'domain':
        return 'domain';
      case 'connect':
        return 'connect';
      case 'diagnostics':
        return 'diagnostics';
      default:
        return 'general';
    }
  }, [query]);

  return (
    <>
      <Prompt
        message={(location) => {
          if (!location.pathname.includes(workspace.ID) && changes) {
            return 'Your changes will not be saved if you leave this page.';
          }
          return true;
        }}
      />
      {showSpinner && (
        <Spinner
          size={SpinnerSize.large}
          aria-label='workspace saving spinner'
        />
      )}
      <Stack
        className={clsx(
          commonStyles.fullHeight,
          commonStyles.flexItem,
          commonStyles.overflowYAuto,
          showSpinner && commonStyles.blur,
          commonStyles.flexGrow,
          commonStyles.minHeight250
        )}
      >
        <Pivot
          selectedKey={tab}
          onLinkClick={(item: PivotItem) => pivotClick(item.props.itemKey)}
          overflowBehavior={'menu'}
          overflowAriaLabel={'more machine properties'}
          className={commonStyles.flexPivot}
          styles={{
            ...PivotStyles.ItemContainerOverflow,
            ...PivotStyles.TabPadding,
          }}
          linkSize={'large'}
        >
          <PivotItem
            headerText='General'
            itemKey={'general'}
            alwaysRender={true}
          >
            <PivotItemErrorBoundaryWrapper>
              <AzureMachineGeneral machineIndex={props.machineIndex} />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
          <PivotItem headerText='Disks' itemKey={'disks'}>
            <PivotItemErrorBoundaryWrapper>
              <AzureMachineDataDisks machineIndex={props.machineIndex} />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
          {snapshotFeatureFlag && (
            <PivotItem headerText='Snapshots' itemKey={'snapshots'}>
              <PivotItemErrorBoundaryWrapper>
                <AzureMachineSnapshots machineIndex={props.machineIndex} />
              </PivotItemErrorBoundaryWrapper>
            </PivotItem>
          )}
          <PivotItem headerText='Network Configuration' itemKey={'networks'}>
            <PivotItemErrorBoundaryWrapper>
              <AzureMachineNetworking machineIndex={props.machineIndex} />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
          {complianceMonitoringFeatureFlag &&
            segmentConstraint.EnablePatchInfoForVM && (
              <PivotItem headerText='Compliance' itemKey={'compliance'}>
                <PivotItemErrorBoundaryWrapper>
                  <AzureMachineCompliance machineIndex={props.machineIndex} />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
          <PivotItem headerText='Domain' itemKey={'domain'}>
            <PivotItemErrorBoundaryWrapper>
              <AzureMachineDomain machineIndex={props.machineIndex} />
            </PivotItemErrorBoundaryWrapper>
          </PivotItem>
          {isAdminSelection && diagnosticsFeatureFlag && (
            <PivotItem
              headerText='Diagnostics'
              itemKey='diagnostics'
              alwaysRender={true}
            >
              <PivotItemErrorBoundaryWrapper>
                <AdminDiagnosticsPage machine={machines[props.machineIndex]} />
              </PivotItemErrorBoundaryWrapper>
            </PivotItem>
          )}

          {machines[props.machineIndex].State == ResourceState.Running && (
            <PivotItem
              headerText='Connect'
              itemKey={'connect'}
              alwaysRender={true}
            >
              <PivotItemErrorBoundaryWrapper>
                <AzureMachineConnect machineIndex={props.machineIndex} />
              </PivotItemErrorBoundaryWrapper>
            </PivotItem>
          )}
        </Pivot>
        <Stack horizontal horizontalAlign='end'>
          <DefaultButton
            className={commonStyles.flexItem}
            text='Cancel'
            allowDisabledFocus
            disabled={!changes}
            onClick={() => dispatch(editableWorkspaceResetChanges())}
          />
          <PrimaryButton
            className={commonStyles.flexItem}
            text='Save'
            allowDisabledFocus
            disabled={!changes || !valid}
            onClick={() => {
              skuChanges || dataDiskChanges
                ? setWarningDialogOpen(true)
                : dispatch(editableWorkspaceSaveChanges());
            }}
          />
        </Stack>
      </Stack>
      <Dialog
        hidden={!warningDialogOpen}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Warning',
          closeButtonAriaLabel: 'Close',
          subText: 'Saving these changes will restart the virtual machine.',
        }}
      >
        <DialogFooter>
          <DefaultButton
            onClick={() => setWarningDialogOpen(false)}
            text='Cancel'
          />
          <PrimaryButton
            onClick={() => {
              setWarningDialogOpen(false);
              dispatch(editableWorkspaceSaveChanges());
            }}
            text='Save'
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

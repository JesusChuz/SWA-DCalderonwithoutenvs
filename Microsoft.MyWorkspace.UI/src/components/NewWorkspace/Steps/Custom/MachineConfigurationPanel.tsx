import * as React from 'react';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  PrimaryButton,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { Notification } from '../../../GeneralComponents/Notifications/Notification';
import {
  getBlockedNotificationState,
  getFeatureFlagMultipleDomainControllers,
} from '../../../../store/selectors';
import { hideBlockedNotification } from '../../../../store/actions';
import { AzureMachineDataDisks } from '../../../MyWorkspaces/WorkspaceMachineProperties/AzureMachineProperties/PropertiesTabs/AzureMachineDataDisks';
import { AzureMachineGeneral } from '../../../MyWorkspaces/WorkspaceMachineProperties/AzureMachineProperties/PropertiesTabs/AzureMachineGeneral';
import { AzureMachineNetworking } from '../../../MyWorkspaces/WorkspaceMachineProperties/AzureMachineProperties/PropertiesTabs/AzureMachineNetworking';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  getEditableWorkspace,
  getEditableWorkspaceErrors,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { editableWorkspaceResetWorkspaceChanges } from '../../../../store/actions/editableWorkspaceActions';
import { AzureMachineDomain } from '../../../MyWorkspaces/WorkspaceMachineProperties/AzureMachineProperties/PropertiesTabs/AzureMachineDomain';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

interface IProps {
  machineIndex: number;
  onDismiss: () => void;
}

export const MachineConfigurationPanel = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const blockedMessageState = useSelector(getBlockedNotificationState);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const domainControllerFeatureFlag = useSelector(
    getFeatureFlagMultipleDomainControllers
  );
  const errors = useSelector(getEditableWorkspaceErrors);
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const previousEditableWorkspace = React.useMemo(() => {
    return cloneDeep(editableWorkspace);
  }, [props.machineIndex]);

  const previousEditableWorkspaceErrors = React.useMemo(() => {
    return cloneDeep(errors);
  }, [props.machineIndex]);

  const changes = React.useMemo(
    () => !isEqual(previousEditableWorkspace, editableWorkspace),
    [previousEditableWorkspace, editableWorkspace]
  );
  const closeDialogKeepChanges = React.useCallback(() => {
    setIsDialogVisible(false);
  }, []);

  const closeDialogDiscardChanges = () => {
    resetAndSaveChanges();
    setIsDialogVisible(false);
  };

  const closePanel = (ev?: React.BaseSyntheticEvent | KeyboardEvent) => {
    if (ev) {
      // Instead of closing the panel immediately, show popup dialog if changes were made
      ev.preventDefault();
      changes ? setIsDialogVisible(true) : resetAndSaveChanges();
    }
  };

  const resetAndSaveChanges = () => {
    dispatch(
      editableWorkspaceResetWorkspaceChanges(
        previousEditableWorkspace,
        previousEditableWorkspaceErrors
      )
    );
    props.onDismiss();
  };

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <DefaultButton
          className={commonStyles.flexItem}
          style={{ alignSelf: 'flex-end' }}
          text='Cancel'
          allowDisabledFocus
          onClick={closePanel}
        />
        <PrimaryButton
          className={commonStyles.flexItem}
          text='Save'
          allowDisabledFocus
          disabled={
            !changes || errors.domains.length > 0 || errors.dataDisks.length > 0
          }
          onClick={() => props.onDismiss()}
        />
      </div>
    ),
    [
      changes,
      errors.domains,
      errors.dataDisks,
      previousEditableWorkspace,
      previousEditableWorkspaceErrors,
    ]
  );

  return (
    <>
      <Dialog
        hidden={!isDialogVisible}
        onDismiss={closeDialogKeepChanges}
        modalProps={{ isBlocking: true }}
        dialogContentProps={{
          title: 'Unsaved Changes',
          type: DialogType.normal,
          subText: 'Your changes will not be saved if you leave this page.',
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={closeDialogDiscardChanges} text='OK' />
          <DefaultButton onClick={closeDialogKeepChanges} text='Cancel' />
        </DialogFooter>
      </Dialog>
      <Panel
        isOpen={props.machineIndex !== -1}
        onDismiss={closePanel}
        type={PanelType.largeFixed}
        closeButtonAriaLabel='Close'
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        headerText='Edit Machine'
        isLightDismiss={true}
        title='Machine Configuration Panel'
      >
        {blockedMessageState.show && (
          <Notification
            position='inherit'
            messageText={blockedMessageState.message}
            messageVariant='blocked'
            onClose={() => {
              dispatch(hideBlockedNotification());
            }}
          />
        )}
        {props.machineIndex !== -1 && (
          <Pivot aria-label='Machine Configuration Categories'>
            <PivotItem
              headerText='General'
              itemKey={'general'}
              alwaysRender={true}
            >
              <AzureMachineGeneral machineIndex={props.machineIndex} />
            </PivotItem>
            <PivotItem headerText='Disks' itemKey={'disks'}>
              <AzureMachineDataDisks machineIndex={props.machineIndex} />
            </PivotItem>
            <PivotItem headerText='Network Configuration' itemKey={'networks'}>
              <AzureMachineNetworking machineIndex={props.machineIndex} />
            </PivotItem>
            {domainControllerFeatureFlag && (
              <PivotItem headerText='Domain' itemKey={'domain'}>
                <AzureMachineDomain machineIndex={props.machineIndex} />
              </PivotItem>
            )}
          </Pivot>
        )}
      </Panel>
    </>
  );
};

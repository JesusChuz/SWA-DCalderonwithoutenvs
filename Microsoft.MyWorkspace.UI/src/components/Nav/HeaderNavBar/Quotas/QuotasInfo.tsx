import * as React from 'react';
import {
  ActionButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  IIconProps,
  IPivotStyles,
  ISpinButtonStyles,
  IStyleSet,
  Pivot,
  PivotItem,
  Position,
  PrimaryButton,
  Separator,
  SpinButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
  Toggle,
  useTheme,
} from '@fluentui/react';
import { useSelector } from 'react-redux';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { InfoButton } from '../../../GeneralComponents/InfoButton';
import {
  getUserRoleAssignmentConstraint,
  getUserRoleAssignmentSegmentName,
  getFeatureFlagSnapshot,
  getFeatureFlagNestedVirtualization,
  getFeatureFlagAutoDeleteNonExistentUsers,
  getSelectedAdminSegmentName,
  getFeatureFlagStaleWorkspaceDeletion,
  getFeatureFlagTenantSegmentAdminQuotas,
  getEditableSegmentConstraint,
  getEditableSegmentConstraintChanges,
  getSelectedAdminSegment,
  getAdminConstraintsUpdating,
  getSelectedAdminSegmentConstraint,
  getSegmentConstraintMaxValues,
  getFeatureFlagComplianceMonitoring,
  getFeatureFlagDisableScheduledStart,
} from '../../../../store/selectors';
import clsx from 'clsx';
import {
  cancelEditableSegmentConstraintChanges,
  updateEditableSegmentConstraint,
  updateSegmentConstraint,
  showUserConfirmationDialog,
  fetchAdminSegments,
} from '../../../../store/actions';
import { useAppDispatch } from '../../../../store/store';
import { getAdminViewStyles } from '../../../../components/Administration/AdministrationViews.styles';
import { SegmentConstraintDto } from '../../../../types/AuthService/SegmentConstraintDto.types';

const InfoIcon: IIconProps = { iconName: 'Info' };

interface IProps {
  type?: 'user' | 'admin';
}

export const QuotasInfo = (props: IProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const adminViewStyles = getAdminViewStyles(theme);
  const userConstraint = useSelector(getUserRoleAssignmentConstraint);
  const editableAdminConstraint = useSelector(getEditableSegmentConstraint);
  const editableAdminConstraintChanges = useSelector(
    getEditableSegmentConstraintChanges
  );
  const adminConstraint = useSelector(getSelectedAdminSegmentConstraint);
  const adminConstraintsUpdating = useSelector(getAdminConstraintsUpdating);
  const userSegmentName: string = useSelector(getUserRoleAssignmentSegmentName);
  const adminSegment = useSelector(getSelectedAdminSegment);
  const adminSegmentName: string = useSelector(getSelectedAdminSegmentName);
  const snapshotFeatureFlag = useSelector(getFeatureFlagSnapshot);
  const staleWorkspaceDeletionFeatureFlag = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );
  const complianceMonitoringFeatureFlag = useSelector(
    getFeatureFlagComplianceMonitoring
  );

  const infoButtonMaxCumulativeMemory = 'infoButton-max-cumulative-memory';
  const infoButtonMaxCumulativeStorage = 'infoButton-max-cumulative-storage';
  const infoButtonAutoDelete = 'infoButton-stale-workspace-deletion';
  const infoButtonComplianceMonitoring = 'infoButton-compliance-monitoring';
  const infoButtonEnableAutoDeleteNonExistentUsers =
    'infoButton-autodelete-nonexistent-users';
  const infoButtonCancelScheduledStart = 'infoButton-cancel-scheduled-start';

  const nestedVirtualizationFeatureFlag = useSelector(
    getFeatureFlagNestedVirtualization
  );
  const autoDeleteNonExistentUsersFeatureFlag = useSelector(
    getFeatureFlagAutoDeleteNonExistentUsers
  );

  const disableScheduledStartFeatureFlag = useSelector(
    getFeatureFlagDisableScheduledStart
  );

  const featureFlagTenantSegmentAdmin = useSelector(
    getFeatureFlagTenantSegmentAdminQuotas
  );
  const allowQuotaUpdates =
    featureFlagTenantSegmentAdmin &&
    props.type === 'admin' &&
    !adminConstraintsUpdating;

  const spinButtonStyles: Partial<ISpinButtonStyles> = {
    spinButtonWrapper: {
      width: 100,
      fontSize: 11,
    },
  };
  const valueRegex = /^(\d+(\.\d+)?).*/;
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 100 },
  };
  const userPivotStyles: Partial<IStyleSet<IPivotStyles>> = {
    linkContent: {
      fontSize: '22px',
    },
  };

  const segmentConstraintMaxValues = useSelector(getSegmentConstraintMaxValues);

  const currentSegmentConstraint = React.useMemo(() => {
    if (props.type === 'admin') {
      return editableAdminConstraint;
    } else {
      return userConstraint;
    }
  }, [userConstraint, editableAdminConstraint, props.type]);

  const currentSegmentName = React.useMemo(() => {
    if (props.type === 'admin') {
      return adminSegmentName;
    } else {
      return userSegmentName;
    }
  }, [userSegmentName, adminSegmentName, props.type]);

  const [editableSegmentName, setEditableSegmentName] =
    React.useState(currentSegmentName);

  React.useEffect(() => {
    setEditableSegmentName(currentSegmentName);
  }, [currentSegmentName]);

  const editableSegmentNameChanges = React.useMemo(() => {
    return editableSegmentName !== currentSegmentName;
  }, [editableSegmentName, currentSegmentName]);

  const textInvalid =
    editableSegmentName === null || editableSegmentName.length <= 0;

  const autoShutdownConstraintsChanged = (
    originalAdminConstraint: SegmentConstraintDto,
    editableAdminConstraint: SegmentConstraintDto
  ): string => {
    if (
      editableAdminConstraint.EnableAutoStaleWorkspaceDeletion &&
      !originalAdminConstraint.EnableAutoStaleWorkspaceDeletion
    ) {
      return `You have enabled Stale Workspace Deletion. This will result in the deletion of any workspace that has not JIT activated in ${
        editableAdminConstraint.StaleWorkspaceDeletionDays
      } day${
        editableAdminConstraint.StaleWorkspaceDeletionDays === 1 ? '' : 's'
      }.`;
    }
    if (
      editableAdminConstraint.StaleWorkspaceDeletionDays <
      originalAdminConstraint.StaleWorkspaceDeletionDays
    ) {
      return `You have decreased the number of days until Stale Workspace Deletion occurs. This will result in the deletion of any workspace that has not JIT activated in ${
        editableAdminConstraint.StaleWorkspaceDeletionDays
      } day${
        editableAdminConstraint.StaleWorkspaceDeletionDays === 1 ? '' : 's'
      }.`;
    }
    return '';
  };

  return (
    <div
      className={clsx(
        props.type === 'admin' && commonStyles.overflowYAuto,
        props.type === 'admin' && commonStyles.fullHeight,
        props.type === 'admin' && adminViewStyles.maxQuotaTabWidth
      )}
    >
      {!currentSegmentName || !currentSegmentConstraint ? (
        <Text className={commonStyles.errorTextBold}>
          Error occurred displaying the segment.
        </Text>
      ) : (
        <Stack
          className={clsx(props.type === 'admin' && commonStyles.fullHeight)}
        >
          {!(featureFlagTenantSegmentAdmin && props.type === 'admin') && (
            <Stack>
              <ActionButton
                iconProps={InfoIcon}
                style={{ color: theme.semanticColors.warningIcon }}
                disabled
              >
                Please contact service administrator to update quota
                information.
              </ActionButton>
            </Stack>
          )}
          <Separator />
          {props.type === 'admin' && adminConstraintsUpdating ? (
            <Stack
              verticalAlign='center'
              horizontalAlign='center'
              className={clsx(commonStyles.fullHeight)}
            >
              <Spinner size={SpinnerSize.large} />
            </Stack>
          ) : (
            <Pivot
              aria-label='Quota Tabs'
              linkSize={'large'}
              className={clsx(
                props.type === 'admin' && commonStyles.overflowYAuto,
                props.type === 'admin' && commonStyles.fullHeight
              )}
              styles={props.type === 'admin' ? undefined : userPivotStyles}
            >
              <PivotItem headerText='User'>
                <Stack
                  tokens={{ childrenGap: 18 }}
                  className={clsx(
                    props.type === 'admin' && commonStyles.paddingTopBottom16
                  )}
                >
                  <Text
                    as='h2'
                    variant='xLarge'
                    className={commonStyles.margin0}
                    style={{ marginTop: '24px' }}
                  >
                    User Level Quotas
                  </Text>
                  <Stack tokens={{ childrenGap: 4 }}>
                    <TextField
                      className={commonStyles.textFieldName}
                      id='segmentName'
                      label='Segment Name'
                      ariaLabel='segment name'
                      required
                      maxLength={100}
                      value={editableSegmentName}
                      disabled={!allowQuotaUpdates}
                      invalid={textInvalid}
                      onGetErrorMessage={(
                        value: 'The segment name cannot be null or invalid.'
                      ) => undefined}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        newValue?: string
                      ) => setEditableSegmentName(newValue)}
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Workspaces'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={segmentConstraintMaxValues.MaxAzureWorkspacesAllowed}
                      step={1}
                      value={currentSegmentConstraint.MaxAzureWorkspacesAllowed.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxAzureWorkspacesAllowed: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum workspaces'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Toggle
                      label='Enable Share With Segment'
                      ariaLabel='enable share with segment'
                      disabled={!allowQuotaUpdates}
                      checked={currentSegmentConstraint.EnableShareWithSegment}
                      onText='Enabled'
                      offText='Disabled'
                      onClick={() =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            EnableShareWithSegment:
                              !currentSegmentConstraint.EnableShareWithSegment,
                          })
                        )
                      }
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Toggle
                      label='Auto Shutdown'
                      ariaLabel='automatic shutdown'
                      disabled={!allowQuotaUpdates}
                      checked={!currentSegmentConstraint.DisableAutoShutDown}
                      onText='Enabled'
                      offText='Disabled'
                      onClick={() =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            DisableAutoShutDown:
                              !currentSegmentConstraint.DisableAutoShutDown,
                          })
                        )
                      }
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Toggle
                      label='RDP Copy/Paste'
                      ariaLabel='RDP copy or paste'
                      disabled={!allowQuotaUpdates}
                      checked={!currentSegmentConstraint.DisableCopyPaste}
                      onText='Enabled'
                      offText='Disabled'
                      onClick={() =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            DisableCopyPaste:
                              !currentSegmentConstraint.DisableCopyPaste,
                          })
                        )
                      }
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Toggle
                      label='Template Creation'
                      ariaLabel='Allow template creation'
                      disabled={!allowQuotaUpdates}
                      checked={currentSegmentConstraint.AllowTemplateCreation}
                      onText='Enabled'
                      offText='Disabled'
                      onClick={() =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            AllowTemplateCreation:
                              !currentSegmentConstraint.AllowTemplateCreation,
                          })
                        )
                      }
                    />
                  </Stack>
                  {autoDeleteNonExistentUsersFeatureFlag && (
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Stack horizontal horizontalAlign='start'>
                        <Toggle
                          label='Auto-Delete Non-Existent Users'
                          ariaLabel='Allow Auto-Delete for Non-Existent Users'
                          disabled={!allowQuotaUpdates}
                          checked={
                            currentSegmentConstraint.EnableAutoDeleteNonExistentUsers
                          }
                          onText='Enabled'
                          offText='Disabled'
                          onClick={() =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                EnableAutoDeleteNonExistentUsers:
                                  !currentSegmentConstraint.EnableAutoDeleteNonExistentUsers,
                              })
                            )
                          }
                        />
                        <InfoButton
                          buttonId={infoButtonEnableAutoDeleteNonExistentUsers}
                          calloutTitle={'Auto-Delete Non-Existent Users'}
                          calloutBody={
                            <>
                              <Text>
                                This option will automatically delete users who
                                are no longer part of AAD.
                              </Text>
                              <Text>
                                Workspaces associated with these users will also
                                be deleted.
                              </Text>
                            </>
                          }
                        />
                      </Stack>
                      <Text
                        variant={'small'}
                        style={{ color: theme.semanticColors.errorText }}
                      >
                        {'Owned workspaces will also be deleted.'}
                      </Text>
                    </Stack>
                  )}

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Weekly Runtime Extension in Hours'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={
                        segmentConstraintMaxValues.WeeklyRuntimeExtensionHours
                      }
                      step={1}
                      value={currentSegmentConstraint.WeeklyRuntimeExtensionHours.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            WeeklyRuntimeExtensionHours: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='weekly runtime extension time in hours'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                  </Stack>
                </Stack>
              </PivotItem>

              <PivotItem headerText='Workspaces'>
                <Stack
                  tokens={{ childrenGap: 18 }}
                  className={clsx(
                    props.type === 'admin' && commonStyles.paddingTopBottom16
                  )}
                >
                  <Text
                    as='h2'
                    variant='xLarge'
                    className={commonStyles.margin0}
                    style={{ marginTop: '24px' }}
                  >
                    Workspace Level Quotas
                  </Text>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Machines Per Workspace'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={
                        segmentConstraintMaxValues.MaxMachinesPerWorkspaceAllowedCustom
                      }
                      step={1}
                      value={currentSegmentConstraint.MaxMachinesPerWorkspaceAllowedCustom.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxMachinesPerWorkspaceAllowedCustom: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum machines per workspace'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Public IP Addresses'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={
                        segmentConstraintMaxValues.MaxPublicIPAddressesAllowed
                      }
                      step={1}
                      value={currentSegmentConstraint.MaxPublicIPAddressesAllowed.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxPublicIPAddressesAllowed: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum public IP addresses'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Runtime in Minutes'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={segmentConstraintMaxValues.MaxRunTimeAllowed}
                      step={5}
                      value={currentSegmentConstraint.MaxRunTimeAllowed.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxRunTimeAllowed: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum runtime in minutes'
                      incrementButtonAriaLabel='increase value by 5'
                      decrementButtonAriaLabel='decrease value by 5'
                    />
                  </Stack>

                  <Stack>
                    <Stack horizontal horizontalAlign='start'>
                      <SpinButton
                        label='Max Cumulative Memory in GB'
                        labelPosition={Position.top}
                        styles={{
                          ...spinButtonStyles,
                          root: { width: 'auto' },
                        }}
                        min={Math.max(
                          2,
                          segmentConstraintMaxValues.MaxMachineMemoryAllowedCustom,
                          segmentConstraintMaxValues.MaxMachineMemoryAllowedNested
                        )}
                        max={
                          segmentConstraintMaxValues.MaxCumulativeMemoryAllowedCustom
                        }
                        step={10}
                        value={currentSegmentConstraint.MaxCumulativeMemoryAllowedCustom.toString()}
                        disabled={!allowQuotaUpdates}
                        onChange={(
                          event: React.SyntheticEvent<HTMLElement>,
                          value?: string
                        ) =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              MaxCumulativeMemoryAllowedCustom: Number(
                                value.replace(valueRegex, '$1')
                              ),
                            })
                          )
                        }
                        ariaLabel='maximum cumulative memory in gigabytes'
                        incrementButtonAriaLabel='increase value by 10'
                        decrementButtonAriaLabel='decrease value by 10'
                      />
                      <InfoButton
                        buttonId={infoButtonMaxCumulativeMemory}
                        calloutTitle={'Limits of Cumulative Memory'}
                        calloutBody={
                          <>
                            <Text>
                              The cumulative memory limit cannot be lower than
                              maximum memory for any single custom or nested
                              machines.
                            </Text>
                            <Text>
                              To set Maximum Cumulative Memory in GB lower than
                              the current minimum of{' '}
                              {Math.max(
                                segmentConstraintMaxValues.MaxMachineMemoryAllowedCustom,
                                segmentConstraintMaxValues.MaxMachineMemoryAllowedNested
                              )}
                              , please decrease these quotas first: Max Memory
                              Per Machine in GB and Max Hyper-V Host Memory in
                              GB.
                            </Text>
                          </>
                        }
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Stack horizontal horizontalAlign='start'>
                      <SpinButton
                        label='Max Cumulative Storage in GB'
                        labelPosition={Position.top}
                        styles={{
                          ...spinButtonStyles,
                          root: { width: 'auto' },
                        }}
                        min={Math.max(
                          128,
                          segmentConstraintMaxValues.MaxMachineStorageAllowedCustom,
                          segmentConstraintMaxValues.MaxMachineStorageAllowedNested
                        )}
                        max={
                          segmentConstraintMaxValues.MaxCumulativeStorageAllowedCustom
                        }
                        step={100}
                        value={currentSegmentConstraint.MaxCumulativeStorageAllowedCustom.toString()}
                        disabled={!allowQuotaUpdates}
                        onChange={(
                          event: React.SyntheticEvent<HTMLElement>,
                          value?: string
                        ) =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              MaxCumulativeStorageAllowedCustom: Number(
                                value.replace(valueRegex, '$1')
                              ),
                            })
                          )
                        }
                        ariaLabel='maximum cumulative storage in gigabytes'
                        incrementButtonAriaLabel='increase value by 100'
                        decrementButtonAriaLabel='decrease value by 100'
                      />
                      <InfoButton
                        buttonId={infoButtonMaxCumulativeStorage}
                        calloutTitle={'Limits of Cumulative Storage'}
                        calloutBody={
                          <>
                            <Text>
                              The cumulative storage limit cannot be lower than
                              maximum storage for any single custom or nested
                              machines.
                            </Text>
                            <Text>
                              To set Maximum Cumulative Storage in GB lower than
                              the current minimum of{' '}
                              {Math.max(
                                segmentConstraintMaxValues.MaxMachineStorageAllowedCustom,
                                segmentConstraintMaxValues.MaxMachineStorageAllowedNested
                              )}
                              , please decrease these quotas first: Max Storage
                              Per Machine in GB and Max Hyper-V Host Storage in
                              GB.
                            </Text>
                          </>
                        }
                      />
                    </Stack>
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Dropdown
                      label='Max OS Disk Size in GB'
                      ariaLabel='maximum OS disk size in gigabytes'
                      styles={dropdownStyles}
                      disabled={!allowQuotaUpdates}
                      placeholder={currentSegmentConstraint.MaxOSDiskSizeAllowed.toString()}
                      options={[
                        { key: 128, text: '128' },
                        { key: 256, text: '256' },
                        { key: 512, text: '512' },
                        { key: 1024, text: '1024' },
                      ]}
                      onChange={(
                        event: React.FormEvent<HTMLDivElement>,
                        item: IDropdownOption
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxOSDiskSizeAllowed: Number(item.key),
                          })
                        )
                      }
                    />
                  </Stack>

                  {staleWorkspaceDeletionFeatureFlag && (
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Stack horizontal horizontalAlign='start'>
                        <Toggle
                          label='Auto Delete Stale Workspaces'
                          ariaLabel='automatically delete stale workspaces'
                          disabled={!allowQuotaUpdates}
                          checked={
                            currentSegmentConstraint.EnableAutoStaleWorkspaceDeletion
                          }
                          onText='Enabled'
                          offText='Disabled'
                          onClick={() =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                EnableAutoStaleWorkspaceDeletion:
                                  !currentSegmentConstraint.EnableAutoStaleWorkspaceDeletion,
                              })
                            )
                          }
                        />
                        <InfoButton
                          buttonId={infoButtonAutoDelete}
                          calloutTitle={'Auto Stale Workspace Deletion'}
                          calloutBody={
                            <>
                              <Text>
                                When enabled, workspaces which have not been JIT
                                activated in the number of days selected in the
                                Auto deletion control will be considered stale
                                and will be automatically deleted unless their
                                delete lock is active.
                              </Text>
                              <Text className={commonStyles.errorTextBold}>
                                Workspace deletion cannot be undone.
                              </Text>
                            </>
                          }
                        />
                      </Stack>
                      <SpinButton
                        label='Auto Deletion in Days'
                        labelPosition={Position.top}
                        styles={spinButtonStyles}
                        disabled={!allowQuotaUpdates}
                        min={0}
                        max={365}
                        step={1}
                        value={currentSegmentConstraint.StaleWorkspaceDeletionDays.toString()}
                        onChange={(
                          event: React.SyntheticEvent<HTMLElement>,
                          value?: string
                        ) =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              StaleWorkspaceDeletionDays: Number(
                                value.replace(valueRegex, '$1')
                              ),
                            })
                          )
                        }
                        ariaLabel='auto deletion in days'
                        incrementButtonAriaLabel='increase value by 1'
                        decrementButtonAriaLabel='decrease value by 1'
                      />
                      <SpinButton
                        label='Bulk Delete Threshold'
                        labelPosition={Position.top}
                        styles={spinButtonStyles}
                        disabled={!allowQuotaUpdates}
                        min={0}
                        max={100}
                        step={1}
                        value={currentSegmentConstraint.MaxBulkDeleteWorkspacesThreshold.toString()}
                        onChange={(
                          event: React.SyntheticEvent<HTMLElement>,
                          value?: string
                        ) =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              MaxBulkDeleteWorkspacesThreshold: Number(
                                value.replace(valueRegex, '$1')
                              ),
                            })
                          )
                        }
                        ariaLabel='maximum number of workspaces allowed for bulk delete without notification'
                        incrementButtonAriaLabel='increase value by 1'
                        decrementButtonAriaLabel='decrease value by 1'
                      />
                    </Stack>
                  )}

                  {snapshotFeatureFlag && (
                    <Stack tokens={{ childrenGap: 4 }}>
                      <SpinButton
                        label='Max Snapshots Per Workspace'
                        labelPosition={Position.top}
                        styles={spinButtonStyles}
                        disabled={!allowQuotaUpdates}
                        min={0}
                        max={
                          segmentConstraintMaxValues.MaxSnapshotsPerWorkspace
                        }
                        step={1}
                        value={currentSegmentConstraint.MaxSnapshotsPerWorkspace.toString()}
                        onChange={(
                          event: React.SyntheticEvent<HTMLElement>,
                          value?: string
                        ) =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              MaxSnapshotsPerWorkspace: Number(
                                value.replace(valueRegex, '$1')
                              ),
                            })
                          )
                        }
                        ariaLabel='maximum snapshots per workspace'
                        incrementButtonAriaLabel='increase value by 1'
                        decrementButtonAriaLabel='decrease value by 1'
                      />
                    </Stack>
                  )}

                  {complianceMonitoringFeatureFlag && (
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Stack horizontal horizontalAlign='start'>
                        <Toggle
                          label='Compliance Monitoring'
                          ariaLabel='Compliance Monitoring'
                          disabled={!allowQuotaUpdates}
                          checked={
                            currentSegmentConstraint.EnablePatchInfoForVM
                          }
                          onText='Enabled'
                          offText='Disabled'
                          onClick={() =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                EnablePatchInfoForVM:
                                  !currentSegmentConstraint.EnablePatchInfoForVM,
                              })
                            )
                          }
                        />
                        <InfoButton
                          buttonId={infoButtonComplianceMonitoring}
                          calloutTitle={'Compliance Monitoring'}
                          calloutBody={
                            <>
                              <Text>
                                When enabled, users will be able to view
                                additional information related to the compliance
                                of their workspaces, such as which VMs have
                                patches pending.
                              </Text>
                              <Text className={commonStyles.errorTextBold}>
                                Before enabling this feature, your tenant must
                                have Azure Monitor enabled.
                              </Text>
                            </>
                          }
                        />
                      </Stack>
                    </Stack>
                  )}
                  {disableScheduledStartFeatureFlag && (
                    <Stack tokens={{ childrenGap: 4 }}>
                      <Toggle
                        label='Allow Scheduled Start'
                        ariaLabel='Allow Scheduled Start'
                        disabled={!allowQuotaUpdates}
                        checked={
                          currentSegmentConstraint.EnableWorkspaceScheduledStart
                        }
                        onText='Enabled'
                        offText='Disabled'
                        onClick={() =>
                          dispatch(
                            updateEditableSegmentConstraint({
                              EnableWorkspaceScheduledStart:
                                !currentSegmentConstraint.EnableWorkspaceScheduledStart,
                            })
                          )
                        }
                      />
                    </Stack>
                  )}
                  <Stack horizontal horizontalAlign='start'>
                    <SpinButton
                      label='Skip Scheduled Start after Inactivity in Days'
                      labelPosition={Position.top}
                      styles={{
                        ...spinButtonStyles,
                        root: { width: 'auto' },
                      }}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={365}
                      step={1}
                      value={currentSegmentConstraint.CancelScheduledStartAfterInactivityInDays.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            CancelScheduledStartAfterInactivityInDays: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='skip scheduled start after inactivity in days'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                    <InfoButton
                      buttonId={infoButtonCancelScheduledStart}
                      calloutTitle={'Skip Scheduled Start'}
                      calloutBody={
                        <>
                          <Text>
                            If a workspace has not been JIT activated recently
                            but is still scheduled to start automatically, it is
                            likely wasting Azure resources.
                          </Text>
                          <Text>
                            The value entered here is the number of days of
                            inactivity that will be allowed before the Scheduled
                            Start will be skipped for the workspace.
                          </Text>
                          <Text>
                            If a value of 0 is entered Scheduled Start will
                            never be skipped for inactivity for this segment.
                          </Text>
                        </>
                      }
                    />
                  </Stack>
                </Stack>
              </PivotItem>

              <PivotItem headerText='Machines'>
                <Stack
                  tokens={{ childrenGap: 18 }}
                  className={clsx(
                    props.type === 'admin' && commonStyles.paddingTopBottom16
                  )}
                >
                  <Text
                    as='h2'
                    variant='xLarge'
                    className={commonStyles.margin0}
                    style={{ marginTop: '24px' }}
                  >
                    Machine Level Quotas
                  </Text>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Data Disks Per Machine'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={0}
                      max={segmentConstraintMaxValues.MaxDataDisksPerVM}
                      step={1}
                      value={currentSegmentConstraint.MaxDataDisksPerVM.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxDataDisksPerVM: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum data disks per virtual machine'
                      incrementButtonAriaLabel='increase value by 1'
                      decrementButtonAriaLabel='decrease value by 1'
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <Dropdown
                      label='Max Memory Per Machine in GB'
                      ariaLabel='maximum memory per machine in gigabytes'
                      styles={dropdownStyles}
                      disabled={!allowQuotaUpdates}
                      placeholder={currentSegmentConstraint.MaxMachineMemoryAllowedCustom.toString()}
                      options={[
                        { key: 2, text: '2' },
                        { key: 4, text: '4' },
                        { key: 8, text: '8' },
                        { key: 16, text: '16' },
                        { key: 32, text: '32' },
                        { key: 48, text: '48' },
                        { key: 64, text: '64' },
                        { key: 80, text: '80' },
                      ].filter(
                        (option) =>
                          option.key <=
                          currentSegmentConstraint.MaxCumulativeMemoryAllowedCustom
                      )}
                      onChange={(
                        event: React.FormEvent<HTMLDivElement>,
                        item: IDropdownOption
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxMachineMemoryAllowedCustom: Number(item.key),
                          })
                        )
                      }
                    />
                  </Stack>

                  <Stack tokens={{ childrenGap: 4 }}>
                    <SpinButton
                      label='Max Storage Per Machine in GB'
                      labelPosition={Position.top}
                      styles={spinButtonStyles}
                      disabled={!allowQuotaUpdates}
                      min={128}
                      max={Math.min(
                        segmentConstraintMaxValues.MaxMachineStorageAllowedCustom,
                        currentSegmentConstraint.MaxCumulativeStorageAllowedCustom
                      )}
                      step={100}
                      value={currentSegmentConstraint.MaxMachineStorageAllowedCustom.toString()}
                      onChange={(
                        event: React.SyntheticEvent<HTMLElement>,
                        value?: string
                      ) =>
                        dispatch(
                          updateEditableSegmentConstraint({
                            MaxMachineStorageAllowedCustom: Number(
                              value.replace(valueRegex, '$1')
                            ),
                          })
                        )
                      }
                      ariaLabel='maximum storage per virtual machine in gigabytes'
                      incrementButtonAriaLabel='increase value by 100'
                      decrementButtonAriaLabel='decrease value by 100'
                    />
                  </Stack>
                </Stack>
              </PivotItem>

              {nestedVirtualizationFeatureFlag &&
                (currentSegmentConstraint.EnableNestedDeployments ||
                  props.type === 'admin') && (
                  <PivotItem headerText='Hyper-V Host'>
                    <Stack
                      tokens={{ childrenGap: 18 }}
                      className={clsx(
                        props.type === 'admin' &&
                          commonStyles.paddingTopBottom16
                      )}
                    >
                      <Text
                        as='h2'
                        variant='xLarge'
                        className={commonStyles.margin0}
                        style={{ marginTop: '24px' }}
                      >
                        Nested Virtualization Quotas
                      </Text>

                      <Stack tokens={{ childrenGap: 4 }}>
                        <SpinButton
                          label='Max Nested Workspaces'
                          labelPosition={Position.top}
                          styles={spinButtonStyles}
                          disabled={!allowQuotaUpdates}
                          min={0}
                          max={
                            segmentConstraintMaxValues.MaxNestedWorkspacesAllowed
                          }
                          step={1}
                          value={currentSegmentConstraint.MaxNestedWorkspacesAllowed.toString()}
                          onChange={(
                            event: React.SyntheticEvent<HTMLElement>,
                            value?: string
                          ) =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                MaxNestedWorkspacesAllowed: Number(
                                  value.replace(valueRegex, '$1')
                                ),
                              })
                            )
                          }
                          ariaLabel='maximum nested workspaces'
                          incrementButtonAriaLabel='increase value by 1'
                          decrementButtonAriaLabel='decrease value by 1'
                        />
                      </Stack>

                      <Stack tokens={{ childrenGap: 4 }}>
                        <Dropdown
                          label='Max Hyper-V Host Memory in GB'
                          ariaLabel='maximum hyper-v host memory in gigabytes'
                          styles={dropdownStyles}
                          disabled={!allowQuotaUpdates}
                          placeholder={currentSegmentConstraint.MaxMachineMemoryAllowedNested.toString()}
                          options={[
                            { key: 8, text: '8' },
                            { key: 16, text: '16' },
                            { key: 32, text: '32' },
                            { key: 64, text: '64' },
                            { key: 128, text: '128' },
                            { key: 192, text: '192' },
                            { key: 256, text: '256' },
                          ].filter(
                            (option) =>
                              option.key <=
                              currentSegmentConstraint.MaxCumulativeMemoryAllowedCustom
                          )}
                          onChange={(
                            event: React.FormEvent<HTMLDivElement>,
                            item: IDropdownOption
                          ) =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                MaxMachineMemoryAllowedNested: Number(item.key),
                              })
                            )
                          }
                        />
                      </Stack>

                      <Stack tokens={{ childrenGap: 4 }}>
                        <SpinButton
                          label='Max Hyper-V Host Storage in GB'
                          labelPosition={Position.top}
                          styles={spinButtonStyles}
                          disabled={!allowQuotaUpdates}
                          min={0}
                          max={Math.min(
                            segmentConstraintMaxValues.MaxMachineStorageAllowedNested,
                            currentSegmentConstraint.MaxCumulativeStorageAllowedCustom
                          )}
                          step={1}
                          value={currentSegmentConstraint.MaxMachineStorageAllowedNested.toString()}
                          onChange={(
                            event: React.SyntheticEvent<HTMLElement>,
                            value?: string
                          ) =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                MaxMachineStorageAllowedNested: Number(
                                  value.replace(valueRegex, '$1')
                                ),
                              })
                            )
                          }
                          ariaLabel='maximum hyper-v host storage in gigabytes'
                          incrementButtonAriaLabel='increase value by 1'
                          decrementButtonAriaLabel='decrease value by 1'
                        />
                      </Stack>

                      <Stack tokens={{ childrenGap: 4 }}>
                        <Toggle
                          label='Nested Deployment Feature'
                          ariaLabel='nested deployment feature'
                          disabled={!allowQuotaUpdates}
                          checked={
                            currentSegmentConstraint.EnableNestedDeployments
                          }
                          onText='Enabled'
                          offText='Disabled'
                          onClick={() =>
                            dispatch(
                              updateEditableSegmentConstraint({
                                EnableNestedDeployments:
                                  !currentSegmentConstraint.EnableNestedDeployments,
                              })
                            )
                          }
                        />
                      </Stack>
                    </Stack>
                  </PivotItem>
                )}
            </Pivot>
          )}

          {props.type === 'admin' && (
            <Stack horizontal horizontalAlign='end'>
              <DefaultButton
                className={commonStyles.flexItem}
                text='Cancel'
                allowDisabledFocus
                disabled={
                  (!editableAdminConstraintChanges &&
                    !editableSegmentNameChanges) ||
                  adminConstraintsUpdating
                }
                onClick={() =>
                  dispatch(cancelEditableSegmentConstraintChanges()) &&
                  setEditableSegmentName(currentSegmentName)
                }
              />
              <PrimaryButton
                className={commonStyles.flexItem}
                text='Save'
                allowDisabledFocus
                disabled={
                  (!editableAdminConstraintChanges &&
                    !editableSegmentNameChanges) ||
                  textInvalid ||
                  adminConstraintsUpdating
                }
                onClick={() => {
                  const autoShutdownChangeMessage =
                    autoShutdownConstraintsChanged(
                      adminConstraint,
                      editableAdminConstraint
                    );
                  if (autoShutdownChangeMessage) {
                    dispatch(
                      showUserConfirmationDialog(
                        'Stale Workspace Deletion Warning',
                        autoShutdownChangeMessage,
                        () =>
                          dispatch(
                            updateSegmentConstraint(
                              adminSegment.ID,
                              editableSegmentName,
                              editableAdminConstraint
                            )
                          ).then(() => dispatch(fetchAdminSegments()))
                      )
                    );
                  } else {
                    dispatch(
                      updateSegmentConstraint(
                        adminSegment.ID,
                        editableSegmentName,
                        editableAdminConstraint
                      )
                    ).then(() => dispatch(fetchAdminSegments()));
                  }
                }}
              />
            </Stack>
          )}
        </Stack>
      )}
    </div>
  );
};

export { QuotasInfo as default };

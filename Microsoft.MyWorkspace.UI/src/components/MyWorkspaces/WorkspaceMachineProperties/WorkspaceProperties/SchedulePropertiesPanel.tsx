import * as React from 'react';
import {
  Dropdown,
  Label,
  Spinner,
  SpinnerSize,
  Stack,
  Toggle,
  Text,
  useTheme,
} from '@fluentui/react';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import {
  AMPMDropdownOptions,
  HourDropdownOptions,
  MinuteDropdownOptions,
  timeZones,
} from './SchedulePropertiesPanel.utils';
import {
  convertStringToTimeSpan,
  convertTimeToString,
} from '../../../../shared/DateTimeHelpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  getIsAdminScheduledJobsLoading,
  getAreWorkspaceScheduledJobsLoading,
} from '../../../../store/selectors/scheduleSelectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalScheduledWorkspaceJob,
  getEditableWorkspaceOriginalWorkspace,
  getEditableWorkspaceScheduledWorkspaceJob,
  getEditableWorkspaceScheduledWorkspaceJobError,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek,
  editableWorkspaceChangeWorkspaceScheduledJobStartTime,
  editableWorkspaceChangeWorkspaceScheduledJobStopTime,
  editableWorkspaceChangeWorkspaceScheduledJobTimeZone,
} from '../../../../store/actions/editableWorkspaceActions';
import {
  getCatalogUserProfile,
  getUserRoleAssignmentConstraint,
  getFeatureFlagDisableScheduledStart,
} from '../../../../store/selectors';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { EditsDisabled } from '../../../../shared/helpers/WorkspaceHelper';

export const SchedulePropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const userProfile = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const isAdminWorkspaceScheduledJobLoading = useSelector(
    getIsAdminScheduledJobsLoading
  );
  const areWorkspaceScheduledJobsLoading = useSelector(
    getAreWorkspaceScheduledJobsLoading
  );
  const workspaceScheduledJob = useSelector(
    getEditableWorkspaceScheduledWorkspaceJob
  );
  const originalScheduledJob = useSelector(
    getEditableWorkspaceOriginalScheduledWorkspaceJob
  );
  const scheduledWorkspaceJobError = useSelector(
    getEditableWorkspaceScheduledWorkspaceJobError
  );

  const scheduledDays = workspaceScheduledJob?.ScheduledDays.split(', ') ?? [];
  const autoStartTimeSpan = convertStringToTimeSpan(
    workspaceScheduledJob?.AutoStartTimeOfDay
  );
  const autoStopTimeSpan = convertStringToTimeSpan(
    workspaceScheduledJob?.AutoStopTimeOfDay
  );
  const calloutButtonId = `infoButton-scheduled-stop`;
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);

  const disableScheduledStartFeatureFlag = useSelector(
    getFeatureFlagDisableScheduledStart
  );

  const displayScheduledStart = disableScheduledStartFeatureFlag
    ? segmentConstraint.EnableWorkspaceScheduledStart
    : true;

  return (
    <Stack
      className={styles.propertiesContent}
      tokens={{ childrenGap: 8, padding: 2 }}
    >
      {!isAdminWorkspaceScheduledJobLoading &&
        !areWorkspaceScheduledJobsLoading &&
        !workspaceScheduledJob && (
          <Text
            className={`${commonStyles.errorTextBold} ${commonStyles.marginTop16} ${commonStyles.marginLeft8}`}
          >
            {`An error occurred loading this workspace's schedule. Please try again.`}
          </Text>
        )}
      {isAdminWorkspaceScheduledJobLoading ||
      areWorkspaceScheduledJobsLoading ? (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      ) : (
        workspaceScheduledJob && (
          <>
            <Dropdown
              className={styles.timezoneDropdown}
              label={'Time Zone'}
              options={timeZones.map((tz) => ({ key: tz.ID, text: tz.Name }))}
              selectedKey={workspaceScheduledJob?.TimeZone}
              placeholder='Select Time Zone'
              disabled={EditsDisabled(
                userProfile,
                editableWorkspace,
                originalWorkspace
              )}
              errorMessage={scheduledWorkspaceJobError?.timeZoneError ?? ''}
              onChange={(event, item) => {
                dispatch(
                  editableWorkspaceChangeWorkspaceScheduledJobTimeZone(
                    item.key.toString()
                  )
                );
              }}
            />
            <Dropdown
              className={styles.daysOfWeekDropdown}
              label={'Active Days'}
              multiSelect
              options={[
                { key: 'Monday', text: 'Monday' },
                { key: 'Tuesday', text: 'Tuesday' },
                { key: 'Wednesday', text: 'Wednesday' },
                { key: 'Thursday', text: 'Thursday' },
                { key: 'Friday', text: 'Friday' },
                { key: 'Saturday', text: 'Saturday' },
                { key: 'Sunday', text: 'Sunday' },
              ]}
              selectedKeys={scheduledDays}
              placeholder='No Days Selected'
              disabled={EditsDisabled(
                userProfile,
                editableWorkspace,
                originalWorkspace
              )}
              errorMessage={scheduledWorkspaceJobError?.daysOfWeekError ?? ''}
              onChange={(event, item) => {
                dispatch(
                  editableWorkspaceChangeWorkspaceScheduledJobDaysOfWeek(
                    item.selected
                      ? [...scheduledDays, item.key]
                          .filter((day) => day !== 'None')
                          .join(', ')
                      : scheduledDays
                          .filter((day: string) => day !== item.key)
                          .join(', ') || 'None'
                  )
                );
              }}
            />
            <Stack
              horizontal
              horizontalAlign='space-between'
              style={{ width: 500, height: 62 }}
              tokens={{ childrenGap: 96 }}
            >
              <Stack style={{ width: 135 }}>
                <Label>{'Scheduled Start'}</Label>
                <Toggle
                  ariaLabel='Scheduled Start'
                  onText={'Enabled'}
                  offText={'Disabled'}
                  styles={{
                    root: {
                      marginTop: 'auto !important',
                      marginBottom: 'auto',
                    },
                  }}
                  checked={
                    displayScheduledStart &&
                    !!workspaceScheduledJob?.AutoStartTimeOfDay
                  }
                  disabled={
                    !displayScheduledStart ||
                    EditsDisabled(
                      userProfile,
                      editableWorkspace,
                      originalWorkspace
                    )
                  }
                  onChange={(event, checked) => {
                    dispatch(
                      editableWorkspaceChangeWorkspaceScheduledJobStartTime(
                        checked
                          ? originalScheduledJob.AutoStartTimeOfDay ??
                              '09:00:00'
                          : undefined
                      )
                    );
                  }}
                  data-custom-parentid='Scheduled Start Toggle'
                />
              </Stack>
              {autoStartTimeSpan && displayScheduledStart && (
                <Stack>
                  <Label>{'Scheduled Start Time'}</Label>
                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <Dropdown
                      className={styles.hourDropdown}
                      options={HourDropdownOptions}
                      selectedKey={autoStartTimeSpan.hour}
                      disabled={
                        !displayScheduledStart ||
                        EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )
                      }
                      ariaLabel={'scheduled start time hour'}
                      onChange={(event, option) => {
                        dispatch(
                          editableWorkspaceChangeWorkspaceScheduledJobStartTime(
                            convertTimeToString({
                              ...autoStartTimeSpan,
                              hour: option.key as number,
                            })
                          )
                        );
                      }}
                    />
                    <Dropdown
                      className={styles.minuteDropdown}
                      options={MinuteDropdownOptions}
                      selectedKey={autoStartTimeSpan.minute}
                      disabled={
                        !displayScheduledStart ||
                        EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )
                      }
                      ariaLabel={'scheduled start time minute'}
                      onChange={(event, option) => {
                        dispatch(
                          editableWorkspaceChangeWorkspaceScheduledJobStartTime(
                            convertTimeToString({
                              ...autoStartTimeSpan,
                              minute: option.key as number,
                            })
                          )
                        );
                      }}
                    />
                    <Dropdown
                      className={styles.ampmDropdown}
                      options={AMPMDropdownOptions}
                      selectedKey={autoStartTimeSpan.amPm}
                      disabled={
                        !displayScheduledStart ||
                        EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )
                      }
                      ariaLabel={'scheduled start time AM/PM'}
                      onChange={(event, option) => {
                        dispatch(
                          editableWorkspaceChangeWorkspaceScheduledJobStartTime(
                            convertTimeToString({
                              ...autoStartTimeSpan,
                              amPm: option.key as 'AM' | 'PM',
                            })
                          )
                        );
                      }}
                    />
                  </Stack>
                </Stack>
              )}
            </Stack>

            {!displayScheduledStart && (
              <Text variant={'small'} className={commonStyles.warningText}>
                {'Scheduled Start is not enabled for the segment.'}
              </Text>
            )}

            {displayScheduledStart &&
              segmentConstraint.CancelScheduledStartAfterInactivityInDays >
                0 && (
                <Text variant={'small'} className={commonStyles.warningText}>
                  {`Scheduled Start will be skipped if it has been more than ${
                    segmentConstraint.CancelScheduledStartAfterInactivityInDays
                  } 
                day${
                  segmentConstraint.CancelScheduledStartAfterInactivityInDays >
                  1
                    ? 's'
                    : ''
                } since the last JIT activation on the workspace.`}
                </Text>
              )}

            <Stack
              horizontal
              horizontalAlign='space-between'
              style={{ width: 500, height: 62 }}
              tokens={{ childrenGap: 96 }}
            >
              <Stack style={{ width: 135 }}>
                <Label>
                  <Stack horizontal verticalAlign='center'>
                    <Text>{'Scheduled Stop'}</Text>
                  </Stack>
                </Label>
                <Toggle
                  ariaLabel='Scheduled Stop'
                  onText={'Enabled'}
                  offText={'Disabled'}
                  styles={{
                    root: {
                      marginTop: 'auto !important',
                      marginBottom: 'auto',
                    },
                  }}
                  checked={!!workspaceScheduledJob?.AutoStopTimeOfDay}
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace,
                    originalWorkspace
                  )}
                  onChange={(event, checked) => {
                    dispatch(
                      editableWorkspaceChangeWorkspaceScheduledJobStopTime(
                        checked
                          ? originalScheduledJob.AutoStopTimeOfDay ?? '17:00:00'
                          : undefined
                      )
                    );
                  }}
                  data-custom-parentid='Scheduled Stop Toggle'
                />
              </Stack>
              {autoStopTimeSpan && (
                <Stack>
                  <Stack.Item>
                    <Label>{'Scheduled Stop Time'}</Label>
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                      <Dropdown
                        className={styles.hourDropdown}
                        options={HourDropdownOptions}
                        selectedKey={autoStopTimeSpan.hour}
                        disabled={EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )}
                        ariaLabel={'scheduled stop time hour'}
                        onChange={(event, option) => {
                          dispatch(
                            editableWorkspaceChangeWorkspaceScheduledJobStopTime(
                              convertTimeToString({
                                ...autoStopTimeSpan,
                                hour: option.key as number,
                              })
                            )
                          );
                        }}
                      />
                      <Dropdown
                        className={styles.minuteDropdown}
                        options={MinuteDropdownOptions}
                        selectedKey={autoStopTimeSpan.minute}
                        disabled={EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )}
                        ariaLabel={'scheduled stop time minute'}
                        onChange={(event, option) => {
                          dispatch(
                            editableWorkspaceChangeWorkspaceScheduledJobStopTime(
                              convertTimeToString({
                                ...autoStopTimeSpan,
                                minute: option.key as number,
                              })
                            )
                          );
                        }}
                      />
                      <Dropdown
                        className={styles.ampmDropdown}
                        options={AMPMDropdownOptions}
                        selectedKey={autoStopTimeSpan.amPm}
                        disabled={EditsDisabled(
                          userProfile,
                          editableWorkspace,
                          originalWorkspace
                        )}
                        ariaLabel={'scheduled stop time AM/PM'}
                        onChange={(event, option) => {
                          dispatch(
                            editableWorkspaceChangeWorkspaceScheduledJobStopTime(
                              convertTimeToString({
                                ...autoStopTimeSpan,
                                amPm: option.key as 'AM' | 'PM',
                              })
                            )
                          );
                        }}
                      />
                    </Stack>
                  </Stack.Item>
                </Stack>
              )}
            </Stack>
            {scheduledWorkspaceJobError && (
              <Text
                variant={'small'}
                style={{ color: theme.semanticColors.errorText }}
              >
                {scheduledWorkspaceJobError.timeError}
              </Text>
            )}
            {!workspaceScheduledJob?.AutoStopTimeOfDay &&
              !scheduledWorkspaceJobError.timeError && (
                <Text variant={'small'} className={commonStyles.warningText}>
                  {
                    'Workspaces will still be subject to the maximum runtime quota when shutdown is disabled.'
                  }
                </Text>
              )}
          </>
        )
      )}
    </Stack>
  );
};

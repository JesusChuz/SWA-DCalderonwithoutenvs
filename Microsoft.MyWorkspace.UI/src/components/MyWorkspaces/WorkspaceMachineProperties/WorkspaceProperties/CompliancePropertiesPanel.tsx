import {
  DetailsList,
  IColumn,
  Icon,
  Link,
  MessageBar,
  MessageBarType,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  getWorkspacePatchingSummary,
  getWorkspacePatchingSummaryLoading,
} from '../../../../store/selectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { VMPatchSummary } from '../../../../types/AzureWorkspace/VMPatchSummaryDto.types';
import Shield from '../../../../assets/Shield.svg';
import { CardEmptyState } from '../../../../components/Dashboard/Cards/CardEmptyState';
import { getFormattedDateTime } from '../../../../shared/DateTimeHelpers';
import { DashboardCard } from '../../../../components/GeneralComponents/DashboardCards/DashboardCard';
import { useHistory } from 'react-router';

export const CompliancePropertiesPanel = (): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const workspacePatchingSummary = useSelector(getWorkspacePatchingSummary);
  const workspacePatchingSummaryLoading = useSelector(
    getWorkspacePatchingSummaryLoading
  );

  const pendingPatches = React.useMemo(() => {
    return [...workspacePatchingSummary].sort((a, b) => {
      if (a.CriticalUpdatesMissing > 0 || b.CriticalUpdatesMissing > 0) {
        return a.CriticalUpdatesMissing > b.CriticalUpdatesMissing ? -1 : 1;
      }
      if (a.SecurityUpdatesMissing > 0 || b.SecurityUpdatesMissing > 0) {
        return a.SecurityUpdatesMissing > b.SecurityUpdatesMissing ? -1 : 1;
      }
      if (a.OtherUpdatesMissing > 0 || b.OtherUpdatesMissing > 0) {
        return a.OtherUpdatesMissing > b.OtherUpdatesMissing ? -1 : 1;
      }
      return 0;
    });
  }, [workspacePatchingSummary]);

  const columns: IColumn[] = [
    {
      key: 'vmName',
      name: 'VM Name',
      ariaLabel: 'VM Name',
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: VMPatchSummary) => (
        <Stack
          horizontal
          horizontalAlign='start'
          verticalAlign='center'
          className={commonStyles.fullHeight}
        >
          {item.CriticalUpdatesMissing > 0 && (
            <TooltipHost content={'Critical Updates Missing'}>
              <Icon
                iconName='ShieldAlert'
                aria-label='Critical Updates Missing'
                className={`${commonStyles.severeWarningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          )}
          {item.CriticalUpdatesMissing === 0 &&
            item.SecurityUpdatesMissing > 0 && (
              <TooltipHost content={'Security Updates Missing'}>
                <Icon
                  iconName='Shield'
                  aria-label='Security Updates Missing'
                  className={`${commonStyles.warningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
                />
              </TooltipHost>
            )}
          {item.CriticalUpdatesMissing === 0 &&
            item.SecurityUpdatesMissing === 0 && (
              <div className={`${commonStyles.padRight20}`}></div>
            )}
          <Text
            variant='small'
            nowrap
            className={commonStyles.textOverflowEllipsis}
          >
            <Link
              className={commonStyles.fullWidth}
              onClick={() => {
                if (item.WorkspaceId && item.VirtualMachineId) {
                  history.push(
                    `/${item.WorkspaceId}/${item.VirtualMachineId}?tab=compliance`
                  );
                }
              }}
            >
              {item.VirtualMachineName}
            </Link>
          </Text>
        </Stack>
      ),
    },
    {
      key: 'criticalUpdates',
      name: 'Critical Updates',
      ariaLabel: 'Critical Updates',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: VMPatchSummary) => {
        return <Text>{item.CriticalUpdatesMissing}</Text>;
      },
    },
    {
      key: 'securityUpdates',
      name: 'Security Updates',
      ariaLabel: 'Security Updates',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: VMPatchSummary) => {
        return <Text>{item.SecurityUpdatesMissing}</Text>;
      },
    },
    {
      key: 'otherUpdates',
      name: 'Other Updates',
      ariaLabel: 'Other Updates',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: VMPatchSummary) => {
        return <Text>{item.OtherUpdatesMissing}</Text>;
      },
    },
    {
      key: 'timeGenerated',
      name: 'Time Generated',
      ariaLabel: 'Time Generated',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: VMPatchSummary) => {
        return (
          <Text>
            {item.TimeGenerated ? getFormattedDateTime(item.TimeGenerated) : ''}
          </Text>
        );
      },
    },
  ];

  function calculateSum(array: any[], property: string) {
    const total = array.reduce((accumulator, object) => {
      return accumulator + object[property];
    }, 0);
    return total;
  }

  const renderMessageBar = () => {
    return workspacePatchingSummary.length > 0 ? (
      <MessageBar messageBarType={MessageBarType.info}>
        {
          'Patches must be performed manually. Navigate to the VM compliance tab for more specific information.'
        }
      </MessageBar>
    ) : (
      <></>
    );
  };

  const renderMachineComplianceCards = () => {
    const totalCriticalUpdates = calculateSum(
      workspacePatchingSummary,
      'CriticalUpdatesMissing'
    );
    const totalSecurityUpdates = calculateSum(
      workspacePatchingSummary,
      'SecurityUpdatesMissing'
    );
    const totalOtherUpdates = calculateSum(
      workspacePatchingSummary,
      'OtherUpdatesMissing'
    );
    return workspacePatchingSummary.length > 0 ? (
      <Stack
        horizontal
        tokens={{ childrenGap: 16 }}
        className={`${commonStyles.paddingTopBottom16} ${commonStyles.paddingLeft2}`}
      >
        <DashboardCard
          title='Critical Updates'
          className={commonStyles.boldText}
          size='sm'
        >
          <Text
            className={`${commonStyles.font60} ${commonStyles.severeWarningColor}`}
          >
            {totalCriticalUpdates}
          </Text>
        </DashboardCard>
        <DashboardCard
          title='Security Updates'
          className={commonStyles.boldText}
          size='sm'
        >
          <Text
            className={`${commonStyles.font60} ${commonStyles.warningColor}`}
          >
            {totalSecurityUpdates}
          </Text>
        </DashboardCard>
        <DashboardCard
          title='Other Updates'
          className={commonStyles.boldText}
          size='sm'
        >
          <Text className={commonStyles.font60}>{totalOtherUpdates}</Text>
        </DashboardCard>
      </Stack>
    ) : (
      <></>
    );
  };

  const renderMachineComplianceList = () => {
    return workspacePatchingSummary.length > 0 ? (
      <DetailsList
        styles={{
          focusZone: {
            styles: { paddingTop: 0 },
          },
        }}
        compact
        items={pendingPatches}
        columns={columns}
        selectionMode={SelectionMode.none}
      />
    ) : (
      <Stack
        horizontal
        horizontalAlign={'center'}
        verticalAlign={'center'}
        className={styles.paddingTop30}
      >
        <Stack.Item>
          <CardEmptyState
            imgSrc={Shield}
            headerText='Your workspace is up to date!'
            descriptionText='None of your machines require patching at this time.'
          />
        </Stack.Item>
      </Stack>
    );
  };

  if (workspacePatchingSummaryLoading) {
    return (
      <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
    );
  } else {
    return (
      <Stack
        className={`${styles.propertiesContent} ${commonStyles.overflowYAuto}`}
      >
        <Stack style={{ maxWidth: 1200, width: '100%' }}>
          {renderMessageBar()}
          {renderMachineComplianceCards()}
          {renderMachineComplianceList()}
        </Stack>
      </Stack>
    );
  }
};

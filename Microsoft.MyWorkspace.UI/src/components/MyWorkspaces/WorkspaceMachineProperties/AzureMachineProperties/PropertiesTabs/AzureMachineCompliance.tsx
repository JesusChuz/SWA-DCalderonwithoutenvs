import {
  DetailsList,
  IColumn,
  Icon,
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
  getWorkspacePatchingDetails,
  getWorkspacePatchingDetailsLoading,
} from '../../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { VMPatchDetails } from '../../../../../types/AzureWorkspace/VMPatchDetailsDto.types';
import Shield from '../../../../../assets/Shield.svg';
import { CardEmptyState } from '../../../../../components/Dashboard/Cards/CardEmptyState';
import { getFormattedDateTime } from '../../../../../shared/DateTimeHelpers';

interface IProps {
  machineIndex: number;
}

export const AzureMachineCompliance = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const workspacePatchingDetails = useSelector(getWorkspacePatchingDetails);
  const workspacePatchingDetailsLoading = useSelector(
    getWorkspacePatchingDetailsLoading
  );
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);

  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;

  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const machine = machines[props.machineIndex];
  const vmPatchingDetails = React.useMemo(() => {
    return workspacePatchingDetails
      .filter((vm) => vm.VirtualMachineId === machine.ID)
      .sort((a, b) => {
        const aCategory = getClassificationCategory(a.Classification);
        const bCategory = getClassificationCategory(b.Classification);

        const map = new Map<string, number>();
        map.set('Critical', 0);
        map.set('Security', 1);
        map.set('Other', 2);

        if (map.get(aCategory) < map.get(bCategory)) {
          return -1;
        }
        if (map.get(aCategory) > map.get(bCategory)) {
          return 1;
        }
        return 0;
      });
  }, [props.machineIndex, workspacePatchingDetails]);

  function getClassificationCategory(classification: string) {
    if (classification && classification.toLowerCase().includes('critical')) {
      return 'Critical';
    } else if (
      classification &&
      classification.toLowerCase().includes('security')
    ) {
      return 'Security';
    }
    return 'Other';
  }

  const columns: IColumn[] = [
    {
      key: 'updateName',
      name: 'Update Name',
      ariaLabel: 'Update Name',
      minWidth: 400,
      maxWidth: 500,
      isResizable: true,
      onRender: (item: VMPatchDetails) => {
        return (
          <TooltipHost content={item.Title}>
            <Text>{item.Title}</Text>
          </TooltipHost>
        );
      },
    },
    {
      key: 'classification',
      name: 'Classification',
      ariaLabel: 'Classification',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: VMPatchDetails) => (
        <Stack
          horizontal
          horizontalAlign='start'
          verticalAlign='center'
          className={commonStyles.fullHeight}
        >
          {getClassificationCategory(item.Classification) === 'Critical' && (
            <TooltipHost content={'Critical Update'}>
              <Icon
                iconName='ShieldAlert'
                aria-label='Critical Update'
                className={`${commonStyles.severeWarningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          )}
          {getClassificationCategory(item.Classification) === 'Security' && (
            <TooltipHost content={'Security Update'}>
              <Icon
                iconName='Shield'
                aria-label='Security Update'
                className={`${commonStyles.warningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          )}
          <TooltipHost content={item.Classification}>
            <Text>{item.Classification}</Text>
          </TooltipHost>
        </Stack>
      ),
    },
    {
      key: 'timeGenerated',
      name: 'Time Generated',
      ariaLabel: 'Time Generated',
      minWidth: 140,
      maxWidth: 140,
      onRender: (item: VMPatchDetails) => {
        return (
          <Text>
            {item.TimeGenerated ? getFormattedDateTime(item.TimeGenerated) : ''}
          </Text>
        );
      },
    },
  ];

  const renderMessageBar = () => {
    return vmPatchingDetails.length > 0 ? (
      <MessageBar messageBarType={MessageBarType.info}>
        {
          'Most items can be resolved by checking for updates on your machine and installing them. This list is updated once per day.'
        }
      </MessageBar>
    ) : (
      <></>
    );
  };

  const renderMachineComplianceList = () => {
    return vmPatchingDetails.length > 0 ? (
      <DetailsList
        styles={{
          focusZone: {
            styles: { paddingTop: 0 },
          },
        }}
        compact
        items={vmPatchingDetails}
        columns={columns}
        selectionMode={SelectionMode.none}
      />
    ) : (
      <Stack
        horizontal
        horizontalAlign={'center'}
        verticalAlign={'center'}
        className={commonStyles.paddingTop20}
      >
        <Stack.Item>
          <CardEmptyState
            imgSrc={Shield}
            headerText='Your machine is up to date!'
            descriptionText='No patching is required at this time.'
          />
        </Stack.Item>
      </Stack>
    );
  };

  if (workspacePatchingDetailsLoading) {
    return (
      <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
    );
  } else {
    return (
      <Stack className={`${commonStyles.overflowYAuto}`}>
        <Stack style={{ maxWidth: 1200, width: '100%' }}>
          {renderMessageBar()}
          {renderMachineComplianceList()}
        </Stack>
      </Stack>
    );
  }
};

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Stack,
  ITextFieldStyles,
  Text,
  Spinner,
  SpinnerSize,
  SearchBox,
  FocusTrapZone,
  DefaultButton,
  Toggle,
  Panel,
  PanelType,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { InfoButton } from '../../../GeneralComponents/InfoButton';
import { styles } from '../../Steps/Template/ChooseTemplate.styles';
import { VirtualMachineCustomDto } from '../../../../types/Catalog/VirtualMachineCustomDto.types';
import {
  getCatalogMachines,
  getCatalogMachineSkusLoading,
  getCatalogMachinesLoadingStatus,
} from '../../../../store/selectors/catalogSelectors';
import {
  getFeatureFlagAzureCustom,
  getFeatureFlagNestedVirtualization,
} from '../../../../store/selectors/configSelectors';
import { ErrorPage } from '../../../Pages/ErrorPage';
import {
  getEditableWorkspaceEditType,
  getEditableWorkspaceIsNestedVirtualizationEnabled,
  getEditableWorkspaceMachineSelection,
  getEditableWorkspaceVirtualMachines,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceAddMachine,
  editableWorkspaceBuildMachines,
  editableWorkspaceResetConfiguredMachineSelection,
  editableWorkspaceResetMachineSelection,
  editableWorkspaceSetNestedVirtualization,
} from '../../../../store/actions/editableWorkspaceActions';
import { filterList } from './ChooseMachines.utils';
import { AzureVirtualMachineDto } from '../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from '../../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import {
  CoherenceDataGrid,
  CoherenceDataGridColumn,
} from '@coherence-design-system/controls/lib/DataGrid';
import { WorkspaceEditType } from '../../../../types/enums/WorkspaceEditType';
import { OSVersion } from '../../../../types/enums/OSVersion';
import { showUserConfirmationDialog } from '../../../../store/actions';
import { getUserRoleAssignmentConstraint } from '../../../../store/selectors';
import clsx from 'clsx';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { SelectedMachineColumn } from './SelectedMachineColumn';
import { OSIcon } from 'src/components/GeneralComponents/OSIcon';

export const ChooseMachines = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const machines = useSelector(getCatalogMachines);
  const selectedMachines = useSelector(getEditableWorkspaceMachineSelection);
  const virtualMachines: (
    | AzureVirtualMachineDto
    | AzureVirtualMachineForCreationDto
  )[] = useSelector(getEditableWorkspaceVirtualMachines);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const machinesLoading = useSelector(getCatalogMachinesLoadingStatus);
  const machineSkusLoading = useSelector(getCatalogMachineSkusLoading);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const featureFlagAzureCustom = useSelector(getFeatureFlagAzureCustom);
  const featureFlagNestedVirtualization = useSelector(
    getFeatureFlagNestedVirtualization
  );
  const isNestedVirtualizationEnabled = useSelector(
    getEditableWorkspaceIsNestedVirtualizationEnabled
  );

  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = React.useState<string>('');
  const [disableTrapZone, setDisableTrapZone] = React.useState(false);
  const [selectedMachinePanelOpen, setSelectedMachinePanelOpen] =
    React.useState(false);
  const isMediumScreenWidth = useMediaQuery('(max-width: 800px)');
  const buttonId = `infoButton-nested-virtualization`;

  const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 450 },
  };

  React.useEffect(() => {
    if (!isMediumScreenWidth) {
      setSelectedMachinePanelOpen(false);
    }
  }, [isMediumScreenWidth]);

  const columns: CoherenceDataGridColumn<VirtualMachineCustomDto>[] = [
    {
      key: 'Name',
      name: 'Machine Name',
      fieldName: 'Name',
      type: 'string',
      minColumnWidth: 100,
      isResizable: true,
      onRender: (item) => {
        return (
          <DefaultButton
            className={`${styles.itemCell} ${commonStyles.fullWidth} ${commonStyles.fullHeight}`}
            ariaLabel={`${item.Name} select button`}
            data-testid={`machine-select-button-${item.Name}`}
            styles={{
              flexContainer: {
                width: '100%',
                justifyContent: 'start',
              },
            }}
            role='button'
            onClick={() => dispatch(editableWorkspaceAddMachine(item))}
          >
            <OSIcon osVersion={item.OSVersion} />
            <Text>{item.Name} </Text>
          </DefaultButton>
        );
      },
    },
  ];

  const buildMachineOfferingList = () => {
    if (machinesLoading || machineSkusLoading) {
      return (
        <Stack
          horizontal
          horizontalAlign='center'
          tokens={{ padding: '40px 8px' }}
        >
          <Spinner
            size={SpinnerSize.large}
            className={commonStyles.loading}
            style={{ marginTop: 0 }}
          />
        </Stack>
      );
    }
    let filteredList = filterList(machines, filterValue);
    if (isNestedVirtualizationEnabled) {
      filteredList = filteredList.filter(
        (machine) =>
          machine.OSVersion !== OSVersion.Linux &&
          machine.CanSupportVirtualization
      );
    }
    if (filteredList.length > 0) {
      return (
        <Stack className={commonStyles.fullWidth}>
          <CoherenceDataGrid
            rowStyles={{ cell: { padding: 0, minHeight: 48 } }}
            listConfig={columns}
            data={filteredList}
            isSortable={true}
            isScrollable={false}
            onItemInvoked={onItemInvoked}
          />
        </Stack>
      );
    } else {
      return (
        <Stack tokens={{ padding: '40px 8px' }}>
          <Text variant='large'>No Machines Found</Text>
        </Stack>
      );
    }
  };

  const onItemInvoked = (
    item: VirtualMachineCustomDto,
    index: number,
    ev: Event
  ): void => {
    if (ev.type !== 'dblclick') {
      dispatch(editableWorkspaceAddMachine(item));
    }
  };

  React.useEffect(() => {
    setDisableTrapZone(true);
    return () => {
      dispatch(editableWorkspaceBuildMachines());
    };
  }, []);

  const machineOfferingList = buildMachineOfferingList();
  return (
    <div
      className={`${commonStyles.fullHeight} ${styles.wrapper}`}
      data-custom-parent-group='group1'
      data-custom-parentid={`${workspaceEditType} Workspace - Choose Machines`}
    >
      {featureFlagAzureCustom && (
        <>
          <Stack
            horizontal
            className={`${styles.offeringListColumn} ${styles.wrap} ${commonStyles.fullHeight}`}
          >
            <Stack
              className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText} ${commonStyles.fullHeight}`}
              style={{ marginBottom: '8px' }}
            >
              <FocusTrapZone
                className={commonStyles.fullHeight}
                style={{ display: 'flex', flexDirection: 'column' }}
                isClickableOutsideFocusTrap={true}
                forceFocusInsideTrap={false}
                disabled={disableTrapZone}
              >
                <Stack
                  horizontal
                  verticalAlign='center'
                  horizontalAlign='space-between'
                  className={commonStyles.fullWidth}
                >
                  <h3>Choose Machines</h3>
                  {isMediumScreenWidth && (
                    <DefaultButton
                      text={`View Selected Machines (${
                        virtualMachines.length +
                        selectedMachines.reduce((prev, curr) => {
                          return prev + curr.count;
                        }, 0)
                      })`}
                      onClick={() => setSelectedMachinePanelOpen(true)}
                    />
                  )}
                </Stack>
                <Stack
                  horizontal
                  tokens={{ childrenGap: 24 }}
                  className={`${commonStyles.fullWidth}`}
                  verticalAlign={'center'}
                  horizontalAlign={'space-between'}
                  wrap
                >
                  <Stack.Item grow={1} style={{ maxWidth: 500 }}>
                    <SearchBox
                      onChange={(event, newValue) =>
                        setFilterValue(newValue.toLowerCase())
                      }
                      onClear={() => setFilterValue('')}
                      className={`${commonStyles.fullWidth} ${commonStyles.textFieldSpacing}`}
                      placeholder='Filter By Name'
                      value={filterValue}
                      styles={narrowTextFieldStyles}
                      iconProps={{ iconName: 'Filter' }}
                    />
                  </Stack.Item>
                  {workspaceEditType === WorkspaceEditType.NewCustomWorkspace &&
                    constraint.EnableNestedDeployments &&
                    featureFlagNestedVirtualization && (
                      <Stack.Item grow={0}>
                        <Stack horizontal>
                          <Toggle
                            label={'Nested Virtualization'}
                            inlineLabel
                            styles={{ label: { wordBreak: 'keep-all' } }}
                            checked={isNestedVirtualizationEnabled}
                            onChange={(ev, checked) => {
                              if (
                                selectedMachines.length !== 0 ||
                                virtualMachines.length !== 0
                              ) {
                                dispatch(
                                  showUserConfirmationDialog(
                                    'Warning',
                                    'This action will remove all current selected machines.',
                                    () => {
                                      dispatch(
                                        editableWorkspaceResetMachineSelection()
                                      );
                                      dispatch(
                                        editableWorkspaceResetConfiguredMachineSelection()
                                      );
                                      dispatch(
                                        editableWorkspaceSetNestedVirtualization(
                                          checked
                                        )
                                      );
                                    }
                                  )
                                );
                              } else {
                                dispatch(
                                  editableWorkspaceSetNestedVirtualization(
                                    checked
                                  )
                                );
                              }
                            }}
                          />
                          <InfoButton
                            buttonId={buttonId}
                            calloutTitle='Nested Virtualization'
                            calloutBody='Upon enabling nested virtualization, your workspace will be restricted to one VM that is hypervisor-enabled for OS and Console dependent scenarios.'
                          />
                        </Stack>
                      </Stack.Item>
                    )}
                </Stack>
                <Stack
                  className={clsx(
                    commonStyles.fullWidth,
                    commonStyles.overflowYAuto,
                    commonStyles.minHeight100
                  )}
                >
                  <div className={styles.container} data-is-scrollable>
                    {machineOfferingList}
                  </div>
                </Stack>
              </FocusTrapZone>
            </Stack>
          </Stack>
          {isMediumScreenWidth ? (
            <Panel
              isLightDismiss
              isOpen={selectedMachinePanelOpen}
              type={PanelType.medium}
              onDismiss={() => setSelectedMachinePanelOpen(false)}
              closeButtonAriaLabel='close modal'
              title='Selected Machines'
            >
              <SelectedMachineColumn />
            </Panel>
          ) : (
            <Stack
              horizontal
              className={clsx(
                styles.offeringSelectionColumn,
                styles.wrap,
                commonStyles.fullHeight,
                commonStyles.overflowYAuto,
                styles.horizontalPadding
              )}
            >
              <SelectedMachineColumn />
            </Stack>
          )}
        </>
      )}
      {!featureFlagAzureCustom && (
        <ErrorPage
          title='Custom Deployment'
          message='This feature is currently disabled.'
          showButton={true}
          buttonMessage='Go to Workspaces'
        />
      )}
    </div>
  );
};

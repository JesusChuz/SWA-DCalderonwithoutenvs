import * as React from 'react';
import {
  ShimmeredDetailsList,
  IColumn,
  Link,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Selection,
  CommandButton,
  Text,
  FontIcon,
  IObjectWithKey,
  ISelection,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  ContextualMenu,
  CheckboxVisibility,
  DetailsRow,
  IDetailsRowStyles,
  IDetailsRowProps,
  useTheme,
} from '@fluentui/react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { AzureWorkspaceInsightsDto } from '../../../../types/AzureWorkspace/AzureWorkspaceInsightsDto.types';
import { WorkspacesForDeletionDto } from '../../../../types/AzureWorkspace/WorkspacesForDeletionDto.types';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  ResourceStateDotIcon,
  getResourceStateText,
} from '../../../MyWorkspaces/WorkspaceStatusIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSelectedAdminSegment,
  getSelectedWorkspaceInsights,
  getWorkspaceInsights,
  getWorkspaceInsightsSummary,
  getStaleWorkspaceAutoDeleteTotal,
  getWorkspaceInsightsContinuationToken,
  getWorkspaceInsightsLoading,
  getWorkspaceInsightsSortProperty,
  getWorkspaceInsightsFilterProperties,
  getFeatureFlagBulkDeleteWorkspaceInsights,
  getCatalogUserProfile,
  getFeatureFlagStaleWorkspaceDeletion,
  getSelectedAdminSegmentConstraint,
  getFeatureFlagCsvDownloadButton,
  getWorkspaceInsightsNextLink,
  getFeatureFlagOData,
} from '../../../../store/selectors';
import {
  fetchWorkspaceInsightsSummary,
  fetchStaleWorkspaceAutoDeleteTotal,
  fetchWorkspaceInsights,
  appendWorkspaceInsights,
  setWorkspaceInsightFilterProperties,
  setWorkspaceInsightSortProperty,
  setSelectedWorkspaceInsights,
  bulkDeleteAzureWorkspaces,
} from '../../../../store/actions';
import { DonutChartCard } from '../../../GeneralComponents/DashboardCards/DonutChartCard';
import { IChartDataPoint, IChartProps } from '@fluentui/react-charting';
import { ResourceState } from '../../../../types/AzureWorkspace/enums/ResourceState';
import { DetailsListFilter } from '../../../GeneralComponents/DetailsListFilter';
import { RefreshButton } from '../../../GeneralComponents/RefreshButton';
import { getAdminViewStyles } from '../../AdministrationViews.styles';
import { DashboardCard } from '../../../GeneralComponents/DashboardCards/DashboardCard';
import { SegmentConstraintDto } from '../../../../types/AuthService/SegmentConstraintDto.types';
import { downloadJsonAsCSV } from '../../../../shared/utilities/DownloadUtil';
import dayjs from 'dayjs';
import { FilterOperator } from 'src/types/enums/FilterOperator';

export const TenantSegmentAdminWorkspaceActivity = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAdminViewStyles(theme);
  const workspaceInsights = useSelector(getWorkspaceInsights);
  const AzureWorkspaceInsightsSummary = useSelector(
    getWorkspaceInsightsSummary
  );
  const odataFeatureFlag = useSelector(getFeatureFlagOData);
  const StaleWorkspaceAutodeleteTotal = useSelector(
    getStaleWorkspaceAutoDeleteTotal
  );
  const workspaceInsightsLoading = useSelector(getWorkspaceInsightsLoading);
  const workspaceInsightsContinuationToken = useSelector(
    getWorkspaceInsightsContinuationToken
  );
  const workspaceInsightsNextLink = useSelector(getWorkspaceInsightsNextLink);
  const workspaceInsightsSortProperty = useSelector(
    getWorkspaceInsightsSortProperty
  );
  const staleWorkspaceDeletionFeatureFlag = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );
  const adminConstraint: SegmentConstraintDto = useSelector(
    getSelectedAdminSegmentConstraint
  );
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const filters = useSelector(getWorkspaceInsightsFilterProperties);
  const selectedWorkspaceInsights = useSelector(getSelectedWorkspaceInsights);
  const maximumRowsForSelection = 200;
  const user = useSelector(getCatalogUserProfile);
  const bulkDeleteWorkspaceInsightsFeatureFlag = useSelector(
    getFeatureFlagBulkDeleteWorkspaceInsights
  );
  const downloadCsvButtonEnabled = useSelector(getFeatureFlagCsvDownloadButton);
  const showCards = true;
  const _onColumnClick = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    column: IColumn
  ) => {
    const sortName = column.key as keyof AzureWorkspaceInsightsDto;
    dispatch(setWorkspaceInsightSortProperty(sortName));
  };

  const getWorkspaceDeletionStatus = (
    workspaceInsight: AzureWorkspaceInsightsDto
  ) => {
    if (workspaceInsight.WorkspaceDeletionStatus === ResourceState.Deleting) {
      return 'Marked For Deletion';
    }
    if (workspaceInsight.WorkspaceDeletionStatus === ResourceState.Failed) {
      return 'Deletion Failed';
    }
    return '';
  };

  const columns: IColumn[] = [
    {
      key: 'OwnerEmail',
      name: 'Workspace Owner',
      isResizable: true,
      isSorted: workspaceInsightsSortProperty.Name === 'OwnerEmail',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 140,
      maxWidth: 180,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        return (
          <Text
            style={
              workspaceInsight.OwnerEmail == null
                ? { fontStyle: 'italic' }
                : undefined
            }
            variant='small'
          >{`${workspaceInsight.OwnerEmail ?? 'Owner Not Found'}`}</Text>
        );
      },
    },
    {
      key: 'WorkspaceID',
      name: 'Workspace ID',
      isResizable: true,
      minWidth: 215,
      maxWidth: 250,
      fieldName: 'WorkspaceID',
    },
    {
      key: 'WorkspaceName',
      name: 'Workspace Name',
      isResizable: true,
      isSorted: workspaceInsightsSortProperty.Name === 'WorkspaceName',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 175,
      maxWidth: 300,
      fieldName: 'WorkspaceName',
    },
    {
      key: 'WorkspaceAge',
      name: 'Workspace Age (Days)',
      isResizable: true,
      onColumnClick: _onColumnClick,
      isSorted: workspaceInsightsSortProperty.Name === 'WorkspaceAge',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 160,
      maxWidth: 160,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        const workspaceAge = workspaceInsight.WorkspaceAge ?? 0;
        return (
          <Text variant='small'>{`${
            workspaceAge > 90 ? '> 90' : workspaceAge
          }`}</Text>
        );
      },
    },
    {
      key: 'LastJitActivationAge',
      name: 'Last Active (Days)',
      isResizable: true,
      onColumnClick: _onColumnClick,
      isSorted: workspaceInsightsSortProperty.Name === 'LastJitActivationAge',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 130,
      maxWidth: 130,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        const lastActivation = workspaceInsight.LastJitActivationAge ?? 0;
        return (
          <Text variant='small'>{`${
            lastActivation > 90 ? '> 90' : lastActivation
          }`}</Text>
        );
      },
    },
    {
      key: 'State',
      name: 'Workspace Status',
      isResizable: true,
      isSorted: workspaceInsightsSortProperty.Name === 'State',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 125,
      maxWidth: 125,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        return (
          <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 4 }}>
            <ResourceStateDotIcon resourceState={workspaceInsight.State} />
            <Text variant='small'>
              {getResourceStateText(workspaceInsight.State)}
            </Text>
          </Stack>
        );
      },
    },
    {
      key: 'WorkspaceDeleteLockEnabled',
      name: 'Delete Lock',
      isResizable: true,
      isSorted:
        workspaceInsightsSortProperty.Name === 'WorkspaceDeleteLockEnabled',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 125,
      maxWidth: 125,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        return workspaceInsight.WorkspaceDeleteLockEnabled ? (
          <FontIcon iconName='Lock' aria-label='Delete Lock Enabled' />
        ) : (
          <></>
        );
      },
    },
    {
      key: 'WorkspaceDeletionStatus',
      name: 'Deletion Status',
      isResizable: true,
      isSorted:
        workspaceInsightsSortProperty.Name === 'WorkspaceDeletionStatus',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 125,
      maxWidth: 125,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        return (
          <Text variant='small'>
            {getWorkspaceDeletionStatus(workspaceInsight)}
          </Text>
        );
      },
    },
    {
      key: 'WorkspaceOwnerExists',
      name: 'Orphaned',
      isResizable: true,
      isSorted: workspaceInsightsSortProperty.Name === 'WorkspaceOwnerExists',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 125,
      maxWidth: 125,
      onRender: (workspaceInsight: AzureWorkspaceInsightsDto) => {
        return !workspaceInsight.WorkspaceOwnerExists ? (
          <Text variant='small'>Yes</Text>
        ) : (
          <></>
        );
      },
    },
    {
      key: 'DeploymentRegion',
      name: 'Region',
      isResizable: true,
      isSorted: workspaceInsightsSortProperty.Name === 'DeploymentRegion',
      isSortedDescending: workspaceInsightsSortProperty.IsDescending,
      minWidth: 110,
      maxWidth: 125,
      fieldName: 'DeploymentRegion',
    },
  ];

  const workspaceInsightSelection = new Selection<AzureWorkspaceInsightsDto>({
    getKey: (item) => item.WorkspaceID,
    onSelectionChanged: () => {
      dispatch(
        setSelectedWorkspaceInsights(workspaceInsightSelection.getSelection())
      );
    },
  });

  const itemToKey = (item: AzureWorkspaceInsightsDto) => {
    return item?.WorkspaceID;
  };

  const dynamicData: IChartDataPoint[] = [
    {
      legend: '<30 days',
      data:
        AzureWorkspaceInsightsSummary === null
          ? 0
          : Number(AzureWorkspaceInsightsSummary.LessThanThirty),
      color: '#138808',
    },
    {
      legend: '30>60 days',
      data:
        AzureWorkspaceInsightsSummary === null
          ? 0
          : Number(
              AzureWorkspaceInsightsSummary.GreaterThanThirtyLessThanSixty
            ),
      color: '#f0c22b',
    },
    {
      legend: '60>90 days',
      data:
        AzureWorkspaceInsightsSummary === null
          ? 0
          : Number(
              AzureWorkspaceInsightsSummary.GreaterThanSixtyLessThanNinety
            ),
      color: '#f29f48',
    },
    {
      legend: '>90 days',
      data:
        AzureWorkspaceInsightsSummary === null
          ? 0
          : Number(AzureWorkspaceInsightsSummary.GreaterThanNinety),
      color: '#cc0000',
    },
  ];
  const data: IChartProps = {
    chartData: dynamicData,
  };

  const dialogStyles = { main: { maxWidth: 450 } };
  const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    keepInBounds: true,
  };
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [isDraggable] = useBoolean(false);
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');

  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: isDraggable ? dragOptions : undefined,
    }),
    [isDraggable, labelId, subTextId]
  );

  const variableText =
    selectedWorkspaceInsights.length === 1
      ? 'this workspace?'
      : selectedWorkspaceInsights.length + ' workspaces?';
  const normalTitle = `Are you sure you want to delete ${variableText}`;
  const errorTitle = `Maximum number of records for bulk deletion exceeded.`;
  const normalSubtext = 'This action cannot be undone.';
  const errorSubtext = 'Maximum Allowed: ' + maximumRowsForSelection;

  const selectedMoreThanMaximum = () => {
    return selectedWorkspaceInsights.length > maximumRowsForSelection;
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: `${selectedMoreThanMaximum() ? errorTitle : normalTitle}`,
    closeButtonAriaLabel: 'Close',
    subText: `${selectedMoreThanMaximum() ? errorSubtext : normalSubtext}`,
  };

  const confirmDeletion = async () => {
    const lightWorkspaceInsights = selectedWorkspaceInsights.map(
      (workspaceInsight) => ({
        WorkspaceId: workspaceInsight.WorkspaceID,
        SegmentId: workspaceInsight.SegmentId,
      })
    );

    const workspacesForDeletionDto = {
      LightWorkspaceInsights: lightWorkspaceInsights,
      RequestUserEmail: user.Mail,
    } as WorkspacesForDeletionDto;
    toggleHideDialog();
    await bulkDeleteAzureWorkspaces(workspacesForDeletionDto)(dispatch);
    dispatch(fetchWorkspaceInsightsSummary(selectedSegment.ID));
    dispatch(fetchStaleWorkspaceAutoDeleteTotal(selectedSegment.ID));
    dispatch(fetchWorkspaceInsights([selectedSegment.ID], filters));
  };

  const onRenderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = { userSelect: 'auto', cursor: 'auto' };
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const exportAndDownloadCsv = (
    selectedWorkspaceInsights: AzureWorkspaceInsightsDto[]
  ) => {
    const convertedJson = selectedWorkspaceInsights.map((insight) => ({
      'Workspace Owner': insight.OwnerEmail,
      'Workspace ID': insight.WorkspaceID,
      'Workspace Name': insight.WorkspaceName,
      'Workspace Age (Days)': insight.WorkspaceAge,
      'Last Active (Days)': insight.LastJitActivationAge,
      'Workspace Status': getResourceStateText(insight.State),
      // 'Lifetime Cost': formatInUsDollars(insight.CurrentAzureCost),
      // 'Average Cost per Day': formatInUsDollars(insight.DailyCost),
      'Delete Lock': insight.WorkspaceDeleteLockEnabled ? 'TRUE' : 'FALSE',
      'Deletion Status': getWorkspaceDeletionStatus(insight),
      Orphaned: insight.WorkspaceOwnerExists ? 'FALSE' : 'TRUE',
      Region: insight.DeploymentRegion,
    }));
    downloadJsonAsCSV(
      dispatch,
      convertedJson,
      `${selectedSegment.Name}-WorkspaceActivity-${dayjs().format(
        'YYMMDD'
      )}.csv`,
      [
        'Workspace Owner',
        'Workspace ID',
        'Workspace Name',
        'Workspace Age (Days)',
        'Last Active (Days)',
        'Workspace Status',
        // 'Lifetime Cost',
        // 'Average Cost per Day',
        'Delete Lock',
        'Deletion Status',
        'Orphaned',
        'Region',
      ]
    );
  };

  return (
    <Stack className={`${commonStyles.fullHeight}`} tokens={{ childrenGap: 8 }}>
      {showCards && (
        <Stack horizontal gap={16}>
          <DonutChartCard
            data={data}
            dashboardCardProps={{
              title: 'Workspace Inactivity',
              size: 'med',
              styles: { width: '400px' },
              collapsible: true,
              collapsedByDefault: true,
            }}
          />
          {staleWorkspaceDeletionFeatureFlag &&
            adminConstraint.EnableAutoStaleWorkspaceDeletion && (
              <DashboardCard
                title='Auto Deletion'
                className={commonStyles.boldText}
                size='sm'
                collapsible={true}
                collapsedByDefault={true}
              >
                <Text className={commonStyles.font45}>
                  {StaleWorkspaceAutodeleteTotal == null
                    ? '0'
                    : StaleWorkspaceAutodeleteTotal}

                  <FontIcon
                    aria-label='Delete icon'
                    iconName='Delete'
                    className={commonStyles.colorRedText28}
                  />
                </Text>
                <Text>Workspaces</Text>
              </DashboardCard>
            )}
        </Stack>
      )}
      <Stack
        horizontal
        verticalAlign='center'
        horizontalAlign='space-between'
        className={`${styles.stickyNavBar}`}
      >
        <Stack.Item>
          {bulkDeleteWorkspaceInsightsFeatureFlag && (
            <CommandButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => toggleHideDialog()}
              disabled={selectedWorkspaceInsights.length === 0}
            >
              Delete Selected ({selectedWorkspaceInsights.length}/
              {workspaceInsights.length})
            </CommandButton>
          )}
          {downloadCsvButtonEnabled && (
            <CommandButton
              iconProps={{ iconName: 'Download' }}
              data-custom-parentid='Tenant Segment Admin Workspace Activity - Export to CSV'
              disabled={
                workspaceInsightsLoading ||
                !workspaceInsights ||
                workspaceInsights.length === 0 ||
                !selectedSegment
              }
              menuProps={{
                items: [
                  {
                    key: 'exportSelectedWorkspaces',
                    text: 'Export Selected Workspaces',
                    disabled:
                      !selectedWorkspaceInsights ||
                      selectedWorkspaceInsights.length === 0,
                    onClick: () =>
                      exportAndDownloadCsv(selectedWorkspaceInsights),
                  },
                  {
                    key: 'exportDisplayedWorkspaces',
                    text: 'Export Displayed Workspaces',
                    onClick: () => exportAndDownloadCsv(workspaceInsights),
                  },
                ],
              }}
            >
              Export to CSV
            </CommandButton>
          )}
        </Stack.Item>
        <Stack.Item>
          <Stack
            horizontal
            verticalAlign='center'
            horizontalAlign='space-between'
          >
            <Stack.Item>
              <DetailsListFilter
                filterProperties={[
                  {
                    Name: 'OwnerEmail',
                    CustomRenderName: 'Owner',
                    Values: [],
                    Operator: odataFeatureFlag
                      ? FilterOperator.contains
                      : FilterOperator.eq,
                  },
                  {
                    Name: 'WorkspaceID',
                    CustomRenderName: 'Workspace ID',
                    Values: [],
                  },
                  {
                    Name: 'WorkspaceName',
                    CustomRenderName: 'Workspace Name',
                    Values: [],
                    Operator: odataFeatureFlag
                      ? FilterOperator.contains
                      : FilterOperator.eq,
                  },
                  {
                    Name: 'WorkspaceDeleteLockEnabled',
                    CustomRenderName: 'Delete Lock',
                    Values: ['No Filter', true, false],
                    CustomRenderValue: (v) =>
                      v.toString().charAt(0).toUpperCase() +
                      v.toString().slice(1),
                  },
                  {
                    Name: 'WorkspaceDeletionStatus',
                    CustomRenderName: 'Deletion Status',
                    Values: ['No Filter', 'Deleting', 'Failed'],
                    CustomRenderValue: (v) => {
                      if (v === 'Deleting') {
                        return 'Marked For Deletion';
                      }
                      if (v === 'Failed') {
                        return 'Deletion Failed';
                      }
                      return 'No Filter';
                    },
                  },
                  {
                    Name: 'WorkspaceOwnerExists',
                    CustomRenderName: 'Orphaned',
                    Values: ['No Filter', true, false],
                    CustomRenderValue: (v) => {
                      if (v === true) {
                        return 'No';
                      } else if (v === false) {
                        return 'Yes';
                      } else {
                        return v.toString();
                      }
                    },
                  },
                  {
                    Name: 'DeploymentRegion',
                    CustomRenderName: 'Region',
                    Values: [
                      'No Filter',
                      'AustraliaCentral',
                      'AustraliaEast',
                      'AustraliaWest',
                      'CanadaCentral',
                      'CanadaEast',
                      'CentralIndia',
                      'CentralUS',
                      'EastAsia',
                      'EastUS',
                      'EastUS2',
                      'FranceCentral',
                      'GermanyWestCentral',
                      'JapanEast',
                      'JapanWest',
                      'KoreaCentral',
                      'NorthCentralUS',
                      'NorthEurope',
                      'SouthCentralUS',
                      'SoutheastAsia',
                      'SouthIndia',
                      'SwedenCentral',
                      'UAENorth',
                      'UKSouth',
                      'UKWest',
                      'United Kingdom',
                      'WestCentralUS',
                      'WestEurope',
                      'WestIndia',
                      'WestUS',
                      'WestUS2',
                      'WestUS3',
                    ],
                  },
                ]}
                filters={filters}
                onFiltersChange={(filters) =>
                  dispatch(setWorkspaceInsightFilterProperties(filters))
                }
                selectedFiltersSelector={getWorkspaceInsightsFilterProperties}
              />
            </Stack.Item>
            <Stack.Item>
              <RefreshButton
                isRefreshing={workspaceInsightsLoading}
                text='Refresh Workspaces'
                onRefreshClick={() => {
                  dispatch(fetchWorkspaceInsightsSummary(selectedSegment.ID));
                  dispatch(
                    fetchWorkspaceInsights([selectedSegment.ID], filters)
                  );
                }}
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          {selectedWorkspaceInsights.length <= maximumRowsForSelection && (
            <PrimaryButton onClick={confirmDeletion} text='Delete' />
          )}
          <DefaultButton onClick={toggleHideDialog} text='Cancel' />
        </DialogFooter>
      </Dialog>
      <Stack
        horizontal
        className={`${commonStyles.overflowYAuto} ${commonStyles.overflowXHidden} ${commonStyles.fullHeight} ${commonStyles.flexGrow}`}
      >
        <Stack className={commonStyles.fullWidth}>
          <Stack
            className={commonStyles.fullHeight}
            tokens={{ childrenGap: 8 }}
          >
            <Dialog
              hidden={hideDialog}
              onDismiss={toggleHideDialog}
              dialogContentProps={dialogContentProps}
              modalProps={modalProps}
            >
              <DialogFooter>
                {selectedWorkspaceInsights.length <=
                  maximumRowsForSelection && (
                  <PrimaryButton onClick={confirmDeletion} text='Delete' />
                )}
                <DefaultButton onClick={toggleHideDialog} text='Cancel' />
              </DialogFooter>
            </Dialog>
            <ShimmeredDetailsList
              styles={{ root: { overflowY: 'auto' } }}
              items={workspaceInsights}
              columns={columns}
              selectionMode={
                bulkDeleteWorkspaceInsightsFeatureFlag
                  ? SelectionMode.multiple
                  : SelectionMode.none
              }
              selection={
                workspaceInsightSelection as ISelection<IObjectWithKey>
              }
              checkboxVisibility={CheckboxVisibility.always}
              getKey={itemToKey}
              setKey='multiple'
              enableShimmer={
                workspaceInsightsLoading && workspaceInsights.length === 0
              }
              checkButtonAriaLabel={'checkbox'}
              ariaLabelForSelectAllCheckbox={'select all checkbox'}
              onRenderRow={onRenderRow}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack style={{ marginBottom: 8 }} tokens={{ childrenGap: 8 }}>
        <Stack horizontalAlign='center'>
          <Text>{`${workspaceInsights.length} Workspace${
            workspaceInsights.length === 1 ? '' : 's'
          } Displayed`}</Text>
        </Stack>
        <Stack
          horizontal
          horizontalAlign='center'
          tokens={{ childrenGap: 4 }}
          className={
            !workspaceInsightsContinuationToken && !workspaceInsightsNextLink
              ? commonStyles.visibilityHidden
              : undefined
          }
        >
          <Link
            onClick={() => {
              dispatch(appendWorkspaceInsights([selectedSegment.ID]));
            }}
            disabled={workspaceInsightsLoading}
          >
            Load More
          </Link>
          {workspaceInsightsLoading && (
            <Spinner size={SpinnerSize.xSmall}></Spinner>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

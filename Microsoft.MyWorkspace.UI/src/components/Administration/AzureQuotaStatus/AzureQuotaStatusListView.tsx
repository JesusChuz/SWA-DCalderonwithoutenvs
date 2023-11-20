import * as React from 'react';
import {
  SelectionMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  ColumnActionsMode,
  Stack,
  Spinner,
  SpinnerSize,
  Label,
  TooltipHost,
  FontIcon,
  Dropdown,
  ISelectableOption,
  useTheme,
} from '@fluentui/react';
import {
  getAzureSubscriptionQuotaStatus,
  getAzureSubscriptionQuotaStatusLoadingStatus,
  getSelectedGeography,
  getSelectedSubscription,
  getSelectedWorkspaceTenant,
} from '../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  fetchAzureSubscriptionQuotaStatus,
  setSelectedQuotaGeography,
  setSelectedQuotaSubscription,
  setSelectedQuotaWorkspaceTenant,
} from '../../../store/actions';
import { AzureSubscriptionQuotaStatusDto } from '../../../types/Catalog/AzureSubscriptionQuotaStatus.types';
import clsx from 'clsx';
import { ArrayHelper } from '../../../shared/helpers/ArrayHelper';

export const AzureSubscriptionQuotaStatusListView = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const selectedSubscription = useSelector(getSelectedSubscription);
  const selectedWorkspaceTenantName = useSelector(getSelectedWorkspaceTenant);
  const selectedGeography = useSelector(getSelectedGeography);

  const azureSubscriptionQuotaStatusCollection = useSelector(
    getAzureSubscriptionQuotaStatus
  );
  const isAzureSubscriptionQuotasLoading = useSelector(
    getAzureSubscriptionQuotaStatusLoadingStatus
  );
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const subscriptionFilter = React.useMemo(
    () => [
      ...[{ key: 'All', text: 'All' }],
      ...ArrayHelper.getUniqueObjectsOfArray(
        azureSubscriptionQuotaStatusCollection,
        'SubscriptionId'
      ).map((azureSubQuotaStatus: AzureSubscriptionQuotaStatusDto) => {
        return {
          key: azureSubQuotaStatus.SubscriptionId,
          text: azureSubQuotaStatus.SubscriptionName,
        } as ISelectableOption;
      }),
    ],
    [azureSubscriptionQuotaStatusCollection]
  );

  const workspaceTenantFilter = React.useMemo(
    () => [
      ...[{ key: 'All', text: 'All' }],
      ...ArrayHelper.getUniqueObjectsOfArray(
        azureSubscriptionQuotaStatusCollection,
        'WorkspaceTenantName'
      ).map((azureSubQuotaStatus: AzureSubscriptionQuotaStatusDto) => {
        return {
          key: azureSubQuotaStatus.WorkspaceTenantName,
          text: azureSubQuotaStatus.WorkspaceTenantName,
        } as ISelectableOption;
      }),
    ],
    [azureSubscriptionQuotaStatusCollection]
  );

  const geographyFilter = React.useMemo(
    () => [
      ...[{ key: 'All', text: 'All' }],
      ...ArrayHelper.getUniqueObjectsOfArray(
        azureSubscriptionQuotaStatusCollection,
        'Geography'
      ).map((azureSubQuotaStatus: AzureSubscriptionQuotaStatusDto) => {
        return {
          key: azureSubQuotaStatus.Geography,
          text: azureSubQuotaStatus.Geography,
        } as ISelectableOption;
      }),
    ],
    [azureSubscriptionQuotaStatusCollection]
  );

  React.useEffect(() => {
    buildColumnsObject();
    dispatch(fetchAzureSubscriptionQuotaStatus());
  }, []);

  React.useEffect(() => {
    dispatch(fetchAzureSubscriptionQuotaStatus());
  }, [selectedSubscription, selectedWorkspaceTenantName, selectedGeography]);

  const displayGridResults = (): JSX.Element => {
    if (isAzureSubscriptionQuotasLoading) {
      return (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      );
    } else if (azureSubscriptionQuotaStatusCollection === null) {
      return <React.Fragment />;
    }

    const azureSubscriptionQuotaStatusCollectionFiltered =
      azureSubscriptionQuotaStatusCollection.filter(
        (azureSubscriptionQuotaStatusDto: AzureSubscriptionQuotaStatusDto) => {
          let workspaceTenantFilterCondition = true;
          let subscriptionFilterCondition = true;
          let geographyFilterCondition = true;

          if (
            selectedWorkspaceTenantName &&
            selectedWorkspaceTenantName !== 'All'
          ) {
            workspaceTenantFilterCondition =
              azureSubscriptionQuotaStatusDto.WorkspaceTenantName ==
              selectedWorkspaceTenantName;
          }

          if (selectedSubscription && selectedSubscription !== 'All') {
            subscriptionFilterCondition =
              azureSubscriptionQuotaStatusDto.SubscriptionId ==
              selectedSubscription;
          }

          if (selectedGeography && selectedGeography !== 'All') {
            geographyFilterCondition =
              azureSubscriptionQuotaStatusDto.Geography == selectedGeography;
          }

          return (
            workspaceTenantFilterCondition &&
            subscriptionFilterCondition &&
            geographyFilterCondition
          );
        }
      );

    return (
      <Stack className={commonStyles.container}>
        <Stack tokens={{ childrenGap: 24 }} horizontal>
          <Dropdown
            label='Workspace Tenant'
            placeholder='Select a Workspace Tenant'
            styles={{ dropdown: { width: 300 } }}
            selectedKey={
              selectedWorkspaceTenantName ? selectedWorkspaceTenantName : 'All'
            }
            options={workspaceTenantFilter}
            onChange={(event, item) => {
              dispatch(setSelectedQuotaWorkspaceTenant(item.key.toString()));
            }}
          />
          <Dropdown
            label='Subscription'
            placeholder='Select a Subscription'
            styles={{ dropdown: { width: 300 } }}
            selectedKey={selectedSubscription ? selectedSubscription : 'All'}
            options={subscriptionFilter}
            onChange={(event, item) => {
              dispatch(setSelectedQuotaSubscription(item.key.toString()));
            }}
          />
          <Dropdown
            label='Geography'
            placeholder='Select a geography'
            styles={{ dropdown: { width: 300 } }}
            selectedKey={selectedGeography ? selectedGeography : 'All'}
            options={geographyFilter}
            onChange={(event, item) => {
              dispatch(setSelectedQuotaGeography(item.key.toString()));
            }}
          />
        </Stack>
        <DetailsList
          items={azureSubscriptionQuotaStatusCollectionFiltered}
          columns={columns}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          styles={{ root: { overflowY: 'auto' } }}
        />
      </Stack>
    );
  };

  const columnsMap: Record<string, IColumn> = {
    OverAllCapacityStatus: {
      key: 'status',
      name: '',
      ariaLabel: 'geography column',
      fieldName: 'OverAllCapacityStatus',
      minWidth: 30,
      maxWidth: 30,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (quota: AzureSubscriptionQuotaStatusDto) => (
        <Stack tokens={{ childrenGap: 24 }} horizontal>
          {quota.OverAllCapacityStatus === 'Usage At Normal Level' && (
            <TooltipHost content='Usage At Normal Level'>
              <FontIcon
                iconName='green-check-mark'
                aria-label='Usage At Normal Level'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          {quota.OverAllCapacityStatus === 'Usage At or Near Quota' && (
            <TooltipHost content='Usage At Or Near Quota'>
              <FontIcon
                iconName='yellow-warning-icon'
                aria-label='Usage At Or Near Quota'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          {quota.OverAllCapacityStatus === 'Compute Hard Limit Reached' && (
            <TooltipHost content='Compute Hard Limit Reached'>
              <FontIcon
                iconName='red-error-icon'
                aria-label='Compute Hard Limit Reached'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          {quota.OverAllCapacityStatus === 'Route Table Hard Limit Reached' && (
            <TooltipHost content='Route Table Hard Limit Reached'>
              <FontIcon
                iconName='red-error-icon'
                aria-label='Route Table Hard Limit Reached'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
          {quota.OverAllCapacityStatus ===
            'Resource Group Hard Limit Reached' && (
            <TooltipHost content='Resource Group Hard Limit Reached'>
              <FontIcon
                iconName='red-error-icon'
                aria-label='Resource Group Hard Limit Reached'
                className={clsx(commonStyles.warningText, commonStyles.font18)}
              />
            </TooltipHost>
          )}
        </Stack>
      ),
    },
    WorkspaceTenantName: {
      key: 'WorkspaceTenantName',
      name: 'Workspace Tenant',
      ariaLabel: 'workspace tenant column',
      fieldName: 'WorkspaceTenantName',
      minWidth: 120,
      maxWidth: 120,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    subscriptionName: {
      key: 'SubscriptionName',
      name: 'Subscription Name',
      ariaLabel: 'subscription name column',
      minWidth: 150,
      maxWidth: 150,
      fieldName: 'SubscriptionName',
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    geography: {
      key: 'Geography',
      name: 'Geography',
      ariaLabel: 'geography column',
      fieldName: 'Geography',
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    region: {
      key: 'Region',
      name: 'Region',
      ariaLabel: 'region column',
      fieldName: 'Region',
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    resourceGroupUsage: {
      key: 'ResourceGroup',
      name: 'Resource Group Usage',
      ariaLabel: 'resource group column',
      fieldName: 'ResourceGroupCapacity',
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (quota: AzureSubscriptionQuotaStatusDto) => {
        return (
          <Stack>
            <Label>{quota.ResourceGroupCapacity}</Label>
          </Stack>
        );
      },
    },
    routeTableUsage: {
      key: 'RouteTable',
      name: 'Route Table Usage',
      ariaLabel: 'route table column',
      fieldName: 'RouteTable',
      minWidth: 170,
      maxWidth: 170,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (quota: AzureSubscriptionQuotaStatusDto) => (
        <Stack tokens={{ childrenGap: 24 }} horizontal>
          <Label style={{ minWidth: 55 }}>{quota.RouteTable}</Label>
          {quota.RouteTableCapacityPercentage < 87 && (
            <Label className={clsx(commonStyles.successText)}>
              {quota.RouteTableCapacityPercentage}%
            </Label>
          )}
          {quota.RouteTableCapacityPercentage >= 87 &&
            quota.RouteTableCapacityPercentage < 90 && (
              <Label className={clsx(commonStyles.warningText)}>
                {quota.RouteTableCapacityPercentage}%
              </Label>
            )}
          {quota.RouteTableCapacityPercentage >= 90 && (
            <Label className={clsx(commonStyles.errorText)}>
              {quota.RouteTableCapacityPercentage}%
            </Label>
          )}
        </Stack>
      ),
    },
    standardBSFamilyvCPUsUsage: {
      key: 'StandardBSFamilyvCPUsUsage',
      name: 'StandardBS vCPUs Usage',
      ariaLabel: 'standard BS family vCPUs usage column',
      fieldName: 'StandardBSFamilyvCPUs',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (quota: AzureSubscriptionQuotaStatusDto) => (
        <Stack tokens={{ childrenGap: 24 }} horizontal>
          <Label style={{ minWidth: 55 }}>{quota.StandardBSFamilyvCPUs}</Label>
          {quota.StandardBSFamilyCapacityPercentage < 70 && (
            <Label className={clsx(commonStyles.successText)}>
              {quota.StandardBSFamilyCapacityPercentage}%
            </Label>
          )}
          {quota.StandardBSFamilyCapacityPercentage >= 70 &&
            quota.StandardBSFamilyCapacityPercentage < 80 && (
              <Label className={clsx(commonStyles.warningText)}>
                {quota.StandardBSFamilyCapacityPercentage}%
              </Label>
            )}
          {quota.StandardBSFamilyCapacityPercentage >= 80 && (
            <Label className={clsx(commonStyles.errorText)}>
              {quota.StandardBSFamilyCapacityPercentage}%
            </Label>
          )}
        </Stack>
      ),
    },
    standardDSv4FamilyvCPUsUsage: {
      key: 'StandardDSv4FamilyvCPUsUsage',
      name: 'Standard DSv4 vCPUs Usage',
      ariaLabel: 'standardDSv4FamilyvCPUsUsage column',
      fieldName: 'StandardDSv4FamilyvCPUs',
      minWidth: 200,
      maxWidth: 200,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (quota: AzureSubscriptionQuotaStatusDto) => (
        <Stack tokens={{ childrenGap: 24 }} horizontal>
          <Label style={{ minWidth: 55 }}>
            {quota.StandardDSv4FamilyvCPUs}
          </Label>
          {quota.StandardDSv4FamilyCapacityPercentage < 70 && (
            <Label className={clsx(commonStyles.successText)}>
              {quota.StandardDSv4FamilyCapacityPercentage}%
            </Label>
          )}
          {quota.StandardDSv4FamilyCapacityPercentage >= 70 &&
            quota.StandardDSv4FamilyCapacityPercentage < 80 && (
              <Label className={clsx(commonStyles.warningText)}>
                {quota.StandardDSv4FamilyCapacityPercentage}%
              </Label>
            )}
          {quota.StandardDSv4FamilyCapacityPercentage >= 80 && (
            <Label className={clsx(commonStyles.errorText)}>
              {quota.StandardDSv4FamilyCapacityPercentage}%
            </Label>
          )}
        </Stack>
      ),
    },
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    newColumns.push(columnsMap.OverAllCapacityStatus);
    newColumns.push(columnsMap.WorkspaceTenantName);
    newColumns.push(columnsMap.subscriptionName);
    newColumns.push(columnsMap.geography);
    newColumns.push(columnsMap.region);
    newColumns.push(columnsMap.resourceGroupUsage);
    newColumns.push(columnsMap.routeTableUsage);
    newColumns.push(columnsMap.standardBSFamilyvCPUsUsage);
    newColumns.push(columnsMap.standardDSv4FamilyvCPUsUsage);

    setColumns(newColumns);
  };

  return (
    <Stack className={commonStyles.fullHeight} tokens={{ childrenGap: 8 }}>
      <Stack
        horizontal
        className={`${commonStyles.overflowYAuto} ${commonStyles.flexGrow}`}
      >
        <Stack className={commonStyles.container}>{displayGridResults()}</Stack>
      </Stack>
    </Stack>
  );
};

export default AzureSubscriptionQuotaStatusListView;

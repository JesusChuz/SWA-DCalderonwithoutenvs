import * as React from 'react';
import { IColumn, Text, useTheme, Stack, Link } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonStyles } from 'src/components/GeneralComponents/CommonStyles';
import { TemplateActionsPanel } from './TemplateActionsPanel';
import { formatDateString } from 'src/shared/DateTimeHelpers';
import { TemplateTooltipActions } from './TemplateActionButtons';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import {
  getTemplateFilterProperties,
  getTemplateRequests,
  getTemplateRequestsNextLink,
  getTemplateRequestsLoading,
  getTemplateRequestsRefreshing,
} from 'src/store/selectors/adminTemplateSelectors';
import {
  fetchInitialAuthorTemplates,
  fetchNextAuthorTemplates,
  refreshAuthorTemplates,
  setTemplateRequests,
  setTemplateFilterProperties,
} from 'src/store/actions/adminTemplateActions';
import { TemplateStatusDotIcon } from './TemplateManagement.utils';
import { ContinuationDetailsListWrapper } from '../GeneralComponents/ContinuationDetailsListWrapper';
import { signalRConnection } from 'src/services/signalRService';
import { DetailsListWithSortableColumns } from '../GeneralComponents/DetailsListWithSortableColumns';
import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { TemplateRequestStatus } from 'src/types/enums/TemplateRequestStatus';
import { DetailsListFilter } from '../GeneralComponents/DetailsListFilter';
import { RefreshButton } from '../GeneralComponents/RefreshButton';
import { convertTemplateStatusToReadable } from 'src/shared/helpers/StatusHelper';
import { FilterOperator } from 'src/types/enums/FilterOperator';
import {
  getFeatureFlagOData,
  getFeatureFlagTemplateDeploymentCounts,
  getFeatureFlagsLoaded,
} from 'src/store/selectors';
import { InfoButton } from '../GeneralComponents/InfoButton';

interface ITemplateList {
  segmentId: string;
  commandBarItems?: React.ReactElement;
}

export const TemplateList = (props: ITemplateList) => {
  const templates: WorkspaceTemplateDto[] = useSelector(getTemplateRequests);
  const continuationToken = useSelector(getTemplateRequestsNextLink);
  const nextLink = useSelector(getTemplateRequestsNextLink);
  const templatesLoading = useSelector(getTemplateRequestsLoading);
  const filters: FilterProperty[] = useSelector(getTemplateFilterProperties);
  const templatesRefreshing = useSelector(getTemplateRequestsRefreshing);
  const [refreshClicked, setRefreshClicked] = React.useState(false);
  const featureFlagsLoaded = useSelector(getFeatureFlagsLoaded);
  const odataFeatureFlag = useSelector(getFeatureFlagOData);
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const [isActionsPanelOpen, setIsActionsPanelOpen] = React.useState(false);
  const featureFlagTemplateDeploymentCounts = useSelector(
    getFeatureFlagTemplateDeploymentCounts
  );

  const [currentTemplate, setCurrentTemplate] =
    React.useState<WorkspaceTemplateDto | null>(null);

  const openActionsPanel = (template: WorkspaceTemplateDto) => {
    setIsActionsPanelOpen(true);
    setCurrentTemplate(template);
  };

  const columns: IColumn[] = [
    {
      key: 'Name',
      name: 'Name',
      minWidth: 300,
      maxWidth: 400,
      onRender: (template: WorkspaceTemplateDto) => {
        return (
          <Text
            variant='small'
            nowrap
            className={commonStyles.textOverflowEllipsis}
          >
            <Link
              className={commonStyles.fullWidth}
              onClick={() => openActionsPanel(template)}
            >
              {template.Name}
            </Link>
          </Text>
        );
      },
    },
    {
      key: 'Status',
      name: 'Status',
      minWidth: 100,
      maxWidth: 125,
      onRender: (template: WorkspaceTemplateDto) => {
        return (
          <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 4 }}>
            <TemplateStatusDotIcon status={template.Status} />
            <Text
              onClick={() => setIsActionsPanelOpen(!isActionsPanelOpen)}
              variant='small'
            >
              {convertTemplateStatusToReadable(template.Status)}
            </Text>
          </Stack>
        );
      },
    },
    {
      key: 'TotalSuccessfulDeployments',
      name: 'Deployments',
      minWidth: 125,
      maxWidth: 175,
      onRender: (template: WorkspaceTemplateDto) => {
        return (
          <Text variant='small'>{template.TotalSuccessfulDeployments}</Text>
        );
      },
      onRenderHeader: (columnProps, defaultRenderer) => {
        return (
          <Stack horizontal verticalAlign='center'>
            {defaultRenderer(columnProps)}
            <InfoButton
              buttonId='num-deployments'
              calloutTitle='Number of Successful Deployments'
              calloutBody={`Refers to the total number of workspaces that have been successfully deployed using this template`}
            />
          </Stack>
        );
      },
    },
    {
      key: 'AuthorEmail',
      name: 'Author',
      minWidth: 200,
      maxWidth: 250,
      onRender: (template: WorkspaceTemplateDto) => {
        return <Text variant='small'>{template.AuthorEmail}</Text>;
      },
    },
    {
      key: 'CreatedDate',
      name: 'Creation Date',
      minWidth: 100,
      maxWidth: 150,
      onRender: (template: WorkspaceTemplateDto) => (
        <Stack verticalAlign='center'>
          <Text variant='small'>{formatDateString(template.CreatedDate)}</Text>
        </Stack>
      ),
    },
    {
      key: 'ID',
      name: 'Id',
      minWidth: 215,
      maxWidth: 215,
      onRender: (template: WorkspaceTemplateDto) => (
        <Stack verticalAlign='center'>
          <Text variant='small'>{template.ID}</Text>
        </Stack>
      ),
    },
    {
      key: 'actions',
      name: '',
      ariaLabel: 'actions column',
      fieldName: 'Actions',
      minWidth: 50,
      onRender: (template: WorkspaceTemplateDto) => (
        <Stack horizontalAlign='end'>
          <TemplateTooltipActions
            template={template}
            onPropertiesClick={(id) => {
              setCurrentTemplate(templates.find((t) => t.ID === id));
              setIsActionsPanelOpen(true);
            }}
          />
        </Stack>
      ),
    },
  ];

  const filteredColumns: IColumn[] = React.useMemo(() => {
    return featureFlagTemplateDeploymentCounts
      ? columns
      : columns.filter((item) => item.key !== 'Deployments');
  }, [columns, featureFlagTemplateDeploymentCounts]);

  React.useEffect(() => {
    signalRConnection.on('onTemplateRequestUpdate', () => {
      dispatch(refreshAuthorTemplates(props.segmentId, filters));
    });
    return () => {
      signalRConnection?.off('onTemplateRequestUpdate');
    };
  }, [props.segmentId]);

  React.useEffect(() => {
    if (currentTemplate) {
      setCurrentTemplate((current) =>
        templates.find((t) => t.ID === current.ID)
      );
    }
  }, [templates]);

  const manuallyRefreshed = React.useMemo(() => {
    if (templatesRefreshing && refreshClicked) {
      return true;
    } else if (!templatesRefreshing && refreshClicked) {
      setRefreshClicked(false);
      return false;
    }
    return false;
  }, [templatesRefreshing, refreshClicked]);

  React.useEffect(() => {
    if (featureFlagsLoaded) {
      dispatch(fetchInitialAuthorTemplates(props.segmentId, filters));
    }
  }, [props.segmentId, filters, featureFlagsLoaded]);

  return (
    <Stack className={`${commonStyles.overflowYAuto} ${commonStyles.flexGrow}`}>
      <TemplateActionsPanel
        isActionsPanelOpen={isActionsPanelOpen}
        setIsActionsPanelOpen={setIsActionsPanelOpen}
        template={currentTemplate}
      />
      <Stack horizontal verticalAlign='center' horizontalAlign='space-between'>
        <Stack grow={5} horizontal>
          {props.commandBarItems && props.commandBarItems}
        </Stack>
        <Stack grow={1} horizontal verticalAlign='center' reversed>
          <RefreshButton
            text='refresh templates'
            isRefreshing={templatesLoading}
            onRefreshClick={() => {
              setRefreshClicked(true);
              dispatch(refreshAuthorTemplates(props.segmentId, filters));
            }}
          />
          <DetailsListFilter
            filters={filters}
            filterProperties={[
              {
                Name: 'Name',
                Values: [],
                Operator: odataFeatureFlag
                  ? FilterOperator.contains
                  : FilterOperator.eq,
              },
              {
                Name: 'AuthorEmail',
                CustomRenderName: 'Author Email',
                Values: [],
                Operator: odataFeatureFlag
                  ? FilterOperator.contains
                  : FilterOperator.eq,
              },
              {
                Name: 'ID',
                Values: [],
              },
              {
                Name: 'Status',
                Values: [
                  TemplateRequestStatus.Accepted,
                  TemplateRequestStatus.Draft,
                  TemplateRequestStatus.Failed,
                  TemplateRequestStatus.MarkForDeletion,
                  TemplateRequestStatus.Processing,
                  TemplateRequestStatus.Published,
                  TemplateRequestStatus.Unknown,
                  TemplateRequestStatus.Unpublished,
                ],
                CustomRenderValue: convertTemplateStatusToReadable,
              },
            ]}
            onFiltersChange={(f) => dispatch(setTemplateFilterProperties(f))}
            selectedFiltersSelector={getTemplateFilterProperties}
          />
        </Stack>
      </Stack>
      <ContinuationDetailsListWrapper
        dataLoading={templatesLoading}
        showLoadingWithData={manuallyRefreshed}
        data={templates}
        dataName={'Template'}
        showLoadMore={Boolean(nextLink) || Boolean(continuationToken)}
        loadMoreClick={() => {
          dispatch(fetchNextAuthorTemplates(props.segmentId, filters));
        }}
      >
        <DetailsListWithSortableColumns
          items={templates}
          columns={filteredColumns}
          setItems={(newItems) => dispatch(setTemplateRequests(newItems))}
          sortableColumns={[
            'Name',
            'TotalSuccessfulDeployments',
            'AuthorEmail',
            'Status',
            'CreatedDate',
          ]}
        />
      </ContinuationDetailsListWrapper>
    </Stack>
  );
};

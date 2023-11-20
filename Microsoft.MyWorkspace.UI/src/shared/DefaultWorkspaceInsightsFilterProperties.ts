import { Filter } from 'odata-query';
import { ResourceState } from '../types/AzureWorkspace/enums/ResourceState';
import { FilterProperty } from '../types/AzureWorkspace/FilterProperty.types';
import { FilterOperator } from '../types/enums/FilterOperator';

export const DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES: FilterProperty[] = [
  {
    Name: 'WorkspaceDeletionStatus',
    Operator: FilterOperator.ne,
    Value: ResourceState.Deleting,
  },
];

export const DEFAULT_WORKSPACE_INSIGHTS_FILTER_PROPERTIES_ODATA: Filter = {
  'Resource/WorkspaceDeletionStatus': { ne: 'Deleting' },
};

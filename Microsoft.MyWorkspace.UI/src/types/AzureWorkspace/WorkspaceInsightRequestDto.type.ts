import { SortProperty } from '../SortProperty.types';
import { AzureWorkspaceInsightsDto } from './AzureWorkspaceInsightsDto.types';
import { FilterProperty } from './FilterProperty.types';

export interface WorkspaceInsightRequestDto {
  SegmentIds: string[];
  SortProperty: SortProperty<AzureWorkspaceInsightsDto>;
  FilterProperties: FilterProperty[];
}

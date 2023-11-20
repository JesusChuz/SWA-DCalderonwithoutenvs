import { SortProperty } from '../SortProperty.types';
import { Filter } from 'odata-query';

export interface ODataQueryParams<T> {
  baseUrl: string;
  select: (keyof T)[];
  filter: Filter;
  top: number;
  skip: number;
  additionalQueryParams: Record<string, string>;
  orderBy: SortProperty<T>[];
  count: boolean;
}

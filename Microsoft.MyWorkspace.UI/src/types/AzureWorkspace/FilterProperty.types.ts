import { FilterOperator } from '../enums/FilterOperator';

export interface FilterProperty {
  Name: string;
  Operator: FilterOperator;
  Value: string | number | boolean;
}

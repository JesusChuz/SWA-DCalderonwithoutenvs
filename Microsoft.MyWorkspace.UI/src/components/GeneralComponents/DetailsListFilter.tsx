import * as React from 'react';
import {
  ActionButton,
  IButtonStyles,
  IconButton,
  IContextualMenuItemProps,
  IOverflowSetItemProps,
  OverflowSet,
  Stack,
  TagItem,
  Text,
} from '@fluentui/react';
import { FilterProperty } from '../../types/AzureWorkspace/FilterProperty.types';
import { FilterOperator } from '../../types/enums/FilterOperator';
import { DetailsListFilterPanel } from './DetailsListFilterPanel';
import { SelectorType } from 'src/types/SelectorType.types';

export interface IDetailsListFilterProperty {
  Name: string;
  Values: (string | boolean | number)[];
  CustomRenderName?: string;
  CustomRenderValue?: (value: string | boolean | number) => string;
  Operator?: FilterOperator;
}

interface IDetailsListFilterProps<T> {
  filters: FilterProperty[];
  onFiltersChange: (filters: FilterProperty[]) => void;
  selectedFiltersSelector: SelectorType<T, FilterProperty[]>;
  filterProperties: IDetailsListFilterProperty[];
  overflowAt?: number;
}

interface OverflowFilterProperty
  extends IOverflowSetItemProps,
    FilterProperty {}

export const DetailsListFilter = <T,>(
  props: IDetailsListFilterProps<T>
): JSX.Element => {
  const overFlowAt = React.useMemo(
    () => (props.overflowAt ? props.overflowAt : 3),
    [props.overflowAt]
  );

  const displayOperator = (filterOperator: FilterOperator): string => {
    switch (filterOperator) {
      case FilterOperator.eq:
        return '==';
      case FilterOperator.ne:
        return '!=';
      default:
        return filterOperator;
    }
  };

  const getTextFromFilter = (item: OverflowFilterProperty) => {
    const filterProperty = props.filterProperties.find(
      (fp) => fp.Name === item.Name
    );
    const name = filterProperty.CustomRenderName
      ? filterProperty.CustomRenderName
      : filterProperty.Name;
    const value = filterProperty.CustomRenderValue
      ? filterProperty.CustomRenderValue(item.Value)
      : item.Value;
    return (
      <Text>
        {name} {displayOperator(item.Operator)} {value}
      </Text>
    );
  };

  const onRenderContextMenuItem = (props: IContextualMenuItemProps) => {
    const filterItem = props.item as OverflowFilterProperty;
    return onRenderItem(filterItem);
  };

  const onRenderItem = (item: OverflowFilterProperty): JSX.Element => {
    const remove = () => {
      const filtered = props.filters.filter(
        (f) =>
          f.Name !== item.Name ||
          f.Operator !== item.Operator ||
          f.Value !== item.Value
      );
      props.onFiltersChange(filtered);
    };
    return (
      <TagItem
        item={{ name: item.name, key: item.name }}
        index={0}
        onRemoveItem={remove}
      >
        {getTextFromFilter(item)}
      </TagItem>
    );
  };

  const onRenderOverflowButton = (
    overflowItems: OverflowFilterProperty[] | undefined
  ): JSX.Element => {
    const buttonStyles: Partial<IButtonStyles> = {
      root: {
        minWidth: 0,
        padding: '0 4px',
        alignSelf: 'stretch',
        height: 'auto',
      },
    };
    return (
      <IconButton
        title='More options'
        styles={buttonStyles}
        menuIconProps={{ iconName: 'More' }}
        menuProps={{
          items: overflowItems,
          contextualMenuItemAs: onRenderContextMenuItem,
        }}
      />
    );
  };

  const clearAll = () => props.onFiltersChange([]);

  return (
    <Stack horizontal verticalAlign='center'>
      {props.filters.length > 0 && (
        <>
          <Text style={{ marginRight: '4px' }}>Filtered by: </Text>
          <OverflowSet
            aria-label='Selected Filters'
            items={props.filters
              .slice(0, overFlowAt)
              .map((f) => ({ key: f.Name, ...f }))}
            overflowItems={props.filters
              .slice(overFlowAt)
              .map((f) => ({ key: f.Name, ...f }))}
            onRenderOverflowButton={onRenderOverflowButton}
            onRenderItem={onRenderItem}
          />
          <ActionButton aria-label='Clear All Filters' onClick={clearAll}>
            Clear all
          </ActionButton>
        </>
      )}
      {props.filters.length === 0 && <Text>No filters applied</Text>}
      <DetailsListFilterPanel
        onClearFilter={(filterKey: string) => {
          props.onFiltersChange(
            props.filters.filter((item) => item.Name !== filterKey)
          );
        }}
        onSetFilter={(filter: FilterProperty) => {
          const index = props.filters.findIndex(
            (existingFilter) => existingFilter.Name === filter.Name
          );
          if (index === -1) {
            props.onFiltersChange([...props.filters, filter]);
          } else {
            const newArray = [
              ...props.filters.slice(0, index),
              filter,
              ...props.filters.slice(index + 1),
            ];
            props.onFiltersChange(newArray);
          }
        }}
        filterProperties={props.filterProperties}
        selectedFiltersSelector={props.selectedFiltersSelector}
      />
    </Stack>
  );
};

import {
  ActionButton,
  ChoiceGroup,
  Dropdown,
  IChoiceGroupOption,
  Label,
  List,
  Panel,
  PanelType,
  SearchBox,
  Separator,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { SelectorType } from 'src/types/SelectorType.types';
import { FilterProperty } from '../../types/AzureWorkspace/FilterProperty.types';
import { FilterOperator } from '../../types/enums/FilterOperator';
import { getCommonStyles } from './CommonStyles';
import { IDetailsListFilterProperty } from './DetailsListFilter';

interface IDetailsListFilterPanelProps<T> {
  filterProperties: IDetailsListFilterProperty[];
  onClearFilter: (filterKey: string) => void;
  onSetFilter: (filter: FilterProperty) => void;
  selectedFiltersSelector: SelectorType<T, FilterProperty[]>;
}

export const DetailsListFilterPanel = <T,>(
  props: IDetailsListFilterPanelProps<T>
): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const selectedFilters = useSelector(props.selectedFiltersSelector);

  const getValueOptions = (filter: IDetailsListFilterProperty) => {
    const filterProperty = props.filterProperties.find(
      (p) => p.Name === filter.Name
    );
    return filterProperty
      ? filterProperty.Values.map((v) => ({
          key: v.toString(),
          text: filterProperty.CustomRenderValue
            ? filterProperty.CustomRenderValue(v)
            : v.toString(),
          data: v,
        }))
      : [];
  };

  let timeoutInstance: NodeJS.Timeout;

  const setFilterValue = (
    filterName: string,
    filterValue: string | boolean | number,
    filterOperator?: FilterOperator
  ) => {
    const filter = {
      Name: filterName,
      Operator: filterOperator ?? FilterOperator.eq,
      Value: filterValue,
    };
    if (timeoutInstance) {
      clearTimeout(timeoutInstance);
    }
    if (filterValue === '') {
      props.onClearFilter(filter.Name);
      return;
    }
    timeoutInstance = setTimeout(() => {
      props.onSetFilter(filter);
    }, 1000);
  };

  const onRenderCell = (
    filter: IDetailsListFilterProperty,
    index: number
  ): JSX.Element => {
    const valueOptions = getValueOptions(filter);
    if (valueOptions.length == 0) {
      return (
        <>
          <Label style={{ color: theme.semanticColors.inputText }}>
            {filter.CustomRenderName ? filter.CustomRenderName : filter.Name}
          </Label>
          <SearchBox
            onChange={(event, newValue) =>
              setFilterValue(
                filter.Name,
                newValue,
                filter.Operator ?? undefined
              )
            }
            onClear={() => props.onClearFilter(filter.Name)}
            className={`${commonStyles.fullWidth} ${commonStyles.textFieldSpacing}`}
            placeholder={'Search'}
            defaultValue={
              selectedFilters
                .filter((f) => f.Name === filter.Name)[0]
                ?.Value.toString() ?? undefined
            }
            iconProps={{ iconName: 'Search' }}
          />
          <Separator></Separator>
        </>
      );
    } else if (valueOptions.length < 8) {
      const onChange = (
        ev: React.SyntheticEvent<HTMLElement>,
        option: IChoiceGroupOption
      ) => {
        if (option.key === 'No Filter') {
          props.onClearFilter(filter.Name);
        } else {
          props.onSetFilter({
            Name: filter.Name,
            Operator: FilterOperator.eq,
            Value: valueOptions.find((v) => v.key === option.key).data,
          });
        }
      };
      return (
        <>
          <ChoiceGroup
            selectedKey={selectedFilters
              .filter((f) => f.Name === filter.Name)[0]
              ?.Value.toString()}
            defaultSelectedKey={'No Filter'}
            onChange={onChange}
            options={valueOptions}
            label={
              filter.CustomRenderName ? filter.CustomRenderName : filter.Name
            }
            required={false}
          />
          <Separator></Separator>
        </>
      );
    } else {
      return (
        <div data-is-focusable={true}>
          <Dropdown
            label={
              filter.CustomRenderName ? filter.CustomRenderName : filter.Name
            }
            selectedKey={selectedFilters
              .filter((f) => f.Name === filter.Name)[0]
              ?.Value.toString()}
            placeholder='Select a filter option'
            styles={{ dropdown: { width: 300 } }}
            options={valueOptions}
            multiSelect={false}
            onChange={(event, option) => {
              if (option.key === 'No Filter') {
                props.onClearFilter(filter.Name);
              } else {
                props.onSetFilter({
                  Name: filter.Name,
                  Operator: FilterOperator.eq,
                  Value: option.data,
                });
              }
            }}
          />
          <Separator></Separator>
        </div>
      );
    }
  };

  return (
    <>
      <ActionButton
        title='Add Filters'
        iconProps={{ iconName: 'Filter' }}
        aria-label='Add Filters'
        onClick={() => setFilterPanelOpen(true)}
      />
      <Panel
        isOpen={filterPanelOpen}
        onDismiss={() => setFilterPanelOpen(false)}
        headerText={`Add Filters`}
        closeButtonAriaLabel='Close'
        customWidth={'450px'}
        type={PanelType.custom}
      >
        <List items={props.filterProperties} onRenderCell={onRenderCell} />
      </Panel>
    </>
  );
};

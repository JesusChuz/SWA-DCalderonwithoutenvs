import * as React from 'react';
import {
  DetailsList,
  DetailsRow,
  IColumn,
  IDetailsListProps,
  IDetailsRowProps,
  IDetailsRowStyles,
  SelectionMode,
} from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { setPoliteScreenReaderAnnouncement } from 'src/store/actions';

interface IDetailsListWithSortableColumns<T> {
  items: T[];
  columns: IColumn[];
  // column keys
  sortableColumns: string[];
  setItems: (newItems: T[]) => void;
  detailsListProps?: IDetailsListProps;
}

export const DetailsListWithSortableColumns = <T,>(
  props: IDetailsListWithSortableColumns<T>
): JSX.Element => {
  const [columns, setColumns] = React.useState(props.columns);
  const dispatch = useDispatch();

  const onColumnClick = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    column: IColumn
  ) => {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column.key === currCol.key
    )[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        dispatch(
          setPoliteScreenReaderAnnouncement(
            `${currColumn.name} is sorted ${
              currColumn.isSortedDescending ? 'descending' : 'ascending'
            }`
          )
        );
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = copyAndSort(
      props.items,
      currColumn.key,
      currColumn.isSortedDescending
    );
    setColumns(newColumns);
    props.setItems(newItems);
  };

  const copyAndSort = (
    items: T[],
    columnKey: string,
    isSortedDescending?: boolean
  ): T[] => {
    const key = columnKey as keyof T;
    return items
      .slice(0)
      .sort((a: T, b: T) =>
        (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
      );
  };

  const onRenderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = { userSelect: 'auto', cursor: 'auto' };
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const getKey = (item: IColumn, index?: number) => {
    return item.key;
  };

  React.useEffect(() => {
    const cols = columns.slice();
    for (let i = 0; i < cols.length; i++) {
      cols[i].onColumnClick = null;
    }
    for (let i = 0; i < props.sortableColumns.length; i++) {
      const col = cols.find((c) => c.key === props.sortableColumns[i]);
      if (col) {
        col.onColumnClick = onColumnClick;
      }
    }
    setColumns(cols);
  }, [props.columns, props.sortableColumns]);

  return (
    <DetailsList
      items={props.items}
      columns={columns}
      getKey={getKey}
      setKey='none'
      selectionMode={SelectionMode.none}
      onRenderRow={onRenderRow}
      {...(props.detailsListProps ? props.detailsListProps : {})}
    />
  );
};

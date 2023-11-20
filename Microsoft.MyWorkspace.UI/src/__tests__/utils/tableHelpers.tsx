import {
  MatcherOptions,
  buildQueries,
  queryHelpers,
} from '@testing-library/react';

const queryAllTableRows = (
  container: HTMLElement,
  options?: MatcherOptions | undefined
) => {
  return queryHelpers.queryAllByAttribute('role', container, 'row', options);
};

const getTableRowMultipleError = () =>
  'Found multiple elements with the role of row';
const getTableRowMissingError = () =>
  'Unable to find an element elements with the role of row';

const queryAllTableGridCells = (
  container: HTMLElement,
  options?: MatcherOptions | undefined
) => {
  return queryHelpers.queryAllByAttribute(
    'role',
    container,
    'gridcell',
    options
  );
};

const getTableGridCellMultipleError = () =>
  'Found multiple elements with the role of gridcell';
const getTableGridCellMissingError = () =>
  'Unable to find an element elements with the role of gridcell';

const [
  queryTableRows,
  getAllTableRows,
  getTableRows,
  findAllTableRows,
  findTableRows,
] = buildQueries(
  queryAllTableRows,
  getTableRowMultipleError,
  getTableRowMissingError
);

const [
  queryTableGridCells,
  getAllTableGridCells,
  getTableGridCells,
  findAllTableGridCells,
  findTableGridCells,
] = buildQueries(
  queryAllTableGridCells,
  getTableGridCellMultipleError,
  getTableGridCellMissingError
);

export {
  queryTableRows,
  queryAllTableRows,
  getTableRows,
  getAllTableRows,
  findAllTableRows,
  findTableRows,
  queryTableGridCells,
  getAllTableGridCells,
  getTableGridCells,
  findAllTableGridCells,
  findTableGridCells,
};

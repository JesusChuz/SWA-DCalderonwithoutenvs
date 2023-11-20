import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';
import { PageResultOData } from 'src/types/OData/PageResultOData.types';
import { validate as uuidValidate } from 'uuid';
import buildQuery, { Filter, PlainObject } from 'odata-query';
import { ODataQueryParams } from 'src/types/OData/ODataQueryParams.types';

const addResourcePrefix = (value: string) => `Resource/${value}`;

export function buildODataQueryString<T>(
  baseUrl = '',
  queryParams?: Partial<ODataQueryParams<T>>
): string {
  const select =
    (queryParams?.select?.map((q) =>
      addResourcePrefix(q.toString())
    ) as (keyof T)[]) ?? undefined;
  const filter: Filter = queryParams?.filter ?? undefined;
  const orderBy =
    (queryParams?.orderBy?.map((orderBy) => {
      return `${addResourcePrefix(orderBy.Name.toString())} ${
        orderBy.IsDescending ? 'desc' : 'asc'
      }`;
    }) as [keyof T, 'asc' | 'desc']) ?? undefined;
  const top = queryParams?.top ?? undefined;
  const skip = queryParams?.skip ?? undefined;
  const count = queryParams?.count ?? false;
  let query = buildQuery({
    select,
    filter,
    top,
    skip,
    orderBy,
    count,
  });

  // Add additional query params
  if (
    queryParams?.additionalQueryParams &&
    Object.keys(queryParams.additionalQueryParams).length > 0
  ) {
    Object.entries(queryParams.additionalQueryParams).forEach(
      ([key, value]) => {
        query = query.concat(`${query ? '&' : '?'}${key}=${value}`);
      }
    );
  }
  return `${baseUrl}${query}`;
}

export function parseNextLink<T>(
  nextLink: PageResultOData<T>
): Partial<ODataQueryParams<T>> {
  const nextLinkUrl = nextLink['@odata.nextLink'];
  // Get query params from next link
  if (nextLinkUrl) {
    const url = new URL(nextLinkUrl);
    const queryParams = url.searchParams;
    const top = queryParams.get('$top');
    const skip = queryParams.get('$skip');
    return {
      top: top ? parseInt(top) : undefined,
      skip: skip ? parseInt(skip) : undefined,
    };
  } else {
    return null;
  }
}

export const createFilterObjectArray = (
  filter: FilterProperty[]
): Array<string | PlainObject> => {
  if (!filter) return [];
  const filterValues = filter.map((f) => createFilterPropertyObject(f));
  return filterValues;
};

const createFilterPropertyObject = (
  filter: FilterProperty
): string | PlainObject => {
  const { Name, Operator, Value } = filter;
  const isString = typeof Value === 'string';
  const isUuid = isString ? uuidValidate(Value.toString()) : false;
  const resourceName = addResourcePrefix(Name);
  return {
    [resourceName]: {
      [Operator]: isUuid ? { value: Value, type: 'guid' } : Value,
    },
  };
};

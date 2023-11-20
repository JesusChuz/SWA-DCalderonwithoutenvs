import { FilterProperty } from 'src/types/AzureWorkspace/FilterProperty.types';

export const getFilterPropertiesQuery = (filters: FilterProperty[]) => {
  let query = filters.length > 0 ? 'filterProperties=[' : '';
  for (let i = 0; i < filters.length; i++) {
    let f = `{"Name": "${filters[i].Name}", "Operator": "${filters[i].Operator}", "Value": "${filters[i].Value}"}`;
    f = i < filters.length - 1 ? `${f},` : f;
    query += f;
  }
  query += filters.length > 0 ? ']' : '';
  return encodeURI(query);
};

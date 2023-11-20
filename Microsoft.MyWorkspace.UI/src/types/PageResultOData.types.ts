export interface PageResultOData<Type> {
  value: Type[];
  '@odata.nextLink': string;
}

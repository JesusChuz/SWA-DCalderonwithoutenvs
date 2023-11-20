export interface PageResult<Type> {
  ResultSet: Type[];
  ContinuationToken: string;
}

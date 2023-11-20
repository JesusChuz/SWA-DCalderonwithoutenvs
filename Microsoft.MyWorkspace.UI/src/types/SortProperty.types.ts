export interface SortProperty<T> {
  Name: keyof T;
  IsDescending: boolean;
}

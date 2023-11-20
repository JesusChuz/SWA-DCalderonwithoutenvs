import { AxiosError } from 'axios';

export interface AxiosErrorWithId {
  error: AxiosError;
  id: string;
}

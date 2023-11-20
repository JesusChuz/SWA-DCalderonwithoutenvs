import { AxiosError } from 'axios';

export const AxiosErrorTestData: AxiosError = {
  name: 'Error Name',
  message: 'Error Message',
  config: {},
  isAxiosError: true,
  toJSON: jest.fn(),
};

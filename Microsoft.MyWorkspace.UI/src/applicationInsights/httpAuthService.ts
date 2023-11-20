import axios from 'axios';
import { acquireAccessToken } from 'src/authentication/msal';
import { telemetryContext } from './TelemetryService';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  async (request) => {
    request.headers.Authorization = `Bearer ${await acquireAccessToken()}`;
    telemetryContext.logEvent('request', { name: String(request) });
    return request;
  },
  (error) => {
    telemetryContext.logException(error);
    return Promise.reject(error);
  }
);

export { axiosInstance as httpAuthService };

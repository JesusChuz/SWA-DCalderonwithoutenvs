import { createAction, Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
  FETCH_CONFIG_BEGIN,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILURE,
  Action,
  FETCH_FRONTEND_API_VERSION_BEGIN,
  FETCH_FRONTEND_API_VERSION_FAILURE,
  FETCH_FRONTEND_API_VERSION_SUCCESS,
  FETCH_APP_CONFIG_VALUES_BEGIN,
  FETCH_APP_CONFIG_VALUES_FAILURE,
  FETCH_APP_CONFIG_VALUES_SUCCESS,
  FETCH_FEATURE_FLAGS_BEGIN,
  FETCH_FEATURE_FLAGS_FAILURE,
  FETCH_FEATURE_FLAGS_SUCCESS,
} from './actionTypes';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { Config } from '../../types/Config/Config.types';
import ErrorAction from './errorAction';
import { AppConfigValues } from '../../types/Config/AppConfigValues.types';
import { FeatureFlagValues } from '../../types/Config/FeatureFlagValues.types';

export interface ConfigAction extends Action {
  payload?:
    | Config
    | boolean
    | AxiosError
    | string
    | string[]
    | number
    | AppConfigValues
    | FeatureFlagValues;
}

const featureFlagEndpoint = 'api/config/featureflag';
const appConfigEndpoint = 'api/config/appconfig';

export const fetchConfigBegin = (): ConfigAction => ({
  type: FETCH_CONFIG_BEGIN,
});

export const fetchConfigSuccess = (payload: Config): ConfigAction => ({
  type: FETCH_CONFIG_SUCCESS,
  payload,
});

export const fetchConfigError = (error: AxiosError): ConfigAction => ({
  type: FETCH_CONFIG_FAILURE,
  payload: error,
});

export const fetchConfig = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchConfigBegin());
    try {
      const res = await httpAuthService.get('api/config');
      // Log success here
      dispatch(fetchConfigSuccess(res.data ? res.data : []));
    } catch (err) {
      dispatch(fetchConfigError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Application Configuration:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchFeatureFlagsBegin = (): ConfigAction => ({
  type: FETCH_FEATURE_FLAGS_BEGIN,
});

export const fetchFeatureFlagsSuccess = (
  featureFlag: FeatureFlagValues
): ConfigAction => ({
  type: FETCH_FEATURE_FLAGS_SUCCESS,
  payload: featureFlag,
});

export const fetchFeatureFlagsError = (error: AxiosError): ConfigAction => ({
  type: FETCH_FEATURE_FLAGS_FAILURE,
  payload: error,
});

export const fetchFeatureFlags = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFeatureFlagsBegin());
    try {
      const res = await httpAuthService.get<FeatureFlagValues>(
        `${featureFlagEndpoint}`
      );
      // Log success here
      dispatch(fetchFeatureFlagsSuccess(res.data));
    } catch (err) {
      dispatch(fetchFeatureFlagsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Feature Flags :\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchAppConfigValuesBegin = createAction(
  FETCH_APP_CONFIG_VALUES_BEGIN
);

export const fetchAppConfigValuesFailure = createAction<AxiosError>(
  FETCH_APP_CONFIG_VALUES_FAILURE
);

export const fetchAppConfigValuesSuccess = createAction<AppConfigValues>(
  FETCH_APP_CONFIG_VALUES_SUCCESS
);

export const fetchAppConfigValues = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAppConfigValuesBegin());
    try {
      const res = await httpAuthService.get<AppConfigValues>(
        `${appConfigEndpoint}`
      );
      dispatch(fetchAppConfigValuesSuccess(res.data));
    } catch (err) {
      dispatch(fetchAppConfigValuesFailure(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve App Configuration values:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchFrontendApiVersionBegin = createAction(
  FETCH_FRONTEND_API_VERSION_BEGIN
);

export const fetchFrontendApiVersionFailure = createAction<AxiosError>(
  FETCH_FRONTEND_API_VERSION_FAILURE
);

export const fetchFrontendApiVersionSuccess = createAction<string>(
  FETCH_FRONTEND_API_VERSION_SUCCESS
);

export const fetchFrontendApiVersion = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFrontendApiVersionBegin());
    try {
      const res = await httpAuthService.get<string>('general/version');

      // Log success here
      dispatch(fetchFrontendApiVersionSuccess(res.data ? res.data : ''));
    } catch (err) {
      dispatch(fetchFrontendApiVersionFailure(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve FrontEnd API Version:\n${err.response?.data}`,
        true
      );
    }
  };
};

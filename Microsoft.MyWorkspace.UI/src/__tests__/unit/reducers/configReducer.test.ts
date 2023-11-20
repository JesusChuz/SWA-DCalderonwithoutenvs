import { AxiosError } from 'axios';
import { ConfigAction } from '../../../store/actions';
import {
  FETCH_CONFIG_BEGIN,
  FETCH_CONFIG_FAILURE,
  FETCH_CONFIG_SUCCESS,
} from '../../../store/actions/actionTypes';
import configReducer, {
  configInitialState,
} from '../../../store/reducers/configReducer';
import { Config } from '../../../types/Config/Config.types';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';

const initialState = configInitialState;
const axiosError: AxiosError = {
  ...AxiosErrorTestData,
};

describe('Config Reducer Tests', () => {
  test('Action with FETCH_CONFIG_BEGIN type returns correct state', () => {
    const action: ConfigAction = {
      type: FETCH_CONFIG_BEGIN,
    };
    const newState = configReducer(initialState, action);
    expect(newState.isConfigLoading).toBe(true);
    expect(newState.configError).toBeNull();
  });
  test('Action with FETCH_CONFIG_FAILURE type returns correct state', () => {
    const action: ConfigAction = {
      type: FETCH_CONFIG_FAILURE,
      payload: axiosError,
    };
    const newState = configReducer(initialState, action);
    expect(newState.isConfigLoading).toBe(false);
    expect(newState.configError).toEqual(axiosError);
  });
  test('Action with FETCH_CONFIG_SUCCESS type returns correct state', () => {
    const payload: Config = {
      ChatbotURLp1: 'url-1',
      ChatbotURLp2: 'url-2',
      OCVEnv: 1,
      OCVAppId: 2,
      AppInsightsKey: 'key',
      DebugMode: false,
      Message: { id: 'message-id', message: 'this-is-a-message' },
    };
    const action: ConfigAction = {
      type: FETCH_CONFIG_SUCCESS,
      payload,
    };
    const newState = configReducer(initialState, action);
    expect(newState.config).toEqual(payload);
    expect(newState.isConfigLoadedFirstTime).toBe(true);
    expect(newState.isConfigLoading).toBe(false);
    expect(newState.configError).toBeNull();
  });
  test('Default case returns initial state', () => {
    const action: ConfigAction = {
      type: null,
    };
    const newState = configReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

import { getMockStore } from '../../utils/mockStore.util';
import { fetchConfig } from '../../../store/actions/configActions';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  FETCH_CONFIG_BEGIN,
  FETCH_CONFIG_FAILURE,
  FETCH_CONFIG_SUCCESS,
} from '../../../store/actions/actionTypes';
import { Config } from '../../../types/Config/Config.types';
import ErrorAction from '../../../store/actions/errorAction';

jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
jest.mock('../../../store/actions/errorAction');

(ErrorAction as jest.Mock).mockImplementation(() => null);
jest.spyOn(console, 'error').mockImplementation(() => jest.fn());

const store = getMockStore();
const failure = { response: { status: 400 } };

describe('Config Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchConfig action creator dispatches expected actions on success', async () => {
    const mockData: { data: Config } = { data: {} as Config };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CONFIG_BEGIN },
      { type: FETCH_CONFIG_SUCCESS, payload: mockData.data },
    ];
    await fetchConfig()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchConfig action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CONFIG_BEGIN },
      { type: FETCH_CONFIG_FAILURE, payload: failure },
    ];
    await fetchConfig()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});

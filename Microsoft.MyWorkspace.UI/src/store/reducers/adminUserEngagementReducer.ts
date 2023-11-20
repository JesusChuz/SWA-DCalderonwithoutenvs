import { AxiosError } from 'axios';
import { BannerDto } from '../../types/Admin/BannerDto.types';
import {
  CREATE_BANNER_BEGIN,
  CREATE_BANNER_FAILURE,
  CREATE_BANNER_SUCCESS,
  FETCH_BANNERS_BEGIN,
  FETCH_BANNERS_FAILURE,
  FETCH_BANNERS_SUCCESS,
  UPDATE_BANNER_BEGIN,
  UPDATE_BANNER_FAILURE,
  UPDATE_BANNER_SUCCESS,
} from '../actions/actionTypes/adminUserEngagementActions';
import { AdminUserEngagementAction } from '../actions/adminUserEngagementActions';

export interface ReduxAdminUserEngagementState {
  banners: BannerDto[];
  bannersLoading: boolean;
  bannersError: AxiosError;
  createBannerLoading: boolean;
  createBannerError: AxiosError;
  updateBannerLoading: boolean;
  updateBannerError: AxiosError;
}

export const initialAdminUserEngagementState: ReduxAdminUserEngagementState = {
  banners: [],
  bannersLoading: false,
  bannersError: null,
  createBannerLoading: false,
  createBannerError: null,
  updateBannerLoading: false,
  updateBannerError: null,
};

export default function userEngagementReducer(
  state: ReduxAdminUserEngagementState = initialAdminUserEngagementState,
  action: AdminUserEngagementAction
): ReduxAdminUserEngagementState {
  switch (action.type) {
    case FETCH_BANNERS_BEGIN:
      return {
        ...state,
        bannersLoading: true,
        bannersError: null,
      };
    case FETCH_BANNERS_SUCCESS: {
      return {
        ...state,
        banners: action.payload as BannerDto[],
        bannersLoading: false,
        bannersError: null,
      };
    }
    case FETCH_BANNERS_FAILURE:
      return {
        ...state,
        bannersLoading: false,
        bannersError: action.payload as AxiosError,
      };
    case CREATE_BANNER_BEGIN:
      return {
        ...state,
        createBannerLoading: true,
        createBannerError: null,
      };
    case CREATE_BANNER_SUCCESS: {
      return {
        ...state,
        createBannerLoading: false,
        createBannerError: null,
      };
    }
    case CREATE_BANNER_FAILURE:
      return {
        ...state,
        createBannerLoading: false,
        createBannerError: action.payload as AxiosError,
      };
    case UPDATE_BANNER_BEGIN:
      return {
        ...state,
        updateBannerLoading: true,
        updateBannerError: null,
      };
    case UPDATE_BANNER_SUCCESS: {
      return {
        ...state,
        updateBannerLoading: false,
        updateBannerError: null,
      };
    }
    case UPDATE_BANNER_FAILURE:
      return {
        ...state,
        updateBannerLoading: false,
        updateBannerError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}

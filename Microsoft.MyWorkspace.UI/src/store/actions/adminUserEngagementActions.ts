import { Action, Dispatch } from 'redux';
import { AxiosError } from 'axios';

import ErrorAction from './errorAction';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { BannerDto } from '../../types/Admin/BannerDto.types';
import {
  CREATE_BANNER_BEGIN,
  CREATE_BANNER_FAILURE,
  CREATE_BANNER_SUCCESS,
  DELETE_BANNER_BEGIN,
  DELETE_BANNER_FAILURE,
  DELETE_BANNER_SUCCESS,
  FETCH_BANNERS_BEGIN,
  FETCH_BANNERS_FAILURE,
  FETCH_BANNERS_SUCCESS,
  UPDATE_BANNER_BEGIN,
  UPDATE_BANNER_FAILURE,
  UPDATE_BANNER_SUCCESS,
} from './actionTypes/adminUserEngagementActions';
import { BannerForCreationDto } from 'src/types/Admin/BannerForCreationDto.types';

export interface AdminUserEngagementAction extends Action {
  payload?: BannerDto[] | BannerDto | AxiosError | string;
}

export const fetchBannersBegin = () => ({
  type: FETCH_BANNERS_BEGIN,
});

export const fetchBannersSuccess = (payload: BannerDto) => ({
  type: FETCH_BANNERS_SUCCESS,
  payload,
});

export const fetchBannersError = (error: AxiosError) => ({
  type: FETCH_BANNERS_FAILURE,
  payload: error,
});

export const fetchBanners = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchBannersBegin());
    try {
      const res = await httpAuthService.get('admindashboard/banner');
      dispatch(fetchBannersSuccess(res.data as BannerDto));
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(fetchBannersError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve banners :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const createBannerBegin = () => ({
  type: CREATE_BANNER_BEGIN,
});

export const createBannerSuccess = (payload: BannerDto) => ({
  type: CREATE_BANNER_SUCCESS,
  payload,
});

export const createBannerError = (error: AxiosError) => ({
  type: CREATE_BANNER_FAILURE,
  payload: error,
});

export const createBanner = (banner: BannerForCreationDto) => {
  return async (dispatch: Dispatch) => {
    dispatch(createBannerBegin());
    try {
      const res = await httpAuthService.post('admindashboard/banner', banner);
      dispatch(createBannerSuccess(res.data as BannerDto));
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(createBannerError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to create banner :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const updateBannerBegin = () => ({
  type: UPDATE_BANNER_BEGIN,
});

export const updateBannerSuccess = (payload: BannerDto) => ({
  type: UPDATE_BANNER_SUCCESS,
  payload,
});

export const updateBannerError = (error: AxiosError) => ({
  type: UPDATE_BANNER_FAILURE,
  payload: error,
});

export const updateBanner = (banner: BannerDto) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateBannerBegin());
    try {
      const res = await httpAuthService.put('admindashboard/banner', banner);
      dispatch(updateBannerSuccess(res.data as BannerDto));
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(updateBannerError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to update banner :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const deleteBannerBegin = () => ({
  type: DELETE_BANNER_BEGIN,
});

export const deleteBannerSuccess = (payload: BannerDto) => ({
  type: DELETE_BANNER_SUCCESS,
  payload,
});

export const deleteBannerError = (error: AxiosError) => ({
  type: DELETE_BANNER_FAILURE,
  payload: error,
});

export const deleteBanner = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateBannerBegin());
    try {
      const res = await httpAuthService.delete(`admindashboard/banner/${id}`);
      dispatch(updateBannerSuccess(res.data as BannerDto));
      return res;
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        dispatch(updateBannerError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to delete banner :\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

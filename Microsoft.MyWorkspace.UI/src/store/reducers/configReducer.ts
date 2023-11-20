import {
  FETCH_CONFIG_BEGIN,
  FETCH_CONFIG_FAILURE,
  FETCH_CONFIG_SUCCESS,
  FETCH_APP_CONFIG_VALUES_BEGIN,
  FETCH_APP_CONFIG_VALUES_SUCCESS,
  FETCH_APP_CONFIG_VALUES_FAILURE,
  FETCH_FRONTEND_API_VERSION_BEGIN,
  FETCH_FRONTEND_API_VERSION_FAILURE,
  FETCH_FRONTEND_API_VERSION_SUCCESS,
  FETCH_FEATURE_FLAGS_BEGIN,
  FETCH_FEATURE_FLAGS_FAILURE,
  FETCH_FEATURE_FLAGS_SUCCESS,
} from '../actions/actionTypes';
import { AxiosError } from 'axios';
import { Config } from '../../types/Config/Config.types';
import { ConfigAction } from '../actions';
import { AppConfigValues } from '../../types/Config/AppConfigValues.types';
import { FeatureFlagValues } from '../../types/Config/FeatureFlagValues.types';
import { Blank_FeatureFlagValues } from '../../data/Blank_FeatureFlagValues';
import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { Blank_SegmentConstraintDto } from '../../data/Blank_SegmentConstraintDto';

export interface ReduxConfigState {
  config: Config;
  isConfigLoadedFirstTime: boolean;
  isConfigLoading: boolean;
  configError: AxiosError;
  azureDNSZoneName: string;
  modernRdpDownloadLink: string;
  rdpJitMaxHours: number;
  frontendAPIVersion: string;
  frontendAPIVersionLoaded: boolean;
  frontendAPIVersionError: AxiosError;
  restrictedDnsPrefixes: string[];
  staleWorkspaceDeletionWarningThreshold: number;
  staleWorkspaceDeletionBannerThreshold: number;
  featureFlags: FeatureFlagValues;
  featureFlagsError: AxiosError;
  featureFlagsLoaded: boolean;
  segmentConstraintMaxValues: Partial<SegmentConstraintDto>;
}

export const configInitialState: ReduxConfigState = {
  config: null,
  isConfigLoadedFirstTime: false,
  isConfigLoading: false,
  configError: null,
  azureDNSZoneName: '',
  modernRdpDownloadLink: '',
  rdpJitMaxHours: undefined,
  frontendAPIVersion: '',
  frontendAPIVersionLoaded: false,
  frontendAPIVersionError: null,
  restrictedDnsPrefixes: [],
  staleWorkspaceDeletionWarningThreshold: undefined,
  staleWorkspaceDeletionBannerThreshold: undefined,
  featureFlags: Blank_FeatureFlagValues,
  featureFlagsError: null,
  featureFlagsLoaded: false,
  segmentConstraintMaxValues: Blank_SegmentConstraintDto,
};

export default function configReducer(
  state: ReduxConfigState = configInitialState,
  action: ConfigAction
): ReduxConfigState {
  switch (action.type) {
    case FETCH_CONFIG_BEGIN:
      return {
        ...state,
        isConfigLoading: true,
        configError: null,
      };
    case FETCH_CONFIG_FAILURE:
      return {
        ...state,
        isConfigLoading: false,
        configError: action.payload as AxiosError,
      };
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        config: action.payload as Config,
        isConfigLoadedFirstTime: true,
        isConfigLoading: false,
        configError: null,
      };
    case FETCH_FRONTEND_API_VERSION_BEGIN:
      return {
        ...state,
        frontendAPIVersion: 'Loading...',
        frontendAPIVersionError: null,
      };
    case FETCH_FRONTEND_API_VERSION_SUCCESS:
      return {
        ...state,
        frontendAPIVersion: action.payload as string,
        frontendAPIVersionLoaded: true,
        frontendAPIVersionError: null,
      };
    case FETCH_FRONTEND_API_VERSION_FAILURE:
      return {
        ...state,
        frontendAPIVersion: 'unavailable',
        frontendAPIVersionLoaded: true,
        frontendAPIVersionError: action.payload as AxiosError,
      };
    case FETCH_APP_CONFIG_VALUES_BEGIN:
      return {
        ...state,
        azureDNSZoneName: '',
        modernRdpDownloadLink: '',
        rdpJitMaxHours: undefined,
        restrictedDnsPrefixes: [],
        staleWorkspaceDeletionWarningThreshold: undefined,
        staleWorkspaceDeletionBannerThreshold: undefined,
        segmentConstraintMaxValues: undefined,
      };
    case FETCH_APP_CONFIG_VALUES_SUCCESS: {
      const payload = action.payload as AppConfigValues;
      return {
        ...state,
        azureDNSZoneName: payload.AzureDNSZoneName,
        modernRdpDownloadLink: payload.ModernRDPDownloadLink,
        rdpJitMaxHours: parseInt(payload.RdpJitMaxHours),
        restrictedDnsPrefixes: payload.RestrictedDnsPrefixes,
        staleWorkspaceDeletionWarningThreshold: parseInt(
          payload.StaleWorkspaceDeletionWarningThreshold
        ),
        staleWorkspaceDeletionBannerThreshold: parseInt(
          payload.StaleWorkspaceDeletionBannerThreshold
        ),
        segmentConstraintMaxValues:
          payload.SegmentConstraintMaxValues as Partial<SegmentConstraintDto>,
      };
    }
    case FETCH_APP_CONFIG_VALUES_FAILURE:
      return {
        ...state,
        azureDNSZoneName: '',
        modernRdpDownloadLink: '',
        rdpJitMaxHours: undefined,
        restrictedDnsPrefixes: [],
        staleWorkspaceDeletionWarningThreshold: undefined,
        staleWorkspaceDeletionBannerThreshold: undefined,
        segmentConstraintMaxValues: undefined,
      };
    case FETCH_FEATURE_FLAGS_BEGIN:
      return {
        ...state,
        featureFlags: Blank_FeatureFlagValues,
        featureFlagsLoaded: false,
        featureFlagsError: null,
      };
    case FETCH_FEATURE_FLAGS_SUCCESS:
      const flags = action.payload as FeatureFlagValues;
      return {
        ...state,
        featureFlags: flags,
        featureFlagsLoaded: true,
        featureFlagsError: null,
      };
    case FETCH_FEATURE_FLAGS_FAILURE:
      return {
        ...state,
        featureFlagsLoaded: true,
        featureFlagsError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}

import { configureStore } from '@reduxjs/toolkit';
import { PreloadedState } from 'redux';
import { authServiceInitialState } from 'src/store/reducers/authServiceReducer';
import { catalogInitialState } from 'src/store/reducers/catalogReducer';
import { configInitialState } from 'src/store/reducers/configReducer';
import { editableWorkspaceInitialState } from 'src/store/reducers/editableWorkspaceReducer';
import rootReducer, { RootState } from 'src/store/reducers/rootReducer';
import { defaultFeatureFlags } from '../data/defaults/defaultTestFeatureFlagValues';
import { defaultTestUserRoleAssignment } from '../data/defaults/defaultTestUserRoleAssignment';
import { defaultVirtualMachineSkuDtos } from '../data/defaults/defaultTestVirtualMachineSkuDtos';
import cloneDeep from 'lodash/cloneDeep';
import { defaultTestGeographies } from '../data/defaults/defaultTestGeographies';

export const initializeTestStore = (
  preloadedState?: PreloadedState<RootState>
) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initializeTestState(preloadedState),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const initializeTestState = (
  preloadedState?: PreloadedState<RootState>
) => {
  return cloneDeep({
    ...rootReducer,
    authService: {
      ...authServiceInitialState,
      userRoleAssignment: defaultTestUserRoleAssignment,
      constraint:
        defaultTestUserRoleAssignment.UserRoleAssignments[0].Constraint,
    },
    editableWorkspace: {
      ...editableWorkspaceInitialState,
      isAdminSelection: false,
    },
    catalog: {
      ...catalogInitialState,
      catalogMachineSkus: defaultVirtualMachineSkuDtos,
      geographies: defaultTestGeographies,
    },
    config: {
      ...configInitialState,
      featureFlags: defaultFeatureFlags,
    },
    ...preloadedState,
  }) as RootState;
};

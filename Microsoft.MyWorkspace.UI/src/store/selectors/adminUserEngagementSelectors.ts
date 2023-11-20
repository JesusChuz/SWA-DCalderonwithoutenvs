import { createSelector } from 'reselect';
import { ReduxAdminUserEngagementState } from '../reducers/adminUserEngagementReducer';

import { MyWorkspacesStore } from '../reducers/rootReducer';

const userEngagementState = (
  state: MyWorkspacesStore
): ReduxAdminUserEngagementState => state.userEngagement;

export const getBanners = createSelector(
  userEngagementState,
  (userEngagement: ReduxAdminUserEngagementState) => {
    return userEngagement.banners;
  }
);

export const getPublishedBanners = createSelector(
  userEngagementState,
  (userEngagement: ReduxAdminUserEngagementState) => {
    return userEngagement.banners.filter((b) => b.Published);
  }
);

export const getBannersLoading = createSelector(
  userEngagementState,
  (userEngagement: ReduxAdminUserEngagementState) => {
    return userEngagement.bannersLoading;
  }
);

export const getBannersSaving = createSelector(
  userEngagementState,
  (userEngagement: ReduxAdminUserEngagementState) => {
    return (
      userEngagement.createBannerLoading || userEngagement.updateBannerLoading
    );
  }
);

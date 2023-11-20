import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BreadCrumbs } from 'src/components/GeneralComponents/BreadCrumbs';
import { MyWorkspaceErrorBoundary } from 'src/components/GeneralComponents/ErrorBoundary/MyWorkspaceErrorBoundary';
import { LazyLoadingSpinner } from 'src/components/GeneralComponents/LazyLoadingSpinner';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import {
  getUnreadUserNotificationCount,
  getUserAuthorization,
} from 'src/store/selectors';
import { AuthorizationState } from 'src/types/enums/AuthorizationState';
import { Routes } from './Routes';
import { BannerContainer } from './BannerContainer';

interface IProps {
  navCollapsed: boolean;
}

export const MainContainer = (props: IProps): JSX.Element => {
  const commonStyles = useCommonStyles();
  const authorization = useSelector(getUserAuthorization);
  const unreadUserNotificationCount = useSelector(
    getUnreadUserNotificationCount
  );
  return (
    <main
      id='main'
      tabIndex={-1}
      className={(() => {
        if (authorization === AuthorizationState.unAuthorized) return '';
        return props.navCollapsed
          ? commonStyles.scrollablePaneCollapsed
          : commonStyles.scrollablePaneExpand;
      })()}
    >
      <BannerContainer />
      <BreadCrumbs />
      <div id='mainContainer' className={commonStyles.mainContainer}>
        <React.Suspense fallback={<LazyLoadingSpinner />}>
          <Helmet>
            <title>{`${
              unreadUserNotificationCount > 0
                ? `(${unreadUserNotificationCount}) `
                : ''
            }MyWorkspace`}</title>
          </Helmet>
          <MyWorkspaceErrorBoundary size='large'>
            <Routes />
          </MyWorkspaceErrorBoundary>
        </React.Suspense>
      </div>
    </main>
  );
};

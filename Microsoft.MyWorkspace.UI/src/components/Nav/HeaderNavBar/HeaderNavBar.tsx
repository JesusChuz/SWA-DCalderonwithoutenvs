import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CoherencePanel } from '@coherence-design-system/controls/lib/panel';
import { CoherenceHeader } from '@coherence-design-system/controls/lib/header';
import {
  ActionButton,
  IIconProps,
  mergeStyleSets,
  IStyle,
  Link,
  useTheme,
} from '@fluentui/react';

import {
  getCatalogUserImage,
  getAzureIssueCount,
  getCatalogUserProfile,
} from '../../../store/selectors/catalogSelectors';
import {
  azureCloudLightRed,
  azureCloudLightOrange,
} from '../../../shared/Colors';
import { OCVFeedback } from './OCVFeedback/OCVFeedback';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { getDebugMode } from '../../../store/selectors/configSelectors';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getOpenedPanel, getUserNotifications } from '../../../store/selectors';
import {
  changeUserNotificationStatus,
  updateAllUserNotifications,
  setOpenedPanel,
  updateSubsetUserNotifications,
} from '../../../store/actions';
import { RouteComponentProps, useLocation, useHistory } from 'react-router-dom';
import { LazyLoadingSpinner } from '../../GeneralComponents/LazyLoadingSpinner';
import { convertNotificationDtoToNotificationListItem } from '../../../shared/NotificationHelper';
import { NotificationStatus } from '../../../types/enums/NotificationStatus';
import { application } from '../../../authentication/msal';
import { SettingsPanel } from './Settings/SettingsPanel';
import { telemetryContext } from '../../../applicationInsights/TelemetryService';
import { loadOCVScript } from './OCVFeedback/OCVHelpers';
import { CoherencePanelSize } from '@coherence-design-system/controls/lib/utils';
import {
  NotificationCenter,
  INotificationCategory,
  INotificationItem,
  NotificationStatusType,
} from '@coherence-design-system/notification-center';
import dayjs from 'dayjs';

const PreviousAgreements = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "navPanels"*/ '../../../components/GeneralComponents/PreviousAgreements'
    )
);
const AboutInfo = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "navPanels"*/ './AboutInfo/AboutInfo'
    )
);
const QuotasInfo = React.lazy(
  () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "navPanels"*/ './Quotas/QuotasInfo'
    )
);

export const HeaderNavBar = (props: RouteComponentProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const user: UserProfileDto = useSelector(getCatalogUserProfile);
  const [categories, setCategories] = React.useState([]);
  const imageUrl: string = useSelector(getCatalogUserImage);
  const azureIssueCount = useSelector(getAzureIssueCount);
  const openedPanel = useSelector(getOpenedPanel);
  const location = useLocation();
  const dispatch = useDispatch();
  const notifications = useSelector(getUserNotifications);
  const history = useHistory();
  const debug = useSelector(getDebugMode);

  const [dismissOpenedPanel, setDismissOpenedPanel] = React.useState(false);
  React.useEffect(() => {
    loadOCVScript();
  }, []);

  const isAdmin = React.useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location]);

  React.useEffect(() => {
    if (location.pathname && telemetryContext) {
      telemetryContext.logPageView();
    }
  }, [location.pathname, telemetryContext]);

  const azureIconStyle = {
    root: {
      color: `${
        azureIssueCount > 0
          ? azureIssueCount > 5
            ? azureCloudLightRed
            : azureCloudLightOrange
          : 'white'
      } !important`,
    },
  };
  const _Styles = mergeStyleSets({
    helpSampleLink: [
      {
        fontSize: '14px',
        fontWeight: '600',
        margin: '8px 0',
        display: 'block',
      },
    ] as IStyle,
  });

  const PageEditIcon: IIconProps = { iconName: 'PageEdit' };

  const ConditionalOCV = React.useCallback(() => {
    if (!debug) {
      return <OCVFeedback />;
    }
    return <></>;
  }, [debug]);

  //Profile Panel
  const ProfilePanel = (
    <div>
      <ActionButton
        iconProps={PageEditIcon}
        onClick={() => dispatch(setOpenedPanel('agreements'))}
      >
        View Previous User Agreements
      </ActionButton>
    </div>
  );

  //Help Panel
  const HelpPanel: JSX.Element = (
    <div>
      <h3>MyWorkspace Documentation Page</h3>
      To learn more and view FAQs:
      <Link
        className={_Styles.helpSampleLink}
        onClick={() => history.push('/documentation')}
      >
        Documentation
      </Link>
      <br />
      <h3>MyWorkspace Support</h3>
      To create a ticket visit:
      <Link
        href='https://aka.ms/mywshelp'
        className={_Styles.helpSampleLink}
        target='_blank'
      >
        MyWorkspace Support
      </Link>
    </div>
  );

  const generalDismiss = () => {
    dispatch(setOpenedPanel(''));
  };

  const updateNotificationItem = (
    itemKey: string,
    displayStatus: NotificationStatusType
  ) => {
    const notification = notifications.find((n) => n.ID === itemKey);
    if (!notification) {
      return;
    }
    let notificationStatus = null;
    if (displayStatus === 'Read') {
      notificationStatus = NotificationStatus.Read;
    } else if (displayStatus === 'Unread') {
      notificationStatus = NotificationStatus.Unread;
    } else if (displayStatus === 'Deleted') {
      notificationStatus = NotificationStatus.Dismissed;
    }
    if (
      notificationStatus !== null &&
      notificationStatus !== notification.Status
    ) {
      dispatch(changeUserNotificationStatus(itemKey, notificationStatus));
    }
  };

  React.useEffect(() => {
    const lastHourItems: INotificationItem[] =
      convertNotificationDtoToNotificationListItem(
        notifications.filter((n) =>
          dayjs(n.CreatedOn).isAfter(dayjs().subtract(1, 'hour'))
        )
      ).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    const lastDayItems: INotificationItem[] =
      convertNotificationDtoToNotificationListItem(
        notifications.filter(
          (n) =>
            dayjs(n.CreatedOn).isBefore(dayjs().subtract(1, 'hour')) &&
            dayjs(n.CreatedOn).isAfter(dayjs().subtract(1, 'day'))
        )
      ).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    const laterItems: INotificationItem[] =
      convertNotificationDtoToNotificationListItem(
        notifications.filter((n) =>
          dayjs(n.CreatedOn).isBefore(dayjs().subtract(1, 'day'))
        )
      ).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    const newCategories: INotificationCategory[] = [
      {
        itemKey: 'Last Hour',
        title: 'Last Hour',
        items: lastHourItems,
        showCounter: true,
        maxItemsCollapsed: 3,
        deleteAllButton: {
          onClick: (e) =>
            dispatch(
              updateSubsetUserNotifications(
                NotificationStatus.Dismissed,
                lastHourItems.map((n) => n.itemKey)
              )
            ),
        },
      },
      {
        itemKey: 'Last Day',
        title: 'Last Day',
        items: lastDayItems,
        showCounter: true,
        maxItemsCollapsed: 3,
        deleteAllButton: {
          onClick: (e) =>
            dispatch(
              updateSubsetUserNotifications(
                NotificationStatus.Dismissed,
                lastDayItems.map((n) => n.itemKey)
              )
            ),
        },
      },
      {
        itemKey: 'Older',
        title: 'Older',
        maxItemsCollapsed: 3,
        items: laterItems,
        showCounter: true,
        deleteAllButton: {
          onClick: (e) =>
            dispatch(
              updateSubsetUserNotifications(
                NotificationStatus.Dismissed,
                laterItems.map((n) => n.itemKey)
              )
            ),
        },
      },
    ];
    setCategories(newCategories);
  }, [notifications]);

  return (
    <div>
      <CoherenceHeader
        headerLabel={'header'}
        appNameSettings={{
          label: isAdmin ? 'MyWorkspace | Administrator' : 'MyWorkspace',
          //linkUrl: redirectURL,
        }}
        farRightSettings={{
          additionalItems: [
            {
              text: 'Azure Status',
              iconOnly: true,
              tooltipHostProps: {
                content: 'Azure status',
                hostClassName: commonStyles.whiteText,
              },
              title:
                azureIssueCount === 0
                  ? 'Azure Status: OK'
                  : `Azure Status: ${azureIssueCount} issues exist`,
              onClick: () => {
                window.open('https://status.azure.com/en-us/status', '_blank');
              },
              iconProps: { iconName: 'AzureLogo', styles: azureIconStyle },
              key: 'azureStatus',
              ariaLabel: 'azure status',
            },
          ],
          helpSettings: {
            panelSettings: {
              closeButtonAriaLabel: 'Close Button',
              body: HelpPanel,
            },
          },
          settingsSettings: {
            panelSettings: {
              closeButtonAriaLabel: 'Close Button',
              body: <SettingsPanel />,
            },
          },
          profileSettings: {
            panelSettings: {
              closeButtonAriaLabel: 'Close Button',
              fullName: `${user.GivenName} ${user.Surname}`,
              emailAddress: user.Mail,
              imageUrl: imageUrl,
              logOutLink: '#',
              onLogOut: () => {
                application.logoutRedirect();
              },
              body: ProfilePanel,
            },
          },
        }}
        dismissOpenedPanel={dismissOpenedPanel}
        onDismissOpenedPanel={() => setDismissOpenedPanel(false)}
      >
        <NotificationCenter
          categories={categories}
          panelActions={{
            items: [
              {
                key: 'MARK_ALL_READ',
                text: 'Mark all as read',
                iconProps: { iconName: 'Ringer' },
                onClick: () => {
                  dispatch(updateAllUserNotifications(NotificationStatus.Read));
                },
              },
              {
                key: 'MARK_ALL_UNREAD',
                text: 'Mark all as unread',
                iconProps: { iconName: 'RingerSolid' },
                onClick: () => {
                  dispatch(
                    updateAllUserNotifications(NotificationStatus.Unread)
                  );
                },
              },
              {
                key: 'DELETE_ALL',
                text: 'Delete all',
                iconProps: { iconName: 'Delete' },
                onClick: () => {
                  dispatch(
                    updateAllUserNotifications(NotificationStatus.Dismissed)
                  );
                },
              },
            ],
          }}
          onUpdateNotificationItem={updateNotificationItem}
          closeButtonAriaLabel={'Close'}
        />
      </CoherenceHeader>
      <ConditionalOCV />
      <CoherencePanel
        panelSize={CoherencePanelSize.medium}
        titleText={'User Quotas'}
        isOpen={openedPanel === 'quotas'}
        hasCloseButton={true}
        closeButtonAriaLabel='close quotas panel'
        isLightDismiss={true}
        onDismiss={generalDismiss}
      >
        <React.Suspense fallback={<LazyLoadingSpinner />}>
          <QuotasInfo />
        </React.Suspense>
      </CoherencePanel>
      <CoherencePanel
        panelSize={CoherencePanelSize.large}
        titleText={'Previous User Agreements'}
        isOpen={openedPanel === 'agreements'}
        onDismiss={generalDismiss}
        hasCloseButton={true}
        closeButtonAriaLabel='close user agreements panel'
        isLightDismiss={true}
      >
        <React.Suspense fallback={<LazyLoadingSpinner />}>
          <PreviousAgreements />
        </React.Suspense>
      </CoherencePanel>
      <CoherencePanel
        panelSize={CoherencePanelSize.small}
        titleText={'Working days'}
        isOpen={openedPanel === 'workingsdays'}
        onDismiss={generalDismiss}
        hasCloseButton={true}
        isLightDismiss={true}
        closeButtonAriaLabel='close preferred working days panel'
      ></CoherencePanel>
      <CoherencePanel
        panelSize={CoherencePanelSize.medium}
        titleText={'About'}
        isOpen={openedPanel === 'about'}
        onDismiss={generalDismiss}
        hasCloseButton={true}
        closeButtonAriaLabel='close about panel'
        isLightDismiss={true}
      >
        <React.Suspense fallback={<LazyLoadingSpinner />}>
          <AboutInfo />
        </React.Suspense>
      </CoherencePanel>
    </div>
  );
};

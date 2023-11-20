import * as React from 'react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getAzureWorkspaces } from '../../../store/selectors/azureWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getDashboardStyles } from '../Dashboard.styles';
import { useSelector } from 'react-redux';
import { CardEmptyState } from './CardEmptyState';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';
import { getJitAddresses } from '../../../store/selectors';
import {
  getJitAddress,
  getJitRemainingTime,
  getJitStatusText,
} from '../../MyWorkspaces/JitRDP/JitRDP.utils';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { useTheme, Text, List } from '@fluentui/react';

type workspaceStatus = {
  workspaceName: string;
  workspaceStatus: string;
  expiryNearing: boolean;
};

export const JitStatusOverviewCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const allJitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const [workspaceJitStatus, setWorkspaceJitStatus] = React.useState<
    Array<workspaceStatus>
  >([]);
  const updateIntervalInSeconds = 10;

  const onRenderCell = (item: workspaceStatus): JSX.Element => {
    return (
      <div data-is-focusable>
        <div className={styles.listViewCell}>
          <Text className={styles.mediumCardTextEllipsis}>
            {item.workspaceName}
          </Text>
          <Text
            className={
              item.expiryNearing
                ? styles.listViewExpiredColor
                : styles.listViewRegularColor
            }
          >
            {item.workspaceStatus}
          </Text>
        </div>
      </div>
    );
  };

  const buildWorkspaceJitStatusObject = () => {
    const workspaceStatusCounts: Array<workspaceStatus> = [];
    allWorkspaces.forEach((val: AzureWorkspaceDto) => {
      let currExpirationStatus = false;
      const currWorkspace = val.Name;
      const currJitAddress = getJitAddress(allJitAddresses, val);
      let currJitStatus = getJitStatusText(currJitAddress, true);
      if (currJitStatus === 'Active') {
        const currRemainingTime = getJitRemainingTime(currJitAddress);
        currRemainingTime.isExpired
          ? (currJitStatus = 'Expired')
          : (currJitStatus =
              currRemainingTime.shortFormattedString + ' remaining');
        if (currRemainingTime.hours < 1) {
          currExpirationStatus = true;
        }
      }
      workspaceStatusCounts.push({
        workspaceName: currWorkspace,
        workspaceStatus: currJitStatus,
        expiryNearing: currExpirationStatus,
      });
    });
    setWorkspaceJitStatus(workspaceStatusCounts);
  };

  React.useEffect(() => {
    const interval = setInterval(
      buildWorkspaceJitStatusObject,
      updateIntervalInSeconds * 1000
    );
    buildWorkspaceJitStatusObject();
    return () => clearInterval(interval);
  }, [allWorkspaces, allJitAddresses]);

  return (
    <>
      <DashboardCard
        title='JIT Status Overview'
        className={styles.medDashboardCard}
      >
        {allWorkspaces.length === 0 ? (
          <CardEmptyState
            imgSrc={KittyEmptyState}
            headerText='No Workspaces'
            descriptionText='You do not have any workspaces. Select New Workspace from the side
            menu to get started.'
          />
        ) : (
          <div className={styles.listViewContainer} data-is-scrollable>
            <List items={workspaceJitStatus} onRenderCell={onRenderCell} />
          </div>
        )}
      </DashboardCard>
    </>
  );
};

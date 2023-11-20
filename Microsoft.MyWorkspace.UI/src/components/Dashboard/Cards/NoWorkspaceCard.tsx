import * as React from 'react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getDashboardStyles } from '../Dashboard.styles';
import { useTheme } from '@fluentui/react';
import { CardEmptyState } from './CardEmptyState';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';

export const NoWorkspaceCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);

  return (
    <>
      <DashboardCard
        title={'Create a Workspace'}
        className={styles.medDashboardCard}
      >
        <CardEmptyState
          imgSrc={KittyEmptyState}
          headerText={'Create a Workspace'}
          descriptionText={
            'You currently do not have any workspace deployed. Please create a custom or template workspace to get started.'
          }
        />
      </DashboardCard>
    </>
  );
};

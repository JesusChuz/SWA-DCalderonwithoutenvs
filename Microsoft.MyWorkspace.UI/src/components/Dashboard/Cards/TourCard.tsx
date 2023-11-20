import * as React from 'react';
import { useTheme, DefaultButton, Stack } from '@fluentui/react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getDashboardStyles } from '../Dashboard.styles';
import { TourModal } from '../../MyWorkspaces/AllWorkspacesView/TourModal';
import TourImage from '../../../assets/tour.svg';

export const TourCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const [isTourModalOpen, setIsTourModalOpen] = React.useState(false);

  return (
    <DashboardCard title='Tour MyWorkspace' className={styles.smDashboardCard}>
      <Stack horizontalAlign='center' tokens={{ childrenGap: 6 }}>
        <img src={TourImage} alt='Card Empty State' width={60} height={60} />
        <DefaultButton
          text='Take a Tour'
          onClick={() => setIsTourModalOpen(true)}
        />
      </Stack>
      <TourModal
        isTourModalOpen={isTourModalOpen}
        setIsTourModalOpen={setIsTourModalOpen}
      />
    </DashboardCard>
  );
};

import * as React from 'react';
import { useTheme, DefaultButton, Stack } from '@fluentui/react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getDashboardStyles } from '../Dashboard.styles';
import { TourModal } from '../../MyWorkspaces/AllWorkspacesView/TourModal';
import DocumentationImage from '../../../assets/notes.svg';
import { useHistory } from 'react-router';

export const DocumentationCard = (): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const [isTourModalOpen, setIsTourModalOpen] = React.useState(false);
  return (
    <DashboardCard
      title='Documentation Page'
      className={styles.smDashboardCard}
    >
      <Stack horizontalAlign='center' tokens={{ childrenGap: 4 }}>
        <img
          src={DocumentationImage}
          alt='Card Empty State'
          width={60}
          height={60}
        />
        <DefaultButton
          text='Go to Docs'
          onClick={() => history.push('/documentation')}
        />
      </Stack>
      <TourModal
        isTourModalOpen={isTourModalOpen}
        setIsTourModalOpen={setIsTourModalOpen}
      />
    </DashboardCard>
  );
};

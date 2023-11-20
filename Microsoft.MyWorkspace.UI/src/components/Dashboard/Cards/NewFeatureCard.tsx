import * as React from 'react';
import { DashboardCard } from '../../GeneralComponents/DashboardCards/DashboardCard';
import { getDashboardStyles } from '../Dashboard.styles';
import { useSelector } from 'react-redux';
import { useTheme, Stack } from '@fluentui/react';
import { getFeatures } from '../../../store/selectors/catalogSelectors';
import { CardEmptyState } from './CardEmptyState';
import { FeatureDto } from '../../../types/Catalog/FeatureDto.types';
import KittyEmptyState from '../../../assets/kittyEmptyPage.svg';
import sanitizeHtml from 'sanitize-html';

export const NewFeatureCard = (): JSX.Element => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);

  const newFeatureList: FeatureDto[] = useSelector(getFeatures);
  const noFeature = newFeatureList?.length === 0;
  const newestFeature: FeatureDto | undefined = noFeature
    ? null
    : newFeatureList[0];

  return (
    <>
      <DashboardCard
        title={`Newest Feature${noFeature ? '' : `: ${newestFeature.Title}`}`}
        className={styles.medDashboardCard}
      >
        {noFeature ? (
          <CardEmptyState
            imgSrc={KittyEmptyState}
            headerText={'No New Features'}
            descriptionText={
              'You are up to date with all the features of MyWorkspace! Stay tuned for any new upcoming features.'
            }
          />
        ) : (
          <div className={styles.listViewContainer} data-is-scrollable>
            <Stack horizontalAlign='start'>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(newestFeature.Body),
                }}
              ></div>
            </Stack>
          </div>
        )}
      </DashboardCard>
    </>
  );
};

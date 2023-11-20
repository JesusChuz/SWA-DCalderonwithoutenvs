import * as React from 'react';
import { useTheme, Stack } from '@fluentui/react';
import { getTours, getFeatures } from '../../store/selectors';
import { useSelector } from 'react-redux';
import Links from './Links';
import { getDocumentationStyles } from './DocumentationStyles';
import MyWorkspaceOverview from './MyWorkspaceOverview';
import NewFeatures from './NewFeatures';
import { TourDto } from '../../types/Catalog/TourDto.types';
import UserGuides from './UserGuides';
import { FeatureDto } from '../../types/Catalog/FeatureDto.types';

export const Documentation = (): JSX.Element => {
  const theme = useTheme();
  const documentationStyles = getDocumentationStyles(theme);
  const userGuideList: TourDto[] = useSelector(getTours).slice(1);
  const [showingGuides, setShowingGuides] = React.useState(false);
  const [currentGuide, setCurrentGuide] = React.useState(0);
  const newFeatureList: FeatureDto[] = useSelector(getFeatures);
  const userGuides = React.useMemo(() => {
    return userGuideList.map((userGuide) => {
      return {
        title: userGuide.Title,
        description: userGuide.Description,
        imageUrl: userGuide.ImageUrl,
      };
    });
  }, [userGuideList]);

  return (
    <Stack horizontal className={documentationStyles.body}>
      <Stack.Item className={documentationStyles.navBar}>
        <Links
          currentGuide={currentGuide}
          showingGuides={showingGuides}
          setCurrentGuide={setCurrentGuide}
          setShowingGuides={setShowingGuides}
        />
      </Stack.Item>
      {!showingGuides && (
        <Stack>
          <Stack.Item>
            <MyWorkspaceOverview />
          </Stack.Item>
          <Stack.Item>
            <Stack horizontal className={documentationStyles.cardsContainer}>
              {newFeatureList.length >= 1 && (
                <NewFeatures
                  title={newFeatureList[0].Title}
                  body={newFeatureList[0].Body}
                  imageUrl={newFeatureList[0].ImageUrl}
                />
              )}
              {newFeatureList.length >= 2 && (
                <NewFeatures
                  title={newFeatureList[1].Title}
                  body={newFeatureList[1].Body}
                  imageUrl={newFeatureList[1].ImageUrl}
                />
              )}
              {newFeatureList.length >= 3 && (
                <NewFeatures
                  title={newFeatureList[2].Title}
                  body={newFeatureList[2].Body}
                  imageUrl={newFeatureList[2].ImageUrl}
                />
              )}
            </Stack>
          </Stack.Item>
        </Stack>
      )}
      {showingGuides && (
        <Stack className={documentationStyles.userGuideBody}>
          <UserGuides
            title={
              userGuides[currentGuide] ? userGuides[currentGuide].title : ''
            }
            description={
              userGuides[currentGuide]
                ? userGuides[currentGuide].description
                : ''
            }
            imageUrl={
              userGuides[currentGuide] ? userGuides[currentGuide].imageUrl : ''
            }
          />
        </Stack>
      )}
    </Stack>
  );
};

export default Documentation;

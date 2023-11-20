/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import {
  cancelIcon,
  getContentStyles,
  getIconButtonStyles,
  stackTokens,
} from '../AllWorkspacesView/ModalStyles.styles';
import {
  Modal,
  Stack,
  useTheme,
  Text,
  FontWeights,
  FontSizes,
} from '@fluentui/react';
import {
  DefaultButton,
  IconButton,
  PrimaryButton,
} from '@fluentui/react/lib/Button';
import { FeatureDto } from '../../../types/Catalog/FeatureDto.types';
import {
  getFeatures,
  getCatalogUserProfile,
} from '../../../store/selectors/catalogSelectors';
import { updateSeenFeatures } from '../../../store/actions/catalogActions';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import postsImage from '../../../assets/PostsLight.svg';
import sanitizeHtml from 'sanitize-html';

export const NewFeatureAnnouncement = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const contentStyles = getContentStyles(theme);
  const iconButtonStyles = getIconButtonStyles(theme);
  const dispatch = useDispatch();
  const [isModalOpen, { setFalse: hideModal }] = useBoolean(true);

  const newFeatureList: FeatureDto[] = useSelector(getFeatures);
  const currUser: UserProfileDto = useSelector(getCatalogUserProfile);
  const seenFeatures: string[] = currUser.SeenFeatures;

  const [featureDisplay, setFeatureDisplay] = React.useState(0);
  const [localSeenFeatures, setLocalSeenFeatures] = React.useState([]);

  // gather a list of new features that user has not yet seen
  const unseenFeatures: FeatureDto[] = [];
  newFeatureList.forEach((elem) => {
    if (!seenFeatures.includes(elem.Id)) {
      unseenFeatures.push(elem);
    }
  });

  const hasUnseenFeatures = unseenFeatures.length !== 0;

  const closeModal = () => {
    const newSeenFeaturesList: string[] = [];
    if (hasUnseenFeatures) {
      markCurrentFeature();
      // gather a list of feature IDs that user has seen for this cycle
      for (const i in localSeenFeatures) {
        newSeenFeaturesList.push(unseenFeatures[i].Id);
      }
    }
    hideModal();
    dispatch(
      updateSeenFeatures(currUser, [...seenFeatures, ...newSeenFeaturesList])
    );
  };

  const nextFeature = () => {
    markCurrentFeature();
    setFeatureDisplay(featureDisplay + 1);
  };

  const previousFeature = () => {
    markCurrentFeature();
    setFeatureDisplay(featureDisplay - 1);
  };

  const markCurrentFeature = () => {
    setLocalSeenFeatures(localSeenFeatures);
    if (!localSeenFeatures.includes(featureDisplay)) {
      localSeenFeatures.push(featureDisplay);
    }
  };

  return (
    <>
      {!currUser.DisplayNewUserWalkthrough && hasUnseenFeatures && (
        <Stack className={contentStyles.featureContainer}>
          <Modal
            theme={theme}
            isOpen={isModalOpen}
            onDismiss={closeModal}
            isBlocking={false}
            containerClassName={contentStyles.featureContainer}
          >
            {unseenFeatures.map((currentFeature, index) => {
              const hasImage = currentFeature?.ImageUrl?.length > 0;
              return (
                <div key={index}>
                  {index === featureDisplay && (
                    <div>
                      <div className={contentStyles.header}>
                        <Text
                          id={currentFeature.Title}
                          style={{
                            fontWeight: FontWeights.semibold,
                            fontSize: FontSizes.xLargePlus,
                          }}
                        >
                          {currentFeature.Title}
                        </Text>
                        <IconButton
                          styles={iconButtonStyles}
                          iconProps={cancelIcon}
                          ariaLabel='Close popup modal for new feature announcement'
                          onClick={closeModal}
                        />
                      </div>
                      <Stack
                        horizontalAlign='center'
                        className={commonStyles.paddingTopBottom16}
                      >
                        {hasImage &&
                        currentFeature.ImageUrl.includes('.mp4') ? (
                          <video
                            autoPlay
                            loop
                            controls
                            width='90%'
                            key={currentFeature.ImageUrl}
                          >
                            <source
                              src={currentFeature.ImageUrl}
                              type='video/mp4'
                            />
                          </video>
                        ) : (
                          <img
                            src={
                              hasImage ? currentFeature.ImageUrl : postsImage
                            }
                            className={
                              hasImage
                                ? contentStyles.featureImage
                                : commonStyles.kittyWidthHeight
                            }
                            alt={
                              hasImage
                                ? 'feature-specific content for display'
                                : 'default for feature announcement display'
                            }
                          />
                        )}
                      </Stack>
                      <div
                        className={contentStyles.body}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(currentFeature.Body),
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className={contentStyles.body}>
              <Stack horizontal tokens={stackTokens}>
                {featureDisplay !== 0 && (
                  <DefaultButton text='Previous' onClick={previousFeature} />
                )}
                {featureDisplay !== unseenFeatures.length - 1 && (
                  <PrimaryButton text='Next' onClick={nextFeature} />
                )}
                {featureDisplay === unseenFeatures.length - 1 && (
                  <PrimaryButton text='Got It!' onClick={closeModal} />
                )}
              </Stack>
            </div>
          </Modal>
        </Stack>
      )}
    </>
  );
};

export { NewFeatureAnnouncement as default };

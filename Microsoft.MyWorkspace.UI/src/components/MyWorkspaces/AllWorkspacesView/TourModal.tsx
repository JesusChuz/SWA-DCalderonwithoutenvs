/* eslint-disable jsx-a11y/media-has-caption */
import * as React from 'react';
import {
  getContentStyles,
  getIconButtonStyles,
  stackTokens,
} from '../AllWorkspacesView/ModalStyles.styles';
import {
  DefaultButton,
  PrimaryButton,
  useTheme,
  Text,
  FontWeights,
  FontSizes,
  Stack,
  Modal,
  IconButton,
} from '@fluentui/react';
import { TourDto } from '../../../types/Catalog/TourDto.types';
import { useSelector } from 'react-redux';
import { getTours } from '../../../store/selectors';

interface IProps {
  isTourModalOpen: boolean;
  setIsTourModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TourModal = (props: IProps): JSX.Element => {
  const teachingPanelList: TourDto[] = useSelector(getTours);
  const theme = useTheme();
  const contentStyles = getContentStyles(theme);
  const iconButtonStyles = getIconButtonStyles(theme);
  const [teachingPanelCurrent, setTeachingPanelCurrent] = React.useState(0);

  //pre-load images into the cache to prevent flickering
  React.useEffect(() => {
    teachingPanelList.map((teachingElement) => {
      if (teachingElement.ImageUrl) {
        const img = new Image();
        img.src = teachingElement.ImageUrl;
      }
    });
  }, [teachingPanelList]);

  return (
    <Stack className={contentStyles.tourContainer}>
      <Modal
        theme={theme}
        isOpen={props.isTourModalOpen}
        onDismiss={() => props.setIsTourModalOpen(false)}
        isBlocking={false}
        containerClassName={contentStyles.tourContainer}
      >
        {teachingPanelList.map((teachingElement, index) => {
          return (
            <div key={index}>
              {index === teachingPanelCurrent && (
                <div>
                  <div className={contentStyles.header}>
                    <Text
                      style={{
                        fontWeight: FontWeights.semibold,
                        fontSize: FontSizes.xLargePlus,
                      }}
                    >
                      {teachingElement.Title}
                    </Text>
                    <IconButton
                      styles={iconButtonStyles}
                      iconProps={{ iconName: 'Cancel' }}
                      ariaLabel='Close popup modal'
                      onClick={() => props.setIsTourModalOpen(false)}
                    />
                  </div>
                  <div className={contentStyles.body}>
                    <p>{teachingElement.Description}</p>
                    <div>
                      {teachingElement.ImageUrl && (
                        <>
                          {teachingElement.ImageUrl.includes('.mp4') ? (
                            <video
                              autoPlay
                              loop
                              controls
                              width='100%'
                              key={teachingElement.ImageUrl}
                            >
                              <source
                                src={teachingElement.ImageUrl}
                                type='video/mp4'
                              />
                            </video>
                          ) : (
                            <img
                              src={teachingElement.ImageUrl}
                              alt='sample_image'
                              width='100%'
                              style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className={contentStyles.body}>
          <Stack horizontal tokens={stackTokens}>
            {teachingPanelCurrent !== 0 && (
              <DefaultButton
                text='Previous'
                onClick={() =>
                  setTeachingPanelCurrent(teachingPanelCurrent - 1)
                }
              />
            )}
            {teachingPanelCurrent !== teachingPanelList.length - 1 && (
              <PrimaryButton
                text='Next'
                onClick={() =>
                  setTeachingPanelCurrent(teachingPanelCurrent + 1)
                }
              />
            )}
            {teachingPanelCurrent === teachingPanelList.length - 1 && (
              <PrimaryButton
                text='Got It!'
                onClick={() => props.setIsTourModalOpen(false)}
              />
            )}
          </Stack>
        </div>
      </Modal>
    </Stack>
  );
};

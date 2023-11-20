import * as React from 'react';
import {
  Stack,
  Modal,
  IconButton,
  FontSizes,
  FontWeights,
  DefaultButton,
  PrimaryButton,
  useTheme,
  Text,
} from '@fluentui/react';
import {
  cancelIcon,
  getContentStyles,
  getIconButtonStyles,
  stackTokens,
} from '../AllWorkspacesView/ModalStyles.styles';
import { useSelector, useDispatch } from 'react-redux';
import { getCatalogUserProfile } from '../../../store/selectors/catalogSelectors';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import newUserImage from '../../../assets/NewUser.svg';
import { useBoolean } from '@fluentui/react-hooks';
import { TourModal } from '../AllWorkspacesView/TourModal';
import { updateNewUserWalkthroughPreference } from '../../../store/actions';

export const NewUserWalkthrough = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const contentStyles = getContentStyles(theme);
  const iconButtonStyles = getIconButtonStyles(theme);
  const [isModalOpen, { setFalse: hideModal }] = useBoolean(true);
  const [isTourModalOpen, setIsTourModalOpen] = React.useState(false);
  const currUser: UserProfileDto = useSelector(getCatalogUserProfile);

  const closeModal = () => {
    hideModal();
    dispatch(updateNewUserWalkthroughPreference(currUser, false));
  };

  return (
    <>
      {currUser.DisplayNewUserWalkthrough && (
        <Stack className={contentStyles.featureContainer}>
          <Modal
            theme={theme}
            isOpen={isModalOpen}
            onDismiss={closeModal}
            isBlocking={false}
            containerClassName={contentStyles.featureContainer}
          >
            <div className={contentStyles.header}>
              <Text
                id={currUser.ID}
                style={{
                  fontWeight: FontWeights.semibold,
                  fontSize: FontSizes.xLargePlus,
                }}
              >
                Welcome to MyWorkspace, {currUser.GivenName}!
              </Text>
              <IconButton
                styles={iconButtonStyles}
                iconProps={cancelIcon}
                ariaLabel='Close popup modal for new user welcome modal'
                onClick={closeModal}
              />
            </div>
            <Stack
              horizontalAlign='center'
              className={commonStyles.paddingTopBottom16}
            >
              <img
                src={newUserImage}
                className={commonStyles.kittyWidthHeight}
                alt={'default for new user welcome modal'}
              />
            </Stack>
            <div className={contentStyles.body}>
              <p>
                It looks like this is your first time here! Can we offer you a
                quick tour to get you started?{' '}
              </p>
              <p>
                {' '}
                To explore at your own pace, you can head to the home page and
                click on the Take a Tour label on the top right.{' '}
              </p>
              <p>
                {' '}
                For additional information, please visit the Documentation page
                from the side navigation bar.{' '}
              </p>
            </div>
            <div className={contentStyles.body}>
              <Stack horizontal tokens={stackTokens}>
                <PrimaryButton
                  text='Take a Tour'
                  onClick={() => setIsTourModalOpen(true)}
                />
                <DefaultButton text='Got It!' onClick={closeModal} />
              </Stack>
              <TourModal
                isTourModalOpen={isTourModalOpen}
                setIsTourModalOpen={setIsTourModalOpen}
              />
            </div>
          </Modal>
        </Stack>
      )}
    </>
  );
};

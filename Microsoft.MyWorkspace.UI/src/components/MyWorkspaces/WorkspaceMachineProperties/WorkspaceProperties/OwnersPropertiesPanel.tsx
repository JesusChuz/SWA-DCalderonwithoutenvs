import * as React from 'react';
import {
  Stack,
  PrimaryButton,
  List,
  Persona,
  IconButton,
  PersonaSize,
  Label,
  TooltipHost,
  Separator,
  Toggle,
  Text,
  useTheme,
} from '@fluentui/react';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { ValidatedAliasTextField } from '../../../GeneralComponents/ValidatedAliasTextField';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { AddSharedOwnerDialog } from './AddSharedOwnerDialog/addSharedOwnerDialog';
import { EditsDisabled } from '../../../../shared/helpers/WorkspaceHelper';
import { useDispatch, useSelector } from 'react-redux';
import { getCatalogUserProfile } from '../../../../store/selectors/catalogSelectors';
import { UserProfileDto } from '../../../../types/Catalog/UserProfileDto.types';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceAddSharedOwner,
  editableWorkspaceRemoveSharedOwner,
  editableWorkspaceUpdateSegmentSharing,
} from '../../../../store/actions/editableWorkspaceActions';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { InfoButton } from '../../../GeneralComponents/InfoButton';
import {
  getFeatureFlagEnableTransferOwnership,
  getFeatureFlagShareWithSegment,
  getUserRoleAssignmentConstraint,
} from '../../../../store/selectors';
import { SegmentConstraintDto } from '../../../../types/AuthService/SegmentConstraintDto.types';
import clsx from 'clsx';
import { TransferOwnerDialog } from './TransferOwnershipDialog/transferOwnerDialog';

export const OwnersPropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const userConstraint: SegmentConstraintDto = useSelector(
    getUserRoleAssignmentConstraint
  );
  const userProfile: UserProfileDto = useSelector(getCatalogUserProfile);
  const [isOwnerValid, setIsOwnerValid] = React.useState<boolean>(true);
  const [showSharedOwnerDialog, setShowSharedOwnerDialog] =
    React.useState<boolean>(false);
  const [showTransferOwnerDialog, setShowTransferOwnerDialog] =
    React.useState<boolean>(false);
  const [newOwner, setNewOwner] = React.useState('');
  const infoButtonId = 'shareWorkspaceInfoButton';
  const featureFlagShareWithSegment = useSelector(
    getFeatureFlagShareWithSegment
  );
  const featureFlagEnableTransferOwnership = useSelector(
    getFeatureFlagEnableTransferOwnership
  );

  const onRenderCell = (
    item: string,
    index: number | undefined
  ): JSX.Element => {
    const sharedOwnerIsSelf = userProfile.Mail === item;
    return (
      <Stack
        horizontal
        data-is-focusable={true}
        className={styles.listItem}
        verticalAlign='center'
        horizontalAlign='space-between'
      >
        {item !== 'No Shared Owners' ? (
          <React.Fragment>
            <Persona text={item} size={PersonaSize.size32} />
            <TooltipHost content='Delete'>
              <IconButton
                id={`delete-shared-owner-${index}`}
                iconProps={{ iconName: 'Cancel' }}
                ariaLabel='delete'
                disabled={EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace,
                  true,
                  sharedOwnerIsSelf
                )}
                onClick={() =>
                  dispatch(editableWorkspaceRemoveSharedOwner(index))
                }
              />
            </TooltipHost>
          </React.Fragment>
        ) : (
          <Text>No Shared Owners</Text>
        )}
      </Stack>
    );
  };

  return (
    <div>
      <Stack className={styles.propertiesContent}>
        <ValidatedAliasTextField
          disabled={true}
          containerClassName={commonStyles.flexItem}
          className={clsx(commonStyles.halfWidth, commonStyles.minWidth500px)}
          label='Owner'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewOwner(event.target.value);
          }}
          value={editableWorkspace.OwnerEmail}
          validationStateCallback={async (isValid: boolean) =>
            setIsOwnerValid(isValid)
          }
          valid={isOwnerValid}
          errorMessage={isOwnerValid ? '' : 'Invalid'}
        />
        {featureFlagEnableTransferOwnership && (
          <Stack
            horizontal
            verticalAlign='center'
            className={`${commonStyles.halfWidth} ${commonStyles.minWidth500px}`}
            horizontalAlign='space-between'
          >
            <Label className={commonStyles.flexItem}>Transfer Ownership</Label>
            <PrimaryButton
              iconProps={{ iconName: 'Forward' }}
              text='Select Recipient'
              disabled={EditsDisabled(
                userProfile,
                editableWorkspace,
                originalWorkspace,
                true
              )}
              onClick={() => setShowTransferOwnerDialog(true)}
            />
          </Stack>
        )}
        <Separator
          className={`${commonStyles.halfWidth} ${commonStyles.minWidth500px}`}
        />

        {featureFlagShareWithSegment &&
          (userConstraint.EnableShareWithSegment ||
            originalWorkspace.SharedWithSegment) && (
            <Stack horizontal>
              <Toggle
                label='Share workspace with all tenant segment members'
                inlineLabel
                checked={editableWorkspace.SharedWithSegment}
                disabled={EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace
                )}
                onChange={() =>
                  dispatch(
                    editableWorkspaceUpdateSegmentSharing(
                      !editableWorkspace.SharedWithSegment
                    )
                  )
                }
              />
              <InfoButton
                buttonId={infoButtonId}
                calloutTitle={'Sharing with Segment'}
                calloutBody={
                  <>
                    <Text>
                      Sharing your workspace with all segment members means that
                      everyone in your segment can view and access this
                      workspace.
                    </Text>
                    <Text>
                      This preference will only be set when the save button is
                      submitted.
                    </Text>
                    <Text className={commonStyles.errorTextBold}>
                      Please enable this only on the guidance of your Line of
                      Business lead.
                    </Text>
                  </>
                }
              />
            </Stack>
          )}
        <Stack
          horizontal
          verticalAlign='center'
          className={`${commonStyles.halfWidth} ${commonStyles.minWidth500px}`}
          horizontalAlign='space-between'
        >
          <Label className={commonStyles.flexItem}>Shared Owners</Label>
          <PrimaryButton
            iconProps={{ iconName: 'Add' }}
            text='Add Shared Owner'
            disabled={EditsDisabled(
              userProfile,
              editableWorkspace,
              originalWorkspace,
              true
            )}
            onClick={() => setShowSharedOwnerDialog(true)}
          />
        </Stack>
        <Separator
          className={`${commonStyles.halfWidth} ${commonStyles.minWidth500px}`}
        />
        <List
          className={`${commonStyles.halfWidth} ${commonStyles.minWidth500px}`}
          items={
            editableWorkspace.SharedOwnerEmails?.length > 0
              ? editableWorkspace.SharedOwnerEmails
              : ['No Shared Owners']
          }
          onRenderCell={onRenderCell}
        />
      </Stack>
      <AddSharedOwnerDialog
        showDialog={showSharedOwnerDialog}
        workspaceSharedOwners={editableWorkspace.SharedOwnerIDs}
        workspaceOwner={editableWorkspace.OwnerID}
        workspaceSharedOwnerEmails={editableWorkspace.SharedOwnerEmails}
        workspaceOwnerEmail={editableWorkspace.OwnerEmail}
        onDismiss={() => setShowSharedOwnerDialog(false)}
        onAdd={(sharedOwnerId: string, alias: string) => {
          setShowSharedOwnerDialog(false);
          dispatch(editableWorkspaceAddSharedOwner(alias, sharedOwnerId));
        }}
      />
      {featureFlagEnableTransferOwnership && (
        <TransferOwnerDialog
          workspaceId={editableWorkspace.ID}
          showDialog={showTransferOwnerDialog}
          workspaceOwner={editableWorkspace.OwnerID}
          workspaceOwnerEmail={editableWorkspace.OwnerEmail}
          onDismiss={() => setShowTransferOwnerDialog(false)}
        />
      )}
    </div>
  );
};

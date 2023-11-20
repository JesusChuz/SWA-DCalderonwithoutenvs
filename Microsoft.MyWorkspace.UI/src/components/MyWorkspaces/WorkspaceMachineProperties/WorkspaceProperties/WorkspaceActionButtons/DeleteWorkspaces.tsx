import * as React from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import {
  CommandBarButton,
  TooltipHost,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  mergeStyleSets,
  DialogType,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';

//import { deleteAzureWorkspace } from '../../store/actions/azureWorkspaceActions';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
//import { refreshAllWorkspaces } from './workspaceService';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  deleteAzureWorkspace,
  fetchAzureWorkspaces,
} from '../../../../../store/actions/azureWorkspaceActions';
import { DeleteDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import {
  getAzureWorkspaces,
  getCatalogUserProfile,
} from '../../../../../store/selectors';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';

interface IProps {
  workspaces: AzureWorkspaceDto[];
  isSingleWorkspace: boolean;
  callback?: () => void;
  onDismiss?: () => void;
  disabled?: boolean;
  variant: 'CommandBarButton' | 'ContextualMenuButton';
}

const styles = mergeStyleSets({
  commandBarButton: {
    height: '100%',
  },
  contextMenuButton: {
    width: '100%',
    height: '36px',
    textAlign: 'left',
  },
});

export const DeleteWorkspaces = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const history = useHistory();
  const userProfile = useSelector(getCatalogUserProfile);
  const workspaces = useSelector(getAzureWorkspaces);
  const [open, setOpen] = React.useState(false);

  const dispatchDeleteWorkspaces = async () => {
    let counter = props.workspaces.length;

    for (let i = 0; i < props.workspaces.length; i++) {
      deleteAzureWorkspace(props.workspaces[i].ID)(dispatch).then(() => {
        counter--;
      });
    }

    const interval = setInterval(() => {
      if (counter === 0) {
        clearInterval(interval);
        dispatch(fetchAzureWorkspaces());
        if (props.callback) {
          props.callback();
        }
      }
    }, 250);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (del: boolean) => {
    if (del) {
      dispatchDeleteWorkspaces();
      history.push('/');
    }
    setOpen(false);
    if (props.onDismiss) {
      props.onDismiss();
    }
  };

  const getButton = () => {
    return (
      <CommandBarButton
        className={
          props.variant === 'CommandBarButton'
            ? styles.commandBarButton
            : styles.contextMenuButton
        }
        ariaLabel='delete selected workspaces'
        disabled={
          props.disabled ||
          props.workspaces.length === 0 ||
          props.workspaces.some((ws, i) => {
            const originalWorkspace = workspaces.find((w) => w.ID === ws.ID);
            return DeleteDisabled(
              userProfile,
              ws,
              originalWorkspace === undefined ? ws : originalWorkspace
            );
          })
        }
        text='Delete'
        iconProps={{
          iconName: 'Delete',
          styles:
            props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
        }}
        onClick={handleOpen}
        data-custom-parentid='Delete Workspace Button'
      />
    );
  };

  const toolTip =
    props.disabled || props.workspaces.length === 0
      ? 'select a workspace to delete'
      : 'Delete ' + (props.isSingleWorkspace ? 'Workspace' : 'Workspaces');

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={toolTip}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return (
    <React.Fragment>
      {getComponent()}
      <Dialog
        hidden={!open}
        onDismiss={() => {
          setOpen(false);
          if (props.onDismiss) {
            props.onDismiss();
          }
        }}
        dialogContentProps={{
          title:
            'Delete ' +
            (props.isSingleWorkspace ? 'Workspace' : 'Workspaces') +
            '?',
          type: DialogType.normal,
          subText:
            'You will be deleting the following ' +
            (props.isSingleWorkspace ? 'workspace.' : 'workspaces.'),
        }}
        modalProps={{ isBlocking: true }}
      >
        <Stack>
          {props.workspaces.map((v: AzureWorkspaceDto) => (
            <Text className={commonStyles.flexItem} key={v.ID} variant='medium'>
              {v.Name}
            </Text>
          ))}
        </Stack>

        <DialogFooter>
          <PrimaryButton onClick={() => handleClose(true)} text='Delete' />
          <DefaultButton onClick={() => handleClose(false)} text='Cancel' />
        </DialogFooter>
      </Dialog>
    </React.Fragment>
  );
};

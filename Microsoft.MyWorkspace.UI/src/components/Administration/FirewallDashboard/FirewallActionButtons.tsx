import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
  CommandBarButton,
  TooltipHost,
  IconButton,
  IContextualMenuItem,
  useTheme,
} from '@fluentui/react';

import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { HubNetworkDto } from '../../../types/FirewallManager/HubNetworkDto';
import {
  deleteConfigProfile,
  setSelectedAdminFirewallHubId,
  setSelectedAdminFirewallId,
  setSelectedConfigProfile,
} from '../../../store/actions/adminFirewallActions';
import { ConfigProfileDto } from '../../../types/FirewallManager/ConfigProfileDto.types';
import { showUserConfirmationDialog } from '../../../store/actions';

interface ActionButtonProps {
  disabled?: boolean;
  editActionFunction?: () => void;
}

interface IConfigProfileProps extends ActionButtonProps {
  configProfile: ConfigProfileDto;
}

interface IFirewallButtonProps extends ActionButtonProps {
  firewall: FirewallHubNetworkInfoDto;
}

interface IHubButtonProps extends ActionButtonProps {
  hub: HubNetworkDto;
}

const contextMenuStyles = {
  root: {
    color: '#004fa9',
    selectors: {
      '&:hover': {
        color: '#004fa9',
      },
      '&:active': {
        color: '#0064bf',
      },
    },
  },
};

export const ViewHubsButton = (props: IFirewallButtonProps): JSX.Element => {
  const disabled = props.disabled;
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  return (
    <CommandBarButton
      className={commonStyles.contextMenuButton}
      ariaLabel='manage firewall'
      disabled={disabled}
      text='Manage Firewall'
      role={'menuitem'}
      iconProps={{
        iconName: 'DOM',
        styles: contextMenuStyles,
      }}
      onClick={() =>
        history.push(
          `/admin/FirewallManagement/${props.firewall.FirewallSettings.ID}`
        )
      }
    />
  );
};

export const FirewallActionsButton = (
  props: IFirewallButtonProps
): JSX.Element => {
  const dispatch = useDispatch();

  const getButton = () => {
    const items: IContextualMenuItem[] = [
      {
        key: props.firewall.FirewallSettings.ID + ' properties',
        text: 'Properties',
        role: 'menuitem',
        iconProps: { iconName: 'Edit' },
        onClick: () => {
          dispatch(
            setSelectedAdminFirewallId(props.firewall.FirewallSettings.ID)
          );
        },
      },
      {
        key: props.firewall.FirewallSettings.ID + ' Hub Networks',
        onRender: () => (
          <ViewHubsButton firewall={props.firewall} disabled={props.disabled} />
        ),
      },
    ];

    return (
      <IconButton
        id={props.firewall.FirewallSettings.ID}
        aria-label={`firewall properties for ${props.firewall.FirewallSettings.Name}`}
        iconProps={{ iconName: 'MoreVertical' }}
        onRenderMenuIcon={() => null}
        menuProps={{
          items: items,
        }}
      />
    );
  };
  return <TooltipHost content={'Firewall Actions'}>{getButton()}</TooltipHost>;
};

export const HubNetworkActionsButton = (
  props: IHubButtonProps
): JSX.Element => {
  const dispatch = useDispatch();

  const getButton = () => {
    const items: IContextualMenuItem[] = [
      {
        key: props.hub.ID + ' properties',
        text: 'Properties',
        role: 'menuitem',
        iconProps: { iconName: 'Edit' },
        onClick: () => {
          dispatch(
            setSelectedAdminFirewallHubId(props.hub.FirewallID, props.hub.ID)
          );
        },
      },
    ];

    return (
      <IconButton
        id={props.hub.ID}
        aria-label={`hub network properties for ${props.hub.Name}`}
        iconProps={{ iconName: 'MoreVertical' }}
        onRenderMenuIcon={() => null}
        menuProps={{
          items: items,
        }}
      />
    );
  };
  return (
    <TooltipHost content={'Hub Network Actions'}>{getButton()}</TooltipHost>
  );
};

export const ConfigProfileActionsButton = (
  props: IConfigProfileProps
): JSX.Element => {
  const dispatch = useDispatch();
  const getButton = () => {
    const items: IContextualMenuItem[] = [
      {
        key: props.configProfile.ID + ' properties',
        text: 'Properties',
        role: 'menuitem',
        iconProps: { iconName: 'Edit' },
        onClick: () => {
          dispatch(setSelectedConfigProfile(props.configProfile.ID));
        },
      },
      {
        key: props.configProfile.ID + ' delete',
        text: 'Delete',
        role: 'menuitem',
        iconProps: { iconName: 'Delete' },
        onClick: () => {
          dispatch(
            showUserConfirmationDialog(
              'Delete configuration profile?',
              `This action cannot be undone.`,
              () => dispatch(deleteConfigProfile(props.configProfile.ID))
            )
          );
        },
      },
    ];

    return (
      <IconButton
        id={props.configProfile.ID}
        aria-label={`${props.configProfile.Name} properties`}
        iconProps={{ iconName: 'MoreVertical' }}
        onRenderMenuIcon={() => null}
        menuProps={{
          items: items,
        }}
      />
    );
  };
  return (
    <TooltipHost content={'Configuration Profile Actions'}>
      {getButton()}
    </TooltipHost>
  );
};

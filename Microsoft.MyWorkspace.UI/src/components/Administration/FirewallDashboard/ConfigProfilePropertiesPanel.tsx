import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Panel,
  PanelType,
  TextField,
  Text,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminFirewalls,
  getSelectedConfigProfile,
  getSelectedConfigProfileErrors,
  getSelectedConfigProfileHasChanges,
  getSelectedConfigProfileValid,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  resetSelectedConfigProfile,
  saveSelectedConfigProfile,
  setSelectedConfigProfile,
  updateSelectedConfigProfile,
} from '../../../store/actions/adminFirewallActions';
import { ConfigProfileDto } from '../../../types/FirewallManager/ConfigProfileDto.types';

export const ConfigProfilePropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const firewalls = useSelector(getAdminFirewalls);

  const errors = useSelector(getSelectedConfigProfileErrors);

  const valid = useSelector(getSelectedConfigProfileValid);

  const profile: ConfigProfileDto = useSelector(getSelectedConfigProfile);

  const changes: boolean = useSelector(getSelectedConfigProfileHasChanges);

  const firewallCount = React.useMemo(() => {
    return firewalls.reduce((count, f) => {
      return f.FirewallSettings.ConfigID === profile?.ID ? count + 1 : count;
    }, 0);
  }, [firewalls, profile]);

  const handleClose = async (save: boolean) => {
    if (save) {
      dispatch(saveSelectedConfigProfile());
    } else {
      dispatch(setSelectedConfigProfile(''));
    }
  };

  const resetChanges = () => {
    dispatch(resetSelectedConfigProfile());
  };

  React.useEffect(() => {
    if (profile) {
      setPanelOpen(true);
    } else {
      setPanelOpen(false);
    }
  }, [profile]);

  return (
    <>
      {profile && (
        <Panel
          isOpen={panelOpen}
          onDismiss={() => handleClose(false)}
          headerText={`${profile.Name} Properties`}
          closeButtonAriaLabel='Close'
          customWidth={'450px'}
          type={PanelType.custom}
        >
          <Text
            variant='mediumPlus'
            as='h3'
          >{`${firewallCount} firewalls associated with this Configuration Profile`}</Text>
          <Stack
            className={commonStyles.paddingTop12}
            color={'red'}
            tokens={{ childrenGap: 8 }}
          >
            <TextField
              id='id'
              label='ID'
              ariaLabel='configuration profile id'
              readOnly
              value={profile.ID}
            />
            <TextField
              id='name'
              label='Name'
              ariaLabel='configuration profile name'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    Name: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.nameError}
              value={profile.Name}
            />
            <TextField
              id='description'
              label='Description'
              ariaLabel='configuration profile description'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    Description: event.currentTarget.value,
                  })
                )
              }
              value={profile.Description}
            />
            <TextField
              id='TCPPorts'
              label='TCP Ports'
              ariaLabel='tcp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    TcpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.tcpError}
              value={profile.TcpPorts}
            />
            <TextField
              id='UDPPorts'
              label='UDP Ports'
              ariaLabel='udp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    UdpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.udpError}
              value={profile.UdpPorts}
            />
            <TextField
              id='OutboundTCPPorts'
              label='Outbound TCP Ports'
              ariaLabel='outbound tcp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    OutboundTcpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.outboundTcpError}
              value={profile.OutboundTcpPorts}
            />
            <TextField
              id='OutboundUDPPorts'
              label='Outbound UDP Ports'
              ariaLabel='outbound udp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    OutboundUdpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.outboundUdpError}
              value={profile.OutboundUdpPorts}
            />
            <TextField
              id='tags'
              label='Tags'
              ariaLabel='tags'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedConfigProfile({
                    ...profile,
                    Tags: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.tagsError}
              value={profile.Tags}
            />
            <Stack
              className={commonStyles.paddingTop12}
              horizontal
              tokens={{ childrenGap: 8 }}
            >
              <PrimaryButton
                onClick={() => handleClose(true)}
                text='Save'
                disabled={!changes || !valid}
              />
              <DefaultButton
                onClick={() => resetChanges()}
                text='Cancel'
                disabled={!changes}
              />
            </Stack>
          </Stack>
        </Panel>
      )}
    </>
  );
};

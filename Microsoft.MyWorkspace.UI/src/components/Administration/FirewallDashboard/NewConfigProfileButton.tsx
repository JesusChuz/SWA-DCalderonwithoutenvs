import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Panel,
  PanelType,
  TextField,
  CommandBarButton,
  TooltipHost,
  DirectionalHint,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNewConfigProfile,
  getNewConfigProfileErrors,
  getNewConfigProfileHasChanges,
  getNewConfigProfileValid,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  createConfigProfile,
  resetNewConfigProfile,
  updateNewConfigProfile,
} from '../../../store/actions/adminFirewallActions';

export const NewConfigProfileButton = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const changes = useSelector(getNewConfigProfileHasChanges);
  const valid = useSelector(getNewConfigProfileValid);
  const errors = useSelector(getNewConfigProfileErrors);
  const newProfile = useSelector(getNewConfigProfile);

  const handleClose = (save: boolean) => {
    setPanelOpen(false);
    if (save) {
      dispatch(createConfigProfile());
    }
  };

  const resetChanges = () => {
    dispatch(resetNewConfigProfile());
  };

  React.useEffect(() => {
    resetChanges();
  }, [panelOpen]);

  return (
    <>
      <CommandBarButton
        className={commonStyles.fullHeight}
        iconProps={{ iconName: 'Add' }}
        text='New Configuration Profile'
        onClick={() => setPanelOpen(true)}
      />
      <Panel
        isOpen={panelOpen}
        onDismiss={() => handleClose(false)}
        headerText={'New Configuration Profile'}
        closeButtonAriaLabel='Close'
        customWidth={'450px'}
        type={PanelType.custom}
      >
        <Stack
          className={commonStyles.paddingTop12}
          tokens={{ childrenGap: 8 }}
        >
          <TextField
            id='name'
            label='Name'
            ariaLabel='configuration profile name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewConfigProfile({
                  ...newProfile,
                  Name: event.currentTarget.value,
                })
              )
            }
            errorMessage={errors.nameError}
            value={newProfile.Name}
          />
          <TextField
            id='description'
            label='Description'
            ariaLabel='configuration profile description'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewConfigProfile({
                  ...newProfile,
                  Description: event.currentTarget.value,
                })
              )
            }
            value={newProfile.Description}
          />
          <TooltipHost
            directionalHint={DirectionalHint.topLeftEdge}
            content='Transmission Control Protocol'
          >
            <TextField
              id='TCPPorts'
              label='TCP Ports'
              ariaLabel='tcp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateNewConfigProfile({
                    ...newProfile,
                    TcpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.tcpError}
              value={newProfile.TcpPorts}
            />
          </TooltipHost>
          <TooltipHost
            directionalHint={DirectionalHint.topLeftEdge}
            content='User Datagram Protocol'
          >
            <TextField
              id='UDPPorts'
              label='UDP Ports'
              ariaLabel='udp ports'
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateNewConfigProfile({
                    ...newProfile,
                    UdpPorts: event.currentTarget.value,
                  })
                )
              }
              errorMessage={errors.udpError}
              value={newProfile.UdpPorts}
            />
          </TooltipHost>
          <TextField
            id='OutboundTCPPorts'
            label='Outbound TCP Ports'
            ariaLabel='outbound tcp ports'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewConfigProfile({
                  ...newProfile,
                  OutboundTcpPorts: event.currentTarget.value,
                })
              )
            }
            errorMessage={errors.outboundTcpError}
            value={newProfile.OutboundTcpPorts}
          />
          <TextField
            id='OutboundUDPPorts'
            label='Outbound UDP Ports'
            ariaLabel='outbound udp ports'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewConfigProfile({
                  ...newProfile,
                  OutboundUdpPorts: event.currentTarget.value,
                })
              )
            }
            errorMessage={errors.outboundUdpError}
            value={newProfile.OutboundUdpPorts}
          />
          <TextField
            id='Tags'
            label='Tags'
            ariaLabel='tags'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewConfigProfile({
                  ...newProfile,
                  Tags: event.currentTarget.value,
                })
              )
            }
            errorMessage={errors.tagsError}
            value={newProfile.Tags}
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
    </>
  );
};

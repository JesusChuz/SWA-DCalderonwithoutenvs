import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Panel,
  PanelType,
  TextField,
  CommandBarButton,
  IDropdownOption,
  Dropdown,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFirewallDeploymentErrors,
  getFirewallDeploymentRegions,
  getFirewallTenants,
  getNewFirewallDeployment,
  isFirewallDeploymentValid,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  deployNewFirewall,
  fetchFirewallDeploymentRegions,
  fetchFirewallTenants,
  setNewFirewallDeployment,
  updateNewFirewallDeployment,
} from '../../../store/actions/adminFirewallActions';
import { FirewallDeploymentDto } from '../../../types/FirewallManager/FirewallDeploymentDto';
import { FirewallDeploymentErrors } from '../../../types/Forms/FirewallDeploymentErrors.types';
import { FirewallTenantDto } from '../../../types/FirewallManager/FirewallTenantDto';

export const NewFirewallButton = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const newFirewallDeployment: FirewallDeploymentDto = useSelector(
    getNewFirewallDeployment
  );

  const firewallDeploymentErrors: FirewallDeploymentErrors = useSelector(
    getFirewallDeploymentErrors
  );

  const isValid: boolean = useSelector(isFirewallDeploymentValid);

  const deploymentRegions: string[] = useSelector(getFirewallDeploymentRegions);
  const firewallTenants: FirewallTenantDto[] = useSelector(getFirewallTenants);

  const deploymentRegionsOptions = React.useMemo(() => {
    return deploymentRegions.map((r) => ({ key: r, text: r }));
  }, [deploymentRegions]);

  const firewallTenantOptions = React.useMemo(() => {
    return firewallTenants.map((ft) => ({ key: ft.Id, text: ft.Name }));
  }, [firewallTenants]);

  const handleDeploy = async (save: boolean) => {
    setPanelOpen(false);
    if (save) {
      dispatch(deployNewFirewall(newFirewallDeployment));
      setPanelOpen(false);
    }
  };

  const handleClose = () => {
    dispatch(setNewFirewallDeployment());
    setPanelOpen(false);
  };

  React.useEffect(() => {
    dispatch(fetchFirewallDeploymentRegions());
    dispatch(fetchFirewallTenants());
  }, []);

  return (
    <>
      <CommandBarButton
        className={commonStyles.fullHeight}
        iconProps={{ iconName: 'Add' }}
        text='New Firewall'
        onClick={() => setPanelOpen(true)}
      />
      <Panel
        isOpen={panelOpen}
        onDismiss={() => handleDeploy(false)}
        headerText={`New Firewall`}
        closeButtonAriaLabel='Close'
        customWidth={'450px'}
        type={PanelType.custom}
      >
        <Stack
          className={commonStyles.paddingTop12}
          tokens={{ childrenGap: 8 }}
        >
          <TextField
            id='subscription'
            label='Subscription ID'
            maxLength={36}
            ariaLabel='subscription'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewFirewallDeployment({
                  ...newFirewallDeployment,
                  SubscriptionId: event.currentTarget.value,
                })
              )
            }
            value={newFirewallDeployment.SubscriptionId}
            errorMessage={firewallDeploymentErrors.SubscriptionIdErrorMessage}
          />
          <Dropdown
            selectedKey={newFirewallDeployment.AzureRegion}
            label='Select Deployment Region'
            placeholder='None'
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              item: IDropdownOption
            ) => {
              dispatch(
                updateNewFirewallDeployment({
                  ...newFirewallDeployment,
                  AzureRegion: item.text,
                })
              );
            }}
            options={deploymentRegionsOptions}
            ariaLabel='Select Deployment Region'
            errorMessage={firewallDeploymentErrors.AzureRegionErrorMessage}
          />
          <Dropdown
            selectedKey={newFirewallDeployment.FirewallTenantId}
            label='Select Firewall Tenant'
            placeholder='None'
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              item: IDropdownOption
            ) => {
              dispatch(
                updateNewFirewallDeployment({
                  ...newFirewallDeployment,
                  FirewallTenantId: item.key.toString(),
                })
              );
            }}
            options={firewallTenantOptions}
            ariaLabel='Select Firewall Tenant'
            errorMessage={firewallDeploymentErrors.FirewallTenantErrorMessage}
          />
          <Stack
            className={commonStyles.paddingTop12}
            horizontal
            tokens={{ childrenGap: 8 }}
          >
            <PrimaryButton
              onClick={() => handleDeploy(true)}
              text='Deploy!'
              disabled={!isValid}
            />
            <DefaultButton onClick={() => handleClose()} text='Cancel' />
          </Stack>
        </Stack>
      </Panel>
    </>
  );
};

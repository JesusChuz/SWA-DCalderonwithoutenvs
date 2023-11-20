import {
  COMMASEPARATEDNUMBERSANDLETTERSANDSPACESANDHIPHENS,
  COMMASEPARATEDNUMBERSANDRANGES,
} from '../../shared/Regex';
import { ConfigProfileDto } from '../../types/FirewallManager/ConfigProfileDto.types';
import { FirewallDeploymentDto } from '../../types/FirewallManager/FirewallDeploymentDto';
import { ConfigProfileErrors } from '../../types/Forms/ConfigProfileErrors.types';
import { ConfigProfileForCreationDto } from '../../types/ResourceCreation/ConfigProfileForCreationDto.types';
import {
  FirewallTagsError,
  NoError,
  FirewallPortRangeError,
  RequiredText,
  FirewallDeploymentSubscriptionIdError,
  FirewallDeploymentAzureRegionEmptyError,
  FirewallDeploymentFirewallTenantError,
} from './ErrorConstants';
import { validate as uuidValidate, NIL as EmptyGuid } from 'uuid';
import { FirewallDeploymentErrors } from '../../types/Forms/FirewallDeploymentErrors.types';

export const validateConfigProfile = (
  profile: ConfigProfileDto | ConfigProfileForCreationDto,
  checkDirty: boolean
): ConfigProfileErrors => {
  return {
    nameError: profile?.Name.length > 0 ? NoError : RequiredText,
    tcpError:
      checkDirty && profile?.TcpPorts === null
        ? NoError
        : validatePortRange(profile?.TcpPorts),
    outboundTcpError:
      checkDirty && profile?.OutboundTcpPorts === null
        ? NoError
        : validatePortRange(profile?.OutboundTcpPorts),
    udpError:
      checkDirty && profile?.UdpPorts === null
        ? NoError
        : validatePortRange(profile?.UdpPorts),
    outboundUdpError:
      checkDirty && profile?.OutboundUdpPorts === null
        ? NoError
        : validatePortRange(profile?.OutboundUdpPorts),
    tagsError:
      checkDirty && profile?.Tags === null
        ? NoError
        : validateTags(profile?.Tags),
  };
};

const validatePortRange = (value: string): string => {
  if (!value) {
    return RequiredText;
  } else {
    return COMMASEPARATEDNUMBERSANDRANGES.test(value)
      ? NoError
      : FirewallPortRangeError;
  }
};

const validateTags = (value: string): string => {
  if (!value) {
    return RequiredText;
  } else {
    return COMMASEPARATEDNUMBERSANDLETTERSANDSPACESANDHIPHENS.test(value)
      ? NoError
      : FirewallTagsError;
  }
};

export const validateFirewallDeployment = (
  firewallDeployment: FirewallDeploymentDto
): FirewallDeploymentErrors => {
  return {
    SubscriptionIdErrorMessage:
      !uuidValidate(firewallDeployment.SubscriptionId) ||
      firewallDeployment.SubscriptionId === EmptyGuid
        ? FirewallDeploymentSubscriptionIdError
        : NoError,
    AzureRegionErrorMessage:
      firewallDeployment.AzureRegion.length <= 0
        ? FirewallDeploymentAzureRegionEmptyError
        : NoError,
    FirewallTenantErrorMessage:
      !uuidValidate(firewallDeployment.FirewallTenantId) ||
      firewallDeployment.FirewallTenantId === EmptyGuid
        ? FirewallDeploymentFirewallTenantError
        : NoError,
  };
};

import {
  FirewallDeploymentAzureRegionEmptyError,
  FirewallDeploymentSubscriptionIdError,
  FirewallPortRangeError,
  FirewallTagsError,
  NoError,
  RequiredText,
} from '../../../store/validators/ErrorConstants';
import {
  validateConfigProfile,
  validateFirewallDeployment,
} from '../../../store/validators/firewallManagementValidators';
import { ConfigProfileDto } from '../../../types/FirewallManager/ConfigProfileDto.types';
import { FirewallDeploymentDto } from '../../../types/FirewallManager/FirewallDeploymentDto';
import { ConfigProfileDtoTestData } from '../../data/ConfigProfileDtoTestData';
import { NIL as EmptyGuid } from 'uuid';

describe('Firewall Management Validator Tests', () => {
  test('validateConfigProfile returns errors for each invalid field when dirty', () => {
    const data: ConfigProfileDto = {
      ID: 'test-id',
      Name: '',
      Description: '',
      TcpPorts: '',
      UdpPorts: '',
      OutboundTcpPorts: '',
      OutboundUdpPorts: '',
      Tags: '',
    };
    const errors = validateConfigProfile(data, true);
    expect(errors.nameError).toBe(RequiredText);
    expect(errors.tcpError).toBe(RequiredText);
    expect(errors.outboundTcpError).toBe(RequiredText);
    expect(errors.udpError).toBe(RequiredText);
    expect(errors.outboundUdpError).toBe(RequiredText);
    expect(errors.tagsError).toBe(RequiredText);
  });

  test('validateConfigProfile returns empty for each field when dirty', () => {
    const errors = validateConfigProfile(ConfigProfileDtoTestData, true);
    expect(errors.nameError).toBe(NoError);
    expect(errors.tcpError).toBe(NoError);
    expect(errors.outboundTcpError).toBe(NoError);
    expect(errors.udpError).toBe(NoError);
    expect(errors.outboundUdpError).toBe(NoError);
    expect(errors.tagsError).toBe(NoError);
  });

  test('validateConfigProfile returns errors for each invalid non-empty field when dirty', () => {
    const data: ConfigProfileDto = {
      ID: 'test-id',
      Name: 'TestName',
      Description: 'TestDescription',
      TcpPorts: '333,',
      UdpPorts: '444-444,44-',
      OutboundTcpPorts: 'd',
      OutboundUdpPorts: '53,',
      Tags: 'tags,error,,',
    };
    const errors = validateConfigProfile(data, true);
    expect(errors.nameError).toBe(NoError);
    expect(errors.tcpError).toBe(FirewallPortRangeError);
    expect(errors.outboundTcpError).toBe(FirewallPortRangeError);
    expect(errors.udpError).toBe(FirewallPortRangeError);
    expect(errors.outboundUdpError).toBe(FirewallPortRangeError);
    expect(errors.tagsError).toBe(FirewallTagsError);
  });
});

test('validateFirewallDeployment returns errors for each invalid entry.', () => {
  const data: FirewallDeploymentDto = {
    AzureRegion: '',
    SubscriptionId: EmptyGuid,
    FirewallTenantId: '',
  };

  const errors = validateFirewallDeployment(data);
  expect(errors.AzureRegionErrorMessage).toBe(
    FirewallDeploymentAzureRegionEmptyError
  );
  expect(errors.SubscriptionIdErrorMessage).toBe(
    FirewallDeploymentSubscriptionIdError
  );
});

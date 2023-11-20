import { ConfigProfileDto } from '../../types/FirewallManager/ConfigProfileDto.types';

export const ConfigProfileDtoTestData: ConfigProfileDto = {
  Name: 'Firewall Setting',
  ID: 'test-id',
  Description: 'test description',
  OutboundTcpPorts: '443',
  OutboundUdpPorts: '444',
  TcpPorts: '443',
  UdpPorts: '444',
  Tags: 'tag1,tag2',
};

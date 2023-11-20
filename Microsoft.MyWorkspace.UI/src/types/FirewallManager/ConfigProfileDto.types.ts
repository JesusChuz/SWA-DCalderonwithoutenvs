export interface ConfigProfileDto {
  ID: string;
  Name: string;
  Description: string;
  // Property must follow the pattern of https://regex101.com/r/bppHS4/1 : Comma separated list of numbers or ranged numbers.
  OutboundTcpPorts: string;
  // Property must follow the pattern of https://regex101.com/r/bppHS4/1 : Comma separated list of numbers or ranged numbers.
  OutboundUdpPorts: string;
  // Property must follow the pattern of https://regex101.com/r/bppHS4/1 : Comma separated list of numbers or ranged numbers.
  TcpPorts: string;
  // String operand must follow the pattern of https://regex101.com/r/p1R8ia/1 : Comma separated list of numbers or ranged numbers.
  UdpPorts: string;
  // Property must follow the pattern of https://regex101.com/r/7my8z6/1 : Comma separated list of numbers and letters.
  Tags: string;
}

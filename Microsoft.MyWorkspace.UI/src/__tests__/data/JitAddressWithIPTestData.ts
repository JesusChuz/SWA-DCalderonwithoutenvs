import { JitAddressWithIP } from '../../types/FirewallManager/JitAddressWithIP';

export const JitAddressWithIPTestData: JitAddressWithIP = {
  IP: '',
  Addresses: [],
};

export const getTestJitAddressWithIPDto = (
  properties: Partial<JitAddressWithIP> = {}
): JitAddressWithIP => {
  return {
    ...JitAddressWithIPTestData,
    ...properties,
  };
};

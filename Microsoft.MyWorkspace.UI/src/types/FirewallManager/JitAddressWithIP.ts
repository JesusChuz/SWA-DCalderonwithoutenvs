import { JitAddressDto } from './JitAddressDto';

export interface JitAddressWithIP {
  IP: string;
  Addresses: JitAddressDto[];
}

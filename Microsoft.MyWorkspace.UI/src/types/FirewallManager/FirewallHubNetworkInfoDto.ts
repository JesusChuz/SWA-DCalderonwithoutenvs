import { FirewallSettingsDto } from './FirewallSettingsDto';
import { HubNetworkDto } from './HubNetworkDto';

export interface FirewallHubNetworkInfoDto {
  FirewallSettings: FirewallSettingsDto;
  TotalAssociatedHubNetworks: number;
  TotalSpokeNetworkConsumed: number;
  MaxSpokeAllowed: number;
  AssociatedHubNetworks: HubNetworkDto[];
}

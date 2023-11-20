export interface RegionDto {
  ID: string;
  Name: string;
  IsPublished: boolean;
  SubscriptionID: string;
  Location: string;
  NumberOfAvailableSKUs: number;
  NumberOfTotalSKUs: number;
  FirewallID: string;
  JitEnabled: boolean;
}

export interface AzureSubscriptionQuotaStatusDto {
  WorkspaceTenantName: string;
  WorkspaceTenantId: string;
  SubscriptionName: string;
  SubscriptionId: string;
  Geography: string;
  Region: string;
  RouteTable: string;
  RouteTableCapacityPercentage: number;
  StandardBSFamilyvCPUs: string;
  StandardBSFamilyCapacityPercentage: number;
  StandardDSv4FamilyvCPUs: string;
  StandardDSv4FamilyCapacityPercentage: number;
  OverAllCapacityStatus: string;
  ResourceGroupCapacity: number;
}

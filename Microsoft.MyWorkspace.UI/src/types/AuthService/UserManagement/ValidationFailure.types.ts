import { ResourceType } from './ResourceType.types';

export interface ValidationFailure {
  ResourceId: string;
  ResourceType: ResourceType;
  ResourceName: string;
  ErrorMessage: string;
}

import { NodeType } from './enums/NodeType';
import { TaskStatus } from '../AzureWorkspace/enums/TaskStatus';
import { TaskOperation } from '../AzureWorkspace/enums/TaskOperation';
import { ResourceState } from '../AzureWorkspace/enums/ResourceState';

export interface TelemetryGraphNodeDto {
  Name: string;
  NodeType: NodeType;
  NodeSubType: string;
  ResourceAzureDeepLink: string;
  Status: TaskStatus;
  CorrelationId: string;
  TaskOperation: TaskOperation;
  ResourceState: ResourceState;
  HttpStatusCode: number;
  HttpVerb: string;
  ApiRoute: string;
  HttpBody: string;
  Parent: string;
  Children: TelemetryGraphNodeDto[];
  TimeStamp: string;
  ErrorMessage: string;
  HasPathError: boolean;
}

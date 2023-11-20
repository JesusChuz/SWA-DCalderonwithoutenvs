import { TelemetryGraphNodeDto } from '../../../../../../types/Telemetry/TelemetryGraphNodeDto.types';
import { NodeType, TaskOperation, TaskStatus } from './TreeEnums';

const VM_IMAGE = { name: 'telemetrytree/vm.png', size: 18, radius: 12 };
const WORKSPACE_IMAGE = {
  name: 'telemetrytree/workspace.png',
  size: 18,
  radius: 28,
};
const DISK_IMAGE = { name: 'telemetrytree/disk.png', size: 18, radius: 28 };
const NETWORK_IMAGE = {
  name: 'telemetrytree/network.png',
  size: 18,
  radius: 28,
};
const TASKGENERATOR_IMAGE = {
  name: 'telemetrytree/task_generator.png',
  size: 18,
  radius: 28,
};

const API_IMAGE = {
  name: 'telemetrytree/api.png',
  size: 18,
  radius: 28,
};

const VMEXTENSION_IMAGE = {
  name: 'telemetrytree/vm_extension.png',
  size: 18,
  radius: 28,
};

const NIC_IMAGE = {
  name: 'telemetrytree/nic.png',
  size: 18,
  radius: 28,
};

const UDR_IMAGE = {
  name: 'telemetrytree/azureudr.png',
  size: 18,
  radius: 28,
};

const NSG_IMAGE = {
  name: 'telemetrytree/nsg.png',
  size: 18,
  radius: 28,
};

const RG_IMAGE = {
  name: 'telemetrytree/rg.png',
  size: 18,
  radius: 28,
};

const SPOKEPEERING_IMAGE = {
  name: 'telemetrytree/spokepeering.png',
  size: 18,
  radius: 28,
};

const VMPOWERTASK_IMAGE = {
  name: 'telemetrytree/vmpower.png',
  size: 18,
  radius: 28,
};

export const getNodeDescription = (node: TelemetryGraphNodeDto) => {
  let i = ' ';
  switch (node.NodeType) {
    case NodeType.Workspace:
      i = TaskStatus[node.Status as TaskStatus];
      break;
    case NodeType.TaskGenerator:
      i = 'TaskGen';
      break;
    case NodeType.Task:
      i = TaskStatus[node.Status as TaskStatus];
      break;
    case NodeType.Resource:
      i = TaskOperation[node.TaskOperation as TaskOperation];
      break;
    case NodeType.TaskApi:
      i = TaskStatus[node.Status as TaskStatus];
      break;
  }

  return i;
};

export const getNodeClass = (
  node: TelemetryGraphNodeDto,
  collapsed: boolean
) => {
  let i = getNodeCircleClassFromHttpStatusCode(node.HttpStatusCode, collapsed);
  switch (node.NodeType) {
    case NodeType.Workspace:
    case NodeType.TaskGenerator:
    case NodeType.Task:
    case NodeType.Resource:
    case NodeType.TaskApi:
      i = getNodeCircleClassFromHttpStatusCode(node.HttpStatusCode, collapsed);
      break;
  }

  return i;
};

export const getNodeCircleClassFromHttpStatusCode = (
  statusCode: number,
  collapsed: boolean
) => {
  if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
    return collapsed
      ? 'circle-succeeded-collapsed'
      : 'circle-succeeded-expanded';
  }

  return collapsed ? 'circle-failed-collapsed' : 'circle-failed-expanded';
};

export const getNodeImage = function (node: TelemetryGraphNodeDto) {
  let i = undefined;
  switch (node.NodeType) {
    case NodeType.Workspace:
      i = WORKSPACE_IMAGE;
      break;
    case NodeType.TaskGenerator:
      i = TASKGENERATOR_IMAGE;
      break;
    case NodeType.Task:
    case NodeType.Resource:
      i = getNodeSubTypeImage(node);
      break;
    case NodeType.TaskApi:
      i = API_IMAGE;
      break;
  }

  return i;
};

export const getLinkClass = function (node: TelemetryGraphNodeDto) {
  return node.HasPathError ? 'link-failed' : 'link';
};

export const getNodeSubTypeImage = (node: TelemetryGraphNodeDto) => {
  const nodeSubType =
    node.NodeType === NodeType.Resource
      ? node.NodeSubType + 'task'
      : node.NodeSubType;
  let i = undefined;
  switch (nodeSubType) {
    case 'azureextensiontask':
      i = VMEXTENSION_IMAGE;
      break;
    case 'azurevirtualmachinegeneralizedtask':
    case 'azurevirtualmachinetask':
      i = VM_IMAGE;
      break;
    case 'azurenictask':
      i = NIC_IMAGE;
      break;
    case 'azurespokepeeringtask':
      i = SPOKEPEERING_IMAGE;
      break;
    case 'azurevirtualnetworktask':
      i = NETWORK_IMAGE;
      break;
    case 'azureudrtask':
      i = UDR_IMAGE;
      break;
    case 'azurensgtask':
      i = NSG_IMAGE;
      break;
    case 'azureresourcegrouptask':
      i = RG_IMAGE;
      break;
    case 'azuredatadisktask':
      i = DISK_IMAGE;
      break;
    case 'azurevirtualmachinepowertask':
      i = VMPOWERTASK_IMAGE;
      break;
  }

  return i;
};

export enum WorkspacePropertiesTab {
  General = 'general',
  Owner = 'owner',
  ExternalConnectivity = 'externalConnectivity',
  DNS = 'dns',
  JIT = 'jit',
}

export enum WorkspacePropertiesSaveStep {
  NotStarted = -1,
  General = 0,
  Owner = 1,
  ExternalConnectivity = 2,
  DNS = 3,
  JIT = 4,
  Finished = 5,
}

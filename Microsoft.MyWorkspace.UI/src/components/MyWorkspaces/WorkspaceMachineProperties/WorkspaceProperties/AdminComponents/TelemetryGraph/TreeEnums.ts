export enum NodeType {
  Workspace,
  TaskGenerator,
  Task,
  TaskApi,
  Resource,
}

export enum TaskStatus {
  /// <summary> A task that has not been started. </summary>
  NotStarted,

  /// <summary> A task that is currently running. </summary>
  InProgress,

  /// <summary> A task that has been suspended (for Azure run books). </summary>
  Suspended,

  /// <summary> A task that has failed to complete. </summary>
  Failed,

  /// <summary> A task that has successfully completed. </summary>
  Succeeded,
}

export enum TaskOperation {
  /// <summary> A task to create something. </summary>
  Create = 0,

  /// <summary> A task to update something. </summary>
  Update,

  /// <summary> A task to delete something. </summary>
  Delete,

  /// <summary> A task to orchestrate other tasks. </summary>
  Orchestrate,
}

export enum ResourceState {
  /// <summary>
  /// Resource is in an unknown state.
  /// </summary>
  /// <value>0</value>
  Unknown,

  /// <summary>
  /// Resource not deployed.
  /// </summary>
  /// <value>1</value>
  NotDeployed,

  /// <summary>
  /// Resource is waiting to be deployed.
  /// </summary>
  /// <value>2</value>
  Waiting,

  /// <summary>
  /// Resource deployment is in progress.
  /// </summary>
  /// <value>3</value>
  Deploying,

  /// <summary>
  /// Resource is running.
  /// </summary>
  /// <value>4</value>
  Running,

  /// <summary>
  /// Resource is partially running.
  /// </summary>
  /// <value>5</value>
  PartiallyRunning,

  /// <summary>
  /// Resource is transitioning.
  /// </summary>
  /// <value>6</value>
  Transitioning,

  /// <summary>
  /// Resource is off.
  /// </summary>
  /// <value>7</value>
  Off,

  /// <summary>
  /// Resource deployment failed.
  /// </summary>
  /// <value>8</value>
  Failed,

  /// <summary>
  /// Resource is deleting.
  /// </summary>
  /// <value>9</value>
  Deleting,
}

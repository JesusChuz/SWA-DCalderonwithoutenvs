import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { AzureVirtualMachineSnapshotDto } from '../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';

export const GetSnapshotResourceState = (
  snapshot: AzureVirtualMachineSnapshotDto
): ResourceState => {
  const osDiskSnapshot = snapshot.OSDiskSnapshot;
  const dataDiskSnapshots = snapshot.DiskSnapshots;
  if (
    osDiskSnapshot.State === ResourceState.Running &&
    dataDiskSnapshots.every((snap) => snap.State === ResourceState.Running)
  ) {
    return ResourceState.Running;
  }
  if (
    osDiskSnapshot.State === ResourceState.Off &&
    dataDiskSnapshots.every((snap) => snap.State === ResourceState.Off)
  ) {
    return ResourceState.Off;
  }
  if (
    osDiskSnapshot.State === ResourceState.Failed ||
    dataDiskSnapshots.some((snap) => snap.State === ResourceState.Failed)
  ) {
    return ResourceState.Failed;
  }
  if (
    osDiskSnapshot.State === ResourceState.Deploying ||
    dataDiskSnapshots.some((snap) => snap.State === ResourceState.Deploying)
  ) {
    return ResourceState.Deploying;
  }
  return ResourceState.Waiting;
};

export const GetSnapshotResourceStates = (
  snapshots: AzureVirtualMachineSnapshotDto[]
): ResourceState[] => {
  return snapshots.map((snap) => GetSnapshotResourceState(snap));
};

export const AreAnySnapshotsPending = (
  snapshots: AzureVirtualMachineSnapshotDto[]
): boolean => {
  const states = GetSnapshotResourceStates(snapshots);
  return states.some(
    (state) =>
      state !== ResourceState.Failed &&
      state !== ResourceState.Off &&
      state !== ResourceState.Running
  );
};

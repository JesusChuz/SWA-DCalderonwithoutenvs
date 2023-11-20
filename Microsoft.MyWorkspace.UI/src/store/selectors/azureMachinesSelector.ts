import { createSelector } from 'reselect';

import { ReduxAzureMachinesState } from '../reducers/azureMachinesReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const azureMachinesState = (
  state: MyWorkspacesStore
): ReduxAzureMachinesState => state.azureMachines;

export const getLinuxRDPSavingID = createSelector(
  azureMachinesState,
  (azureMachines: ReduxAzureMachinesState) => azureMachines.linuxRDPSavingID
);

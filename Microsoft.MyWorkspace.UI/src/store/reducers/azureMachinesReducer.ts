import {
  REVOKE_RDP_FAILURE,
  REVOKE_RDP_BEGIN,
  REVOKE_RDP_SUCCESS,
  REQUEST_RDP_SUCCESS,
  REQUEST_RDP_FAILURE,
  REQUEST_RDP_BEGIN,
} from '../actions/actionTypes';
import { AzureMachineAction } from '../actions/azureMachineActions';

export interface ReduxAzureMachinesState {
  linuxRDPSavingID: string;
}

export const azureMachinesInitialState: ReduxAzureMachinesState = {
  linuxRDPSavingID: '',
};

export default function azureMachinesReducer(
  state: ReduxAzureMachinesState = azureMachinesInitialState,
  action: AzureMachineAction
): ReduxAzureMachinesState {
  switch (action.type) {
    case REVOKE_RDP_BEGIN: {
      return {
        ...state,
        linuxRDPSavingID: action.payload as string,
      };
    }
    case REVOKE_RDP_SUCCESS: {
      return {
        ...state,
        linuxRDPSavingID: '',
      };
    }
    case REVOKE_RDP_FAILURE: {
      return {
        ...state,
        linuxRDPSavingID: '',
      };
    }
    case REQUEST_RDP_BEGIN: {
      return {
        ...state,
        linuxRDPSavingID: action.payload as string,
      };
    }
    case REQUEST_RDP_SUCCESS: {
      return {
        ...state,
        linuxRDPSavingID: '',
      };
    }
    case REQUEST_RDP_FAILURE: {
      return {
        ...state,
        linuxRDPSavingID: '',
      };
    }
    default:
      return state;
  }
}

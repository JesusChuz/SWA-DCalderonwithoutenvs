import { rest } from 'msw';
import { Blank_AzureWorkspaceDto } from 'src/data/Blank_AzureWorkspaceDto';
import {
  MockSignalRConnection,
  signalRConnection,
} from 'src/services/signalRService';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';

export const fetchUserWorkspaceSuccessHandler = (
  workspaceList: AzureWorkspaceDto[]
) =>
  rest.get(
    `${process.env.REACT_APP_API_URL}/azureworkspace/userworkspaces`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(workspaceList));
    }
  );

export const updateUserWorkspaceSuccessHandler = () =>
  rest.post(
    `${process.env.REACT_APP_API_URL}/azureworkspace`,
    (req, res, ctx) => {
      (signalRConnection as unknown as MockSignalRConnection).triggerCallbacks(
        'onResourceUpdate'
      );
      return res(ctx.status(200), ctx.delay());
    }
  );

export const updateUserWorkspaceErrorHandler = () =>
  rest.post(
    `${process.env.REACT_APP_API_URL}/azureworkspace`,
    (req, res, ctx) => {
      (signalRConnection as unknown as MockSignalRConnection).triggerCallbacks(
        'onResourceUpdate'
      );
      return res(ctx.status(500));
    }
  );

export const defaultAzureWorkspaceHandlers = [
  fetchUserWorkspaceSuccessHandler([Blank_AzureWorkspaceDto]),
  updateUserWorkspaceSuccessHandler(),
];

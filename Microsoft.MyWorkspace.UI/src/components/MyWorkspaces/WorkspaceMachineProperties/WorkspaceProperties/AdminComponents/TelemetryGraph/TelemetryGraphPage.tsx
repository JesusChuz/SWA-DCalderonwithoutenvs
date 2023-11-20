import { Panel, PanelType, Stack, Text } from '@fluentui/react';
import ReactJson from 'react-json-view';
import React from 'react';
import { NodeType } from './TreeEnums';
import { useDispatch, useSelector } from 'react-redux';
import { getEditableWorkspace } from '../../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getFetchingID,
  getTaskTreeError,
  getTreeByWorkspaceID,
} from '../../../../../../store/selectors/adminTaskTreeSelectors';
import { fetchTaskTree } from '../../../../../../store/actions/adminTaskTreeActions';
import { TelemetryGraph } from './TelemetryGraph';
import { TelemetryGraphNodeDto } from '../../../../../../types/Telemetry/TelemetryGraphNodeDto.types';

export const TelemetryGraphPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const [node, setNode] = React.useState<TelemetryGraphNodeDto>(null);
  const [body, setBody] = React.useState({} as any);

  const workspace = useSelector(getEditableWorkspace) as AzureWorkspaceDto;
  const fetchingID = useSelector(getFetchingID);
  const graph = useSelector(getTreeByWorkspaceID(workspace.ID));
  const error = useSelector(getTaskTreeError);

  const entitySelectHandler = (node: TelemetryGraphNodeDto): void => {
    const requestBody = JSON.parse(
      node.HttpBody.length > 0 ? node.HttpBody : '{}'
    );
    setBody(requestBody);
    setNode(node);
  };

  return (
    <>
      <Stack>
        <TelemetryGraph
          data={graph}
          error={error}
          dimensions={{
            width: 1000,
            height: 1000,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
          }}
          clickHandler={entitySelectHandler}
          fetchDataHandler={() => {
            dispatch(fetchTaskTree(workspace.ID));
          }}
          isLoading={fetchingID !== null}
        />
      </Stack>
      <Panel
        headerText='Node Details'
        isOpen={node !== null}
        onDismiss={() => setNode(null)}
        isBlocking={false}
        type={PanelType.medium}
      >
        {node && (
          <>
            <Stack tokens={{ childrenGap: 10 }}>
              <Stack.Item>
                <span></span>
              </Stack.Item>
              <Stack.Item>
                <span></span>
              </Stack.Item>
              <Stack.Item>
                <span></span>
              </Stack.Item>
            </Stack>
            <Stack tokens={{ childrenGap: 10 }}>
              <Stack.Item>
                <Text>
                  <b>Type:</b> {NodeType[node.NodeType]}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Sub Type:</b> {node.NodeSubType}
                </Text>
              </Stack.Item>
              {NodeType[node.NodeType] === 'Resource' && (
                <Stack.Item>
                  <Text>
                    <b>Azure Deep Link:</b>
                    &nbsp;
                    <a
                      href={node.ResourceAzureDeepLink}
                      target='_blank'
                      rel='noreferrer'
                    >
                      link
                    </a>
                  </Text>
                </Stack.Item>
              )}
              <Stack.Item>
                <Text>
                  <b>CorrelationID:</b> {node.CorrelationId}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Time Stamp:</b>{' '}
                  {new Date(node.TimeStamp)?.toLocaleString('en-US')}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Api Route:</b> {node.ApiRoute}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Http Verb:</b> {node.HttpVerb}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Http Status Code:</b> {node.HttpStatusCode}
                </Text>
              </Stack.Item>
              <Stack.Item>
                <Text>
                  <b>Request Body</b>
                </Text>
                <Text>
                  <ReactJson src={body} theme='monokai' collapsed={false} />
                </Text>
              </Stack.Item>
              {node.ErrorMessage && (
                <Stack.Item>
                  <Text>{node.ErrorMessage}</Text>
                </Stack.Item>
              )}
            </Stack>
          </>
        )}
      </Panel>
    </>
  );
};

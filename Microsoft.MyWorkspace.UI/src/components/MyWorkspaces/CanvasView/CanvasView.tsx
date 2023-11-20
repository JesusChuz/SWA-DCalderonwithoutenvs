import {
  Callout,
  ChoiceGroup,
  IChoiceGroupOption,
  IconButton,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureWorkspaceForCreationDto } from 'src/types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { DomainView } from './DomainView';
import { NetworkView } from './NetworkView';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { getCanvasStyles } from './CanvasView.styles';

interface CanvasViewProps {
  workspace: AzureWorkspaceDto | AzureWorkspaceForCreationDto;
}

const iconButtonWidthNoPadding = 28;

export const CanvasView = (props: CanvasViewProps) => {
  const [tab, setTab] = React.useState('network');
  const theme = useTheme();
  const styles = getCanvasStyles(theme);

  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);
  const buttonId = useId('callout-button');
  const labelId = useId('callout-label');
  const descriptionId = useId('callout-description');

  const options: IChoiceGroupOption[] = [
    {
      key: 'network',
      text: 'Network Topology',
      iconProps: { iconName: 'DOM' },
    },
    {
      key: 'domain',
      text: 'Domain Overview',
      iconProps: { iconName: 'RowsGroup' },
    },
  ];

  return (
    <>
      <Stack>
        {tab === 'network' && <NetworkView workspace={props.workspace} />}
        {tab === 'domain' && <DomainView workspace={props.workspace} />}
        <Stack horizontal verticalAlign='start'>
          <ChoiceGroup
            style={{ marginLeft: '5%' }}
            label='View Options'
            selectedKey={tab}
            options={options}
            onChange={(e, option) => setTab(option.key)}
          />
          <IconButton
            style={{
              position: 'relative',
              left: `-${iconButtonWidthNoPadding}px`,
            }}
            iconProps={{ iconName: 'Info' }}
            aria-label='More info button'
            id={buttonId}
            onClick={toggleIsCalloutVisible}
          />
          {isCalloutVisible && (
            <Callout
              className={styles.callout}
              ariaLabelledBy={labelId}
              ariaDescribedBy={descriptionId}
              role='dialog'
              gapSpace={0}
              target={`#${buttonId}`}
              onDismiss={toggleIsCalloutVisible}
              setInitialFocus
            >
              <Text
                as='h1'
                block
                variant='xLarge'
                className={styles.calloutTitle}
                id={labelId}
              >
                Canvas View
              </Text>
              <Text block variant='small' id={descriptionId}>
                This is a read-only view of both the network topology, and
                domain relationships within the workspace. In both views, you
                can zoom and pan as needed. In the Network Topology view you can
                drag machines and networks around. You can also hover over a
                network to dim out all other networks.
              </Text>
            </Callout>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default CanvasView;

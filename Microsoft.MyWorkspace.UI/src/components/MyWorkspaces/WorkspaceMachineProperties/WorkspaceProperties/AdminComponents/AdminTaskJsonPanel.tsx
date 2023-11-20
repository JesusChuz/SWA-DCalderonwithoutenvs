import {
  IconButton,
  Panel,
  PanelType,
  Stack,
  TooltipHost,
} from '@fluentui/react';
import * as React from 'react';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { LazyLoadingSpinner } from '../../../../GeneralComponents/LazyLoadingSpinner';

const ReactJson = React.lazy(() => import('react-json-view'));

interface IProps {
  taskResourceJson: Record<string, unknown>;
}

export const AdminTaskJsonPanel = (props: IProps): JSX.Element => {
  const [open, setOpen] = React.useState(false);

  const getButton = () => {
    return (
      <IconButton
        ariaLabel='json view'
        iconProps={{ iconName: 'Code' }}
        onClick={() => {
          setOpen(true);
        }}
      />
    );
  };

  return (
    <>
      <TooltipHost content={'Task JSON'}>{getButton()}</TooltipHost>
      <Panel
        headerText='Task Resource JSON'
        isOpen={open}
        onDismiss={() => setOpen(false)}
        closeButtonAriaLabel='Close'
        customWidth={'800px'}
        type={PanelType.custom}
      >
        <Stack tokens={defaultStackTokens}>
          <React.Suspense fallback={<LazyLoadingSpinner />}>
            <ReactJson
              src={props.taskResourceJson}
              name='Resource'
              theme='monokai'
              collapsed
            />
          </React.Suspense>
        </Stack>
      </Panel>
    </>
  );
};

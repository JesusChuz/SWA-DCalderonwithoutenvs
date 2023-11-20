import * as React from 'react';
import {
  CommandBarButton,
  Panel,
  PanelType,
  Stack,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { useSelector } from 'react-redux';

import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { LazyLoadingSpinner } from '../../../../GeneralComponents/LazyLoadingSpinner';

const ReactJson = React.lazy(() => import('react-json-view'));

export const AdminWorkspaceJsonPanel = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [open, setOpen] = React.useState(false);
  const workspace = useSelector(getEditableWorkspace) as AzureWorkspaceDto;

  const getButton = () => {
    return (
      <CommandBarButton
        className={commonStyles.fullHeight}
        ariaLabel=''
        text='View JSON'
        role='button'
        iconProps={{
          iconName: 'Code',
        }}
        onClick={() => setOpen(true)}
      ></CommandBarButton>
    );
  };

  return (
    <>
      <TooltipHost content={'Workspace JSON'}>{getButton()}</TooltipHost>
      <Panel
        headerText='Workspace JSON'
        isOpen={open}
        onDismiss={() => setOpen(false)}
        closeButtonAriaLabel='Close'
        customWidth={'800px'}
        type={PanelType.custom}
      >
        <Stack tokens={defaultStackTokens}>
          <React.Suspense fallback={<LazyLoadingSpinner />}>
            <ReactJson
              src={workspace}
              name='Workspace'
              theme='monokai'
              collapsed
            />
          </React.Suspense>
        </Stack>
      </Panel>
    </>
  );
};

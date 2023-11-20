import { Stack, MessageBar, MessageBarType } from '@fluentui/react';
import * as React from 'react';

export const TemplateIPMessageBar = (): JSX.Element => {
  return (
    <Stack>
      <Stack.Item style={{ marginTop: '16px' }}>
        <MessageBar messageBarType={MessageBarType.info} isMultiline={true}>
          <div>
            Static IP configurations for workspaces created from a template will
            differ from the original workspace used to create the template.
          </div>
          <div>
            Updates can be made within Workspace Properties post-deployment.
          </div>
        </MessageBar>
      </Stack.Item>
    </Stack>
  );
};

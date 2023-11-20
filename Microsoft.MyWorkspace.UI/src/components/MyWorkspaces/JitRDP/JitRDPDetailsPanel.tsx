import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react';

import { JitRDPDetails } from './JitRDPDetails';

interface IProps {
  open: boolean;
  workspaceID: string;
  closeJit: (id?: string) => void;
  highlightID?: string;
}

export const JitRDPDetailsPanel = (props: IProps): JSX.Element => {
  return (
    <Panel
      headerText='JIT RDP Access'
      isOpen={props.open}
      onDismiss={() => props.closeJit()}
      closeButtonAriaLabel='Close'
      customWidth={'450px'}
      type={PanelType.custom}
    >
      <JitRDPDetails workspaceID={props.workspaceID} />
    </Panel>
  );
};

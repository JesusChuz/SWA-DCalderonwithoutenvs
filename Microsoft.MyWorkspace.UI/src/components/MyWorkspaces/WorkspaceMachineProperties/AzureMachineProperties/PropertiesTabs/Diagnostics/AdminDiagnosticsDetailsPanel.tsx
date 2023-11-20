import * as React from 'react';
import {
  ITheme,
  getTheme,
  Text,
  Panel,
  PanelType,
  Stack,
} from '@fluentui/react';
import { DiagnosticDto } from '../../../../../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { getDiagnosticStyles } from './AdminDiagnostics.styles';
import { DiagnosticStateDotIcon } from './DiagnosticStatusIcons';
import { AdaptiveCard } from 'adaptivecards-react';
import { hostConfig } from 'src/config/hostConfig';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  diagnostics: DiagnosticDto;
}

// side panel to view details of a chosen current diagnostic
export const AdminDiagnosticsDetailsPanel = (props: IProps): JSX.Element => {
  const theme: ITheme = getTheme();
  const styles = getDiagnosticStyles(theme);
  let jsonStatusMessageObject = {};
  if (props.diagnostics.StatusMessage.includes('adaptive-card.json')) {
    jsonStatusMessageObject = JSON.parse(props.diagnostics.StatusMessage);
  }

  return (
    <Panel
      isOpen={props.open}
      onDismiss={() => {
        props.setOpen(false);
      }}
      closeButtonAriaLabel='Close'
      customWidth={'500px'}
      type={PanelType.custom}
      isLightDismiss
    >
      <div className={styles.container} data-is-scrollable>
        <Stack tokens={{ childrenGap: 20 }}>
          <Text variant='xLarge'>{props.diagnostics.Name}</Text>
          {props.diagnostics.Discovery && (
            <Stack className={styles.itemContent} tokens={{ childrenGap: 5 }}>
              <Text className={styles.itemSection}>Diagnostic Description</Text>
              <Text className={styles.itemIndex}>
                {props.diagnostics.Discovery}
              </Text>
            </Stack>
          )}
          {props.diagnostics.StatusMessage && (
            <Stack className={styles.itemContent} tokens={{ childrenGap: 5 }}>
              <Text className={styles.itemSection}>Diagnostic Run Summary</Text>
              {props.diagnostics.StatusMessage.includes(
                'adaptive-card.json'
              ) && (
                <AdaptiveCard
                  payload={jsonStatusMessageObject}
                  hostConfig={hostConfig}
                />
              )}
              {!props.diagnostics.StatusMessage.includes(
                'adaptive-card.json'
              ) && (
                <Text className={styles.itemIndex}>
                  {props.diagnostics.StatusMessage}
                </Text>
              )}
            </Stack>
          )}
          {props.diagnostics.Updated && (
            <Stack className={styles.itemContent} tokens={{ childrenGap: 5 }}>
              <Text className={styles.itemSection}>Last Updated</Text>
              <Text className={styles.itemIndex}>
                {props.diagnostics.Updated}
              </Text>
            </Stack>
          )}
          {props.diagnostics.Created && (
            <Stack className={styles.itemContent} tokens={{ childrenGap: 5 }}>
              <Text className={styles.itemSection}>Created</Text>
              <Text className={styles.itemIndex}>
                {props.diagnostics.Created}
              </Text>
            </Stack>
          )}
          {props.diagnostics.Solution && (
            <Stack className={styles.itemContent} tokens={{ childrenGap: 5 }}>
              <Text className={styles.itemSection}>Recommended Solution</Text>
              <Text className={styles.itemIndex}>
                {props.diagnostics.Solution.Name}
              </Text>
            </Stack>
          )}
        </Stack>
      </div>
    </Panel>
  );
};

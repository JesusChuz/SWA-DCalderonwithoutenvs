import {
  Spinner,
  Stack,
  Text,
  SpinnerSize,
  useTheme,
  TooltipHost,
  Icon,
  Link,
} from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  HasCriticalUpdatesPending,
  HasOtherUpdatesPending,
  HasSecurityUpdatesPending,
} from '../../../shared/helpers/WorkspaceHelper';
import {
  getAllWorkspacesPatchingSummaryLoading,
  getAllWorkspacesPatchingSummary,
} from '../../../store/selectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';

interface IProps {
  workspace: AzureWorkspaceDto;
}

export const ComplianceStatus = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const history = useHistory();
  const commonStyles = getCommonStyles(theme);
  const allWorkspacesPatchingSummaryLoading = useSelector(
    getAllWorkspacesPatchingSummaryLoading
  );
  const allWorkspacesPatchingSummary = useSelector(
    getAllWorkspacesPatchingSummary
  );
  const workspace = props.workspace;
  const hasCriticalUpdatesPending = HasCriticalUpdatesPending(
    workspace,
    allWorkspacesPatchingSummary
  );
  const hasSecurityUpdatesPending = HasSecurityUpdatesPending(
    workspace,
    allWorkspacesPatchingSummary
  );
  const hasOtherUpdatesPending = HasOtherUpdatesPending(
    workspace,
    allWorkspacesPatchingSummary
  );

  return allWorkspacesPatchingSummaryLoading ? (
    <Stack
      horizontal
      horizontalAlign='start'
      verticalAlign='center'
      className={commonStyles.fullHeight}
      tokens={{ childrenGap: 4 }}
    >
      <>
        <Stack.Item>
          <Spinner size={SpinnerSize.small} className={commonStyles.loading} />
        </Stack.Item>
        <Stack.Item>
          <Text variant='small'>Updates Loading</Text>
        </Stack.Item>
      </>
    </Stack>
  ) : (
    <Stack
      horizontal
      horizontalAlign='start'
      verticalAlign='center'
      className={commonStyles.fullHeight}
      tokens={{ childrenGap: 4 }}
    >
      {hasCriticalUpdatesPending && (
        <>
          <Stack.Item>
            <TooltipHost content={'Critical Updates Available'}>
              <Icon
                iconName='ShieldAlert'
                aria-label='Critical Updates Available'
                className={`${commonStyles.severeWarningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          </Stack.Item>
          <Stack.Item>
            <Text variant='small'>
              <Link
                className={commonStyles.fullWidth}
                onClick={() => history.push(`/${workspace.ID}?tab=compliance`)}
              >
                Updates Available
              </Link>
            </Text>
          </Stack.Item>
        </>
      )}
      {!hasCriticalUpdatesPending && hasSecurityUpdatesPending && (
        <>
          <Stack.Item>
            <TooltipHost content={'Security Updates Available'}>
              <Icon
                iconName='Shield'
                aria-label='Security Updates Available'
                className={`${commonStyles.warningColor} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
              />
            </TooltipHost>
          </Stack.Item>
          <Stack.Item>
            <Text variant='small'>
              <Link
                className={commonStyles.fullWidth}
                onClick={() => history.push(`/${workspace.ID}?tab=compliance`)}
              >
                Updates Available
              </Link>
            </Text>
          </Stack.Item>
        </>
      )}
      {!hasCriticalUpdatesPending &&
        !hasSecurityUpdatesPending &&
        hasOtherUpdatesPending && (
          <>
            <Stack.Item>
              <TooltipHost content={'General Updates Available'}>
                <Icon
                  iconName='Shield'
                  aria-label='General Updates Available'
                  className={`${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
                />
              </TooltipHost>
            </Stack.Item>
            <Stack.Item>
              <Text variant='small'>
                <Link
                  className={commonStyles.fullWidth}
                  onClick={() =>
                    history.push(`/${workspace.ID}?tab=compliance`)
                  }
                >
                  Updates Available
                </Link>
              </Text>
            </Stack.Item>
          </>
        )}
      {!hasCriticalUpdatesPending &&
        !hasSecurityUpdatesPending &&
        !hasOtherUpdatesPending && (
          <>
            <Stack.Item>
              <TooltipHost content={'No Updates Available'}>
                <Icon
                  iconName='Shield'
                  aria-label='No Updates Available'
                  className={`${commonStyles.successText} ${commonStyles.padRight8} ${commonStyles.displayBlock} ${commonStyles.cursorDefault}`}
                />
              </TooltipHost>
            </Stack.Item>
            <Stack.Item>
              <Text variant='small'>Up to Date</Text>
            </Stack.Item>
          </>
        )}
    </Stack>
  );
};

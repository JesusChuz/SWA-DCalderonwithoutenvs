import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  HoverCard,
  HoverCardType,
  Stack,
  FontIcon,
  Text,
  Link,
  useTheme,
} from '@fluentui/react';
import clsx from 'clsx';

import { getAllWorkspacesStyles } from './AllWorkspacesView/AllWorkspacesView.styles';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import {
  getAutoShutdownInMins,
  getAutoShutdownText,
} from '../../shared/Utilities';
import { AzureWorkspaceDto } from '../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getJitEnabled,
  getRegions,
} from '../../store/selectors/catalogSelectors';
import { JitAddressDto } from '../../types/FirewallManager/JitAddressDto';
import {
  getJitAddresses,
  getUserIP,
} from '../../store/selectors/firewallSelectors';
import { RegionDto } from '../../types/Catalog/RegionDto.types';
import { SyncStatus } from '../../types/enums/SyncStatus';

interface JitError {
  id: string;
}

interface IProps {
  workspace: AzureWorkspaceDto;
  openJit: (open: boolean, id?: string) => void;
}

export const WorkspaceWarnings = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAllWorkspacesStyles(theme);
  const [render, setRender] = React.useState<boolean>(false);
  const [jitError, setJitError] = React.useState<JitError>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  //const user: UserProfileDto = useSelector(getCatalogUserProfile);
  const jitEnabled: boolean = useSelector(getJitEnabled);
  const jitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const regions: RegionDto[] = useSelector(getRegions);
  const ip: string = useSelector(getUserIP);

  const getJitError = () => {
    if (!jitEnabled) {
      return false;
    }
    const address = jitAddresses.findIndex(
      (a) => a.Location === props.workspace.Location
    );
    const error = address === -1 || jitAddresses[address].Address !== ip;
    if (error) {
      setJitError({ id: props.workspace.RegionID });
    } else {
      setJitError(null);
    }
    return error;
  };

  const getWarnings = () => {
    const w = [];
    if (jitEnabled) {
      const address = jitAddresses.findIndex(
        (a) => a.Location === props.workspace.Location
      );
      if (
        address !== -1 &&
        jitAddresses[address].Status !== SyncStatus.Active
      ) {
        w.push('Jit Elevation Pending');
      }
    }
    setWarnings(w);
    return w.length > 0;
  };

  const renderHoverCard = (workspace: AzureWorkspaceDto): JSX.Element => {
    return (
      <Stack
        className={styles.hoverCardContent}
        horizontalAlign='center'
        verticalAlign='center'
      >
        {jitError && (
          <Stack.Item>
            <Link
              className={commonStyles.errorText}
              onClick={() => props.openJit(true, jitError.id)}
            >
              JIT RDP Access Not Enabled
            </Link>
          </Stack.Item>
        )}
        {warnings.map((w) => (
          <Stack.Item key={w}>
            <Text>{w}</Text>
          </Stack.Item>
        ))}
        {false && (
          <Stack.Item>
            <Text
              className={clsx(
                getAutoShutdownInMins(workspace) <= 15 &&
                  commonStyles.errorTextBold
              )}
            >
              {getAutoShutdownText(workspace)}
            </Text>
          </Stack.Item>
        )}
      </Stack>
    );
  };

  React.useEffect(() => {
    if (props.workspace) {
      const error = getJitError();
      const w = getWarnings();
      setRender(error || w);
    }
  }, [props.workspace, jitAddresses, regions, ip]);

  return (
    <React.Fragment>
      {render && (
        <HoverCard
          type={HoverCardType.plain}
          instantOpenOnClick
          plainCardProps={{
            onRenderPlainCard: renderHoverCard,
            renderData: props.workspace,
          }}
        >
          <FontIcon
            className={`${
              jitError === null ? styles.warningIcon : styles.errorIcon
            }`}
            iconName={jitError === null ? 'Warning' : 'Error'}
            aria-label='workspace warnings'
          />
        </HoverCard>
      )}
    </React.Fragment>
  );
};

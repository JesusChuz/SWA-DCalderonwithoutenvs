import { Separator, Stack, Text, useTheme } from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  getAzureWorkspaces,
  getSelectedAdminWorkspaces,
} from 'src/store/selectors';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  getJitErrorMessage,
  isWorkspaceJitValid,
} from '../../JitRDP/JitRDP.utils';
import { JitRDPDetails } from '../../JitRDP/JitRDPDetails';
import { AdminJitRDPList } from '../../JitRDP/AdminJitRDPList';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { getEditWorkspaceIsAdminSelection } from 'src/store/selectors/editableWorkspaceSelectors';
import genericError from 'src/assets/GenericError.svg';

interface IProps {
  workspaceID: string;
}

export const JitPropertiesPanel = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const userWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const adminWorkspaces: AzureWorkspaceDto[] = useSelector(
    getSelectedAdminWorkspaces
  );
  const [allWorkspaces, setAllWorkspaces] = React.useState([]);
  const isAdminSelection: boolean = useSelector(
    getEditWorkspaceIsAdminSelection
  );
  const workspace = React.useMemo(() => {
    if (!props.workspaceID) {
      return null;
    }
    return allWorkspaces.find((ws) => ws.ID === props.workspaceID) || null;
  }, [allWorkspaces, props.workspaceID]);

  React.useEffect(() => {
    if (isAdminSelection) {
      setAllWorkspaces(adminWorkspaces);
    } else {
      setAllWorkspaces(userWorkspaces);
    }
  }, [userWorkspaces, adminWorkspaces, isAdminSelection]);

  return (
    <Stack className={styles.propertiesContent}>
      {!isWorkspaceJitValid(workspace) ? (
        <Stack
          className={`${commonStyles.marginTop16} ${commonStyles.marginLeft8}`}
        >
          <Text className={commonStyles.errorTextBold}>
            {getJitErrorMessage(workspace)}
          </Text>
        </Stack>
      ) : (
        <>
          <JitRDPDetails workspaceID={props.workspaceID} />
          {isAdminSelection && (
            <Stack>
              <Separator />
              <AdminJitRDPList workspaceID={props.workspaceID} />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

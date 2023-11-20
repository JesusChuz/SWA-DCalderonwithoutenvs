import * as React from 'react';
import {
  List,
  Stack,
  IconButton,
  TooltipHost,
  useTheme,
  Text,
} from '@fluentui/react';
import { editIcon } from '../../../shared/Icons';
import { defaultStackTokens } from '../../../shared/StackTokens';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useSelector, useDispatch } from 'react-redux';
import {
  getSelectedAdminSegment,
  getSelectedAdminSegmentConstraint,
} from '../../../store/selectors';
import { RestrictedDomainsPanel } from './RestrictedDomainsPanel';
import { fetchSegmentUpdatePercentage } from '../../../store/actions';
import { RestrictedDomainsUpdatingMessage } from './RestrictedDomainsUpdatingMessage';

export const TenantSegmentConstraints = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const constraints = useSelector(getSelectedAdminSegmentConstraint);
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const [openRestrictedDomainsPanel, setOpenRestrictedDomainsPanel] =
    React.useState(false);

  React.useEffect(() => {
    dispatch(fetchSegmentUpdatePercentage(selectedSegment.ID));
  }, [selectedSegment]);

  const onRenderCell = (item: string): JSX.Element => {
    return (
      <div data-is-focusable>
        <Text>{item}</Text>
      </div>
    );
  };

  return (
    <div>
      <Stack
        horizontal
        className={commonStyles.fullWidth}
        tokens={{ ...defaultStackTokens }}
        horizontalAlign='start'
        verticalAlign='center'
      >
        <Stack.Item>
          <h3 className={commonStyles.margin0}>Private Mode Only Domains</h3>
        </Stack.Item>
        <Stack.Item>
          <TooltipHost
            content='Edit Private Mode Only Domains'
            setAriaDescribedBy={false}
          >
            <IconButton
              iconProps={editIcon}
              ariaLabel='Edit Private Mode Only Domains'
              onClick={() => setOpenRestrictedDomainsPanel(true)}
            />
          </TooltipHost>
        </Stack.Item>
      </Stack>
      <Stack
        horizontal
        className={`${commonStyles.fullWidth} ${commonStyles.columnContainer}`}
        tokens={defaultStackTokens}
      >
        <RestrictedDomainsUpdatingMessage segmentId={selectedSegment.ID} />
        <>
          {constraints.RestrictedDnsEndpoints &&
            constraints.RestrictedDnsEndpoints.length > 0 && (
              <List
                items={constraints.RestrictedDnsEndpoints}
                onRenderCell={onRenderCell}
              />
            )}
        </>
      </Stack>
      <RestrictedDomainsPanel
        openRestrictedDomainsPanel={openRestrictedDomainsPanel}
        dismissPanel={() => setOpenRestrictedDomainsPanel(false)}
        segmentId={selectedSegment.ID}
        segmentName={selectedSegment.Name}
        editable={true}
      />
    </div>
  );
};

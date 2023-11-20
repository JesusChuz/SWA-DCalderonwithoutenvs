import * as React from 'react';
import { Stack, Text } from '@fluentui/react';
import { useSelector } from 'react-redux';
import { getSegmentUpdatePercentage } from '../../../store/selectors';

interface IRestrictedDomainsUpdatingMessageProps {
  segmentId: string;
}

export const RestrictedDomainsUpdatingMessage = (
  props: IRestrictedDomainsUpdatingMessageProps
): JSX.Element => {
  const segmentUpdatePercentage = useSelector(getSegmentUpdatePercentage);
  const message = React.useMemo(() => {
    let m = '';
    const percent = segmentUpdatePercentage.get(props.segmentId)
      ? segmentUpdatePercentage.get(props.segmentId)
      : 0;

    switch (percent) {
      case 100:
        m = 'Synced Across All Workspaces in Segment';
        break;
      case -1:
        m = 'No Private Mode Only Domains';
        break;
      case 0:
        m = 'Syncing Changes...';
        break;
      default:
        m = `Syncing Changes ${percent}% Complete`;
    }
    return m;
  }, [segmentUpdatePercentage, props.segmentId]);

  return (
    <>
      {message && (
        <Stack style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Text>
            <b>{message}</b>
          </Text>
        </Stack>
      )}
    </>
  );
};

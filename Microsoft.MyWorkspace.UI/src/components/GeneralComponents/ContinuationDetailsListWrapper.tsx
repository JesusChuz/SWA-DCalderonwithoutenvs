import * as React from 'react';
import {
  Stack,
  Spinner,
  SpinnerSize,
  useTheme,
  Text,
  Link,
} from '@fluentui/react';
import { getCommonStyles } from './CommonStyles';

interface IContinuationDetailsList<T> {
  dataLoading: boolean;
  // show a spinner when loading, even when there is existing data present
  showLoadingWithData?: boolean;
  data: T[];
  dataName: string;
  showLoadMore: boolean;
  loadMoreClick: () => void;
  children: React.ReactNode;
}

export function ContinuationDetailsListWrapper<T>(
  props: IContinuationDetailsList<T>
): JSX.Element {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);

  const showLoading = React.useMemo(() => {
    return (
      props.dataLoading &&
      (props.data.length === 0 ? true : props.showLoadingWithData)
    );
  }, [props.dataLoading, props.data, props.showLoadingWithData]);

  return (
    <>
      {showLoading ? (
        <Stack
          horizontal
          horizontalAlign='center'
          style={{ marginTop: 32, marginBottom: 32 }}
        >
          <Spinner size={SpinnerSize.large} />
        </Stack>
      ) : (
        <>
          <Stack
            horizontal
            className={`${commonStyles.overflowYAuto} ${commonStyles.flexGrow}`}
          >
            <Stack className={commonStyles.fullWidth}>{props.children}</Stack>
          </Stack>
          <Stack style={{ marginBottom: 8 }} tokens={{ childrenGap: 8 }}>
            <Stack horizontalAlign='center'>
              <Text>
                {`${props.data.length} ${props.dataName}${
                  props.data.length === 1 ? '' : 's'
                } Displayed`}
              </Text>
            </Stack>
            <Stack
              horizontal
              horizontalAlign='center'
              tokens={{ childrenGap: 4 }}
              className={
                !props.showLoadMore ? commonStyles.visibilityHidden : undefined
              }
            >
              <Link
                onClick={() => {
                  props.loadMoreClick();
                }}
                disabled={props.dataLoading}
              >
                Load More
              </Link>
              {props.dataLoading && (
                <Spinner size={SpinnerSize.xSmall}></Spinner>
              )}
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
}

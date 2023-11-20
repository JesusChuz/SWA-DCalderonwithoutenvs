import {
  ActionButton,
  Checkbox,
  DetailsList,
  DetailsListLayoutMode,
  FocusZone,
  IColumn,
  IconButton,
  IStackTokens,
  MessageBar,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { AxiosResponse } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import sanitizeHtml from 'sanitize-html';
import {
  deleteBanner,
  fetchBanners,
  setPoliteScreenReaderAnnouncement,
  showUserConfirmationDialog,
} from '../../../store/actions';
import { getBanners, getBannersLoading } from '../../../store/selectors';
import { BannerDto } from '../../../types/Admin/BannerDto.types';
import { getBannerStyles } from './Banners.styles';

const tokens: IStackTokens = {
  childrenGap: 5,
  padding: 10,
};

export const BannerList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const banners = useSelector(getBanners);
  const bannersLoading = useSelector(getBannersLoading);
  const styles = getBannerStyles(theme);

  const columns: IColumn[] = [
    {
      key: 'banner',
      name: 'Banner',
      ariaLabel: 'Banner column',
      minWidth: 350,
      isResizable: true,
      onRender: (item: BannerDto) => (
        <div
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              history.push(`/admin/Banners/${item.Id}`);
            }
          }}
          onClick={() => {
            history.push(`/admin/Banners/${item.Id}`);
          }}
          className={styles.messageBar}
        >
          <MessageBar
            truncated={item.Truncated}
            isMultiline={item.Multiline}
            messageBarType={item.Type}
          >
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.Text) }}
            ></div>
          </MessageBar>
        </div>
      ),
    },
    {
      key: 'published',
      name: 'Published',
      fieldName: 'Published',
      minWidth: 70,
      isResizable: true,
      onRender: (item: BannerDto) => (
        <Checkbox disabled checked={item.Published} />
      ),
    },
    {
      key: 'truncated',
      name: 'Truncated',
      fieldName: 'Truncated',
      minWidth: 70,
      isResizable: true,
      onRender: (item: BannerDto) => (
        <Checkbox disabled checked={item.Truncated} />
      ),
    },
    {
      key: 'multiline',
      name: 'Multiline',
      fieldName: 'Multiline',
      minWidth: 70,
      isResizable: true,
      onRender: (item: BannerDto) => (
        <Checkbox disabled checked={item.Multiline} />
      ),
    },
    {
      key: 'delete',
      name: 'Delete',
      minWidth: 50,
      isResizable: true,
      onRender: (item: BannerDto) => {
        return (
          <IconButton
            iconProps={{ iconName: 'Delete' }}
            aria-label='Delete Banner'
            onClick={() => {
              dispatch(
                showUserConfirmationDialog(
                  'Warning',
                  'Are you sure you want to delete this banner?',
                  () => deleteBannerOnConfirm(item)
                )
              );
            }}
          />
        );
      },
    },
  ];

  const deleteBannerOnConfirm = async (banner: BannerDto) => {
    const res: AxiosResponse = await deleteBanner(banner.Id)(dispatch);
    if (res.status === 200) {
      dispatch(fetchBanners());
    }
  };

  React.useEffect(() => {
    dispatch(fetchBanners());
  }, []);

  return (
    <Stack tokens={tokens}>
      <Stack>
        <ActionButton
          style={{ width: '150px' }}
          iconProps={{ iconName: 'Add' }}
          onClick={() => history.push(`/admin/Banners/New`)}
        >
          Create Banner
        </ActionButton>
      </Stack>
      <Stack>
        {!bannersLoading && banners.length === 0 && (
          <Stack tokens={{ padding: 10 }}>
            <Text>No Banners.</Text>
          </Stack>
        )}
        {banners.length > 0 && (
          <FocusZone>
            <DetailsList
              items={banners}
              columns={columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
            />
          </FocusZone>
        )}
        {banners.length === 0 && bannersLoading && (
          <Spinner size={SpinnerSize.large} />
        )}
      </Stack>
    </Stack>
  );
};

export default BannerList;

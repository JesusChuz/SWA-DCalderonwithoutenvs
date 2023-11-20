import { RichTextEditor } from '@coherence-design-system/rich-text-editor';
import {
  Checkbox,
  Dropdown,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import { getBanners, getBannersSaving } from 'src/store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { BannerDto } from 'src/types/Admin/BannerDto.types';
import { BannerForCreationDto } from 'src/types/Admin/BannerForCreationDto.types';
import { NotFound } from 'src/components/Pages/NotFound';
import {
  createBanner,
  setPoliteScreenReaderAnnouncement,
  updateBanner,
} from 'src/store/actions';
import { AxiosResponse } from 'axios';

const defaultBanner: BannerForCreationDto = {
  Text: 'Design your message!',
  Type: MessageBarType.warning,
  Published: false,
  Truncated: false,
  Multiline: false,
};

const BannerTypes = [
  { key: MessageBarType.blocked, text: 'Blocked' },
  { key: MessageBarType.error, text: 'Error' },
  { key: MessageBarType.info, text: 'Info' },
  { key: MessageBarType.severeWarning, text: 'Severe Warning' },
  { key: MessageBarType.success, text: 'Success' },
  { key: MessageBarType.warning, text: 'Warning' },
];

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['strike']),
  allowedAttributes: {
    '*': ['style'],
    a: ['href', 'target'],
  },
  allowedStyles: {
    '*': {
      color: [
        /^#(0x)?[0-9a-f]+$/i,
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
      ],
      'text-align': [/^left$/, /^right$/, /^center$/],
      'font-size': [/^\d+(?:px|em|%|pt)$/],
    },
  },
};

export const Banner = () => {
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = React.useState<BannerDto | BannerForCreationDto>(
    null
  );
  const banners = useSelector(getBanners);
  const bannerSaving = useSelector(getBannersSaving);
  const history = useHistory();
  const [bannerNotFound, setBannerNotFound] = React.useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const addTargetToLink = (text: string) => {
    return text?.replaceAll('<a', "<a target='_blank'");
  };

  const save = async () => {
    if (id && id !== 'New') {
      const res: AxiosResponse = await updateBanner(banner as BannerDto)(
        dispatch
      );
      saveCallback(res);
    } else {
      const res: AxiosResponse = await createBanner(banner)(dispatch);
      saveCallback(res);
    }
  };

  const saveCallback = (res: AxiosResponse) => {
    if (res.status === 200) {
      dispatch(setPoliteScreenReaderAnnouncement('Banner Successfully Saved.'));
      history.push('/admin/Banners');
    }
  };

  React.useEffect(() => {
    if (id && id !== 'New') {
      const bannerToFind = banners.find((b) => b.Id === id);
      if (bannerToFind) {
        setBanner(bannerToFind);
      } else {
        setBannerNotFound(true);
      }
    } else if (id === 'New') {
      setBanner(defaultBanner);
    }
  }, [id, banners]);

  return (
    <>
      {bannerNotFound && <NotFound />}
      {!bannerNotFound && banner !== null && (
        <>
          <MessageBar
            styles={{ root: { width: '100%', zIndex: 1 } }}
            messageBarType={banner.Type}
            isMultiline={banner.Multiline}
            truncated={banner.Truncated}
            dismissButtonAriaLabel='Close'
          >
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(banner.Text, sanitizeOptions),
              }}
            ></div>
          </MessageBar>
          <Stack
            horizontal
            verticalAlign='end'
            tokens={{ padding: 10, childrenGap: 10 }}
          >
            <Dropdown
              label='MessageBar Type'
              selectedKey={banner.Type}
              onChange={(e, o) =>
                setBanner({ ...banner, Type: o.key as MessageBarType })
              }
              placeholder='Select an option'
              options={BannerTypes}
            />
            <Checkbox
              label='Published'
              checked={banner.Published}
              onChange={(e, c) => setBanner({ ...banner, Published: c })}
            />
            <Checkbox
              label='Truncated'
              checked={banner.Truncated}
              onChange={(e, c) => setBanner({ ...banner, Truncated: c })}
            />
            <Checkbox
              label='Multi-line'
              checked={banner.Multiline}
              onChange={(e, c) => setBanner({ ...banner, Multiline: c })}
            />
          </Stack>
          <Stack
            horizontal
            tokens={{ padding: 10 }}
            style={{ height: '300px' }}
          >
            <RichTextEditor
              theme={theme}
              value={banner.Text}
              ariaLabel='Create Banner Text Area'
              label='Customize Banner'
              placeholder='Start typing here'
              onChange={(v) => {
                setBanner({ ...banner, Text: addTargetToLink(v) });
              }}
              resizable
            />
          </Stack>
          <Stack horizontal tokens={{ padding: 10, childrenGap: 5 }}>
            <PrimaryButton text='Save' onClick={save} disabled={bannerSaving} />
            {bannerSaving && <Spinner size={SpinnerSize.large} />}
          </Stack>
        </>
      )}
    </>
  );
};

export default Banner;

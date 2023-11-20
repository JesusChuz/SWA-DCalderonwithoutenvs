import { getTheme, Stack } from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getCommonStyles } from 'src/components/GeneralComponents/CommonStyles';
import { TemplateList } from 'src/components/TemplateManagement/TemplateList';
import { getSelectedAdminSegment } from 'src/store/selectors';

export const TenantSegmentAdminTemplate = () => {
  const segment = useSelector(getSelectedAdminSegment);
  const theme = getTheme();
  const commonStyles = getCommonStyles(theme);
  return (
    <Stack
      className={`${commonStyles.overflowYAuto} ${commonStyles.flexGrow} ${commonStyles.fullHeight}`}
    >
      <TemplateList segmentId={segment.ID} />
    </Stack>
  );
};

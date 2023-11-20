import * as React from 'react';
import {
  Stack,
  DetailsList,
  Text,
  IColumn,
  Icon,
  useTheme,
} from '@fluentui/react';

import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { showTemplateFailures } from './TemplateManagement.utils';
import { TemplateFailure } from 'src/types/Catalog/TemplateFailure.types';

interface ITemplateFailuresList {
  template: WorkspaceTemplateDto;
  containerStyles?: React.CSSProperties;
}

export const TemplateFailuresList = (props: ITemplateFailuresList) => {
  const theme = useTheme();

  const columns: IColumn[] = [
    {
      key: 'VMName',
      name: 'Machine Name',
      minWidth: 150,
      maxWidth: 150,
      onRender: (failure: TemplateFailure) => {
        return <Text variant='small'>{failure.VMName}</Text>;
      },
    },
    {
      key: 'ErrorMessage',
      name: 'Error Message',
      isMultiline: true,
      minWidth: 150,
      onRender: (failure: TemplateFailure) => {
        return <Text variant='small'>{failure.ErrorMessage}</Text>;
      },
    },
  ];

  const style = React.useMemo(() => {
    return props.containerStyles ? props.containerStyles : {};
  }, [props.containerStyles]);

  return (
    <>
      {showTemplateFailures(props.template) && (
        <Stack style={style}>
          <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 10 }}>
            <Icon
              aria-label='error icon'
              iconName='Error'
              style={{
                color: theme.semanticColors.errorText,
                fontSize: 25,
                height: 25,
                width: 25,
              }}
            />
            <Text>Failures</Text>
          </Stack>
          <DetailsList
            items={props.template.Failures}
            columns={columns}
            checkboxVisibility={2}
          />
        </Stack>
      )}
    </>
  );
};

import * as React from 'react';
import {
  DetailsList,
  IColumn,
  Text,
  SelectionMode,
  CheckboxVisibility,
  ISelection,
  IObjectWithKey,
  Selection,
  DetailsRow,
  IDetailsRowProps,
  IDetailsRowStyles,
  Icon,
  useTheme,
  Stack,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFeatureFlagRemoveTenantSegmentUser,
  getSelectedAdminSegment,
} from '../../../../store/selectors';
import { LightUserRoleAssignmentDto } from '../../../../types/AuthService/LightUserRoleAssignmentDto.types';
import { setSelectedUsers } from '../../../../store/actions';

interface IProps {
  segmentMembers: LightUserRoleAssignmentDto[];
}

export const TenantSegmentAdminMembersList = (props: IProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const removeUserFeatureFlag = useSelector(
    getFeatureFlagRemoveTenantSegmentUser
  );

  const userSelection = new Selection<LightUserRoleAssignmentDto>({
    getKey: (item) => item.UserId,
    onSelectionChanged: () => {
      dispatch(setSelectedUsers(userSelection.getSelection()));
    },
  });

  const onRenderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = { userSelect: 'auto', cursor: 'auto' };
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const columns: IColumn[] = [
    {
      key: 'UserEmail',
      name: 'User Email',
      minWidth: 225,
      maxWidth: 300,
      onRender: (user: LightUserRoleAssignmentDto) => {
        return (
          <Text
            style={user.Email == null ? { fontStyle: 'italic' } : undefined}
            variant='small'
          >{`${user.Email ?? 'Email Not Found'}`}</Text>
        );
      },
    },
    {
      key: 'UserRole',
      name: 'User Role(s)',
      minWidth: 375,
      maxWidth: 400,
      onRender: (user: LightUserRoleAssignmentDto) => {
        const role = user.LightRoleAssignments.filter(
          (u) => u.SegmentDefinitionId == selectedSegment.ID
        );
        return (
          <Text variant='small'>{`${role
            .map((r) => r.RoleDisplayName)
            .join(', ')}`}</Text>
        );
      },
    },
    {
      key: 'UserExists',
      name: 'User Exists',
      minWidth: 50,
      maxWidth: 75,
      onRender: (user: LightUserRoleAssignmentDto, i) => {
        return (
          <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign='center'>
            <Icon
              iconName={
                user.UserExists ? 'SkypeCircleCheck' : 'StatusErrorFull'
              }
              style={{
                color: user.UserExists
                  ? theme.semanticColors.successIcon
                  : theme.semanticColors.errorIcon,
              }}
            />
            <Text variant='small'>{user.UserExists ? 'Yes' : 'No'}</Text>
          </Stack>
        );
      },
    },
  ];

  return (
    <DetailsList
      styles={{ root: { overflowY: 'auto' } }}
      items={props.segmentMembers}
      columns={columns}
      selection={userSelection as ISelection<IObjectWithKey>}
      checkboxVisibility={CheckboxVisibility.always}
      getKey={(item: LightUserRoleAssignmentDto) => item.UserId}
      setKey='multiple'
      selectionMode={
        removeUserFeatureFlag ? SelectionMode.multiple : SelectionMode.none
      }
      checkButtonAriaLabel={'checkbox'}
      ariaLabelForSelectAllCheckbox={'select all checkbox'}
      onRenderRow={onRenderRow}
    />
  );
};

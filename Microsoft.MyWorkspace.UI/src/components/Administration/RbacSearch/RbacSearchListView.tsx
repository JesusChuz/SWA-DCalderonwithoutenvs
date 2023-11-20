import * as React from 'react';
import {
  SelectionMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  ColumnActionsMode,
  Stack,
  IconButton,
} from '@fluentui/react';
import { RoleAssignmentDto } from '../../../types/AuthService/RoleAssignmentDto.types';
import { getAdminUserRoleAssignment } from '../../../store/selectors';
import { useSelector } from 'react-redux';
import { RbacSearchPanel } from './RbacSearchPanel';

export const RbacSearchListView = (): JSX.Element => {
  const rbacSearchResults = useSelector(getAdminUserRoleAssignment);
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const [selectedRoleAssignment, setSelectedRoleAssignment] =
    React.useState<RoleAssignmentDto>(null);

  const columnsMap: Record<string, IColumn> = {
    roleName: {
      key: 'RoleName',
      name: 'Role Name',
      ariaLabel: 'role name column',
      fieldName: 'RoleName',
      minWidth: 120,
      maxWidth: 240,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    segmentName: {
      key: 'SegmentName',
      name: 'Segment Name',
      ariaLabel: 'segment name column',
      minWidth: 120,
      maxWidth: 240,
      fieldName: 'SegmentName',
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    description: {
      key: 'Description',
      name: 'Role Description',
      ariaLabel: 'description column',
      fieldName: 'Description',
      minWidth: 120,
      maxWidth: 1200,
      isResizable: true,
      columnActionsMode: ColumnActionsMode.disabled,
    },
    information: {
      key: 'Information',
      name: 'More',
      ariaLabel: 'more information button',
      minWidth: 40,
      isIconOnly: true,
      columnActionsMode: ColumnActionsMode.disabled,
      onRender: (userRole: RoleAssignmentDto) => (
        <Stack horizontalAlign='end'>
          <IconButton
            iconProps={{ iconName: 'More' }}
            onClick={() => setSelectedRoleAssignment(userRole)}
          />
        </Stack>
      ),
    },
  };

  const buildColumnsObject = () => {
    const newColumns: IColumn[] = [];
    newColumns.push(columnsMap.roleName);
    newColumns.push(columnsMap.segmentName);
    newColumns.push(columnsMap.description);
    newColumns.push(columnsMap.information);

    setColumns(newColumns);
  };

  React.useEffect(() => {
    buildColumnsObject();
  }, []);

  return (
    <>
      <DetailsList
        items={rbacSearchResults.UserRoleAssignments}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
      />
      <RbacSearchPanel
        selectedRoleAssignment={selectedRoleAssignment}
        setSelectedRoleAssignment={setSelectedRoleAssignment}
      />
    </>
  );
};

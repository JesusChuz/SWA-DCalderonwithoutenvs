import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  SearchBox,
  FontIcon,
  Text,
  FocusTrapZone,
  DefaultButton,
  useTheme,
  StackItem,
  Link,
  Selection,
  SelectionMode,
  IObjectWithKey,
  ISelection,
  ShimmeredDetailsList,
  IColumn,
  CheckboxVisibility,
  IDetailsRowProps,
  IDetailsRowStyles,
  DetailsRow,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';

import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { styles } from './ChooseTemplate.styles';
import { WorkspaceTemplateDto } from '../../../../types/Catalog/WorkspaceTemplateDto.types';
import {
  getCatalogMachineSkus,
  getCatalogTemplates,
  getCatalogTemplatesLoadingStatus,
  getIsAdmin,
} from '../../../../store/selectors/catalogSelectors';
import {
  editableWorkspaceSetCurrentWorkspaceNew,
  editableWorkspaceUpdateWithTemplate,
} from '../../../../store/actions/editableWorkspaceActions';
import { getEditableWorkspaceEditType } from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  getFeatureFlagTemplateQuotaAdjustment,
  getUserRoleAssignmentConstraint,
} from '../../../../store/selectors';
import { getTemplateQuotaErrorMessage } from '../../../../store/validators/quotaValidators';
import { VirtualMachineSkuDto } from '../../../../types/Catalog/VirtualMachineSkuDto.types';
import clsx from 'clsx';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { SelectedTemplateInfo } from './SelectedTemplateInfo';
import { TemplateDetailsPanel } from './TemplateDetailsPanel';
import { WorkspaceEditType } from 'src/types/enums/WorkspaceEditType';

export const ChooseTemplate = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [filterText, setFilterText] = React.useState<string>('');
  const [disableTrapZone, setDisableTrapZone] = React.useState(false);
  const [openedTemplateDetailsPanel, setOpenedTemplateDetailsPanel] =
    React.useState<boolean>(false);
  const openPanel = () => setOpenedTemplateDetailsPanel(true);
  const dismissPanel = () => setOpenedTemplateDetailsPanel(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<WorkspaceTemplateDto | null>(null);
  const templates: WorkspaceTemplateDto[] = useSelector(getCatalogTemplates);
  const templatesLoading = useSelector(getCatalogTemplatesLoadingStatus);
  const skus: VirtualMachineSkuDto[] = useSelector(getCatalogMachineSkus);
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const templateQuotaAdjustmentEnabled = useSelector(
    getFeatureFlagTemplateQuotaAdjustment
  );
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const isAdmin: boolean = useSelector(getIsAdmin);
  const isScreenMobileOrTabletSized = useMediaQuery('(max-width: 1024px)');

  React.useEffect(() => {
    if (!isScreenMobileOrTabletSized) {
      dismissPanel();
    }
  }, [isScreenMobileOrTabletSized]);

  const filter = (off: WorkspaceTemplateDto) => {
    const showFiltered =
      filterText !== ''
        ? off.Name.toLowerCase()
            .replace(/ /g, '')
            .includes(filterText.toLowerCase().replace(/ /g, ''))
        : true;
    return showFiltered;
  };

  const offeringsGroupedByFavorite = React.useMemo(() => {
    return templates && templates.length > 0 ? templates.filter(filter) : [];
  }, [templates, filterText, isAdmin]);

  const columns: IColumn[] = [
    {
      key: 'Name',
      name: ' Template Name',
      isResizable: true,
      minWidth: 100,
      onRender: (item: WorkspaceTemplateDto) => {
        const quotaError = getTemplateQuotaErrorMessage(
          item.VirtualMachines,
          skus,
          userRoleAssignmentConstraint
        );
        return (
          <Stack
            verticalAlign='center'
            className={`${commonStyles.leftAlignText}`}
          >
            <StackItem>
              <Text style={{ justifySelf: 'flex-start' }}>{item.Name}</Text>
            </StackItem>
            {templateQuotaAdjustmentEnabled && quotaError && (
              <StackItem>
                <FontIcon
                  iconName='Blocked2'
                  className={styles.exceedsQuotaIcon}
                  title={`exceeds quota icon`}
                />
                <Text style={{ justifySelf: 'flex-start' }}>
                  This template cannot be deployed as it exceeds quota
                  constraints.
                </Text>
                <Link
                  className={commonStyles.marginLeft8}
                  onClick={() => setOpenedTemplateDetailsPanel(true)}
                >
                  Details
                </Link>
              </StackItem>
            )}
          </Stack>
        );
      },
    },
  ];

  const onRenderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = {
        userSelect: 'auto',
        cursor: 'auto',
        minHeight: '70px',
        alignItems: 'center',
      };
      return (
        <DetailsRow
          {...props}
          styles={customStyles}
          checkButtonAriaLabel='Template Selection Radio Button'
        />
      );
    }
    return null;
  };

  React.useEffect(() => {
    setDisableTrapZone(true);
  }, []);

  const buildTemplateOfferingList = () => {
    if (templatesLoading) {
      return (
        <Stack
          horizontal
          horizontalAlign='center'
          tokens={{ padding: '40px 8px' }}
        >
          <Spinner
            size={SpinnerSize.large}
            className={commonStyles.loading}
            style={{ marginTop: 0 }}
          />
        </Stack>
      );
    }
    if (templates && templates.length > 0) {
      return (
        <ShimmeredDetailsList
          checkboxCellClassName={commonStyles.flexCentered}
          items={offeringsGroupedByFavorite}
          columns={columns}
          selectionMode={SelectionMode.single}
          selection={templateSelection as ISelection<IObjectWithKey>}
          checkboxVisibility={CheckboxVisibility.always}
          onRenderRow={onRenderRow}
        />
      );
    } else {
      return (
        <Stack tokens={{ padding: '40px 8px' }}>
          <Text variant='large'>No Templates Found</Text>
        </Stack>
      );
    }
  };

  const templateSelection = new Selection<WorkspaceTemplateDto>({
    getKey: (item) => item.ID,
    onSelectionChanged: () => {
      const selection = templateSelection.getSelection();
      const template =
        selection && selection.length > 0 ? selection.at(0) : undefined;
      if (template) {
        setSelectedTemplate(template);
        const quotaError = getTemplateQuotaErrorMessage(
          template.VirtualMachines,
          skus,
          userRoleAssignmentConstraint
        );
        if (templateQuotaAdjustmentEnabled) {
          quotaError
            ? dispatch(
                editableWorkspaceSetCurrentWorkspaceNew(
                  WorkspaceEditType.NewTemplateWorkspace
                )
              )
            : dispatch(editableWorkspaceUpdateWithTemplate(template));
        }
      } else {
        setSelectedTemplate(null);
        dispatch(
          editableWorkspaceSetCurrentWorkspaceNew(
            WorkspaceEditType.NewTemplateWorkspace
          )
        );
      }
    },
  });

  const templateOfferingList = buildTemplateOfferingList();
  return (
    <div
      className={`${styles.wrapper} ${commonStyles.fullHeight}`}
      data-custom-parent-group='group1'
      data-custom-parentid={`${workspaceEditType} Workspace - Choose Template`}
    >
      <Stack
        horizontal
        className={`${styles.offeringListColumn} ${styles.wrap} ${commonStyles.fullHeight}`}
        style={{ paddingRight: '24px' }}
      >
        <Stack
          className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText} ${commonStyles.fullHeight}`}
        >
          <FocusTrapZone
            className={commonStyles.fullHeight}
            style={{ display: 'flex', flexDirection: 'column' }}
            isClickableOutsideFocusTrap={true}
            forceFocusInsideTrap={false}
            disabled={disableTrapZone}
          >
            <Stack
              horizontal
              verticalAlign='center'
              horizontalAlign='space-between'
              className={commonStyles.fullWidth}
            >
              <h3>Template Catalog</h3>
              {isScreenMobileOrTabletSized && (
                <DefaultButton
                  text={`View Selected Template`}
                  onClick={() => openPanel()}
                  disabled={!selectedTemplate}
                />
              )}
            </Stack>
            <SearchBox
              onChange={(event, newValue) =>
                setFilterText(newValue.toLowerCase())
              }
              onClear={() => setFilterText('')}
              className={`${commonStyles.textFieldSpacing} ${commonStyles.flexShrink0}`}
              placeholder='Filter By Name'
              value={filterText}
              iconProps={{ iconName: 'Filter' }}
            />
            <Stack
              className={clsx(
                commonStyles.fullWidth,
                commonStyles.overflowYAuto,
                commonStyles.flexGrow,
                commonStyles.minHeight100
              )}
            >
              <div className={styles.spacer}>{templateOfferingList}</div>
            </Stack>
          </FocusTrapZone>
        </Stack>
      </Stack>
      {selectedTemplate && (
        <TemplateDetailsPanel
          openTemplateDetailsPanel={openedTemplateDetailsPanel}
          dismissPanel={dismissPanel}
          template={selectedTemplate}
        />
      )}
      {!isScreenMobileOrTabletSized && (
        <Stack
          horizontal
          className={clsx(
            styles.offeringSelectionColumn,
            styles.wrap,
            commonStyles.fullHeight,
            commonStyles.overflowYAuto,
            styles.horizontalPadding
          )}
        >
          {selectedTemplate ? (
            <SelectedTemplateInfo
              template={selectedTemplate}
              dismissPanel={dismissPanel}
              openPanel={openPanel}
              openedTemplateDetailsPanel={openedTemplateDetailsPanel}
            />
          ) : (
            <h4>No Template Selected</h4>
          )}
        </Stack>
      )}
    </div>
  );
};

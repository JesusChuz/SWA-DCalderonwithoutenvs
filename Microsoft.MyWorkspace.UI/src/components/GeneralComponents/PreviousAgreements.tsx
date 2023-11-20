import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  DetailsList,
  CheckboxVisibility,
  SelectionMode,
} from '@fluentui/react';

import { AgreementDto } from '../../types/Catalog/AgreementDto.types';
import {
  getCatalogAgreements,
  getCatalogUserProfileAgreements,
} from '../../store/selectors/catalogSelectors';
import { formatDateString } from '../../shared/DateTimeHelpers';
import sanitizeHtml from 'sanitize-html';

const columns = [
  {
    key: 'column1',
    name: 'Agreements',
    fieldName: 'AgreementText',
    minWidth: 100,
    maxWidth: 850,
    isResizable: true,
    isMultiline: true,
    onRender: (item: AgreementDto) => (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.AgreementText) }}
      ></div>
    ),
  },
  {
    key: 'column2',
    name: 'Date',
    fieldName: 'UpdatedOn',
    minWidth: 50,
    maxWidth: 50,
    isResizable: false,
  },
];

export const PreviousAgreements = (): JSX.Element => {
  const userAgreements: string[] = useSelector(getCatalogUserProfileAgreements);
  const agreements: AgreementDto[] = useSelector(getCatalogAgreements);
  const [formattedAgreements, setFormattedAgreements] = React.useState([]);

  React.useEffect(() => {
    setFormattedAgreements(
      userAgreements.map((agreementId: string) => {
        const a: AgreementDto = agreements.find((v) => v.ID === agreementId);
        if (!a) return null;
        return { ...a, UpdatedOn: formatDateString(a.UpdatedOn) };
      })
    );
  }, [userAgreements]);

  return (
    <DetailsList
      selectionMode={SelectionMode.none}
      items={formattedAgreements}
      columns={columns}
      checkboxVisibility={CheckboxVisibility.hidden}
    />
  );
};

export { PreviousAgreements as default };

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SelectorType } from 'src/types/SelectorType.types';

export const UpdateStaleDocuments = (
  staleDocuments: Set<string>,
  refreshedDocuments: string[]
) => {
  const updatedSet = new Set(staleDocuments);
  for (let i = 0; i < refreshedDocuments.length; i++) {
    updatedSet.delete(refreshedDocuments[i]);
  }
  return updatedSet;
};

export const AddStaleDocuments = (
  staleDocuments: Set<string>,
  newDocument: string
) => {
  const updatedSet = new Set(staleDocuments);
  updatedSet.add(newDocument);
  return updatedSet;
};

export const useIsStaleDocument = <T>(
  staleDocumentsSelector: SelectorType<T, Set<string>>,
  documentId: string
) => {
  const staleDocuments = useSelector(staleDocumentsSelector);

  const isStale = useMemo(
    () => staleDocuments.has(documentId),
    [staleDocuments, documentId]
  );

  return isStale;
};

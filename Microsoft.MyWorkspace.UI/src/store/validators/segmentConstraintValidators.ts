import { DomainNameInvalid, NoError } from './ErrorConstants';

export const validateDomainNames = (domainNames: string[]): string[] => {
  return domainNames
    ? domainNames.map(function (item) {
        const matches = item.match(
          /^ ?((?!((http|https):\/\/)))((\*|((?!-)\^?[A-Za-z0-9-]{1,63}))(?<!-)([.\/?&=;+]))+[A-Za-z]{2,6}$/gm
        );
        return matches == null ? DomainNameInvalid : NoError;
      })
    : [];
};

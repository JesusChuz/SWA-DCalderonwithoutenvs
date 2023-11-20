export const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const COMMASEPARATEDNUMBERSANDRANGES =
  /^([0-9]+)(-[0-9]+)*(,([0-9]+)(-[0-9]+)*)*$/;
export const COMMASEPARATEDNUMBERSANDLETTERSANDSPACESANDHIPHENS =
  /^([a-zA-Z0-9\s\-]+)*(,[a-zA-Z0-9\s\-]+)*$/;
export const isEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

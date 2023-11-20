import { mergeStyleSets } from '@fluentui/react';

export const styles = mergeStyleSets({
  actionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionsContainer: {
    minHeight: '10vh',
  },
  button: {
    margin: 'auto',
  },
  buttonRow: {
    padding: '40px 10px 0 10px',
  },
  changePasswordButton: {
    marginTop: '10px',
    marginLeft: '8px',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  changePasswordContent: {
    height: '280px',
  },
  divider: {
    width: '100%',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  generalBottomRow: {
    paddingTop: '5% !important',
  },
  generalSaveRow: {
    paddingTop: '8px !important',
  },
  iconWrapper: {
    width: '24px',
    height: '24px',
    marginLeft: '10px',
  },
  lockDescription: {
    paddingTop: '0 !important',
  },
  floatRight: {
    float: 'right',
  },
  ipList: {
    overflowY: 'auto',
    maxHeight: '20vh',
  },
  ipTextField: {
    verticalAlign: 'middle',
    width: '80%',
  },
  ipCancelIcon: {
    verticalAlign: 'middle',
    minWidth: '20px !important',
  },
  shutDownSubText: {},
  tabContainer: {
    minHeight: '50vh',
  },
  paddedRight: {
    paddingRight: '8px',
  },
  paddedLeft: {
    paddingLeft: '8px',
  },
  domainSelect: {
    minWidth: '150px',
  },
  domainRole: {
    minWidth: '150px',
  },
  dnsForwarderAddressesContainer: {
    marginTop: '8px',
    width: '100%',
  },
  hardwareSelectContainer: {
    padding: '8px',
  },
  storageDeviceTableContainer: {
    margin: '8px',
  },
  borderBottom: {
    borderBottom: '1px grey solid',
  },
  paddingLeft15: {
    paddingLeft: '15px',
  },
  textBold: {
    fontWeight: 'bold',
  },
  paddingRight100: {
    paddingRight: '100px',
  },
  left10: {
    marginLeft: '10px',
  },
  panelWidth: {
    width: '270px',
  },
  marginRight8: {
    padding: '8px',
  },
  check: {
    fontSize: 27,
    height: 27,
    width: 27,
    color: 'green',
  },
  propertiesContent: {
    width: '100%',
  },
});

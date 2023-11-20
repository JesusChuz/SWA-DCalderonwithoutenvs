import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { mergeStyles } from '@fluentui/react';
import { MsalProvider } from '@azure/msal-react';

import { App } from './containers/App';
import './custom.css';
import store from './store/store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { AuthContainer } from './containers/AuthContainer';
import { application } from './authentication/msal';
import { ThemeWrapper } from './components/GeneralComponents/ThemeWrapper';

mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#app)': {
      margin: 0,
      padding: 0,
      height: '100vh',
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MsalProvider instance={application}>
      <AuthContainer>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </AuthContainer>
    </MsalProvider>
  </Provider>,
  document.getElementById('root')
);

if (process.env.REACT_APP_RUN_MSW !== 'false') {
  const { worker } = require('./msw/browser');
  worker.start();
} else {
  serviceWorkerRegistration.unregister();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

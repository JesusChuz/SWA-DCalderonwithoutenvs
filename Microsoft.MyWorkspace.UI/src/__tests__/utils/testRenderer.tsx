import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// As a basic setup, import your same slice reducers
import { RootState } from 'src/store/reducers/rootReducer';
import { BrowserRouter } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { initializeTestStore } from './reduxStoreHelpers';
import { setIconOptions } from '@fluentui/react/lib/Styling';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
export interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: ToolkitStore<RootState>;
  route?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = initializeTestStore(preloadedState),
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  window.history.pushState({}, 'Test page', route);
  setIconOptions({
    disableWarnings: true,
  });
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    initializeIcons(undefined, { disableWarnings: true });
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

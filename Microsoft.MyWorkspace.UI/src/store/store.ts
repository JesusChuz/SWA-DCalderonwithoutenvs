import { PreloadedState, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer, { RootState } from './reducers/rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;

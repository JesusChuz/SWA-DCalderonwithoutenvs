import { OutputSelectorFields } from 'reselect';
import { MyWorkspacesStore } from 'src/store/reducers/rootReducer';

export type SelectorType<T, V> = ((state: MyWorkspacesStore) => V) &
  OutputSelectorFields<
    (args_0: T) => V & {
      clearCache: () => void;
    }
  > & {
    clearCache: () => void;
  };

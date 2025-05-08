import type { ThunkAction, Action } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector, useStore } from 'react-redux';

export function makeStore() {
  return configureStore({
    reducer: {
    //   [appSlice.name]: appSlice.reducer,
    //   [authApi.reducerPath]: authApi.reducer,
    },
    middleware: gDM =>
      gDM({
        serializableCheck: false
      })
        // .concat(authApi.middleware)
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppStore = useStore.withTypes<AppStore>();

export const store = makeStore();

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import anotherCounterSlice from '../features/counter/anotherCounterSlice';

// here define all the reducers.
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    counter2: anotherCounterSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType, // Return type of the thunk function
  RootState, // state type used by getState
  unknown, // any "extra argument" injected into the thunk
  Action<string> // known types of actions that can be dispatched
>;

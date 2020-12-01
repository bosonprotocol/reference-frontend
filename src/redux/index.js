import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import application from "./application/reducer";
import lists from "./lists/reducer";
import multicall from "./multicall/reducer";

// import { updateVersion } from './user/actions'

const PERSISTED_KEYS = ["lists"];

const store = configureStore({
  reducer: {
    application,
    lists,
    multicall,
  },
  middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

// store.dispatch(updateVersion())

export default store;


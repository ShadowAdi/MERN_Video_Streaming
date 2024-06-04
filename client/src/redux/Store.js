import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import videoReducer from "./VideoSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import commentsReducer from "./CommentSlice";

const rootReducer = combineReducers({
  user: userReducer,
  video: videoReducer,
  comment:commentsReducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

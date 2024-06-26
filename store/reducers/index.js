// third-party
import { persistReducer } from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session';
import auth from "./authSlice";

// project import

// ==============================|| COMBINE REDUCERS ||============================== //

const persistConfig = {
  key: "root",
  storage: storageSession,
  timeout: 500
};


const reducers = persistReducer(persistConfig,auth
);

export default reducers;
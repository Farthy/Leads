import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import CustomizerReducer from './customizer/CustomizerSlice';
import AuthReducer from './apps/auth/AuthSlice'
import LeadsReducer from './apps/leads/LeadSlice'
import UserReducer from './apps/user/UserSlice'
import MarketingReducer from './apps/marketing/MarketingSlice'
const persistConfig = {
  key: 'root',
  storage,
};
export const store = configureStore({
  reducer: {
    customizer: persistReducer(persistConfig, CustomizerReducer),
    authReducer: AuthReducer,
    leadsReducer: LeadsReducer,
    userReducer : UserReducer,
    marketingReducer: MarketingReducer,
   
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

export const persistor = persistStore(store);

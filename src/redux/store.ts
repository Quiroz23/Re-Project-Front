import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '@/redux/noopStorage' // El almacenamiento para persistir datos en el localStorage
import { apiSlice } from '@/redux/services/apiSlice'; // Slice de API
import userReducer from '@/redux/features/userSlice'; // Slice del usuario que quieres persistir
import authReducer from '@/redux/features/authSlice'; // Slice de autenticación

// Configuración de redux-persist para userSlice
const persistConfig = {
	key: 'user',
	storage, // Utiliza localStorage por defecto
};

// Configura el rootReducer combinando los reducers y aplicando persistencia solo a userReducer
const rootReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	auth: authReducer,
	user: persistReducer(persistConfig, userReducer), // Solo userReducer será persistido
});

// Configura el store con rootReducer y middlewares adicionales
export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false, // Necesario para evitar problemas con objetos no serializables en redux-persist
		}).concat(apiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

// Configura el persistor para activar la persistencia
export const persistor = persistStore(store);

// Tipos para el estado global y el dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

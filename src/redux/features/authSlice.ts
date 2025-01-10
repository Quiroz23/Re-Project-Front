import { createSlice } from '@reduxjs/toolkit';

// Definición de los tipos de datos de la constante initialState
interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
}

// Valores de Estado Inicial de Autenticación
const initialState = {
	isAuthenticated: false,
	isLoading: true,
} as AuthState;


// Maneja los estados de Autenticación 
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth: state => {
			state.isAuthenticated = true;
		},
		logout: state => {
			state.isAuthenticated = false;
		},
		finishInitialLoad: state => {
			state.isLoading = false;
		},
	},
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
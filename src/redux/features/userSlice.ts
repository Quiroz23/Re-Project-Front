import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definición de los tipos de datos de la constante initialState
interface UserState {
	name: string;
	last_name: string;
	role: string;
}

// Valores de Estado Inicial de Autenticación
const initialState: UserState = {
	name: 'undefined',
	last_name: 'undefined',
	role: 'undefined',
};

// Maneja los estados de Autenticación 
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<{ name: string; last_name: string; role: string }>) => {
			state.name = action.payload.name;
			state.last_name = action.payload.last_name;
			state.role = action.payload.role;
		},
		clearUser: (state) => {
			state.name = 'undefined';
			state.last_name = 'undefined';
			state.role = 'undefined';
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

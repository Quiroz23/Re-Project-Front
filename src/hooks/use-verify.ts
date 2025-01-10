import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';
import { useVerifyMutation } from '@/redux/features/authApiSlice';

export default function useVerify() {
	const dispatch = useAppDispatch();

	const [verify] = useVerifyMutation(); // Se obtiene la función verify del hook(endpoint de verificación token)

	/* Se ejecutará solo una vez al cargar la página porque tiene un array de dependencias vacío */
	useEffect(() => {

		// Valida la sesión actual
		verify(undefined)
			.unwrap() // Se convierte la respuesta a una promesa
			.then(() => {
				dispatch(setAuth()); // Se dispara la acción de actualizar el estado de la autenticación a autenticado
			})
			.finally(() => {
				dispatch(finishInitialLoad()); // Independiente del resultado de la respuesta indica que la carga terminó
			});
	}, []);
}
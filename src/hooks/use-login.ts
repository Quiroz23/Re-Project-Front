import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation, useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { setUser } from '@/redux/features/userSlice';

export default function useLogin() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login, { isLoading }] = useLoginMutation();

	// Estado local para verificar si el usuario ha iniciado sesión
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Ejecuta useRetrieveUserQuery solo si isAuthenticated es verdadero
	const { data: user, isSuccess} = useRetrieveUserQuery(undefined, {
		skip: !isAuthenticated,
	});

	// Estado del formulario
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			// Realiza el login
			await login({ email, password }).unwrap();
			
			// Marca el usuario como autenticado para activar useRetrieveUserQuery
			setIsAuthenticated(true);
		} catch (error) {
			toast.error('Ingresa correctamente los datos');
		}
	};

	// Actualiza el rol en el estado global y redirige al dashboard después de obtener los datos del usuario
	useEffect(() => {
		if (isSuccess && user) {
			const name = user?.profile?.first_name || '';
			const last_name = user?.profile?.last_name || '';
			const role = user?.group?.name || '';

			console.log('Rol del usuario:', role);
			toast.success(`¡Bienvenido ${name}!`);

			// Despacha la acción para establecer el rol en el estado global
			dispatch(setAuth());
			dispatch(setUser({ name, last_name, role }));

			setTimeout(() => {
				router.push('/repository-intranet');
			  }, 100); // Puedes ajustar el tiempo si es necesario
			// Redirige al dashboard
		}
	}, [isSuccess, user, dispatch, router]);

	return {
		email,
		password,
		isLoading,
		onChange,
		onSubmit,
	};
}
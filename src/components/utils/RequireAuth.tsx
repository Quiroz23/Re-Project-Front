'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { Spinner } from "@nextui-org/spinner";

/* Se define el tipo de contenido de Props */
interface Props {
	children: React.ReactNode;
}

/* Función de rutas protegidas */
export default function RequireAuth({ children }: Props) {
	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth); // Extrae el estado de autenticación 

	// Cuando esté cargando el estado de autenticación 
	if (isLoading) {
		return (
			<div className='flex justify-center my-8'>
				<Spinner color='danger'/>
			</div>
		);
	}

	// Si no está autenticado redireccionará al login
	if (!isAuthenticated) {
		redirect('/login');
	}

	// Si el usuario está autenticado permite el acceso a la ruta o componente protegido
	return <>{children}</>;
}
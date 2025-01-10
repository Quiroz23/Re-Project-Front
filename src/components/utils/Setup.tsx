'use client';

import { useVerify } from '@/hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'

/* Inicializa la autenticación y habilita las notificaciones en toda la aplicación */
export default function Setup() {
	useVerify();

	return <ToastContainer theme="colored"/>;
}
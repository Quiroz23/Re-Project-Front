'use client';

import { store } from './store';
import { Provider } from 'react-redux';

interface Props {
	children: React.ReactNode;
}

// Este componente hace que el store esté disponible para cualquier componente anidado
export default function CustomProvider({ children }: Props) {
	return <Provider store={store}>{children}</Provider>;
}
"use client";

import { useAppSelector } from '@/redux/hooks';
import { UserRole } from '@/lib/userRoles';
import { useRouter } from 'next/navigation'; // Cambia 'next/router' a 'next/navigation' en Next.js App Router
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps): React.ReactElement | null {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { role } = useAppSelector((state) => state.user);

  // Solo establece isMounted en true después de que el componente esté montado en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log(role)
    if (isMounted) {
      if (!isAuthenticated) {
        // Si el usuario no está autenticado, redirige a la página de login
        router.push('/login');
      } else if (!allowedRoles.includes(role as UserRole)) {
        // Si el rol del usuario no está permitido, redirige a una página de acceso denegado
        router.push('/repository-intranet/denied');
      }
    }
  }, [isMounted, isAuthenticated, role, allowedRoles, router]);

  // Mientras no esté montado, no renderiza nada
  if (!isMounted || !isAuthenticated || !allowedRoles.includes(role as UserRole)) {
    return null;
  }

  return <>{children}</>; // Si cumple con el rol, renderiza el componente
}
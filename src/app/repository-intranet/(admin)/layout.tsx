'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/userRoles';


export default function ManageAdminPage({
    children,
  }: {
    children: React.ReactNode;
  }) {

	return (
		<>
        <ProtectedRoute allowedRoles={[UserRole.Administrador]}>
			{children}
        </ProtectedRoute>
		</>
	);
}
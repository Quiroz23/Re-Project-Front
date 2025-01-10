'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import RegisterForm from '@/components/publish-document/register-form';
import { UserRole } from '@/lib/userRoles';

export default function ManageStudentPage() {

	return (
		<>
        <ProtectedRoute allowedRoles={[UserRole.ProfesorGuía, UserRole.Director]}>
			<section className='flex items-center justify-center h-screen p-2'>
				<RegisterForm />
			</section>
        </ProtectedRoute>
		</>
	);
}
'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import RegisterFormSection from '@/components/publish-document/register-form-section';
import { UserRole } from '@/lib/userRoles';

export default function ManageStudentPage() {

	return (
		<>
        <ProtectedRoute allowedRoles={[UserRole.ProfesorGuía]}>
			<section className='flex items-center justify-center h-screen p-2'>
				<RegisterFormSection />
			</section>
        </ProtectedRoute>
		</>
	);
}
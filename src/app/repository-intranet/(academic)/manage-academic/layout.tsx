import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.Director, UserRole.ProfesorGuía]}>
      <div>{children}</div>
    </ProtectedRoute>
  );
}

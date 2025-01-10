import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.Director]}>
      <div>{children}</div>
    </ProtectedRoute>
  );
}

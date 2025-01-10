
import TableManagePublish from "@/components/manage-publish-document/table-manage-publish";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";

export default function DocumentListPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.Director]}>
      <section className="w-full h-screen mt-6">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Gestionar Formularios de Publicación
          </p>
        </div>
        <div className="mt-6">
          <TableManagePublish />
        </div>
      </section>
    </ProtectedRoute>
  );
}

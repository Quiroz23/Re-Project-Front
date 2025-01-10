import TablePublishForm from "@/components/publish-document/table-publish-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";

export default function DocumentListPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ProfesorGuía]}>
      <section className="w-full h-screen mt-6">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Gestionar Publicaciones de Documentos
          </p>
        </div>
        <div className="mt-6">
          <TablePublishForm />
        </div>
      </section>
    </ProtectedRoute>
  );
}


import TableManageApplication from "@/components/manage-aplication-form/table-manage-aplication";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";

export default function VisualizationPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.Director]}>
      <section className="w-full h-screen mt-6">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Gestionar Formularios de Visualización
          </p>
        </div>
        <div className="mt-6">
          <TableManageApplication/>
        </div>
      </section>
    </ProtectedRoute>
  );
}

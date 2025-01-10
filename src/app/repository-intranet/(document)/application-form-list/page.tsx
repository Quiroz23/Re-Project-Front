import TableApplicationForms from "@/components/application-form-list/TableListApplication"
import ProtectedRoute from "@/components/ProtectedRoute"
import { UserRole } from "@/lib/userRoles"

export default function ApplicationFormList() {

    return(
<ProtectedRoute allowedRoles={[UserRole.Estudiante]}>
      <section className="w-full h-screen mt-6 px-2">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Solicitudes de Visualizaciones
          </p>
        </div>
        <div className="mt-6">
        <TableApplicationForms/>
        </div>
      </section>
    </ProtectedRoute>
        

    )
    
}
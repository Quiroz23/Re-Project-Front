"use client";

import ViewerPDF from "@/components/document-profile/ViewerPDF";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useGetApplicationFormValidQuery } from "@/redux/features/apiDocument";

interface ViewDocument {
  params: Promise<{ id_document: number }>;
}

export default function ViewDocumentPage({ params }: ViewDocument) {
  const router = useRouter();
  const { role } = useAppSelector((state) => state.user); // Obtén el rol del usuario
  const { id_document } = React.use(params);
  const [document, setDocument] = useState<number | null>(null);
  const { data: user } = useRetrieveUserQuery();
  const { data: applicationForm } = useGetApplicationFormValidQuery({
    document_id: id_document,
    student_id: user?.id || 0,
  });
  console.log("ID de la solicitud:", id_document);

  /* Verificación de acceso por rol */
  useEffect(() => {
    if (role === "Estudiante" && user?.profile?.section === null) {
      if (applicationForm) {
        setDocument(id_document);
      }
    } else if (role !== "Estudiante") {
      setDocument(id_document);
    } else if (role ==="Estudiante" && user?.profile?.section) {
      setDocument(id_document);
    }else {
      setTimeout(() => {
        router.push(`/repository-intranet/document-profile/${id_document}`);
      }, 2000);
    }
  }, [role, user, applicationForm, id_document, router]);

  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.Estudiante,
        UserRole.ProfesorGuía,
        UserRole.Director,
        UserRole.Profesor,
      ]}
    >
      <div className="flex items-center justify-center h-screen text-center">
        {document ? (
          <ViewerPDF id={id_document || 0} />
        ) : (
          <p className="text-2xl font-semibold">
            Acceso Denegado: El documento no existe o no tienes permisos para
            acceder.
          </p>
        )}
      </div>
    </ProtectedRoute>
  );
}

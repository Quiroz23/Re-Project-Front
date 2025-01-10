"use client";
import InfoDoc from "@/components/document-profile/InfoDoc";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

interface PublicVisPageProps {
  params: Promise<{ id: number }>;
}

export default function PublicVisPage({ params }: PublicVisPageProps) {
  const { id } = React.use(params);
  const { data: user } = useRetrieveUserQuery();
  const currentUserRole = useAppSelector((state) => state.user.role);

  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.Estudiante,
        UserRole.ProfesorGuía,
        UserRole.Director,
        UserRole.Profesor,
      ]}
    >
      <section>
        <div className="flex items-center justify-center min-h-screen w-full">
          {user?.id && (
            <InfoDoc id={id} role={currentUserRole} idUser={user.id} />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}

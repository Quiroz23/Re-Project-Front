"use client";

import RegisterForm from "@/components/publish-document/register-form";
import { useAppSelector } from "@/redux/hooks";
import { UserRole } from "@/lib/userRoles";

export default function RegisterPage() {
  const { role } = useAppSelector((state) => state.user);

  // Convertimos el valor de `role` a un valor del enum `UserRole` si coincide
  const userRole = Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : UserRole.ProfesorGuía; // Valor predeterminado en caso de que `role` no coincida

  return (
    <div>
      <h1>Formulario de Registro</h1>
      <RegisterForm userRole={userRole} />
    </div>
  );
}

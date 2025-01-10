"use client";
import { ShieldBan } from "lucide-react";

export default function DeniedPage() {
  return (
    <>
      <div className="w-full">
        <div className="flex justify-center items-center h-screen">
        	<ShieldBan size={'96px'} color="#ff0000" />
          <p className="text-5xl font-semibold">Acceso Denegado</p>
        </div>
      </div>
    </>
  );
}

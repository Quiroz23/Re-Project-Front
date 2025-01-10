"use client";

import React, { useState } from "react";
import ApplicationFormPending from "@/hooks/use-manage-aplication-form";
import CustomModalApplication from "./custom-modal-application";
import DynamicDataGrid from "@/components/ui/dynamic-tablegrid";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "../ui/button";

// Define el tipo de datos de las filas
interface ApplicationForm {
  id: number;
  state: string;
  created_at: string;
  document_title: string;
  student_name: string;
}

export default function TableManageApplication() {
  const { applicationFormsData, isLoading, refetch } = ApplicationFormPending();
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedApplicationId(null);
    setIsModalOpen(false);
    refetch();
  };

  // Configuración de columnas para la tabla dinámica
  const columns: GridColDef<ApplicationForm>[] = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "state", headerName: "Estado" },
    { field: "created_at", headerName: "Fecha de Creación" },
    { field: "document_title", headerName: "Documento" },
    { field: "student_name", headerName: "Estudiante" },
    {
      field: "actions",
      headerName: "Acciones",
      renderCell: (params) => (
        <Button
          className="bg-red-700 hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(params.row.id);
          }}
          disabled={params.row.state !== "Pendiente"}
        >
          Ver
        </Button>
      ),
    },
  ];

  // Mapeo de datos para ajustarse al tipo definido
  const rows: ApplicationForm[] = (applicationFormsData || []).map((form) => ({
    id: form.id,
    state: (() => {
      switch (form.state) {
        case "1":
          return "Pendiente";
        case "2":
          return "Aprobado";
        case "3":
          return "Rechazado";
        default:
          return "Desconocido";
      }
    })(),
    created_at: form.created_at
      ? new Date(form.created_at).toLocaleString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "", 
    document_title: form.document_title || "Sin título",
    student_name: form.student_name || "Desconocido",
  }));

  return (
    <>
      <div className="h-full">
        <DynamicDataGrid
          rows={rows}
          columns={columns}
          isLoading={isLoading}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          height="100%"
        />
      </div>

      <CustomModalApplication
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        applicationId={selectedApplicationId}
      />
    </>
  );
}

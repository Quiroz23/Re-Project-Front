"use client";

import React, { useState } from "react";
import PublishForm from "@/hooks/use-publish-form";
import CustomModal from "../manage-publish-document/CustomModalPublish";
import DynamicDataGrid from "@/components/ui/dynamic-tablegrid";
import { GridColDef, GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { Button } from "../ui/button";

// Definir el tipo de cada fila
interface PublishFormRow extends GridValidRowModel {
  id: number;
  state: string;
  created_at: string | null;
  document_title: string;
}

export default function TablePublishForm() {
  const { publishFormsData, isLoading, refetch } = PublishForm();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (documentId: number) => {
    setSelectedDocumentId(documentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
    setIsModalOpen(false);
    refetch();
  };

  // Configuración de columnas para el DataGrid
  const columns: GridColDef<PublishFormRow>[] = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "state", headerName: "Estado" },
    { field: "created_at", headerName: "Fecha de Creación" },
    { field: "document_title", headerName: "Documento" },
    {
      field: "actions",
      headerName: "Acciones",
      renderCell: (params: GridRenderCellParams<PublishFormRow>) => (
        <Button
          className="bg-red-700 hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(params.row.id);
          }}
          disabled={params.row.state !== "Pendiente"}
        >
          Ver y Editar
        </Button>
      ),
    },
  ];

  // Mapeo de datos para garantizar el cumplimiento del tipo PublishFormRow
  const rows: PublishFormRow[] = (publishFormsData || []).map((form) => ({
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
    document_title: form.document_title,
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

      {/* Modal para manejar acciones */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        documentId={selectedDocumentId}
        publishId={null}
      />
    </>
  );
}

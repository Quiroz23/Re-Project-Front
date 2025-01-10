"use client";

import React, { useState } from "react";
import PublishFormPending from "@/hooks/use-manage-document-publish";
import CustomModal from "./CustomModalPublish";
import DynamicDataGrid from "@/components/ui/dynamic-tablegrid";
import { GridColDef } from "@mui/x-data-grid";
import { Button } from "../ui/button";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useGetAreasQuery } from "@/redux/features/apiAcademic";



// Define el tipo de datos para las filas
interface PublishFormRow {
  id: number;
  state: string;
  created_at: string;
  document_title: string;
  teacher_name: string;
  document: number; // Asegura que `document` esté disponible para el modal

}


export default function TableManagePublish() {
  const { publishFormsData, isLoading, refetch } = PublishFormPending();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [selectedPublishId, setSelectedPublishId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useRetrieveUserQuery();
  const { data: areas = [] } = useGetAreasQuery();
  const areasAsignadas = areas.filter((area) => area.director === user?.id);
  console.log(publishFormsData)

  const myPublish = publishFormsData?.filter((publish) => 
    areasAsignadas.some(area => area.id === publish?.area)
  );
  
  
  console.log('Mis publicacions',myPublish);

  console.log('Mi area',areasAsignadas);
 

  const handleOpenModal = (documentId: number, publishId: number) => {
    setSelectedDocumentId(documentId);
    setSelectedPublishId(publishId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
    setSelectedPublishId(null);
    setIsModalOpen(false);
    refetch();
  };

  // Configuración de columnas para la tabla dinámica
  const columns: GridColDef<PublishFormRow>[] = [
    { field: "id", headerName: "ID", width: 10 },
    { field: "state", headerName: "Estado" },
    { field: "created_at", headerName: "Fecha de Creación" },
    { field: "document_title", headerName: "Documento" },
    { field: "teacher_name", headerName: "Profesor Guía" },
    { field: "area_name", headerName: "Area" },
    {
      field: "actions",
      headerName: "Acciones",
      renderCell: (params) => (
        <Button
          className="bg-red-700 hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation(); // Evitar que se active el clic en la fila
            handleOpenModal(params.row.document, params.row.id);
          }}
          disabled={params.row.state !== "Pendiente"}
        >
          Ver
        </Button>
      ),
    },
  ];

  // Mapeo de datos para ajustarse al tipo definido
  const rows: PublishFormRow[] = ( myPublish || []).map((form) => ({
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
    created_at: form.created_at ? new Date(
      form.created_at
    ).toLocaleString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }): '',
    document_title: form.document_title || "Sin título",
    teacher_name: form.teacher_name || "Desconocido",
    area_name: form.area_name || "Desconocido",
    document: form.document, // Aseguramos que el documento esté disponible
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

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        documentId={selectedDocumentId}
        publishId={selectedPublishId}
      />
    </>
  );
}

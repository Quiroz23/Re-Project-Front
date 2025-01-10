"use client";

import React, { useState } from "react";
import CustomModal from "../manage-publish-document/CustomModalPublish";
import DynamicDataGrid from "@/components/ui/dynamic-tablegrid";
import { GridColDef, GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { Button } from "../ui/button";
import FetchApplicationForms from "@/hooks/use-fetch-applications";

// Definir el tipo de cada fila
interface ApplicationFormsRow extends GridValidRowModel {
  id: number;
  state: string;
  created_at: string | null;
  document_title: string;
}

export default function TableApplicationForms() {
  const { applicationFormsData, isLoading, refetch } = FetchApplicationForms();

  // Configuración de columnas para el DataGrid
  const columns: GridColDef<ApplicationFormsRow>[] = [
    { field: "id", headerName: "ID", width: 10 },
    {
      field: "state",
      headerName: "Estado",
    },
    {
      field: "created_at",
      headerName: "Fecha de Creación"
    },
    { field: "expiration_date", headerName: "Fecha de Expiración" },
    { field: "document_title", headerName: "Documento" }
  ];

  // Mapeo de datos para garantizar el cumplimiento del tipo ApplicationFormsRow
  const rows: ApplicationFormsRow[] = (applicationFormsData || []).map((form) => ({
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
    expiration_date: form.expiration_date ? new Date(
        form.expiration_date
      ).toLocaleString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }): '',
    document_title: form.document_title,
  }));

  return (
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
  );
}

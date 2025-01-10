import React from "react";
import { DataGrid, GridColDef, GridValidRowModel, GridRowParams } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";

// Define las props del componente con tipos genéricos
interface DynamicDataGridProps<T extends GridValidRowModel> {
  rows: T[]; // Filas que se pasarán a la tabla
  columns: GridColDef<T>[]; // Columnas configuradas para la tabla
  isLoading?: boolean; // Indicador de carga
  pageSize?: number; // Tamaño de página por defecto
  rowsPerPageOptions?: number[]; // Opciones de filas por página
  height?: string | number; // Altura del contenedor
  onRowClick?: (row: T) => void; // Función opcional para manejar el clic en una fila
}

// Componente reutilizable para tablas dinámicas
const DynamicDataGrid = <T extends GridValidRowModel>({
  rows,
  columns,
  isLoading = false,
  pageSize = 5,
  rowsPerPageOptions = [5, 10, 20],
  height,
  onRowClick,
}: DynamicDataGridProps<T>) => {
  return (
    <div style={{ height, width: "100%" }}>
      {isLoading ? (
        // Muestra un indicador de carga mientras se cargan los datos
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
          <CircularProgress />
          <p style={{ marginLeft: "0.5rem" }}>Cargando datos...</p>
        </div>
      ) : (
        // Tabla de datos con las propiedades configuradas
        <DataGrid
          rows={rows}
          columns={columns.map((col) => ({
            ...col,
            flex: col.flex ?? (!col.width ? 1 : undefined), // Usar `flex` si no se especifica `width`
          }))}
          pageSize={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          disableSelectionOnClick
          onRowClick={(params: GridRowParams<T>) => onRowClick && onRowClick(params.row)}
          sx={{
            "& .MuiDataGrid-cell": {
              outline: "none", // Elimina el contorno azul en celdas
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5", // Cambia el color de fondo al pasar sobre una fila
            },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: "bold",
              backgroundColor: "#f0f0f0",
            },
          }}
        />
      )}
    </div>
  );
};

export default DynamicDataGrid;

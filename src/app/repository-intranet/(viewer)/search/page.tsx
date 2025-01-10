"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/search/search";
import TableDocuments from "@/components/search/table-documents";
import { useDocumentAccess } from "@/hooks/use-document-access";
import { Spinner } from "@nextui-org/spinner";
import Filters from "@/components/search/filters";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/userRoles";
import { useSearchParams } from "next/navigation";

interface DocumentData {
  id:number;
  title: string;
  entry_date: string;
  author_names: string;
  type_document_name: string;
  type_document: string;
  identifier: string;
  area: number;
  publisher: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query"); // Obtiene la query inicial de la URL
  const { filteredData: initialData = [], isLoading } = useDocumentAccess();
  const [searchResults, setSearchResults] = useState<DocumentData[]>([]);
  const [filters, setFilters] = useState<{ area: string; type: string; publisher: string }>({
    area: "",
    type: "",
    publisher: "",
  });

  // Filtra los documentos al cargar o al cambiar los filtros/queryParam
  useEffect(() => {
    const filteredResults = initialData.filter((doc) => {
      const matchesQuery = queryParam
        ? doc.title.toLowerCase().includes(queryParam.toLowerCase()) || // Búsqueda en el título
          doc.author_names.toLowerCase().includes(queryParam.toLowerCase()) // Búsqueda en el autor
        : true;

      const matchesArea = filters.area ? doc.area.toString() === filters.area : true;
      const matchesType = filters.type ? doc.type_document === filters.type : true;
      const matchesPublisher = filters.publisher ? doc.publisher === filters.publisher : true;

      return matchesQuery && matchesArea && matchesType && matchesPublisher;
    });

    setSearchResults(filteredResults);
  }, [initialData, filters, queryParam]);

  // Callback para recibir los filtros desde el componente `Filters`
  const handleFilterChange = (newFilters: { area: string; type: string; publisher: string }) => {
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={[
        UserRole.Estudiante,
        UserRole.ProfesorGuía,
        UserRole.Director,
        UserRole.Profesor,
      ]}
    >
      <div className="flex items-center justify-center h-screen p-2">
        <main className="grid grid-cols-3 grid-rows-4 w-2/3 h-full gap-4">
          {/* Barra de búsqueda */}
          <section className="row-span-1 h-fit pt-20 pb-6 col-span-3">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl font-semibold">¿Qué estás buscando?</span>
            </div>
            <SearchBar getSearchResults={setSearchResults} queryParam={queryParam || ""} />
          </section>

          {/* Sección de filtros */}
          <section className="row-span-4 col-start-1">
            <Filters getFilterResults={handleFilterChange} />
          </section>

          {/* Tabla de documentos */}
          <section className="col-span-2 row-span-4 text-center w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
              </div>
            ) : searchResults.length > 0 ? (
              <TableDocuments data={searchResults} />
            ) : (
              <p className="flex text-center items-center justify-center h-full font-semibold">
                No hay documentos académicos según su búsqueda
              </p>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

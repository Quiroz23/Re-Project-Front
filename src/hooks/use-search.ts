// hooks/useSearchFilter.ts
import { useDocumentAccess } from "./use-document-access";

export default function useSearchFilter(query: string) {
  const { filteredData: initialData, isLoading } = useDocumentAccess(); //Trae los datos de los documentos según el rol desde el hook

  if (isLoading) return { results: [], isLoading };

  // Se asegura que `documents` no es undefined
  const availableDocuments = initialData || [];

  // Se filtran los documentos según la consulta
  const filteredDocuments = availableDocuments.filter((document) => {
    console.log(query)
    const lowerCaseQuery = query.toLowerCase();
    return (
      document.title?.toLowerCase().includes(lowerCaseQuery) ||
      document.abstract?.toLowerCase().includes(lowerCaseQuery) ||
      document.entry_date?.toLowerCase().includes(lowerCaseQuery) ||
      document.area?.toString().includes(lowerCaseQuery) ||
      document.publisher?.toString().includes(lowerCaseQuery) 
    );
  });

  return { results: filteredDocuments, isLoading };
}

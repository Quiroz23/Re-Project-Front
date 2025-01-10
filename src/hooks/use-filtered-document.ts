import { useMemo } from "react";
import { DocumentModel } from "@/redux/features/apiDocument"; // Ajusta la ruta según tu estructura

// Definir el tipo de los datos filtrados
interface FilteredDocument {
  title: string;
  author: number; // ID of CustomGroup
  entry_date: string;
}

// Hook personalizado para filtrar los documentos
function useFilteredDocuments(documents: DocumentModel[]): FilteredDocument[] {
  return useMemo(() => {
    return documents.map((doc) => ({
      title: doc.title,
      author: doc.author,
      entry_date: doc.entry_date,
    }));
  }, [documents]);
}

export default useFilteredDocuments;

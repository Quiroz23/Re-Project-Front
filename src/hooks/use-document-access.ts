import { useGetDocumentAcceptQuery } from "@/redux/features/apiDocument";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

interface DocumentData {
    id:number;
    title: string;
    entry_date: string;
    abstract:  string | null;
    author_names: string;
    type_document_name: string;
    type_document: string;
    identifier: string;
    area: number;
    publisher: string;
}

export function useDocumentAccess() {
    const { role } = useAppSelector((state) => state.user); // Se obtiene el rol del usuario
    const { data: documents, isLoading } = useGetDocumentAcceptQuery(); // Se obtiene desde la consulta todos los documentos
    const [filteredData, setFilteredData] = useState<DocumentData[]>([]); // Se crea una lista que contendrá los documentos filtrados

    /* Se realiza la lógica de documentos basado en roles */
    useEffect(() => {
        if (documents) {
            if (role === 'Estudiante') {
                const documentPublic = documents.filter(doc => doc.type_access === true); // Filtra por acceso "público" (true) si es estudiante
                const documentData: DocumentData[] = documentPublic.map((doc) => ({
                    id: doc.id,
                    title: doc.title,
                    entry_date: doc.entry_date.toString(),
                    abstract: doc.abstract.toString(),
                    author_names: doc.author_names.toString(),
                    type_document_name: doc.type_document_name.toString(),
                    type_document: doc.type_document.toString(),
                    identifier: doc.identifier.toString(),
                    area: doc.area,
                    publisher: doc.publisher.toString(),
                }));
                setFilteredData(documentData);
            } else {
                const documentData: DocumentData[] = documents.map((doc) => ({
                    id: doc.id,
                    title: doc.title,
                    entry_date: doc.entry_date.toString(),
                    abstract: doc.abstract.toString(),
                    author_names: doc.author_names.toString(),
                    type_document_name: doc.type_document_name.toString(),
                    type_document: doc.type_document.toString(),
                    identifier: doc.identifier.toString(),
                    area: doc.area,
                    publisher: doc.publisher.toString(),
                }));
                setFilteredData(documentData);
            }
            console.log(documents)
        }
    }, [documents, role]);

    return { filteredData, isLoading };
}

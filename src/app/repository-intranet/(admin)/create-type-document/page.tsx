'use client';
import TableAdmin from "@/components/admin/TableAdmin"
import {TypeDocument, useGetTypeDocumentsQuery } from "@/redux/features/apiDocument";



export default function CreateTypeDocumentPage() {

    const {data: typeDocuments = [], refetch} = useGetTypeDocumentsQuery();


    const columns = [
        { header: "ID", key: "id" as const },
        { header: "Nombre del tipo de documento", key: "type_name" as const },
      ];

    return (
        <div className="flex items-center justify-center pt-16">
            <TableAdmin<TypeDocument> columns={columns} data={typeDocuments} refetch={refetch} title="Tipos de Documentos" method="typeDocument" />
        </div>
    )
}
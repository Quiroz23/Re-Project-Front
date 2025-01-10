'use client';
import TableAdmin from "@/components/admin/TableAdmin"
import { Area, useGetAreasModQuery } from "@/redux/features/apiAcademic";


export default function CreateAreaPage() {

    const { data: areas = [], refetch } = useGetAreasModQuery();


    const columns = [
        { header: "ID", key: "id" as const },
        { header: "Nombre Area", key: "area_name" as const },
        { header: "Director", key: "director_email" as const },
      ];

    
    return (
        <div className="flex items-center justify-center pt-16">
            <TableAdmin<Area> columns={columns} data={areas} title="Areas" method="area" refetch={refetch}/>
        </div>
    )
} 
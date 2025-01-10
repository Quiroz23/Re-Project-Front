'use client';
import ModalReArea from "@/components/academic/ModalReArea";
import TableReArea from "@/components/academic/TableReArea";
import { Button } from "@/components/ui/button";
import { useGetCareersQuery, useGetAreasQuery, useDeleteCareerMutation, useGetSignaturesQuery, } from "@/redux/features/apiAcademic";
/* import { useRetrieveUserQuery } from "@/redux/features/authApiSlice"; */
import { PlusIcon } from "@heroicons/react/20/solid";
import { useDisclosure } from "@nextui-org/react";
import { useParams } from "next/navigation";


// Importa el tipo Career desde el mismo módulo en ambos archivos
import { Career, Signature  } from "@/redux/features/apiAcademic";
import { toast } from "react-toastify";

export default function CareerPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: careersData, refetch } = useGetCareersQuery();
/*   const { data: user } = useRetrieveUserQuery(); */
  const { data: areas = [] } = useGetAreasQuery();
  const { data: signaturesData = [] } = useGetSignaturesQuery(); // Cargamos las asignaturas
  const { id } = useParams();
  const [deleteCareer] = useDeleteCareerMutation();

 /*  const areaMe = areas.find((area) => area.director === user?.id); */
  const areaId = Number(id)
  const careers = careersData
  ?.filter((career) => career.area === areaId) // Filtrar por el área del usuario
  .map((career) => ({
    ...career,
    areaName: areas.find((area) => area.id === career.area)?.area_name || "Sin asignar", // Agregar el nombre del área
  })) || [];

  console.log(careers);

  /* const careers: Career[] = careersData?.filter((career) => career.area === areaMe?.id) || []; */
 
  // Configuración de columnas para las carreras
  const columns = [
    { header: "ID", key: "id" as const },
    { header: "Carrera Nombre", key: "career_name" as const },
    { header: "Área", key: "areaName" as const },
  ];

  const relatedColumns = [
    { header: "ID", key: "id" as const },
    { header: "Nombre Asignatura", key: "signature_name" as const },
    { header: "Codigo Asignatura", key: "code_signature" as const },
    { header: "Semestre", key: "semester" as const },
  ];


  const handleDelete = async (id: number) => {
    try {
      await deleteCareer(id).unwrap();
      toast.success('Carrera eliminada correctamente')
      console.log(`Carrera con ID ${id} eliminada con éxito`);
      refetch();
    } catch (error) {
      console.error("Error al eliminar la carrera:", error);
      toast.success('Error al eliminar la carrera')
    }
  };

  return (
    <>
      <header className="flex justify-center">
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 mt-8">
          <p className="text-4xl font-semibold">
            Gestión de Carreras
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end p-3">
          <Button
            className="bg-green-600 text-white hover:bg-green-700 w-36 h-12"
            onClick={onOpen}
          >
            <PlusIcon className="h-5 w-5" /> Crear
          </Button>
        </div>

        {/* Componente de tabla genérica */}
        <TableReArea<Career, Signature>
          data={careers}
          columns={columns}
          title="Lista de Carreras"
          onDelete={handleDelete}
          relatedData={signaturesData} // Pasamos las asignaturas completas
          relatedTitle="Asignaturas Asociadas"
          relatedColumns={relatedColumns}
          relatedFilterKey="career" // Filtramos asignaturas por el campo career
          onSuccess={refetch} // Actualizar datos
        />
      </div>

      {/* Modal para crear área */}
      <ModalReArea isOpen={isOpen} onClose={onClose} IdFun={areaId} gestionProp="carrera" onSuccess={refetch} />
    </>
  );
}

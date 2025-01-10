"use client";

import ModalReArea from "@/components/academic/ModalReArea";
import TableReArea from "@/components/academic/TableReArea";
import { Button } from "@/components/ui/button";
import {
  useGetSignaturesQuery,
  useGetCareersQuery,
  useGetAreasQuery,
  useGetSectionsQuery,
  useDeleteSignatureMutation,
} from "@/redux/features/apiAcademic";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useDisclosure } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Signature, Section } from "@/redux/features/apiAcademic";

export default function SignaturePage() {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook para manejar el estado del modal
  /*     const { data: user } = useRetrieveUserQuery();*/
  const { data: areas = [] } = useGetAreasQuery();
  const { data: signatureData, refetch } = useGetSignaturesQuery();
  const { data: careersData } = useGetCareersQuery();
  const { data: sectionsData = [] } = useGetSectionsQuery(); // Datos de secciones
  const [deleteSignature] = useDeleteSignatureMutation();
  console.log("Secciones data", sectionsData);
  const areaId = Number(id);

  const areaMe = areas.find((area) => area.id === areaId);
  const careers = careersData?.filter((career) => career.area === areaId);
  // Filtra las firmas y agrega el nombre de la carrera y del área a cada firma
  const signatures =
    signatureData
      ?.filter((signature) =>
        careers?.some((career) => career.id === signature.career)
      ) // Filtra firmas por carreras en el área del usuario
      .map((signature) => ({
        ...signature,
        careerName:
          careers?.find((career) => career.id === signature.career)
            ?.career_name || "Sin asignar", // Nombre de la carrera
        areaName: areaMe?.area_name || "Sin asignar", // Nombre del área
      })) || [];

  console.log(signatures);

  const columns = [
    { header: "ID", key: "id" as const },
    { header: "Nombre Asignatura", key: "signature_name" as const },
    { header: "Codigo Asignatura", key: "code_signature" as const },
    { header: "Semestre", key: "semester" as const },
    { header: "Carrera", key: "careerName" as const },
  ];

  const relatedColumns = [
    { header: "ID", key: "id" as const },
    { header: "Nombre Sección", key: "section_name" as const },
  ];

  const handleDelete = async (id: number) => {
    try {
      await deleteSignature(id).unwrap();
      toast.success("Asignatura eliminada correctamente");
      console.log(`Asignatura con ID ${id} eliminada con éxito`);
      refetch();
    } catch (error) {
      console.error("Error al eliminar la Asignatura:", error);
      toast.success("Error al eliminar la Asignatura");
    }
  };

  return (
    <>
      <header className="flex justify-center">
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 mt-8">
          <p className="text-4xl font-semibold">
            Gestión de Asignaturas
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Componente de tabla de carreras */}
        <div className="flex justify-end p-3">
          <Button
            className="bg-green-600 text-white hover:bg-green-700 w-36 h-12"
            onClick={onOpen}
          >
            <PlusIcon className="h-5 w-5" /> Crear
          </Button>
        </div>

        <TableReArea<Signature, Section>
          data={signatures}
          columns={columns}
          title="Lista de Asignaturas"
          onDelete={handleDelete}
          relatedData={sectionsData} // Pasamos las secciones completas
          relatedTitle="Secciones Asociadas"
          relatedColumns={relatedColumns}
          relatedFilterKey="signature" // El campo que relaciona asignaturas con secciones
          onSuccess={refetch} // Actualizar datos
        />
      </div>

      {/* Modal para crear área */}
      <ModalReArea
        isOpen={isOpen}
        onClose={onClose}
        gestionProp="asignatura"
        IdFun={areaId}
        onSuccess={refetch}
      />
    </>
  );
}
 
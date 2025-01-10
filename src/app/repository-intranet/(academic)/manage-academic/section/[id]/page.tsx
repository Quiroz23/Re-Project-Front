"use client";

import ModalReArea from "@/components/academic/ModalReArea";
import TableReArea from "@/components/academic/TableReArea";
import { Button } from "@/components/ui/button";
import {
  useGetSectionsQuery,
  useGetSignaturesQuery,
  useDeleteSectionMutation,
  useGetAreasQuery,
  useGetCareersQuery

} from "@/redux/features/apiAcademic";

import { PlusIcon } from "@heroicons/react/20/solid";
import { useDisclosure } from "@nextui-org/react";
import { Section } from "@/redux/features/apiAcademic";
/* import { useGetUsersQuery } from "@/redux/features/apiUser"; */
import { toast } from "react-toastify";
import { useGetStudientsQuery, useGetUsersQuery } from "@/redux/features/apiUser";
import { Profile } from "@/redux/features/apiUser";
import { useParams } from "next/navigation";


export default function SectionPage() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook para manejar el estado del modal
/*   const { data: users } = useGetUsersQuery(); */
  const { data: sectionData, refetch } = useGetSectionsQuery();
  const { data: signatureData } = useGetSignaturesQuery();
  const { data: studentsData = [] } = useGetStudientsQuery(); // Cargar los estudiantes
  const { data: usersData = [] } = useGetUsersQuery();
  const { data: areas = [] } = useGetAreasQuery();


  const { data: careersData = [] } = useGetCareersQuery();
  const { id } = useParams();
  const areaId = Number(id)

  const areaMe = areas.find((area) => area.id === areaId);
  const careersMe = careersData?.filter((career) => career.area === areaMe?.id);
  const signatureMe = signatureData?.filter((signature) => careersMe?.some((career) => career.id === signature.career));
  const sectionMe = sectionData?.filter((section) => signatureMe?.some((signature) => signature.id === section.signature));
  console.log(signatureMe, 'Mis asignaturas')

  const [deleteSection] = useDeleteSectionMutation();


  const sections =
    sectionMe?.map((section) => ({
      ...section,
      signatureName: signatureMe?.find((signature) => signature.id === section.signature)?.signature_name || "Sin asignar", // Nombre de la asignatura
      teacherName: usersData.find((user) => user.id === section.teacher_guide)?.email || "Sin asignar", // Nombre del profesor guia
    })) || [];

  const studientsNewData = studentsData?.map((student) => ({
    ...student,
    email: usersData.find((user) => user.id === student.user)?.email || "Sin correo", // Correo del alumno
  })) || [];
  console.log('Nueva data s',studientsNewData)

  const columns = [
    { header: "ID", key: "id" as const },
    { header: "Nombre Seccion", key: "section_name" as const },
    { header: "Profesor Guia", key: "teacherName" as const },
    { header: "Asignatura", key: "signatureName" as const },
  ];

  const relatedColumns = [
    { header: "ID", key: "id" as const },
    { header: "Nombre Estudiante", key: "first_name" as const },
    { header: "Apellido Estudiante", key: "last_name" as const },
    { header: "Correo Estudiante", key: "email" as const },
  ];

  const handleDelete = async (id: number) => {
    try {
      await deleteSection(id).unwrap();
      toast.success("Seccion eliminada correctamente");
      console.log(`SECCION con ID ${id} eliminada con éxito`);
      refetch();
    } catch (error) {
      console.error("Error al eliminar la seccion:", error);
      toast.success("Error al eliminar la seccion");
    }
  };

  return (
    <>
      <header className="flex justify-center">
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 mt-8">
        <p className="text-4xl font-semibold">
            Gestión de Secciones
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
        <TableReArea<Section, Profile>
          data={sections}
          columns={columns}
          title="Lista de Secciones"
          onDelete={handleDelete}
          relatedData={studientsNewData} // Pasamos los estudiantes completos
          relatedTitle="Estudiantes Asociados"
          relatedColumns={relatedColumns} // Configuración de columnas para estudiantes
          relatedFilterKey="section" // Filtramos estudiantes por sección
          onSuccess={refetch} // Actualizar datos
        />
      </div>

      {/* Modal para crear área */}
      <ModalReArea isOpen={isOpen} onClose={onClose} gestionProp="seccion" IdFun={areaId} onSuccess={refetch} />
    </>
  );
}

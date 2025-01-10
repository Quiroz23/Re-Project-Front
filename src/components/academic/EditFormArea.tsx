"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import {
  useGetCareerQuery,
  usePutCareerMutation,
  useGetSectionQuery,
  usePutSectionMutation,
  useGetSignatureQuery,
  usePutSignatureMutation,
} from "@/redux/features/apiAcademic";
import { useGetUsersQuery } from "@/redux/features/apiUser";

interface EditAreaFormProps {
  resourceId: number; // ID del recurso que se edita
  gestionProp: "career" | "signature" | "section"; // Tipo de recurso
  onCancel?: () => void; // Función opcional para manejar la cancelación
  isEditing?: boolean;
  onSuccess: () => void;
}

export default function EditAreaForm({
  resourceId,
  gestionProp,
  onCancel,
  onSuccess,
}: EditAreaFormProps) {
  const { data: career, refetch: reCareer } = useGetCareerQuery(resourceId); // Cargar las carreras disponibles
  const { data: signature, refetch: reSignature } =
    useGetSignatureQuery(resourceId); // Cargar las carreras disponibles
  const { data: section, refetch: reSection } = useGetSectionQuery(resourceId); // Cargar las carreras disponibles
  const [updateCareer] = usePutCareerMutation(); // Mutación de PUT para actualizar carreras
  const [updateSignature] = usePutSignatureMutation(); // Mutación de PUT para actualizar carreras
  const [updateSection] = usePutSectionMutation(); // Mutación de PUT para actualizar carreras
  // Estados del formulario
  // Carrera --------------------------------------------
  const [name, setName] = useState(""); // Nombre de la carrera, asignatura y section
  const [area, setArea] = useState(0); // Nombre de la carrera
  // Asignatura --------------------------------------------
  const [careerId, setCareerId] = useState(0); // Id de la carrera de la asignature
  const [code, setCode] = useState(""); // Codigo de la asignatura
  const [semester, setSemester] = useState<number>(0); // Semestre de la asignatura

  // Section --------------------------------------------
  const [teacherId, setTeacherId] = useState(0); // Id del profesor de la seccion
  const [signatureId, setSignatureId] = useState(0); // Id de la asignatura
  const { data: users } = useGetUsersQuery();
  const isTeacher =
    users?.filter(
      (user) =>
        user.group?.name === "Profesor" || user.group?.name === "Profesor Guía"
    ) || [];

  const [isLoading, setIsLoading] = useState(false);
  // Cargar datos existentes para edición
  useEffect(() => {
    if (gestionProp === "career") {
      const fetchedCareer = career;
      if (fetchedCareer) {
        setName(fetchedCareer.career_name); // Rellena el nombre de la carrera existente
        setArea(fetchedCareer.area);
      }
    }
    if (gestionProp === "signature") {
      const fetchedSignature = signature;
      if (fetchedSignature) {
        setName(fetchedSignature.signature_name); // Rellena el nombre de la carrera existente
        setSemester(fetchedSignature.semester);
        setCareerId(fetchedSignature.career);
        setCode(fetchedSignature.code_signature);
      }
    }
    if (gestionProp === "section") {
      const fetchedSection = section;
      if (fetchedSection) {
        setName(fetchedSection.section_name); // Rellena el nombre de la carrera existente
        setTeacherId(fetchedSection.teacher_guide);
        setSignatureId(fetchedSection.signature);
      }
    }
  }, [resourceId, gestionProp, career, section, signature]);

  // Maneja la actualización del recurso
  const handleUpdate = async () => {
    if (name.trim() === "") {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    setIsLoading(true);

    try {
      if (gestionProp === "career") {
        // Llamar a la mutación para actualizar la carrera
        await updateCareer({
          id: resourceId,
          career_name: name,
          area: area,
        }).unwrap();
        toast.success("Carrera actualizada con éxito");
        reCareer();
      } else if (gestionProp === "signature") {
        // Llamar a la mutación para actualizar la carrera
        await updateSignature({
          id: resourceId,
          signature_name: name,
          code_signature: code,
          semester: semester,
          career: careerId,
        }).unwrap();
        toast.success("Asignatura actualizada con éxito");
        reSignature();
      } else if (gestionProp === "section") {
        // Llamar a la mutación para actualizar la carrera
        await updateSection({
          id: resourceId,
          section_name: name,
          teacher_guide: teacherId,
          signature: signatureId,
        }).unwrap();
        toast.success("Asignatura actualizada con éxito");
        reSection();
      } else {
        toast.error("Gestión no soportada en este formulario.");
      }
      // Actualiza los datos en la tabla
      if (onSuccess && onCancel) {
        onSuccess();
        onCancel();
      }
    } catch (error) {
      console.error("Error al actualizar la carrera:", error);
      toast.error("Ocurrió un error al actualizar la carrera.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Editar {gestionProp.charAt(0).toUpperCase() + gestionProp.slice(1)}
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Nombre de ${gestionProp}`}
          fullWidth
          isClearable
        />
        {gestionProp === "signature" && (
          <>
            <Input
              className="pt-4"
              label="Semestre"
              type="number"
              value={semester.toString()}
              onChange={(e) => setSemester(Number(e.target.value))}
              placeholder="Semestre"
              fullWidth
            ></Input>
            <Input 
              className="pt-4"
              label="Codigo"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Codigo de la Asignatura"
              fullWidth
            />
          </>
          
          
        )}
        {gestionProp === "section" && (
          <Select
            className="pt-4"
            label="Profesor Guía"
            placeholder="Selecciona un Profesor Guía para la sección"
            value={teacherId || ""} // Usa directamente el número, no lo conviertas a string
            onChange={(e) => setTeacherId(Number(e.target.value))} // Convierte explícitamente a número
            fullWidth
          >
            {isTeacher.map((teacher) => (
              <SelectItem key={String(teacher.id)} value={teacher.id}>
                {teacher.email}
              </SelectItem>
            ))}
          </Select>
        )}
        <div className="flex justify-between mt-6">
          <Button
            variant="light"
            color="danger"
            onPress={onCancel}
            // Redirige al listado
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            isLoading={isLoading}
            onPress={handleUpdate} // Maneja la actualización
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

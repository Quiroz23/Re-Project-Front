import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import {
  usePatchAreaMutation,
  useGetAreaQuery,
} from "@/redux/features/apiAcademic";
import { useGetUsersQuery } from "@/redux/features/apiUser";
import {
  useGetTypeDocumentQuery,
  usePutTypeDocumentMutation,
} from "@/redux/features/apiDocument";

interface EditAreaFormProps {
  method: "typeDocument" | "area";
  id: number;
  isEditing: boolean;
  onCancel: () => void; // Función opcional para manejar la cancelación
}

export default function EditFormAdmin({
  method,
  id,
  onCancel,
  isEditing,
  
}: EditAreaFormProps) {
  const [patchArea] = usePatchAreaMutation();
  const [updateTypeDocument] = usePutTypeDocumentMutation();
  const { data: users, refetch } = useGetUsersQuery();
  const isDirector =
    users?.filter((user) => user.group?.name === "Director de Carrera") || [];

  const { data: area } = useGetAreaQuery(id);
  const { data: typedoc } = useGetTypeDocumentQuery(id);

  {
    /* Estados del formulario Area */
  }
  const [nameArea, setNameArea] = useState("");
  const [director, setDirector] = useState(0);

  {
    /* Estados del formulario Area */
  }
  const [nameTypeDocument, setNameTypeDocument] = useState("");

  useEffect(() => {
    refetch()
    if (method === "area") {
      const fetchedArea = area;
      if (fetchedArea) {
        setNameArea(fetchedArea.area_name);
        setDirector(fetchedArea.director);
      }
    }
    if (method === "typeDocument") {
      const fetchedTypeDoc = typedoc;
      if (fetchedTypeDoc) {
        setNameTypeDocument(fetchedTypeDoc.type_name);
      }
    }
  }, [method, area, typedoc]);

  const handleSubmit = async () => {
   /*  if (nameArea.trim() === "") {
      toast.error("El nombre no puede estar vacío");
      return;
    } */

    try {
      if (method === "area") {
        // Llamar a la mutación para actualizar la carrera
        await patchArea({
          id: id,
          area_name: nameArea,
          director: director,
        }).unwrap();
        toast.success("Area actualizada con éxito");
        onCancel();
      } else if (method === "typeDocument") {
        // Crear FormData para actualizar el documento
        const formData: FormData = new FormData();
        formData.append("type_name", nameTypeDocument);

        try {
          // Llamar a la mutación con las claves correctas
          await updateTypeDocument({
            id: id, // ID del documento a actualizar
            formData, // FormData con los datos
          }).unwrap();

          toast.success("Asignatura actualizada con éxito");
          onCancel();
        } catch (error) {
          console.error("Error al actualizar el tipo de documento:", error);
          toast.error("Ocurrió un error al actualizar el tipo de documento.");
        }
      }
    } catch (error) {
      console.error("Error al actualizar la carrera:", error);
      toast.error("Ocurrió un error al actualizar la carrera.");
    } finally {
      // Limpiar los estados del formulario
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Editar {method === "area" ? "Area" : "Tipo de Documento"}
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {method === "typeDocument" && (
          <Input
            className="pt-4"
            label="Nombre del Tipo de Documento"
            type="text"
            value={nameTypeDocument}
            onChange={(e) => setNameTypeDocument(e.target.value)}
            placeholder="Tipo de Documento"
            fullWidth
          />
        )}
        {method === "area" && (
          <>
            <Input
              label="Nombre del area"
              value={nameArea}
              onChange={(e) => setNameArea(e.target.value)}
              placeholder={`Nombre del area`}
              fullWidth
              isClearable
              
            />

            <Select
              className="pt-4"
              label="Director"
              placeholder="Selecciona un Director para el Area"
              value={director || ""} // Usa directamente el número, no lo conviertas a string
              onChange={(e) => setDirector(Number(e.target.value))} // Convierte explícitamente a número
              fullWidth
            >
              {isDirector.map((director) => (
                <SelectItem key={String(director.id)} value={director.id}>
                  {director.email}
                </SelectItem>
              ))}
            </Select>
          </>
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
            onPress={handleSubmit} // Maneja la actualización
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

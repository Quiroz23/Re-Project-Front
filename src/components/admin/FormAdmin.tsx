import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { usePostAreaMutation } from "@/redux/features/apiAcademic";
import { toast } from "react-toastify";
import { usePostTypeDocumentMutation } from "@/redux/features/apiDocument";

interface PropsForm {
  method: "typeDocument" | "area";
  onClose: () => void; // Función opcional para manejar la cancelación

}

export default function FormAdmin({ method, onClose }: PropsForm) {
  const [nameTypeDocument, setNameTypeDocument] = useState("");
  const [nameArea, setNameArea] = useState("");
  const [postArea] = usePostAreaMutation();
  const [postTypeDocument] = usePostTypeDocumentMutation();

  const Onsubmit = async () => {
    try {
      switch (method) {
        case "typeDocument":
          if (!nameTypeDocument) {
            toast.error(
              "El nombre del tipo de documento no puede estar vacío."
            );
            return;
          }

          const typeDocumentData = new FormData();
          typeDocumentData.append("type_name", nameTypeDocument);

          await postTypeDocument(typeDocumentData); // Llamada a la mutación
          toast.success("Tipo de documento creado con éxito");
          onClose();
          break;

        case "area":
          if (!nameArea) {
            toast.error("El nombre del área no puede estar vacío.");
            return;
          }

          const areaData = new FormData();
          areaData.append("area_name", nameArea);

          await postArea(areaData).unwrap(); // Llamada a la mutación
          toast.success("Área creada con éxito");
          onClose(); 
          break;

        default:
          toast.error("Método no válido.");
          break;
      }

      // Limpiar los campos después de la creación
      setNameTypeDocument("");
      setNameArea("");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Ocurrió un error al realizar la operación.");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        {method === "typeDocument" && (
          <Input
            label="Nombre del tipo de documento"
            placeholder="Ingrese el nombre del tipo de documento"
            name="nameTypeDocument"
            value={nameTypeDocument} // Mantener sincronizado con el estado
            onChange={(e) => setNameTypeDocument(e.target.value)}
          />
        )}
        {method === "area" && (
          <Input
            label="Nombre de la nueva área"
            placeholder="Ingrese el nombre de la nueva área"
            name="nameArea"
            value={nameArea} // Mantener sincronizado con el estado
            onChange={(e) => setNameArea(e.target.value)}
          />
        )}
      </div>

      <Button
        className="bg-green-700 text-white mt-6 w-full"
        onPress={Onsubmit}
      >
        Agregar
      </Button>
    </form>
  );
}

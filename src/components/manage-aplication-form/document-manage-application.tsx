import { Textarea, Input } from "@nextui-org/react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  useGetApplicationFormQuery,
  usePatchApplicationFormMutation,
} from "@/redux/features/apiDocument";
import { Label } from "../ui/label";

interface CustomDocumentProps {
  onClose: () => void;
  applicationId: number;
}

export default function DocumentApplication({
  onClose,
  applicationId,
}: CustomDocumentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | null>(null); // Estado para manejar la fecha seleccionada
  const { data: initialData, isLoading } =
    useGetApplicationFormQuery(applicationId);
  const [patchApplicationForm] = usePatchApplicationFormMutation();
  const [error, setError] = useState("");

  const onClick = (stateUpdate: string) => {
    
    if(!date && stateUpdate === '2'){
      setError("Este campo es obligatorio para aprobar.");
      return;
    }

    if (!applicationId || !stateUpdate) {
      setDate(new Date())
      toast.error("Faltan datos para completar la operación.");
      return;
    }

    setIsSubmitting(true);
    patchApplicationForm({
      id: applicationId,
      state: stateUpdate,
      expiration_date: date || new Date(),
    })
      .unwrap()
      .then((response) => {
        console.log(response);
        if (stateUpdate === "2") {
          toast.success(
            `¡Ha sido aprobada la solicitud para ${initialData?.student_name}!`
          );
        } else {
          toast.error(
            `¡Ha sido rechazada la solicitud para ${initialData?.student_name}!`
          );
        }
        onClose();
      })
      .catch((error) => {
        console.error("Error al aprobar o rechazar el documento:", error);
        toast.error("Error al procesar la solicitud.");
      })
      .finally(() => {
        setIsSubmitting(false); // Asegura que el estado se actualice siempre
      });
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-center mb-4 text-2xl font-medium">
        Formulario de Visualización
      </div>
      <form className="flex flex-col gap-4">
        <Input label="Estudiante" placeholder="Estudiante" value={initialData?.student_name} readOnly/>

        {/* Razón */}
        <Textarea label="Razón" name="Razón" value={initialData?.reason} readOnly />

        {/* Selector de Fecha */}
        <Label htmlFor="datetime-local">Fecha de Expiración</Label>
        <input
          type="datetime-local"
          className="p-4 bg-zinc-100 rounded-xl"
          onChange={(e) => setDate(new Date(e.target.value))} // Convierte el valor en un objeto Date
          required
        />
        {error && <p className="text-red-600 text-sm ml-2">{error}</p>}

        {/* Botones de Aprobación o Rechazo */}
        <div className="flex justify-between">
          <Button
            className="w-40 bg-green-700 hover:bg-green-600 mt-4 p-5"
            type="button"
            disabled={isSubmitting}
            onClick={() => onClick("2")} // Aprobar
          >
            {isSubmitting ? "Aprobando..." : "Aprobar"}
          </Button>

          <Button
            className="w-40 bg-red-700 hover:bg-red-600 mt-4 p-5"
            type="button"
            disabled={isSubmitting}
            onClick={() => onClick("3")} // Rechazar
          >
            {isSubmitting ? "Rechazando..." : "Rechazar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

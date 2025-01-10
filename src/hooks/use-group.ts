import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { z } from "zod";
import { usePostGroupMutation } from "@/redux/features/apiUser";

interface FormData {
  group_name: string;
  teacher_guide: number | null; // Aseguramos que sea siempre definido como `number | null`
  section: number | null;
}

const groupSchema = z.object({
  group_name: z.string().min(3, { message: "El nombre del grupo debe tener al menos 3 caracteres" }),
});

export default function useGroup(
  onGroupSelect: (id: number | null) => void,

) {
  const [postGroup, { isLoading }] = usePostGroupMutation();
  const { data: user } = useRetrieveUserQuery();

  const [formData, setFormData] = useState<FormData>({
    group_name: "",
    teacher_guide: null, // Inicializa con `null`
    section: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onChange = (event: { target: { name: string; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpia el error al escribir
  };
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación con Zod
    const validationResult = groupSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Preparar los datos según el método
    const data: FormData = {
      group_name: formData.group_name,
      teacher_guide: user?.profile?.id ?? null,
      section: formData.section, // Aquí se envía el id de la sección seleccionada
    };
  
    try {
      const response = await postGroup(data).unwrap();
      if (response.id !== undefined) {
        onGroupSelect(response.id); // Notifica al componente padre
        toast.success(`¡Has creado el grupo: ${response.group_name}!`);
      } else {
        toast.error("No se recibió el ID del grupo.");
      }
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      toast.error("Falló la creación del grupo.");
    }
  };

  return {
    formData,
    errors,
    isLoading,
    onChange,
    onSubmit,
  };
}

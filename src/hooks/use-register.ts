import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { usePostUserMutation } from "@/redux/features/apiUser";
import { z } from "zod";
import { registerSchema } from "@/components/validations/registerSchema";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

export type RegisterFormdata = z.infer<typeof registerSchema>;

const defaultInitialData: RegisterFormdata = {
  email: "",
  password: "",
  group: "", 
};

export default function useRegister() {
  const { data: user } = useRetrieveUserQuery();
  const [postRegisterUser, { isLoading: isRegistering }] = usePostUserMutation();
  const [formData, setFormData] = useState<RegisterFormdata>(defaultInitialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const resetForm = () => {
    setFormData(defaultInitialData); // Limpia los campos de registro
    setErrors({});
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<number | null> => {
    event.preventDefault();
  
    // Verificar que user.group.name existe
    if (!user?.group?.name) {
      toast.error("El usuario no tiene un grupo asignado");
      console.log("Error: user.group.name es nulo o no está definido", user);
      return null;
    }
  
    const groupName =
      user?.group?.name === "Profesor Guía"
        ? "Estudiante"
        : user?.group?.name === "Director de Carrera"
        ? "Profesor"
        : user?.group?.name === "Administrador"
        ? "Director de Carrera" 
        : user?.group?.name || "Estudiante"; // Valor predeterminado
  
    const finalData = {
      ...formData,
      group: groupName, // Aseguramos que el grupo sea un nombre válido
    };
  
    console.log("Datos enviados al registro:", finalData);
  
    // Validación con Zod
    const validation = registerSchema.safeParse(finalData);
    if (!validation.success) {
      const zodErrors: { [key: string]: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0]] = err.message;
        }
      });
      setErrors(zodErrors);
      return null; // Detenemos el envío si hay errores de validación
    }
  
    try {
      const response = await postRegisterUser(finalData).unwrap();
      console.log("Respuesta del registro:", response);
      if (response.id) {
        return response.id;
      } else {
        toast.error("No se pudo obtener el ID del usuario registrado");
        return null;
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      toast.error("Ya existe un usuario con este email");
      return null;
    }
  };
  
  

  return { formData, errors, isRegistering, resetForm, onChange, onSubmit };
}
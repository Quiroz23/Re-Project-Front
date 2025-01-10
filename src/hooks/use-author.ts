import { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { usePostGroupUserMutation } from "@/redux/features/apiUser";

const authorSchema = z.object({
  studentOne: z.string().min(2, { message: "El primer autor debe tener al menos 2 caracteres" }),
  studentTwo: z.string().min(2, { message: "El segundo autor debe tener al menos 2 caracteres" }).optional(),
  studentTree: z.string().min(2, { message: "El tercer autor debe tener al menos 2 caracteres" }).optional(),
});

interface AuthorData {
  studentOne: string;
  studentTwo: string;
  studentTree: string;
}

export default function useAuthor(selectedGroupId: number | null, setStateForm: (value: boolean) => void) {
  const [postGroupUser, { isLoading }] = usePostGroupUserMutation();
  const [formData, setFormData] = useState<AuthorData>({
    studentOne: "",
    studentTwo: "",
    studentTree: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSecondStudent, setShowSecondStudent] = useState(false);
  const [showThirdStudent, setShowThirdStudent] = useState(false);

  // Estado para rastrear si cada campo ha sido enviado
  const [isStudentOneSubmitted, setIsStudentOneSubmitted] = useState(false);
  const [isStudentTwoSubmitted, setIsStudentTwoSubmitted] = useState(false);
  const [isStudentThreeSubmitted, setIsStudentThreeSubmitted] = useState(false);

  // Hacemos que el onCHange sea compatible con elementos input y select
  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target; 
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpiar el error al cambiar el valor
  };
  

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>, student: string, studentName: string) => {
    event.preventDefault();

    if (!formData[studentName as keyof AuthorData]) {
      toast.error("Debe ingresar un nombre antes de enviar.");
      return;
    }

    if (typeof selectedGroupId === "number") {
      const data = { group: selectedGroupId, student };

      postGroupUser(data)
        .unwrap()
        .then(() => {
          toast.success(`Se ha creado el autor: ${student}`);
          // Marcar como enviado el campo correspondiente
          if (studentName === "studentOne") setIsStudentOneSubmitted(true);
          if (studentName === "studentTwo") setIsStudentTwoSubmitted(true);
          if (studentName === "studentTree") setIsStudentThreeSubmitted(true);
        })
        .catch((err) => {
          toast.error("Ocurrió un error al crear el autor");
          console.error(err);
        });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Crear un objeto dinámico que solo incluya campos con valores
    const dataToValidate: Partial<AuthorData> = { studentOne: formData.studentOne };
    if (formData.studentTwo) dataToValidate.studentTwo = formData.studentTwo;
    if (formData.studentTree) dataToValidate.studentTree = formData.studentTree;

    // Validar el formulario con Zod solo para los campos que tienen datos
    const validationResult = authorSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        const newErrors: { [key: string]: string } = {};
        validationResult.error.errors.forEach((error) => {
            if (error.path[0]) newErrors[error.path[0] as string] = error.message;
        });
        setErrors(newErrors);
        return; // Detener el envío si hay errores
    }

    // Verificar que cada campo visible haya sido enviado antes de continuar
    if (!isStudentOneSubmitted || (showSecondStudent && !isStudentTwoSubmitted) || (showThirdStudent && !isStudentThreeSubmitted)) {
        toast.error("Debe presionar 'Enviar' para cada campo de autor antes de confirmar.");
        return;
    }

    // Si la validación es exitosa, limpiar errores y permitir el redireccionamiento
    setErrors({});
    setStateForm(true); // Solo aquí se permite el cambio de página
    toast.success("Formulario enviado con éxito");
  };

  return {
    onChange,
    onSubmit,
    isLoading,
    handleButtonClick,
    formData,
    errors,
    showSecondStudent,
    setShowSecondStudent,
    showThirdStudent,
    setShowThirdStudent,
  };
}

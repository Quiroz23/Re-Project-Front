

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentOldSchema } from "@/components/validations/documentOldSchema";
import { useEffect } from "react";


export type DocumentFormDataOld = z.infer<typeof documentOldSchema>;

interface UseDocumentFormProps {
    initialData?: DocumentFormDataOld;
    onSubmit: (data: DocumentFormDataOld) => void;
}

const defaultInitialData: DocumentFormDataOld = {
    title: "",                 // string
    abstract: "",              // string        // boolean
    area: 1,                   // number (debe ser mayor a 0, así que 1 es un valor inicial válido)
    type_access: false,
    academic_degree: "",       // string (vacío para representar la opción por defecto)
    qualification: 10,         // number (dentro del rango permitido de 10 a 70)
    publisher: "",             // string (vacío para representar la opción por defecto)
    type_document: 1,          // number (1 como valor inicial válido)
    career: 1,                 // number
    teacher_name: "",
    document: undefined,       // opcional, puede ser undefined
};

export default function useDocumentFormOld({ initialData, onSubmit }: UseDocumentFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<DocumentFormDataOld>({
        resolver: zodResolver(documentOldSchema),
        defaultValues: initialData || defaultInitialData,
    });

    const submitHandler = handleSubmit(onSubmit);

    useEffect(() => {
        if (initialData) {
          reset(initialData); // Actualiza los valores del formulario
        }
      }, [initialData, reset]);

    return {
        register,
        errors,
        submitHandler,
    };
}

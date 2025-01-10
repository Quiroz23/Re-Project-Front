import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@/components/validations/documentSchema";
import { useEffect } from "react";


export type DocumentFormData = z.infer<typeof documentSchema>;

interface UseDocumentFormProps {
    initialData?: DocumentFormData;
    onSubmit: (data: DocumentFormData) => void;
}

const defaultInitialData: DocumentFormData = {
    title: "",                 // string
    abstract: "",              // string        // boolean
    area: 1,                  // number (debe ser mayor a 0, así que 1 es un valor inicial válido)
    academic_degree: "",       // string (vacío para representar la opción por defecto)
    qualification: 10,         // number (dentro del rango permitido de 10 a 70)
    publisher: "",             // string (vacío para representar la opción por defecto)
    type_document: 1,          // number (1 como valor inicial válido)
    document: undefined,       // opcional, puede ser undefined
};

export default function useDocumentRe({ initialData, onSubmit }: UseDocumentFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema),
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

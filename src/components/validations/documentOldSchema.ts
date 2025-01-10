import { z } from "zod";

export const documentOldSchema = z.object({
    title: z.string().min(3, { message: "El titulo debe tener al menos 3 caracteres" }),
    abstract: z.string().min(3, { message: "El resumen debe tener al menos 3 caracteres" }),
    area: z.coerce.number().min(1, { message: "El área debe ser un número mayor a 0" }),
    academic_degree: z.string().min(1, { message: "El grado academico debe tener al menos 3 caracteres" }),
    qualification: z.coerce.number().min(10, { message: "La calificación debe ser al menos un 10" }).max(70, { message: "La calificación no puede ser mayor a 70" }),
    document: z.any().optional(),
    publisher: z.string().min(1, { message: "El publicador debe tener al menos 3 caracteres" }),
    type_document: z.number().min(1, { message: "El tipo de documento debe tener al menos 3 caracteres" }),
    type_access: z.boolean({ message: "El tipo de acceso debe ser un valor booleano" }),
    career: z.coerce.number().min(1, { message: "La carrera debe ser un número mayor a 0" }),
    teacher_name: z.string().min(3, { message: "Nombre y Apellido del profesor" }),
});


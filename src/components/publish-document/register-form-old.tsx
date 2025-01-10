"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  /* CardDescription, */
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDocumentFormOld from "@/hooks/use-documento-old";
import {
  useGetDocumentQuery,
  usePostDocumentMutation,
  usePatchDocumentMutation,
  useGetTypeDocumentsQuery,
  
} from "@/redux/features/apiDocument";
import { DocumentFormDataOld } from "@/hooks/use-documento-old";
import { useGetAreasQuery, useGetCareersQuery } from "@/redux/features/apiAcademic";
import { useGetGroupUsersQuery } from "@/redux/features/apiUser";
import { toast } from "react-toastify";
import { useState,  } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";



interface DocumentFormProps {
  context?: number | null; // Para editar documentos, opcional
  method: string; // Para saber si es POST o PATCH
  idGroup?: number; // El ID del grupo
  selectedProfesor: number; // ID del profesor seleccionado
}


export default function RegisterFormOld({
  context,
  method,
  idGroup,
 
}: DocumentFormProps) {
  const {
    data: initialData,
    isLoading,
    isSuccess,
  } = useGetDocumentQuery(context || skipToken);
  const { data: groupUsers } = useGetGroupUsersQuery();
  const { data: areas } = useGetAreasQuery();
  const { data: types } = useGetTypeDocumentsQuery();
  const { data: careers } = useGetCareersQuery();
  const [areaSelect, setAreaSelect] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patchDocument] = usePatchDocumentMutation();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const { data: user } = useRetrieveUserQuery();

  const careersFiltered = careers?.filter((career) => career.area === areaSelect);


  // - Actualizamos el publish document

 // ----------------------------------------------------------------

  const router = useRouter();

  const domain = window.location.origin; // Esto te dará "http://localhost:3000" en desarrollo o el dominio de producción.

  const author = groupUsers?.filter((user) => user.group === idGroup);

  const [postDocument] = usePostDocumentMutation();

 

  const onSubmit = async (data: DocumentFormDataOld) => {
    console.log("Datos del formulario:", data);

    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (key !== "document") {
          formData.append(key, value as string);
        }
      }

      if (selectedFile) {
        formData.append("document", selectedFile); // Añade el archivo al FormData
        console.log("Contenido de FormData antes de enviar:");
        for (const pair of formData.entries()) {
          console.log(pair[0] + ", ", pair[1]);
        }
      } else {
        console.log("No se seleccionó ningún archivo");
      }

      setIsLoad(true);
      // Crea un documento nuevo
      formData.append("author", String(idGroup));
      formData.append("teacher_guide", String(user?.profile?.id || ""));
      formData.append("identifier", "-----");
      console.log("Estamos haciendo el post");
      const response = await postDocument(formData).unwrap();

      patchDocument({
        id: response.id,
        identifier: `${domain}/repository-intranet/document-profile/${response.id}`,
      })
        .unwrap()
        .then((response) => {
          console.log(response);
          toast.success("Documento creado exitosamente");
          console.log("Documento actualizado:", response.id);
          router.push("/repository-intranet");
        })
        .catch((error) => {
          console.error("Error al actualizar el documento:", error);
          toast.error("Error al actualizar el documento");
        });

      
        

    
    } catch (error) {
      console.error("Error al enviar el documento:", error);
      toast.error("Error al enviar el documento");
    }
    finally{
      setIsLoad(false);
    }
  };

  

  const { errors, register, submitHandler } = useDocumentFormOld({
    initialData: undefined,
    onSubmit,
  });

  console.log(initialData);

  return (
    <Card className="w-2/3">
      {isLoad ? (
        <div className="flex h-full justify-center items-center my-8 gap-2">
          <Spinner color="danger" />
          <p className="animate-pulse">Subiendo Documento...</p>
        </div>
      ) : (
        <>
          <CardHeader className="flex items-center">
            <CardTitle className="text-xl p-4">
              Publicar Documento Académico Antiguo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(method === "post" || isSuccess) && (
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Título del documento"
                  />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
                {/* Abstract */}
                <div>
                  <Label htmlFor="abstract">Resumen</Label>
                  <Textarea
                    id="abstract"
                    {...register("abstract")}
                    placeholder="Resumen del documento"
                    className="h-32"
                  />
                  {errors.abstract && (
                    <p className="text-red-500">{errors.abstract.message}</p>
                  )}
                </div>
                                 {/* Profesor Guía Nombre */}
                                 <div>
                  <Label htmlFor="title">Nombre Profesor Guía</Label>
                  <Input
                    id="teacher_name"
                    {...register("teacher_name")}
                    placeholder="Nombre del profesor guía"
                  />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
                {/* Area */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 w-64 text-sm">
                    <Label htmlFor="qualification">Calificación</Label>
                    <Input
                      id="qualification"
                      {...register("qualification")}
                      placeholder="Calificación"
                      type="number"
                      className="w-full"
                    />
                    {errors.qualification && (
                      <p className="text-red-500">
                        {errors.qualification.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-64">
                    <Label htmlFor="type_access">Acceso</Label>
                    <select
                      id="type_access"
                      {...register("type_access", {
                        setValueAs: (value) => value === "true", // Convierte el valor a booleano
                      })}
                      defaultValue={initialData?.type_access ? "true" : "false"} // Establece "true" o "false" basado en los datos iniciales
                      className="border p-2 rounded w-full text-sm"
                    >
                      <option value="true">Público</option>
                      <option value="false">Privado</option>
                    </select>
                    {errors.type_access && (
                      <p className="text-red-500">
                        {errors.type_access.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 w-64">
                    <Label htmlFor="publisher">Publicador</Label>
                    <select
                      id="publisher"
                      {...register("publisher")} // Convierte el valor a número automáticamente
                      className="border p-2 rounded w-full text-sm"
                    >
                      <option value="1">Universidad Inacap</option>
                      <option value="2">Instituto Profesional Inacap</option>
                      <option value="3">
                        Centro de Formación Técnica Inacap
                      </option>
                    </select>
                    {errors.publisher && (
                      <p className="text-red-500">{errors.publisher.message}</p>
                    )}
                  </div>
                </div>

                {/* Type access */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="type_access">Área</Label>
                    <select
                      id="area"
                      {...register("area", { valueAsNumber: true })} // Convierte el valor a número automáticamente
                      onChange={(e) => {
                        const areaId = e.target.value ? parseInt(e.target.value, 10) : null;
                        setAreaSelect(areaId || 4); // Actualiza el área seleccionada
                      }}
                      defaultValue={initialData?.area} // Valor predeterminado
                      
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Selecciona una area</option>
                      {areas?.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.area_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="type_access">Carrera</Label>
                    <select
                      id="career"
                      {...register("career", { valueAsNumber: true })} // Convierte el valor a número automáticamente
                      defaultValue={initialData?.career} // Valor predeterminado
                      className="border p-2 rounded text-sm"
                    >
                      <option value="">Selecciona una carrera</option>
                      {careersFiltered?.map((career) => (
                        <option key={career.id} value={career.id}>
                          {career.career_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="academic_degree">Grado Académico</Label>
                    <select
                      id="academic_degree"
                      {...register("academic_degree")} // Convierte el valor a número automáticamente
                      className="border p-2 rounded w-86 text-sm"
                    >
                      <option value="1">Técnico de Nivel Superior</option>
                      <option value="2">Ingeniero</option>
                      <option value="3">Licenciado</option>
                    </select>
                    {errors.academic_degree && (
                      <p className="text-red-500">
                        {errors.academic_degree.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <div className="flex items-center gap-2 ">
                    <Label htmlFor="type_document">Tipo de Documento</Label>
                    <select
                      id="type_document"
                      {...register("type_document", { valueAsNumber: true })} // Convierte el valor a número automáticamente
                      className="border p-2 rounded w-72 text-sm"
                    >
                      {types?.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.type_name}
                        </option>
                      ))}
                    </select>
                    {errors.type_document && (
                      <p className="text-red-500">
                        {errors.type_document.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="document">Documento</Label>
                    {method === "post" ? (
                      <Input
                        id="document"
                        type="file"
                        accept="application/pdf"
                        className="w-96"
                        {...register("document")}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setSelectedFile(file); // Guarda el archivo en el estado
                            console.log("Archivo seleccionado:", file); // Verifica el archivo seleccionado
                          }
                        }}
                      />
                    ) : (
                      <p>El documento no es editable {initialData?.document}</p>
                    )}

                    {typeof errors.document?.message === "string" && (
                      <p className="text-red-500">{errors.document.message}</p>
                    )}
                  </div>
                 
                </div>
                {/* Authors */}
                <div className="">
                  <Label htmlFor="authors">Autores</Label>
                  {author && author.length > 0 ? (
                    author.map((authors) => (
                      <p key={authors.id}>{authors.student}</p>
                    ))
                  ) : (
                    // Muestra un mensaje o un indicador de carga si no hay autores
                    <p>Cargando autores...</p>
                  )}
                </div>

                <Button className="w-full" type="submit">
                  {isLoading ? "Subiendo Documento..." : "Subir Documento"}
                </Button>
              </form>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}

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
import useDocumentRe from "@/hooks/use-document-re";
import {
  useGetDocumentQuery,
  usePostDocumentMutation,
  usePatchDocumentMutation,
  useGetTypeDocumentsQuery,
} from "@/redux/features/apiDocument";
import { DocumentFormData } from "@/hooks/use-document-re";
import {
  useGetAreasQuery,
  useGetCareersQuery,
  useGetSectionsQuery,
  useGetSignaturesQuery,
} from "@/redux/features/apiAcademic";
import {
  useGetGroupQuery,
  useGetGroupUsersQuery,
} from "@/redux/features/apiUser";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";

interface DocumentFormProps {
  context?: number | null; // Añadimos documentId como prop opcional
  method: string;
  idGroup?: number;
}

export default function DocumentFormRe({
  context,
  method,
  idGroup,
}: DocumentFormProps) {
  const {
    data: initialData,
    isLoading,
    isSuccess,
  } = useGetDocumentQuery(context || skipToken);
  const { data: group } = useGetGroupQuery(idGroup ?? skipToken);
  const { data: groupUsers } = useGetGroupUsersQuery();
  const { data: areas } = useGetAreasQuery();
  const { data: careers } = useGetCareersQuery();
  const { data: signatures } = useGetSignaturesQuery();
  const { data: sections } = useGetSectionsQuery();
  const { data: user } = useRetrieveUserQuery();
  const { data: types } = useGetTypeDocumentsQuery();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patchDocument] = usePatchDocumentMutation();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const router = useRouter();

  const domain = window.location.origin; // Esto te dará "http://localhost:3000" en desarrollo o el dominio de producción.

  const author = groupUsers?.filter((user) => user.group === idGroup);

  const section = sections?.find((s) => s.id === group?.section);

  const filteredSignature = signatures?.find(
    (signature) => signature.id === section?.signature
  );

  const filteredCareer = careers?.find(
    (career) => career.id === filteredSignature?.career
  );

  const filteredArea = areas?.find((area) => area.id === filteredCareer?.area);

  const [postDocument] = usePostDocumentMutation();

  const onSubmit = async (data: DocumentFormData) => {
    try {
      const formData = new FormData();
  
      // Incluye los valores relacionados automáticamente
      if (filteredArea) formData.append("area", String(filteredArea.id));
      if (filteredCareer) formData.append("career", String(filteredCareer.id));
      if (filteredSignature) formData.append("signature", String(filteredSignature.id));
  
      // Otros datos del formulario
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
      formData.append("teacher_name", String(`${user?.profile?.first_name} ${user?.profile?.last_name}` || ""));
      formData.append("identifier", "-----");
      console.log("Estamos haciendo el post");
      const response = await postDocument(formData).unwrap();
      console.log("Documento creado:", response);
      patchDocument({
        id: response.id,
        identifier: `${domain}/repository-intranet/document-profile/${response.id}`,
      })
        .unwrap()
        .then((response) => {
          console.log(response);
          toast.success("Documento creado exitosamente");
          router.push("/repository-intranet");
        })
        .catch((error) => {
          console.error("Error al actualizar el documento:", error);
          toast.error("Error al actualizar el documento");
        });
    } catch (error) {
      console.error("Error al enviar el documento:", error);
      toast.error("Error al enviar el documento");
    } finally {
      setIsLoad(false);
    }
  };

  const { errors, register, submitHandler } = useDocumentRe({
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
              Publicar Documento Académico
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
                <div className="flex justify-between items-center gap-2">
                {/* Calificacion */}
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
                  {/* Grado Académico */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="academic_degree">Grado Académico</Label>
                    <select
                      id="academic_degree"
                      {...register("academic_degree")} // Convierte el valor a número automáticamente
                      className="border p-2 rounded w-full text-sm"
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
                
                <div className="flex justify-between items-center gap-2">
                  {/* Selector de Área */}
                  <div>
                    <Label htmlFor="area">Área</Label>
                    <select
                      id="area"
                      value={filteredArea?.id || ""}
                      disabled // Deshabilitado ya que está preseleccionado
                      className="border p-2 rounded text-sm w-full"
                    >
                      {filteredArea && (
                        <option value={filteredArea.id}>
                          {filteredArea.area_name}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Selector de Carrera */}
                  <div>
                    <Label htmlFor="career">Carrera</Label>
                    <select
                      id="career"
                      value={filteredCareer?.id || ""}
                      disabled // Deshabilitado ya que está preseleccionado
                      className="border p-2 rounded text-sm w-full"
                    >
                      {filteredCareer && (
                        <option value={filteredCareer.id}>
                          {filteredCareer.career_name}
                        </option>
                      )}
                    </select>
                  </div>
                  {/* Selector de Asignatura */}
                  <div>
                    <Label htmlFor="signature">Asignatura</Label>
                    <select
                      id="signature"
                      value={filteredSignature?.id || ""}
                      disabled // Deshabilitado ya que está preseleccionado
                      className="border p-2 rounded text-sm w-full"
                    >
                      {filteredSignature && (
                        <option value={filteredSignature.id}>
                          {filteredSignature.signature_name}
                        </option>
                      )}
                    </select>
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

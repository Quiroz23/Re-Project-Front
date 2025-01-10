"use client";

import { useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { File } from "lucide-react";

import useDocumentRe, { DocumentFormData } from "@/hooks/use-document-re";
import {
  useGetDocumentQuery,
  usePutDocumentMutation,
} from "@/redux/features/apiDocument";
import {
  useGetAreasQuery,
  useGetCareersQuery,
  useGetSignaturesQuery,
} from "@/redux/features/apiAcademic";
import { useGetTypeDocumentsQuery } from "@/redux/features/apiDocument";

interface DocumentFormProps {
  context: number; // ID del documento que se está editando
  onClose: () => void;
}

export default function DocumentFormEdit({
  context,
  onClose,
}: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consultas
  const {
    data: initialData,
    isLoading: isLoadingDocument,
    refetch,
  } = useGetDocumentQuery(context);
  const { data: areas, isLoading: isLoadingAreas } = useGetAreasQuery();
  const { data: careers, isLoading: isLoadingCareers } = useGetCareersQuery();
  const { data: signatures, isLoading: isLoadingSignatures } =
    useGetSignaturesQuery();
  const { data: types, isLoading: isLoadingTypes } = useGetTypeDocumentsQuery();

  const [putDocument] = usePutDocumentMutation();

  // Estado de carga combinado
  const isLoading = isLoadingDocument || isLoadingAreas || isLoadingTypes;

  const { errors, register, submitHandler } = useDocumentRe({
    initialData,
    onSubmit,
  });

  async function onSubmit(data: DocumentFormData) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }

      formData.append("author", String(initialData?.author));
      formData.append("teacher_guide", String(initialData?.teacher_guide));
      formData.delete("document");
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const response = await putDocument({ id: context, formData }).unwrap();
      await refetch();
      toast.success("Documento actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      toast.error("Error al actualizar el documento");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Mostrar spinner mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" />
        <p className="ml-2">Cargando datos...</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl p-4 text-center">
          Editar Documento Académico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Título */}
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Título del documento"
              defaultValue={initialData?.title}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Resumen */}
          <div>
            <Label htmlFor="abstract">Resumen</Label>
            <Textarea
              id="abstract"
              {...register("abstract")}
              placeholder="Resumen del documento"
              className="h-32"
              defaultValue={initialData?.abstract}
            />
            {errors.abstract && (
              <p className="text-red-500">{errors.abstract.message}</p>
            )}
          </div>

          {/* Calificación y Acceso */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-sm w-40">
              <Label htmlFor="qualification">Calificación</Label>
              <Input
                id="qualification"
                type="number"
                {...register("qualification")}
                placeholder="Calificación"
                defaultValue={initialData?.qualification}
              />
              {errors.qualification && (
                <p className="text-red-500">{errors.qualification.message}</p>
              )}
            </div>
            {/* Tipo de Documento */}
            <div className="flex items-center gap-2 w-64">
              <Label htmlFor="type_document">Tipo de Documento</Label>
              <select
                id="type_document"
                {...register("type_document", { valueAsNumber: true })}
                defaultValue={initialData?.type_document}
                className="border p-2 rounded text-sm w-full"
              >
                <option value="">Selecciona un tipo</option>
                {types?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
              {errors.type_document && (
                <p className="text-red-500">{errors.type_document.message}</p>
              )}
            </div>
            {/* Publicador */}
            <div className="flex items-center gap-2">
              <Label htmlFor="publisher">Publicador</Label>
              <select
                id="publisher"
                {...register("publisher")}
                defaultValue={initialData?.publisher}
                className="border p-2 rounded text-sm max-w-64"
              >
                <option value="1">Universidad Inacap</option>
                <option value="2">Instituto Profesional Inacap</option>
                <option value="3">Centro de Formación Técnica Inacap</option>
              </select>
              {errors.publisher && (
                <p className="text-red-500">{errors.publisher.message}</p>
              )}
            </div>
          </div>

          {/* Área Académica */}
          <div className="flex justify-between gap-2 w-full">
            <div className="flex items-center gap-2 max-w-80">
              <Label htmlFor="area">Área</Label>
              <select
                id="area"
                defaultValue={initialData?.area}
                className="border p-2 rounded text-sm w-full"
                disabled
              >
                <option value="">Selecciona un área</option>
                {areas?.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.area_name}
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="text-red-500">{errors.area.message}</p>
              )}
            </div>

            {/* Selector de Carrera */}
            <div className="flex items-center gap-2 max-w-80">
              <Label htmlFor="career">Carrera</Label>
              <select
                id="career"
                defaultValue={initialData?.career}
                className="border p-2 rounded text-sm w-full"
                disabled // Deshabilitado ya que está preseleccionado
              >
                {careers?.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.career_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            {/* Selector de Asignatura */}
            <div className="flex items-center gap-2 max-w-80">
              <Label htmlFor="signature">Asignatura</Label>
              <select
                id="signature"
                defaultValue={initialData?.signature}
                disabled // Deshabilitado ya que está preseleccionado
                className="border p-2 rounded w-full text-sm"
              >
                {signatures?.map((signature) => (
                  <option key={signature.id} value={signature.id}>
                    {signature.signature_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Grado Académico */}
            <div className="flex items-center gap-2 w-fit">
              <Label htmlFor="academic_degree">Grado Académico</Label>
              <select
                id="academic_degree"
                {...register("academic_degree")}
                defaultValue={initialData?.academic_degree}
                className="border p-2 rounded text-sm"
              >
                <option value="1">Técnico de Nivel Superior</option>
                <option value="2">Ingeniero</option>
                <option value="3">Licenciado</option>
              </select>
            </div>
          </div>

          {/* Documento */}
          <div className="flex items-center justify-end gap-1 px-1">
            <button
              type="button"
              className="flex hover:text-green-700"
              onClick={() => {
                const newTab = window.open(
                  `/repository-intranet/view-document/${initialData?.id}`,
                  "_blank"
                );
                if (newTab) {
                  newTab.opener = null; // Evita vulnerabilidades relacionadas con opener
                }
              }}
            >
              Ver Documento
              <span>
                <File />
              </span>
            </button>
          </div>

          {/* Botón de envío */}
          <Button className="w-full bg-green-700 hover:bg-green-600" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
